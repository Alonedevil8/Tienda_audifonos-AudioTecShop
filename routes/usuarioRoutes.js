import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  autenticar,
  cerrarSesion,
  editar,
  guardarEdicion,
  perfil
} from "../controllers/usuarioController.js";

import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

// Componente routes login
router.get("/login", formularioLogin);
router.post("/login", autenticar);

//editar usuario
// Ruta para mostrar el formulario de edición de una propiedad específica
router.get("/editar/:id", protegerRuta, editar);
// Esta ruta permite a los usuarios autenticados acceder al formulario de edición de una propiedad identificada por su ID.

// Ruta para procesar el formulario de edición de una propiedad
router.post("/editar/:id", protegerRuta, guardarEdicion);
// Esta ruta protegida con "protegerRuta" maneja la actualización de una propiedad después de la edición.


//cerrar sesion
router.post("/cerrar-sesion", cerrarSesion);

//perfil
router.get("/perfil", perfil);

// Componente routes registro
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);

//confirmar - verificar token
router.get("/confirma/:token", confirmar);

// Componente routes recuperar password
router.get("/olvidePassword", formularioOlvidePassword);
router.post("/olvidePassword", resetPassword);

//almacena el nuevo password
router.get("/olvidePassword/:token", comprobarToken);
router.post("/olvidePassword/:token", nuevoPassword);

export default router;
