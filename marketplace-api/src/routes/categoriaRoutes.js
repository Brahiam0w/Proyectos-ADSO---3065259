const express = require('express');
const CategoriaController = require('../controllers/categoriaController');
const { autenticar, requiereRol } = require('../middlewares/auth');
const { validacionCrearCategoria, validacionMongoId } = require('../middlewares/validaciones');
const { subirImagenCategoria } = require('../config/multer');

const router = express.Router();

// GET /api/categorias (público)
router.get('/', CategoriaController.listar);

// GET /api/categorias/:id (público)
router.get('/:id', validacionMongoId, CategoriaController.obtener);

// GET /api/categorias/:id/productos (público)
router.get('/:id/productos', validacionMongoId, CategoriaController.obtenerProductos);

// POST /api/categorias (solo admin)
router.post('/',
  autenticar,
  requiereRol('admin'),
  subirImagenCategoria,
  validacionCrearCategoria,
  CategoriaController.crear
);

// PUT /api/categorias/:id (solo admin)
router.put('/:id',
  autenticar,
  requiereRol('admin'),
  subirImagenCategoria,
  validacionMongoId,
  CategoriaController.actualizar
);

// DELETE /api/categorias/:id (solo admin)
router.delete('/:id',
  autenticar,
  requiereRol('admin'),
  validacionMongoId,
  CategoriaController.eliminar
);

// POST /api/categorias/:id/generar-descripcion-ia (solo admin)
router.post('/:id/generar-descripcion-ia',
  autenticar,
  requiereRol('admin'),
  validacionMongoId,
  CategoriaController.generarDescripcionIA
);

module.exports = router;
