const express = require('express');
const router = express.Router();
const {
  listarPagos,
  pagosPorUsuario,
  registrarPago,
  estadoMembresia,
} = require('../controllers/pagoController');
const { proteger } = require('../middlewares/authMiddleware');
const { soloRoles } = require('../middlewares/roleMiddleware');

router.use(proteger);

router.get('/', soloRoles('admin'), listarPagos);           // Solo admin
router.post('/', registrarPago);                             // Admin o el propio usuario
router.get('/estado/:usuario_id', estadoMembresia);          // Admin: cualquiera | Usuario: el suyo
router.get('/:usuario_id', pagosPorUsuario);                 // Admin: cualquiera | Usuario: el suyo

module.exports = router;
