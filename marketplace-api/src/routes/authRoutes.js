const express = require('express');
const AuthController = require('../controllers/authController');
const { autenticar } = require('../middlewares/auth');
const {
  validacionRegistro,
  validacionLogin,
  validacionCambioPassword
} = require('../middlewares/validaciones');

const router = express.Router();
router.post('/registro', validacionRegistro, AuthController.registro);
router.post('/login', validacionLogin, AuthController.login);
router.get('/perfil', autenticar, AuthController.perfil);
router.put('/cambiar-password', autenticar, validacionCambioPassword, AuthController.cambiarPassword);

module.exports = router;
