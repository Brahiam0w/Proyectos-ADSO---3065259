const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');

//verifica si hubo errores de validación
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      mensaje: 'Datos inválidos',
      errores: errors.array().map(e => ({
        campo: e.path,
        mensaje: e.msg,
        valor_recibido: e.value
      }))
    });
  }
  next();
};

// VALIDACIONES DE USUARIO
const validacionRegistro = [
  body('nombre')
    .trim()
    .escape() // Protección XSS: convierte < > & en entidades HTML
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(), // Convierte a minúsculas y normaliza

  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe tener al menos una minúscula, una mayúscula y un número'),

  body('rol')
    .optional()
    .isIn(['comprador', 'vendedor'])
    .withMessage('Rol inválido. Opciones: comprador, vendedor'),

  validarCampos // Siempre al final
];

const validacionLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),

  validarCampos
];

const validacionCambioPassword = [
  body('password_actual')
    .notEmpty()
    .withMessage('La contraseña actual es obligatoria'),

  body('password_nuevo')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe tener al menos una minúscula, una mayúscula y un número')
    .custom((value, { req }) => {
      if (value === req.body.password_actual) {
        throw new Error('La nueva contraseña no puede ser igual a la actual');
      }
      return true;
    }),

  validarCampos
];

// VALIDACIONES DE PRODUCTO
const validacionCrearProducto = [
  body('nombre')
    .trim()
    .escape()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre debe tener entre 2 y 200 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La descripción no puede superar 2000 caracteres'),

  body('precio')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser un número mayor a 0'),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero no negativo'),

  body('categoria')
    .isMongoId()
    .withMessage('ID de categoría inválido'),

  validarCampos
];

const validacionActualizarProducto = [
  body('nombre')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre debe tener entre 2 y 200 caracteres'),

  body('precio')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser mayor a 0'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero no negativo'),

  validarCampos
];

// VALIDACIONES DE CATEGORÍA
const validacionCrearCategoria = [
  body('nombre')
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede superar 500 caracteres'),

  validarCampos
];

// VALIDACIONES DE ORDEN
const validacionCrearOrden = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('La orden debe tener al menos un producto'),

  body('items.*.producto')
    .isMongoId()
    .withMessage('ID de producto inválido'),

  body('items.*.cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser al menos 1'),

  body('direccion_envio')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('La dirección no puede superar 300 caracteres'),

  validarCampos
];

// VALIDACIONES DE PARÁMETROS
const validacionMongoId = [
  param('id')
    .isMongoId()
    .withMessage('ID inválido. Debe ser un MongoDB ObjectId'),
  validarCampos
];

// VALIDACIONES DE QUERY PARAMS (filtros)
const validacionFiltrosProducto = [
  query('precio_min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('precio_min debe ser un número positivo'),

  query('precio_max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('precio_max debe ser un número positivo'),

  query('pagina')
    .optional()
    .isInt({ min: 1 })
    .withMessage('pagina debe ser un número entero positivo'),

  query('limite')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limite debe ser entre 1 y 50'),

  validarCampos
];

module.exports = {
  validarCampos,
  validacionRegistro,
  validacionLogin,
  validacionCambioPassword,
  validacionCrearProducto,
  validacionActualizarProducto,
  validacionCrearCategoria,
  validacionCrearOrden,
  validacionMongoId,
  validacionFiltrosProducto
};
