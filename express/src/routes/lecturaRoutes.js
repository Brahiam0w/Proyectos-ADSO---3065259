import { Router } from 'express';
import { check } from 'express-validator';
import * as LecturaController from '../controllers/lecturaController.js';
import { validarCampos } from '../middleware/validar-campos.js';
import { getUsuarioById } from '../models/usuarioModel.js';
import { validarJWT } from '../middleware/validar-jwt.js';

const router = Router();

router.post(
  '/principal/:usuario_id',
  [
    validarJWT,

    check('usuario_id', 'El usuario_id debe ser numérico').isInt(),

    check('usuario_id').custom(async (usuario_id) => {
      const usuario = await getUsuarioById(usuario_id);

      if (!usuario) {
        throw new Error('El usuario no existe');
      }

      if (!usuario.fecha_nacimiento) {
        throw new Error('El usuario no tiene fecha de nacimiento registrada');
      }

      return true;
    }),

    validarCampos
  ],
  LecturaController.crearPrincipal
);

router.post(
  '/diaria/:usuario_id',
  [
    check('usuario_id', 'El usuario_id debe ser numérico').isInt(),

    check('usuario_id').custom(async (usuario_id) => {
      const usuario = await getUsuarioById(usuario_id);

      if (!usuario) {
        throw new Error('El usuario no existe');
      }

      if (usuario.estado !== 'activo') {
        throw new Error('El usuario no tiene membresía activa');
      }

      return true;
    }),

    validarCampos
  ],
  LecturaController.crearDiaria
);

router.get(
  '/usuario/:usuario_id',
  [
    check('usuario_id', 'El usuario_id debe ser numérico').isInt(),
    validarCampos
  ],
  LecturaController.listarPorUsuario
);

router.get(
  '/:id',
  [
    check('id', 'El id debe ser numérico').isInt(),
    validarCampos
  ],
  LecturaController.obtenerLectura
);

router.get(
  '/test/ia',
  LecturaController.testIA
);

export default router;
