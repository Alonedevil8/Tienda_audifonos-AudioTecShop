// Importa el módulo DataTypes desde Sequelize para definir tipos de datos.
import { DataTypes } from "sequelize";

// Importa la instancia de la base de datos "db" desde el archivo de configuración.
import db from "../config/db.js";

// Define una entidad "Propiedad" que representa una tabla en la base de datos.
const Propiedad = db.define("propiedades", {
  // ID único para cada propiedad.
  id: {
    type: DataTypes.UUID, // Tipo de datos: UUID (Identificador Único Universal)
    defaultValue: DataTypes.UUIDV4, // Valor predeterminado: Generar un UUID v4 si no se proporciona.
    allowNull: false, // No se permite un valor nulo.
    primaryKey: true, // Define este campo como clave primaria.
  },
  
  // Título de la propiedad (máximo 50 caracteres).
  titulo: {
    type: DataTypes.STRING(50), // Tipo de datos: Cadena de texto (máximo 50 caracteres).
    allowNull: false, // No se permite un valor nulo.
  },
  
  // Descripción de la propiedad (cadena de texto).
  descripcion: {
    type: DataTypes.STRING(), // Tipo de datos: Cadena de texto.
    allowNull: false, // No se permite un valor nulo.
  },

  telefono: {
    type: DataTypes.STRING(), // Tipo de datos: Cadena de texto.
    allowNull: false, // No se permite un valor nulo.
  },

  horario: {
    type: DataTypes.STRING(), // Tipo de datos: Cadena de texto.
    allowNull: false, // No se permite un valor nulo.
  },
  
  // Dirección de la propiedad (máximo 60 caracteres).
  calle: {
    type: DataTypes.STRING(200), // Tipo de datos: Cadena de texto (máximo 60 caracteres).
    allowNull: false, // No se permite un valor nulo.
  },
  
  // Latitud de la ubicación de la propiedad (cadena de texto).
  lat: {
    type: DataTypes.STRING(), // Tipo de datos: Cadena de texto.
    allowNull: false, // No se permite un valor nulo.
  },
  
  // Longitud de la ubicación de la propiedad (cadena de texto).
  lng: {
    type: DataTypes.STRING(), // Tipo de datos: Cadena de texto.
    allowNull: false, // No se permite un valor nulo.
  },
  
  // Nombre del archivo de imagen asociado a la propiedad (cadena de texto).
  imagen: {
    type: DataTypes.STRING(), // Tipo de datos: Cadena de texto.
    allowNull: false, // No se permite un valor nulo.
  },
  
  // Estado de publicación de la propiedad (booleano, con valor predeterminado 'false').
  publicado: {
    type: DataTypes.BOOLEAN, // Tipo de datos: Booleano.
    allowNull: false, // No se permite un valor nulo.
    defaultValue: false, // Valor predeterminado 'false'.
  },
});

// Exporta la entidad "Propiedad" para poder usarla en otros módulos.
export default Propiedad;
