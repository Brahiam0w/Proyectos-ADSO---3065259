const express = require('express');
const IAController = require('../controllers/iaController');
const { autenticar } = require('../middlewares/auth');

const router = express.Router();

// POST /api/ia/generar-descripcion (requiere login)
router.post('/generar-descripcion', autenticar, IAController.generarDescripcion);

// POST /api/ia/sugerir-categorias (requiere login)
router.post('/sugerir-categorias', autenticar, IAController.sugerirCategorias);

// POST /api/ia/analizar-precio (requiere login)
router.post('/analizar-precio', autenticar, IAController.analizarPrecio);

module.exports = router;
