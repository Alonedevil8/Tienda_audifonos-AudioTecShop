// Importa el módulo DataTypes desde Sequelize para definir tipos de datos.
import { DataTypes } from "sequelize";

// Importa la instancia de la base de datos "db" desde el archivo de configuración.
import db from "../config/db.js";

// Define una entidad "Audifonos" que representa una tabla en la base de datos.
const Audifonos = db.define("audifonos", {
  // ID único para cada par de audífonos in-ear.
  id: {
    type: DataTypes.UUID, // Tipo de datos: UUID (Identificador Único Universal)
    defaultValue: DataTypes.UUIDV4, // Valor predeterminado: Generar un UUID v4 si no se proporciona.
    allowNull: false, // No se permite un valor nulo.
    primaryKey: true, // Define este campo como clave primaria.
  },
  
  // Modelo de los audífonos (cadena de texto).
  modelo: {
    type: DataTypes.STRING(50), // Tipo de datos: Cadena de texto (máximo 50 caracteres).
    allowNull: false, // No se permite un valor nulo.
  },
  
  // Tipo de conexión (por ejemplo, Bluetooth, cable, etc.) (cadena de texto).
  tipoConexion: {
    type: DataTypes.STRING(), // Tipo de datos: Cadena de texto.
    allowNull: true, // Puede permitirse un valor nulo si no se conoce.
  },
  
  // Descripción de los audífonos (cadena de texto).
  descripcion: {
    type: DataTypes.TEXT, // Tipo de datos: Texto largo.
    allowNull: false, // No se permite un valor nulo.
  },
  
  // Nombre del archivo de imagen asociado a los audífonos (cadena de texto).
  imagen: {
    type: DataTypes.STRING(), // Tipo de datos: Cadena de texto.
    allowNull: false, // No se permite un valor nulo.
  },
  
  // Estado de disponibilidad de los audífonos (booleano, con valor predeterminado 'true').
  disponible: {
    type: DataTypes.BOOLEAN, // Tipo de datos: Booleano.
    allowNull: false, // No se permite un valor nulo.
    defaultValue: false, // Valor predeterminado 'true'.
  },
});

// Exporta la entidad "Audifonos" para poder usarla en otros módulos.
export default Audifonos;
