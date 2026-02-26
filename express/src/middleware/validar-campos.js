import { validationResult, check} from 'express-validator';

export const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};

export const validarPago = [
  check('usuario_id', 'El usuario_id es obligatorio').isInt(),
  check('monto', 'El monto debe ser numérico').isNumeric(),
  validarCampos
];
