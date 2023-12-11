import { Marca, Precio, Mensaje, Usuario, Audifono } from "../models/index.js";
import { validationResult, check } from "express-validator";
import { unlink } from "node:fs/promises";
import { esVendedor, formatearFecha } from "../helper/index.js";

const admin = async (req, res) => {
  const { pagina: paginaActual } = req.query;

  const expresionR = /^[0-9]+/;

  if (!expresionR.test(paginaActual)) {
    return res.redirect("/mis-audifonos?pagina=1");
  }

  try {
    const { id, nombre } = req.usuario;

    const limit = 3;
    const offset = paginaActual * limit - limit;

    const [audifonos, total] = await Promise.all([
      Audifono.findAll({
        limit,
        offset,
        where: {
          usuarioId: id,
        },
        include: [
          { model: Marca, as: "marca" },
          { model: Precio, as: "precio" },
        ],
      }),
      Audifono.count({
        where: {
          usuarioId: id,
        },
      }),
    ]);

    const pagination = Math.ceil(total / limit);

    res.render("audifonos/admin-audifonos", {
      pagina: "Mis Audífonos",
      audifonos,
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

const crear = async (req, res) => {
  // Obtiene todas las marcas y precios
  const [marcas, precios] = await Promise.all([
    Marca.findAll(),
    Precio.findAll(),
  ]);
  // Renderiza la vista de creación de audífonos con datos de marcas y precios
  res.render("audifonos/crear-audifonos", {
    pagina: "Crear Publicación",
    csrfToken: req.csrfToken(),
    marcas,
    precios,
    datos: {},
  });
};

const guardar = async (req, res) => {
  // Realiza validaciones de los campos de entrada usando express-validator.
  await check("modelo")
    .notEmpty()
    .withMessage("Nombre del Audífono Obligatorio")
    .isLength({ max: 30 })
    .withMessage("Título Muy Largo")
    .run(req);

  await check("descripcion")
    .notEmpty()
    .withMessage("La Descripción es Obligatoria")
    .isLength({ max: 250 })
    .withMessage("Descripción Muy Larga")
    .run(req);

  await check("marca").isNumeric().withMessage("Selecciona una Marca").run(req);

  await check("precio")
    .isNumeric()
    .withMessage("Selecciona un Precio")
    .run(req);

  await check("tipoConexion")
    .notEmpty()
    .withMessage("El Tipo de Conexión es Obligatorio")
    .isLength({ max: 30 })
    .withMessage("Descripción Muy Larga")
    .run(req);

  // Verifica si hay errores de validación.
  let resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    // Si hay errores, obtiene marcas y precios y muestra la vista de creación con errores.
    const [marcas, precios] = await Promise.all([
      Marca.findAll(),
      Precio.findAll(),
    ]);
    return res.render("audifonos/crear-audifonos", {
      pagina: "Crear Audífonos",
      csrfToken: req.csrfToken(),
      marcas,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  // Si no hay errores de validación, se extraen los datos del formulario.
  const { modelo, tipoConexion, descripcion, marca, precio } = req.body;

  const { id: usuarioId } = req.usuario;

  try {
    // Crea un nuevo audífono en la base de datos.
    const audifonoGuardado = await Audifono.create({
      modelo,
      tipoConexion,
      descripcion,
      marcaId: marca,
      precioId: precio,
      usuarioId,
      imagen: "", // Añade la lógica para manejar imágenes si es necesario
    });

    // Obtiene el ID del audífono recién creado y redirige a la página de agregar imágenes.
    const { id } = audifonoGuardado;

    console.log(id);
    res.redirect(`/audifonos/agregar-imagen/${id}`); // Asegúrate de que la ruta sea correcta
  } catch (error) {
    console.log("Error al crear el audífono:", error);
  }
};

const guardarImagen = async (req, res) => {
  const { id } = req.params;

  console.log(id);
  // Busca la propiedad con el ID proporcionado.
  const audifono = await Audifono.findByPk(id);

  // Verifica si la propiedad no existe, está publicada o no pertenece al usuario.
  if (
    !audifono ||
    audifono.disponible ||
    req.usuario.id.toString() !== audifono.usuarioId.toString()
  ) {
    return res.redirect("/mis-audifonos");
  }

  // Renderiza la vista de agregar imágenes con los detalles de la propiedad.
  res.render("audifonos/agregar-imagen", {
    pagina: `Subir Imágenes - ${audifono.modelo}`,
    csrfToken: req.csrfToken(),
    audifono,
  });
};

const almacenarImagen = async (req, res, next) => {
  const { id } = req.params;
  const audifono = await Audifono.findByPk(id);

  if (
    !audifono ||
    audifono.publicado ||
    req.usuario.id.toString() !== audifono.usuarioId.toString()
  ) {
    return res.redirect("/mis-audifonos");
  }

  try {
    audifono.imagen = req.file.filename;
    audifono.disponible = 1;

    await audifono.save();
    next();
    console.log("Imagen almacenada con éxito");
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;

  // Validar que la propiedad exista
  const audifono = await Audifono.findByPk(id);
  if (!audifono) {
    return res.redirect("/mis-audifonos");
  }

  // Revisar que quien visita la URl, es quien creo la propiedad
  if (audifono.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-audifonos");
  }

  // Eliminar la propiedad
  await audifono.destroy();
  res.redirect("/mis-audifonos");
};

const editar = async (req, res) => {
  const { id } = req.params;

  // Busca el audífono con el ID proporcionado.
  const audifono = await Audifono.findByPk(id);

  // Verifica si el audífono no existe o no pertenece al usuario.
  if (
    !audifono ||
    audifono.usuarioId.toString() !== req.usuario.id.toString()
  ) {
    return res.redirect("/mis-audifonos");
  }

  // Obtiene todas las marcas y precios disponibles.
  const [marcas] = await Promise.all([Marca.findAll()]);
  const [precios] = await Promise.all([Precio.findAll()]);

  // Renderiza la vista de edición con datos del audífono y categorías.
  res.render("audifonos/editar", {
    pagina: `Editar Audífono: ${audifono.modelo}`,
    csrfToken: req.csrfToken(),
    marcas,
    precios,
    datos: audifono,
  });
};

const guardarEdicion = async (req, res) => {
  // Verificar la validación
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    const [marcas, precios] = await Promise.all([
      Marca.findAll(),
      Precio.findAll(),
    ]);

    return res.render("audifonos/editar", {
      pagina: "Editar Audifono",
      csrfToken: req.csrfToken(),
      marcas,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  const { id } = req.params;
  console.log(req.params);

  const audifono = await Audifono.findByPk(id);
  console.log("audifono");
  console.log(audifono);

  if (!audifono) {
    return res.redirect("/mis-audifonos");
  }

  if (audifono.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-audifonos");
  }

  try {
    const {
      modelo,
      tipoConexion,
      descripcion,
      marcaId: marca,
      precioId: precio,
    } = req.body;

    audifono.set({
      modelo,
      tipoConexion,
      descripcion,
      marcaId: marca,
      precioId: precio,
    });

    await audifono.save();
    res.redirect("/mis-audifonos");
  } catch (error) {
    console.log(error);
  }
};

const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  // Validar que la propiedad exista
  const audifono = await Audifono.findByPk(id);
  if (!audifono) {
    return res.redirect("/mis-audifonos");
  }

  // Revisar que quien visita la URl, es quien creo la propiedad
  if (audifono.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-audifonos");
  }

  // Actualizar
  audifono.disponible = !audifono.disponible;

  await audifono.save();

  res.json({
    resultado1: true,
  });
};

const mostrarAudifonos = async (req, res) => {
  const { id } = req.params;

  const audifonos = await Audifono.findByPk(id, {
    include: [
      { model: Precio, as: "precio" },
      { model: Marca, as: "marca", scope: "eliminarPassword" },
    ],
  });

  if (!audifonos || !audifonos.disponible) {
    return res.redirect("/404");
  }

  res.render("audifonos/mostrar", {
    audifonos,
    pagina: audifonos.modelo,
    csrfToken: req.csrfToken(),
    usuario: req.usuario,
  });
};

export {
  admin,
  crear,
  guardar,
  guardarImagen,
  editar,
  guardarEdicion,
  eliminar,
  almacenarImagen,
  mostrarAudifonos,
  cambiarEstado,
};
