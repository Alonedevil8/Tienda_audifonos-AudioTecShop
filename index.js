// Importar los módulos y configuraciones necesarias
import express from "express"; // Módulo Express para crear una aplicación web
import csrf from "csurf"; // Módulo CSRF para proteger contra ataques CSRF
import cookieParser from "cookie-parser"; // Módulo para analizar cookies
import usuarioRoutes from "./routes/usuarioRoutes.js"; // Rutas relacionadas con usuarios
import propiedadesRoutes from "./routes/propiedadesRoutes.js"; // Rutas relacionadas con propiedades
import appRoutes from "./routes/appRoutes.js";
import audifonosRoutes from "./routes/audifonosRoutes.js"; 
import apiRoutes from "./routes/apiRoutes.js";
import db from "./config/db.js"; // Configuración y conexión a la base de datos

// Importar el módulo 'dotenv' para cargar variables de entorno
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

// Crear una instancia de la aplicación Express
const app = express();

// Habilitar la lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar el análisis de cookies
app.use(cookieParser());

// Importante para la seguridad: Habilitar la protección CSRF
app.use(csrf({ cookie: true }));

// Conexión a la base de datos
try {
  await db.authenticate(); // Intenta autenticar la base de datos
  db.sync(); // Sincroniza los modelos con la base de datos
  console.log("Conexión a la base de datos establecida");
} catch (error) {
  console.log("Error en la conexión a la base de datos");
}

// Habilitar el motor de vistas Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Carpeta Pública para servir archivos estáticos
app.use(express.static("public"));

// Configuración de enrutamiento para rutas relacionadas con usuarios y propiedades
app.use("/", appRoutes); // Rutas relacionadas con usuarios bajo "/"
app.use("/auth", usuarioRoutes); // Rutas relacionadas con usuarios bajo "/auth"
app.use("/", propiedadesRoutes); // Rutas relacionadas con propiedades en la raíz del sitio
app.use("/api", apiRoutes); // Rutas relacionadas con usuarios bajo "/auth"
app.use("/", audifonosRoutes);

// Definir el puerto del servidor a partir de las variables de entorno
const port = process.env.PORT;
app.listen(port, () => {
  console.log("Iniciando la aplicación");
  console.log(`Servidor en el puerto: ${port}`);
});
