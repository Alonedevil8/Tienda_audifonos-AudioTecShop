// Importa los modelos necesarios
import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";
import Mensaje from "./mensaje.js";
import Marca from "./Marca.js";
import Audifono from "./Audifono.js";

// Define las relaciones entre los modelos
// Propiedad pertenece a una Categoría (relación de uno a uno)
Propiedad.belongsTo(Categoria);

// Audífono pertenece a una Marca (relación de uno a uno)
Audifono.belongsTo(Marca);

// Audífono pertenece a un Precio (relación de uno a uno)
Audifono.belongsTo(Precio);

// Propiedad pertenece a un Usuario (relación de uno a uno)
Propiedad.belongsTo(Usuario);

// Propiedad pertenece a un Usuario (relación de uno a uno)
Audifono.belongsTo(Usuario);

// Una Propiedad puede tener muchos Mensajes (relación de uno a muchos)
Propiedad.hasMany(Mensaje, { foreignKey: "propiedadId" });

// Un Mensaje pertenece a una Propiedad (relación de uno a uno)
Mensaje.belongsTo(Propiedad, { foreignKey: "propiedadId" });

// Un Mensaje pertenece a un Usuario (relación de uno a uno)
Mensaje.belongsTo(Usuario, { foreignKey: "usuarioId" });

// Exporta los modelos y relaciones definidos para su uso en otras partes del código
export { Propiedad, Precio, Categoria, Usuario, Mensaje, Marca, Audifono };
