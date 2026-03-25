const express = require('express');
const router = express.Router();
const {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  actualizarPerfil,
  cambiarEstado,
  actualizarPassword,
  activarPlanMistico,
  suspenderPlanMistico,
  desactivarCuenta,
} = require('../controllers/usuarioController');
const { proteger } = require('../middlewares/authMiddleware');
const { soloRoles } = require('../middlewares/roleMiddleware');

// Todas las rutas requieren autenticación
router.use(proteger);

// Rutas de perfil propio
router.put('/perfil', actualizarPerfil);
router.put('/perfil/password', actualizarPassword);
router.post('/perfil/activar-plan', activarPlanMistico);
router.post('/perfil/suspender-plan', suspenderPlanMistico);
router.delete('/perfil/desactivar', desactivarCuenta);

router.get('/', soloRoles('admin'), listarUsuarios);
router.get('/:id', obtenerUsuario);
router.put('/:id', soloRoles('admin'), actualizarUsuario);
router.patch('/:id/estado', soloRoles('admin'), cambiarEstado);

module.exports = router;
