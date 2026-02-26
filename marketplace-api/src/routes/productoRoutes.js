const express = require('express');
const ProductoController = require('../controllers/productoController');
const { autenticar, requiereRol } = require('../middlewares/auth');
const {
  validacionCrearProducto,
  validacionActualizarProducto,
  validacionMongoId,
  validacionFiltrosProducto
} = require('../middlewares/validaciones');
const { subirImagenProducto } = require('../config/multer');

const router = express.Router();

// GET /api/productos (público, con filtros)
router.get('/', validacionFiltrosProducto, ProductoController.listar);

// GET /api/productos/:id (público)
router.get('/:id', validacionMongoId, ProductoController.obtener);

// POST /api/productos (solo vendedores y admin)
router.post('/',
  autenticar,
  requiereRol(['vendedor', 'admin']),
  subirImagenProducto,
  validacionCrearProducto,
  ProductoController.crear
);

// PUT /api/productos/:id (vendedor dueño o admin - verificado en controller)
router.put('/:id',
  autenticar,
  subirImagenProducto,
  validacionMongoId,
  validacionActualizarProducto,
  ProductoController.actualizar
);

// DELETE /api/productos/:id
router.delete('/:id',
  autenticar,
  validacionMongoId,
  ProductoController.eliminar
);

// POST /api/productos/:id/generar-descripcion-ia
router.post('/:id/generar-descripcion-ia',
  autenticar,
  requiereRol(['vendedor', 'admin']),
  validacionMongoId,
  ProductoController.generarDescripcionIA
);

// POST /api/productos/:id/preguntar (público)
router.post('/:id/preguntar',
  validacionMongoId,
  ProductoController.preguntarProducto
);

module.exports = router;
