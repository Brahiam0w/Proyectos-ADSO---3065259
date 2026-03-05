const express = require('express');
const router = express.Router();
const { registro, login, perfil, crearAdmin } = require('../controllers/authController');
const { proteger } = require('../middlewares/authMiddleware');
const { soloRoles } = require('../middlewares/roleMiddleware');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);

// Rutas protegidas
router.get('/perfil', proteger, perfil);

// Solo admins pueden crear otros admins
router.post('/crear-admin', proteger, soloRoles('admin'), crearAdmin);

module.exports = router;
