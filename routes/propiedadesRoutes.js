import express from "express";
import protegerRuta from "../middleware/authMiddleware.js";
import upload from "../middleware/subirArchivo.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

import {
  admin,
  crear,
  guardar,
  guardarImagen,
  almacenarImagen,
  editar,
  guardarEdicion,
  eliminar,
  mostrarPropiedad,
  enviarMensaje,
  verMensajes,
  cambiarEstado,
} from "../controllers/propiedadController.js";

const router = express.Router();

// Ruta para mostrar la vista de administrador protegida por autenticación
router.get("/mis-propiedades", protegerRuta, admin);
// En esta ruta, se utiliza el middleware "protegerRuta" para asegurarse de que el usuario esté autenticado antes de mostrar la vista de administrador.

/** */
// Ruta para mostrar el formulario de creación de propiedades protegido por autenticación
router.get("/propiedades/crear", protegerRuta, crear);
// Aquí, nuevamente se utiliza "protegerRuta" para garantizar que solo los usuarios autenticados puedan acceder al formulario de creación.

// Ruta para procesar el formulario de creación de propiedades protegida por autenticación
router.post("/propiedades/crear", protegerRuta, guardar);
// Esta ruta está protegida para garantizar que solo los usuarios autenticados puedan enviar el formulario de creación de propiedades.

// Ruta para mostrar la página de agregar imágenes a una propiedad específica
router.get("/propiedades/agregar-imagen/:id", protegerRuta, guardarImagen);
// Esta ruta requiere autenticación y muestra la página para agregar imágenes a una propiedad específica identificada por su ID.

// Ruta para procesar el formulario de agregar imágenes y publicar la propiedad
router.post(
  "/propiedades/agregar-imagen/:id",
  protegerRuta,
  upload.single("imagen"),
  almacenarImagen
);
// Aquí, el middleware "upload" maneja la subida de archivos (imágenes) y "almacenarImagen" procesa la solicitud. También se protege con "protegerRuta".

// Ruta para mostrar el formulario de edición de una propiedad específica
router.get("/propiedades/editar/:id", protegerRuta, editar);
// Esta ruta permite a los usuarios autenticados acceder al formulario de edición de una propiedad identificada por su ID.

// Ruta para procesar el formulario de edición de una propiedad
router.post("/propiedades/editar/:id", protegerRuta, guardarEdicion);
// Esta ruta protegida con "protegerRuta" maneja la actualización de una propiedad después de la edición.

router.post("/propiedades/eliminar/:id", protegerRuta, eliminar);

// put

router.put('/propiedades/:id', protegerRuta, cambiarEstado)

//+++++++ PUBLICA +++++++

router.get("/propiedad/:id", identificarUsuario, mostrarPropiedad);

//Almacenar los mensajes
router.post("/propiedad/:id", identificarUsuario, enviarMensaje);

router.get("/mensajes/:id", protegerRuta, verMensajes);

export default router;
