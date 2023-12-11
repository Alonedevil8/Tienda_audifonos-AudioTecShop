import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";

const identificarUsuario = async (req, res, next) => {
  // Identificar si hay token en las cookies
  const { _token } = req.cookies;

  if (!_token) {
    req.usuario = null;
    return next();
  }

  // Comprobar el token

  try {
    // Decodificar el token utilizando la clave secreta (process.env.JWT_SECRET)
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos y aplicar el alcance "eliminarPassword"
    const usuario = await Usuario.scope("eliminarPassword").findByPk(
      decoded.id
    );

    // Si se encuentra un usuario válido, almacenarlo en la solicitud (req)
    if (usuario) {
      req.usuario = usuario;
    }
    return next();
    
  } catch (error) {
    console.log(error);
    return res.clearCookie("_token").redirect("/auth/login");
  }
};

export default identificarUsuario;
