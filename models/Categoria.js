import { DataTypes } from "sequelize";
import db from "../config/db.js";

// Define el modelo de datos para la tabla "categorias"
const Categoria = db.define("categorias", {
  nombre: {
    type: DataTypes.STRING(50), // Define el tipo de dato y la longitud máxima
    allowNull: false, // Indica que el campo "nombre" no puede ser nulo
  },
});

export default Categoria;
