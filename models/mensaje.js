import { DataTypes } from "sequelize";
import db from "../config/db.js";

// Define el modelo de datos para la tabla "precios"
const Mensaje = db.define("mensaje", {
  mensaje: {
    type: DataTypes.STRING(300), // Define el tipo de dato y la longitud máxima
    allowNull: false, // Indica que el campo "nombre" no puede ser nulo
  },
});

export default Mensaje;
