const express = require('express');
const router = express.Router();
const {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  cambiarEstado,
  eliminarUsuario,
  actualizarPassword,
  eliminarMiCuenta,
  activarPlanMistico,
} = require('../controllers/usuarioController');
const { proteger } = require('../middlewares/authMiddleware');
const { soloRoles } = require('../middlewares/roleMiddleware');

// Todas las rutas requieren autenticación
router.use(proteger);

// Rutas de perfil propio
router.put('/perfil/password', actualizarPassword);
router.delete('/perfil/eliminar', eliminarMiCuenta);
router.post('/perfil/activar-plan', activarPlanMistico);

router.get('/', soloRoles('admin'), listarUsuarios);
router.get('/:id', obtenerUsuario);
router.put('/:id', soloRoles('admin'), actualizarUsuario);
router.patch('/:id/estado', soloRoles('admin'), cambiarEstado);
router.delete('/:id', soloRoles('admin'), eliminarUsuario);

module.exports = router;
