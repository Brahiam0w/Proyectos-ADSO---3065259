const express = require('express');
const OrdenController = require('../controllers/ordenController');
const { autenticar, requiereRol } = require('../middlewares/auth');
const { validacionCrearOrden, validacionMongoId } = require('../middlewares/validaciones');

const router = express.Router();

// GET /api/ordenes (comprador ve las suyas, admin ve todas)
router.get('/', autenticar, OrdenController.listar);

// GET /api/ordenes/estadisticas (comprador autenticado)
router.get('/mis-estadisticas', autenticar, OrdenController.misEstadisticas);

// GET /api/ordenes/:id
router.get('/:id', autenticar, validacionMongoId, OrdenController.obtener);

// POST /api/ordenes (solo compradores)
router.post('/',
  autenticar,
  requiereRol(['comprador', 'admin']),
  validacionCrearOrden,
  OrdenController.crear
);

// PATCH /api/ordenes/:id/estado (solo admin)
router.patch('/:id/estado',
  autenticar,
  requiereRol('admin'),
  validacionMongoId,
  OrdenController.actualizarEstado
);

module.exports = router;
