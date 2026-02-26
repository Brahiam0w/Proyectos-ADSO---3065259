import express from "express";
import {
  listarUsuarios,
  obtenerUsuario,
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/", listarUsuarios);
router.get("/:id", obtenerUsuario);
router.post("/", registrarUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario); 

export default router;
