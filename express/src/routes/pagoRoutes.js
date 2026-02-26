import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middleware/validar-campos.js';
import * as PagoController from '../controllers/pagoController.js';

const router = Router();

router.get('/', PagoController.listarPagos);

router.get('/estado/:usuario_id', PagoController.estadoMembresia);

router.get('/usuario/:usuario_id', PagoController.pagosPorUsuario);

router.post(
  '/',
  [
    check('usuario_id', 'El usuario_id es obligatorio').isInt(),
    check('monto', 'El monto debe ser numérico').isNumeric(),
    check('metodo', 'El método es obligatorio').not().isEmpty(),
    validarCampos
  ],
  PagoController.registrarPago
);

export default router;
