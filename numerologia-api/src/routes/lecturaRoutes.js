const express = require('express');
const router = express.Router();
const {
  generarLecturaPrincipal,
  generarLecturaDiaria,
  lecturasPorUsuario,
  obtenerLectura,
} = require('../controllers/lecturaController');
const { proteger } = require('../middlewares/authMiddleware');

router.use(proteger);

router.post('/principal/:usuario_id', generarLecturaPrincipal); // Admin o el propio usuario
router.post('/diaria/:usuario_id', generarLecturaDiaria);       // Admin o usuario activo
router.get('/usuario/:usuario_id', lecturasPorUsuario);          // Admin: cualquiera | Usuario: el suyo
router.get('/:id', obtenerLectura);                              // Admin: cualquiera | Usuario: el suyo

module.exports = router;
