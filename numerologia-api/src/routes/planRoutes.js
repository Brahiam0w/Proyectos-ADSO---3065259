const express = require('express');
const router = express.Router();
const {
  listarPlanes,
  listarPlanesAdmin,
  crearPlan,
  actualizarPlan,
  eliminarPlan,
} = require('../controllers/planController');
const { proteger } = require('../middlewares/authMiddleware');
const { soloRoles } = require('../middlewares/roleMiddleware');

// Rutas Públicas
router.get('/', listarPlanes);

// Rutas de Administración
router.get('/admin', proteger, soloRoles('admin'), listarPlanesAdmin);
router.post('/', proteger, soloRoles('admin'), crearPlan);
router.put('/:id', proteger, soloRoles('admin'), actualizarPlan);
router.delete('/:id', proteger, soloRoles('admin'), eliminarPlan);

module.exports = router;