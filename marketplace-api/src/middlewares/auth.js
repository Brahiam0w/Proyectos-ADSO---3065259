const { verificarToken, extraerTokenDeHeader } = require('../utils/jwt');
const Usuario = require('../models/Usuario');

/**
 * Middleware: verifica que el request tiene un JWT válido
 * Agrega req.usuario con los datos del usuario autenticado
 */
const autenticar = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extraerTokenDeHeader(authHeader);
    const payload = verificarToken(token);

    // Buscamos al usuario en la DB para confirmar que aún existe y está activo
    const usuario = await Usuario.findById(payload.id).select('-password');

    if (!usuario) {
      return res.status(401).json({
        error: true,
        mensaje: 'El usuario del token ya no existe'
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({
        error: true,
        mensaje: 'Tu cuenta ha sido desactivada. Contacta soporte.'
      });
    }

    req.usuario = usuario; // Disponible en el controlador como req.usuario
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      mensaje: error.message
    });
  }
};

/**
 * verifica que el usuario tiene el rol requerido
 */
const requiereRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // Si llegamos aquí, req.usuario ya existe (autenticar lo puso)
    const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: true,
        mensaje: 'No tienes permisos para realizar esta acción',
        tu_rol: req.usuario.rol,
        roles_requeridos: roles
      });
    }
    next();
  };
};

/**
 verifica que el usuario es el dueño del recurso O es admin
 */
const esDuenioOAdmin = (campoId = 'id') => {
  return (req, res, next) => {
    const idRecurso = req.params[campoId];
    const usuarioId = req.usuario._id.toString();
    const esAdmin = req.usuario.rol === 'admin';

    if (!esAdmin && idRecurso !== usuarioId) {
      return res.status(403).json({
        error: true,
        mensaje: 'Solo puedes modificar tus propios recursos'
      });
    }
    next();
  };
};

module.exports = { autenticar, requiereRol, esDuenioOAdmin };
