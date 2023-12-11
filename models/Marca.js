// Importa el módulo DataTypes desde Sequelize para definir tipos de datos.
import { DataTypes } from "sequelize";

// Importa la instancia de la base de datos "db" desde el archivo de configuración.
import db from "../config/db.js";

// Define el modelo de datos para la tabla "marcas"
const Marca = db.define("marcas", {
  nombre: {
    type: DataTypes.STRING(50), // Define el tipo de dato y la longitud máxima
    allowNull: false, // Indica que el campo "nombre" no puede ser nulo
  },
});

export default Marca;
