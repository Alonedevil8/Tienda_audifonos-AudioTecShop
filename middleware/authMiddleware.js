import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";

// Middleware para proteger rutas y verificar la autenticación del usuario
const protegerRuta = async (req, res, next) => {
  // Verificar si existe un token en las cookies de la solicitud
  const { _token } = req.cookies;

  // Si no hay token, redirige al usuario a la página de inicio de sesión
  if (!_token) {
    return res.redirect("/auth/login");
  }

  // Comprobar la validez del token
  try {
    // Decodificar el token utilizando la clave secreta (process.env.JWT_SECRET)
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos y aplicar el alcance "eliminarPassword"
    const usuario = await Usuario.scope("eliminarPassword").findByPk(decoded.id);

    // Si se encuentra un usuario válido, almacenarlo en la solicitud (req)
    if (usuario) {
      req.usuario = usuario;
    } else {
      // Si el usuario no se encuentra, redirigirlo a la página de inicio de sesión
      return res.redirect("/auth/login");
    }

    // Continuar con la siguiente función middleware
    return next();
  } catch (error) {
    // En caso de error en la verificación del token, limpiar la cookie y redirigir al inicio de sesión
    return res.clearCookie("_token").redirect("/auth/login");
  }

};

export default protegerRuta;
