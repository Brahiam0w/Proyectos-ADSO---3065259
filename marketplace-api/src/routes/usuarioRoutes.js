const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const { autenticar, requiereRol, esDuenioOAdmin } = require('../middlewares/auth');
const { validacionMongoId } = require('../middlewares/validaciones');
const { subirAvatarUsuario } = require('../config/multer');

const router = express.Router();

// GET /api/usuarios (solo admin)
router.get('/', autenticar, requiereRol('admin'), UsuarioController.listar);

// GET /api/usuarios/:id
router.get('/:id', autenticar, validacionMongoId, UsuarioController.obtener);

// PUT /api/usuarios/:id (dueño o admin)
router.put('/:id',
  autenticar,
  esDuenioOAdmin('id'),
  subirAvatarUsuario,
  UsuarioController.actualizar
);

// DELETE /api/usuarios/:id (solo admin)
router.delete('/:id',
  autenticar,
  requiereRol('admin'),
  validacionMongoId,
  UsuarioController.eliminar
);

module.exports = router;
