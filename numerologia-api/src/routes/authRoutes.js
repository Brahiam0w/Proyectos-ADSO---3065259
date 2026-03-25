const express = require('express');
const router = express.Router();
const { registro, login, perfil, crearAdmin, olvidoPassword, restablecerPassword } = require('../controllers/authController');
const { proteger } = require('../middlewares/authMiddleware');
const { soloRoles } = require('../middlewares/roleMiddleware');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);
router.post('/olvido-password', olvidoPassword);
router.post('/restablecer-password/:token', restablecerPassword);

// Rutas protegidas
router.get('/perfil', proteger, perfil);

// Solo admins pueden crear otros admins
router.post('/crear-admin', proteger, soloRoles('admin'), crearAdmin);

module.exports = router;
