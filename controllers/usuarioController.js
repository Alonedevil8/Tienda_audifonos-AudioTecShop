// Importación de módulos y funciones necesarias
import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import { generarId, generarJWT } from "../helper/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helper/emails.js";
import jwt from "jsonwebtoken";

// Componente para mostrar el formulario de inicio de sesión
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar sesión",
    csrfToken: req.csrfToken(),
  });
};

// Componente para autenticar al usuario
const autenticar = async (req, res) => {
  // Validación de email y contraseña utilizando express-validator
  await check("email")
    .isEmail()
    .withMessage("No parece un Email o campo vacío")
    .run(req);

  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .run(req);

  // Capturar los resultados de la validación
  let resultado = validationResult(req);

  // Validación: Si hay errores, mostrar el formulario de inicio de sesión nuevamente con errores
  if (!resultado.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  // Validación: Si el usuario no existe, mostrar el formulario de inicio de sesión con un mensaje de error
  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario no existe" }],
    });
  }

  // Validación: Si el usuario no ha sido confirmado, mostrar el formulario de inicio de sesión con un mensaje de error
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "Usuario no ha sido confirmado. Verifique el email" }],
    });
  }

  // Validación: Si la contraseña es incorrecta, mostrar el formulario de inicio de sesión con un mensaje de error
  if (!usuario.verificarPassword(password)) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "La contraseña es incorrecta. Vuelve a intentarlo" }],
    });
  }

  // Generar un token JWT
  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });
  console.log("--------");
  console.log(token);

  // Almacenar la cookie de token
  return res
    .cookie("_token", token, {
      httpOnly: true,
      //secure: true,  --> (Se utiliza con certificado SSL)
      //sameSite: true,
    })
    .redirect("/mis-propiedades");
};

const cerrarSesion = (req, res) => {
  return res.clearCookie("_token").status(200).redirect("/auth/login");
};

const perfil = (req, res) => {

  const { _token } = req.cookies;
  let decoded;

  try {
    if (_token) {
      decoded = jwt.verify(_token, process.env.JWT_SECRET);
    }
  } catch (error) {
    console.log(error)
  }

  return res.status(200).redirect(`/auth/editar/${decoded.id}`);
};

// Componente para mostrar el formulario de registro
const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

// Componente para registrar a un nuevo usuario
const registrar = async (req, res) => {
  // Validación de nombre, email, contraseña y repetición de contraseña utilizando express-validator
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .run(req);

  await check("email")
    .isEmail()
    .withMessage("El campo de correo electrónico no puede estar vacío")
    .run(req);

  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .run(req);

  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Las contraseñas no coinciden")
    .run(req);

  // Capturar los resultados de la validación
  let resultado = validationResult(req);

  // Si hay errores de validación, mostrar el formulario de registro con errores y datos del usuario
  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  const { nombre, email, password } = req.body;

  // Verificar si el usuario ya existe en la base de datos
  const existeUsuario = await Usuario.findOne({
    where: { email: email },
  });

  // Si el usuario ya existe, mostrar el formulario de registro con un mensaje de error
  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: [{ msg: "El usuario ya está registrado" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  // Crear un nuevo usuario en la base de datos
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
  });

  // Enviar un email de confirmación
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  // Mostrar un mensaje de confirmación
  res.render("templates/mensaje", {
    pagina: "Cuenta Creada",
    mensaje: "Hemos enviado un email de confirmación. Presiona en el enlace",
  });
};

// Componente para comprobar la cuenta a través del email y token
const confirmar = async (req, res) => {
  const { token } = req.params;

  // Verificar si el token es válido en la base de datos
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, inténtalo de nuevo",
      error: true,
    });
  }

  // Confirmar la cuenta del usuario
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta Confirmada",
    mensaje: "La cuenta ha sido confirmada",
  });
};

// Componente para mostrar el formulario de restablecimiento de contraseña
const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvidePassword", {
    pagina: "Recupera tu acceso a AudioTecShop",
    csrfToken: req.csrfToken(),
  });
};

// Función para el proceso de restablecimiento de contraseña
const resetPassword = async (req, res) => {
  // Validación de email utilizando express-validator
  await check("email")
    .isEmail()
    .withMessage("No parece un Email o campo vacío")
    .run(req);

  // Capturar los resultados de la validación
  let resultado = validationResult(req);

  // Si hay errores de validación, mostrar el formulario de restablecimiento de contraseña con errores
  if (!resultado.isEmpty()) {
    return res.render("auth/olvidePassword", {
      pagina: "Recupera tu acceso a AudioTecShop",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  // Buscar al usuario por su email
  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  // Si el usuario no existe, mostrar el formulario de restablecimiento de contraseña con un mensaje de error
  if (!usuario) {
    return res.render("auth/olvidePassword", {
      pagina: "Recupera tu acceso a AudioTecShop",
      csrfToken: req.csrfToken(),
      errores: [
        {
          msg: "El email no pertenece a ningún usuario",
        },
      ],
    });
  }

  // Generar un nuevo token
  usuario.token = generarId();
  await usuario.save();

  // Enviar un email de restablecimiento de contraseña
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });

  // Mostrar un mensaje de confirmación
  res.render("templates/mensaje", {
    pagina: "Restablecer tu contraseña",
    mensaje:
      "Hemos enviado un email de restablecimiento de contraseña. Presiona en el enlace",
  });
};

// Componente para comprobar el token en el proceso de restablecimiento de contraseña
const comprobarToken = async (req, res) => {
  const { token } = req.params;

  console.log(token);

  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Restablecer tu contraseña",
      mensaje: "Hubo un error al validar tu información",
      error: true,
    });
  }

  res.render("auth/reset-password", {
    pagina: "Restablecer tu contraseña",
    csrfToken: req.csrfToken(),
  });
};

// Cambiar a una nueva contraseña
const nuevoPassword = async (req, res) => {
  // Validación de la nueva contraseña utilizando express-validator
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .run(req);

  // Capturar los resultados de la validación
  let resultado = validationResult(req);

  // Si hay errores de validación, mostrar el formulario de restablecimiento de contraseña con errores
  if (!resultado.isEmpty()) {
    return res.render("auth/reset-password", {
      pagina: "Restablecer tu contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ where: { token } });

  // Generar un nuevo hash de contraseña
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;

  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Restablecer tu contraseña",
    mensaje: "Contraseña restablecida satisfactoriamente.",
  });
};

// Controlador para la vista de edición de una propiedad.
const editar = async (req, res) => {
  const { id } = req.params;
  // Busca la propiedad con el ID proporcionado.
  const usuario = await Usuario.findByPk(id);

  // Verifica si la propiedad no existe o no pertenece al usuario.
  if (!usuario) {
    return res.redirect("/mis-propiedades");
  }

  // Renderiza la vista de edición con datos de la propiedad y categorías
  res.render("auth/editar", {
    pagina: `Editar Usuario: ${usuario.nombre}`,
    csrfToken: req.csrfToken(),
    datos: usuario,
  });
};

const guardarEdicion = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  // Busca la propiedad con el ID proporcionado.
  const usuario = await Usuario.findByPk(id);

  // Verifica si la propiedad no existe o no pertenece al usuario.
  if (!usuario) {
    return res.redirect("/mis-propiedades");
  }

  // Verifica si hay errores de validación.
  const resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    return res.render("auth/editar", {
      pagina: `Editar Usuario: ${usuario.nombre}`,
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      datos: req.body,
    });
  }

  try {
    // Actualiza los datos de la propiedad con los valores del formulario de edición.
    const { nombre, email } = req.body;

    usuario.nombre = nombre;
    usuario.email = email;

    await usuario.save();
    res.redirect("/mis-audifonos");
  } catch (error) {
    console.log(error);
  }
};

// Exportar las funciones y componentes
export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  autenticar,
  cerrarSesion,
  editar,
  perfil,
  guardarEdicion,
};
