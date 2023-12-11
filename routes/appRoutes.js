import express from "express";

import {
  inicio,
  categoria,
  noEncontrado,
  buscador,
  nosotros,
  trabajaCon,
  contacto,
  verAudifonos,
} from "../controllers/appController.js";

const router = express.Router();

//pagina de inicio
router.get("/", inicio);

//categorias
router.get("/categorias/:id", categoria);

//buscador
router.post("/buscador", buscador);

//pagina 404
router.get("/404", noEncontrado);

//Nosotros
router.get("/nosotros", nosotros);

//conctacto
router.get("/contactonos", contacto);

//trabajaCon
router.get("/TrabajaConNosotros", trabajaCon);

router.get("/VerAudifonos", verAudifonos);

export default router;
