const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

/**
 * Middleware: Verifica que el token JWT sea válido
 */
const proteger = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, mensaje: 'No autorizado. Token no encontrado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ success: false, mensaje: 'El usuario del token ya no existe.' });
    }

    // ==========================================================
    // Lógica de Auto-Expiración en tiempo real
    // ==========================================================
    if (usuario.estado === 'activo' && usuario.fecha_expiracion_plan) {
      const hoy = new Date();
      const expiracion = new Date(usuario.fecha_expiracion_plan);

      if (hoy >= expiracion) {
        console.log(`[Seguridad] El plan del usuario ${usuario.nombre} ha expirado. Actualizando estado...`);
        usuario.estado = 'inactivo';
        await usuario.save();
      }
    }
    // ==========================================================

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, mensaje: 'Token inválido o expirado.' });
  }
};

module.exports = { proteger };
