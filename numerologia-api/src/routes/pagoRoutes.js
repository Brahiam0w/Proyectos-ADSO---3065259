const express = require('express');
const router = express.Router();
const { 
    crearPreferencia, 
    recibirNotificacion, 
    verificarPago, 
    redirigirDesdeMP 
} = require('../controllers/pagoController');
const { proteger } = require('../middlewares/authMiddleware');

// Generar el link de pago seguro
router.post('/crear-preferencia', proteger, crearPreferencia);

// Webhook para Mercado Pago (llamado automáticamente)
router.post('/webhook', recibirNotificacion);

// Verificar estado del pago (desde el frontend)
router.get('/verificar', proteger, verificarPago);

// Redirigir al frontend con los parámetros de MP
router.get('/redirect', redirigirDesdeMP);

module.exports = router;