import { Categoria, Propiedad, Mensaje, Usuario } from "../models/index.js";
import { validationResult, check } from "express-validator";
import { unlink } from "node:fs/promises";
import { esVendedor, formatearFecha } from "../helper/index.js";

// Controlador para la vista de administración de propiedades del usuario.
const admin = async (req, res) => {
  const { pagina: paginaActual } = req.query;
  console.log(paginaActual);

  const expresionR = /^[0-9]$/;

  if (!expresionR.test(paginaActual)) {
    return res.redirect("/mis-propiedades?pagina=1");
  }

  try {
    const { id, nombre } = req.usuario;
    // Limite y Offset para el paginador
    const limit = 2;
    const offset = paginaActual * limit - limit;

    const [propiedades, total] = await Promise.all([
      // Busca todas las propiedades del usuario y las incluye con información de categoría.
      Propiedad.findAll({
        limit,
        offset,
        where: {
          usuarioId: id,
        },
        include: [
          { model: Categoria, as: "categoria" },
          { model: Mensaje, as: "mensajes" },
        ],
      }),
      Propiedad.count({
        where: {
          usuarioId: id,
        },
      }),
    ]);
    const pagination = Math.ceil(total / limit);
    console.log(total)

    // Renderiza la vista de administración con las propiedades del usuario.
    res.render("propiedades/admin", {
      pagina: "Mis Propiedades",
      propiedades,
      csrfToken: req.csrfToken(),
      nombre,
      paginas: pagination,
      paginaActual: Number(paginaActual),
      limit,
      offset,
      total,
    });
  } catch (error) {
    console.log(error);
  }
};

// Controlador para la vista de creación de propiedades.
const crear = async (req, res) => {
  // Obtiene todas las categorías
  const [categorias] = await Promise.all([Categoria.findAll()]);
  // Renderiza la vista de creación de propiedad con datos de categorías
  res.render("propiedades/crear", {
    pagina: "Crear Propiedad",
    csrfToken: req.csrfToken(),
    categorias,
    datos: {},
  });
};

// Controlador para guardar una nueva propiedad en la base de datos.
const guardar = async (req, res) => {

  // Realiza validaciones de los campos de entrada usando express-validator.
  await check("titulo")
    .notEmpty()
    .withMessage("Nombre del Local Obligatorio")
    .isLength({ max: 40 })
    .withMessage("Título Muy Largo")
    .run(req);

  await check("descripcion")
    .notEmpty()
    .withMessage("La Descripcion es Obligatorio")
    .isLength({ max: 250 })
    .withMessage("descripcion Muy Largo")
    .run(req);

  await check("categoria")
    .isNumeric()
    .withMessage("Selecciona una Categoria")
    .run(req);

  await check("telefono")
    .notEmpty()
    .withMessage("El Telefono es Obligatorio")
    .isLength({ max: 30 })
    .withMessage("descripcion Muy Largo")
    .run(req);

  await check("horario")
    .notEmpty()
    .withMessage("El Horario es Obligatorio")
    .isLength({ max: 100 })
    .withMessage("descripcion Muy Largo")
    .run(req);

  await check("lat")
    .notEmpty()
    .withMessage("Debes Ubicar la Posición Geográfica de la Propiedad")
    .run(req);

  // Verifica si hay errores de validación.
  let resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    // Si resultado viene con datos, obtiene categorías  y muestra la vista de creación con errores.
    const [categorias] = await Promise.all([Categoria.findAll()]);
    return res.render("propiedades/crear", {
      pagina: "Crear Propiedad",
      csrfToken: req.csrfToken(),
      categorias,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  // Si no hay errores de validación, se extraen los datos del formulario.
  const { titulo, descripcion, calle, horario, telefono, lat, lng, categoria } =
    req.body;

  const { id: usuarioId } = req.usuario;

  try {
    // Crea una nueva propiedad en la base de datos.
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      calle,
      horario,
      telefono,
      lat,
      lng,
      categoriaId: categoria,
      usuarioId,
      imagen: "",
    });

    // Obtiene el ID de la propiedad recién creada y redirige a la página de agregar imágenes.
    const { id } = propiedadGuardada;
    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log("Error al crear la propiedad:", error);
  }
};

// Controlador para la vista de agregar imágenes a una propiedad.
const guardarImagen = async (req, res) => {
  const { id } = req.params;
  // Busca la propiedad con el ID proporcionado.
  const propiedad = await Propiedad.findByPk(id);

  // Verifica si la propiedad no existe, está publicada o no pertenece al usuario.
  if (
    !propiedad ||
    propiedad.publicado ||
    req.usuario.id.toString() !== propiedad.usuarioId.toString()
  ) {
    return res.redirect("/mis-propiedades");
  }

  // Renderiza la vista de agregar imágenes con los detalles de la propiedad.
  res.render("propiedades/agregar-imagen", {
    pagina: `Subir Imágenes - ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad,
  });
};

// Controlador para almacenar una imagen en la propiedad y marcarla como publicada.
const almacenarImagen = async (req, res, next) => {
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);

  // Verifica si la propiedad no existe, está publicada o no pertenece al usuario.
  if (
    !propiedad ||
    propiedad.publicado ||
    req.usuario.id.toString() !== propiedad.usuarioId.toString()
  ) {
    return res.redirect("/mis-propiedades");
  }

  try {
    // Almacena el nombre de la imagen en la propiedad y la marca como publicada.
    propiedad.imagen = req.file.filename;
    propiedad.publicado = 1;

    await propiedad.save();
    next();
    console.log("Imagen almacenada con éxito");
  } catch (error) {
    console.log(error);
  }
};

// Controlador para la vista de edición de una propiedad.
const editar = async (req, res) => {

  const { id } = req.params;
  // Busca la propiedad con el ID proporcionado.
  const propiedad = await Propiedad.findByPk(id);

  // Verifica si la propiedad no existe o no pertenece al usuario.
  if (
    !propiedad ||
    propiedad.usuarioId.toString() !== req.usuario.id.toString()
  ) {
    return res.redirect("/mis-propiedades");
  }

  // Obtiene todas las categorías  disponibles.
  const [categorias] = await Promise.all([Categoria.findAll()]);

  // Renderiza la vista de edición con datos de la propiedad y categorías
  res.render("propiedades/editar", {
    pagina: `Editar Propiedad: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    categorias,
    datos: propiedad,
  });
};

// Controlador para guardar los cambios realizados en la edición de una propiedad.
const guardarEdicion = async (req, res) => {
  // Verifica si hay errores de validación.

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    // Si hay errores, obtiene categorías y muestra la vista de edición con errores.
    const [categorias] = await Promise.all([Categoria.findAll()]);
    return res.render("propiedades/editar", {
      pagina: `Editar Propiedad: ${propiedad.titulo}`,
      csrfToken: req.csrfToken(),
      categorias,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  const { id } = req.params;
  // Busca la propiedad con el ID proporcionado.
  const propiedad = await Propiedad.findByPk(id);

  // Verifica si la propiedad no existe o no pertenece al usuario.
  if (
    !propiedad ||
    propiedad.usuarioId.toString() !== req.usuario.id.toString()
  ) {
    return res.redirect("/mis-propiedades");
  }

  try {
    // Actualiza los datos de la propiedad con los valores del formulario de edición.
    const {
      titulo,
      descripcion,
      calle,
      telefono,
      horario,
      lat,
      lng,
      categoria,
    } = req.body;

    propiedad.set({
      titulo,
      descripcion,
      calle,
      telefono,
      horario,
      lat,
      lng,
      categoriaId: categoria,
    });

    await propiedad.save();
    res.redirect("/mis-propiedades");
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // Revisar que quien visita la URl, es quien creo la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  // Eliminar la imagen
  await unlink(`public/uploads/${propiedad.imagen}`);
  console.log(`Se eliminó la imagen ${propiedad.imagen}`);

  // Eliminar la propiedad
  await propiedad.destroy();
  res.redirect("/mis-propiedades");
};

// Modifica el estado de la propiedad
const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // Revisar que quien visita la URl, es quien creo la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  // Actualizar
  propiedad.publicado = !propiedad.publicado;

  await propiedad.save();

  res.json({
    resultado: true,
  });
};

// Muestra una propiedad
const mostrarPropiedad = async (req, res) => {
  const { id } = req.params;

  // Comprobar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include: [{ model: Categoria, as: "categoria", scope: "eliminarPassword" }],
  });

  if (!propiedad || !propiedad.publicado) {
    return res.redirect("/404");
  }

  res.render("propiedades/mostrar", {
    propiedad,
    pagina: propiedad.titulo,
    csrfToken: req.csrfToken(),
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
  });
};

const enviarMensaje = async (req, res) => {
  // renderizar los errores
  await check("mensaje")
    .isLength({ min: 10 })
    .withMessage("El Mensaje No Puede Ir Tan Corto o Ir Vacío.")
    .run(req);

  // Verifica si hay errores de validación.
  let resultado = validationResult(req);

  const { id } = req.params;

  // Comprobar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id, {
    include: [{ model: Categoria, as: "categoria" }],
  });

  if (!propiedad) {
    return res.redirect("/404");
  }

  if (!resultado.isEmpty()) {
    return res.render("propiedades/mostrar", {
      propiedad,
      pagina: propiedad.titulo,
      csrfToken: req.csrfToken(),
      usuario: req.usuario,
      esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
      errores: resultado.array(),
    });
  }

  const { mensaje } = req.body;
  const { id: propiedadId } = req.params;
  const { id: usuarioId } = req.usuario;

  // Almacenar el mensaje
  await Mensaje.create({
    mensaje,
    propiedadId,
    usuarioId,
  });

  res.redirect(`http://localhost:3001/propiedad/${propiedadId}`);

  res.render("propiedades/mostrar", {
    propiedad,
    pagina: propiedad.titulo,
    csrfToken: req.csrfToken(),
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
    enviado: true,
  });
};

const verMensajes = async (req, res) => {
  const { id } = req.params;

  // Busca la propiedad con el ID proporcionado.
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      {
        model: Mensaje,
        as: "mensajes",
        include: [{ model: Usuario.scope("eliminarPassword"), as: "usuario" }],
      },
    ],
  });

  // Verifica si la propiedad no existe o no pertenece al usuario.
  if (
    !propiedad ||
    propiedad.usuarioId.toString() !== req.usuario.id.toString()
  ) {
    return res.redirect("/mis-propiedades");
  }

  res.render("propiedades/mensajes", {
    pagina: "Mensajes",
    mensajes: propiedad.mensajes,
    formatearFecha,
  });
};

// Exporta los controladores para su uso en otras partes de la aplicación.
export {
  admin,
  crear,
  guardar,
  guardarImagen,
  almacenarImagen,
  editar,
  guardarEdicion,
  eliminar,
  mostrarPropiedad,
  enviarMensaje,
  verMensajes,
  cambiarEstado,
};
