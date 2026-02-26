import { Router } from 'express';
import * as PagoController from '../controllers/pagoController.js';

const router = Router();

router.get('/', PagoController.listarPagos);
router.get('/:usuario_id', PagoController.pagosPorUsuario);
router.post('/', PagoController.registrarPago);
router.get('/estado/:usuario_id', PagoController.estadoMembresia);

export default router;
