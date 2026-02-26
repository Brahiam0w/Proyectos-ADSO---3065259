import { Router } from 'express';
import * as LecturaController from '../controllers/lecturaController.js';

const router = Router();

router.post('/principal/:usuario_id', LecturaController.crearPrincipal);
router.post('/diaria/:usuario_id', LecturaController.crearDiaria);
router.get('/usuario/:usuario_id', LecturaController.listarPorUsuario);
router.get('/:id', LecturaController.obtenerLectura);
router.get('/test/openai', LecturaController.testOpenAI);
router.get('/diagnostico/openai', LecturaController.diagnosticoOpenAI);
router.get('/test/openai-conexion', LecturaController.verificarConexionOpenAI);
export default router;