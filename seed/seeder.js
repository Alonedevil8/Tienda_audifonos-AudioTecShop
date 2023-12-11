// Importa los datos de las categorías, precios y usuarios desde módulos externos.
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import marcas from "./marcas.js";


// Importa la instancia de la base de datos "db" desde el archivo de configuración.
import db from "../config/db.js";

// Importa los modelos Categoria, Precio y Usuario desde un módulo "models".
import { Categoria, Marca, Precio, Usuario } from "../models/index.js";

// Función para importar datos en la base de datos.
const importarDatos = async () => {
  try {
    // Autentica la base de datos.
    await db.authenticate();

    // Genera las tablas en la base de datos (si no existen).
    await db.sync();

    // Inserta los datos de categorías, precios y usuarios.
    await Categoria.bulkCreate(categorias);
    await Precio.bulkCreate(precios);
    await Usuario.bulkCreate(usuarios);
    await Marca.bulkCreate(marcas);

    console.log("Datos importados correctamente");
    process.exit(0); // Termina el proceso con éxito.
  } catch (error) {
    console.log(error);
    process.exit(1); // Termina el proceso con error.
  }
};

// Función para eliminar todos los datos en la base de datos.
const eliminarDatos = async () => {
  try {
    await db.sync({ force: true }); // Borra todas las tablas y datos (uso extremo).

    console.log("Datos eliminados correctamente...");
    process.exit(0); // Termina el proceso con éxito.
  } catch (error) {
    console.log(error);
    process.exit(1); // Termina el proceso con error.
  }
};

// Comprueba si se ejecuta el script con la opción "-i" (importar datos) o "-e" (eliminar datos).
if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-e") {
  eliminarDatos();
}
