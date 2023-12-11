import multer from "multer";
import path from "path";
import { generarId } from "../helper/tokens.js";

// Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Especifica la carpeta donde se almacenarán los archivos subidos
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    // Define el nombre del archivo subido con un ID generado y su extensión original
    cb(null, generarId() + path.extname(file.originalname));
  },
});

// Crea un middleware Multer configurado con la opción de almacenamiento
const upload = multer({ storage });

export default upload;
