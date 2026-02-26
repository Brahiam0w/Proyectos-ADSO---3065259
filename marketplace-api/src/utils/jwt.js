const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-inseguro-solo-para-dev';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const generarToken = (usuario) => {
  const payload = {
    id: usuario._id || usuario.id,
    email: usuario.email,
    rol: usuario.rol
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
    issuer: 'marketplace-api',
    audience: 'marketplace-users'
  });
};

const verificarToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'marketplace-api',
      audience: 'marketplace-users'
    });
  } catch (error) {
    // Diferenciamos el tipo de error para mejor UX
    if (error.name === 'TokenExpiredError') {
      throw new Error('El token ha expirado. Inicia sesión nuevamente.');
    }
    throw new Error('Token inválido');
  }
};

const extraerTokenDeHeader = (authHeader) => {
  if (!authHeader) {
    throw new Error('Token no proporcionado. Incluye el header Authorization: Bearer <token>');
  }
  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Formato inválido. Usa: Authorization: Bearer <token>');
  }
  return authHeader.substring(7); // Quita "Bearer "
};

module.exports = { generarToken, verificarToken, extraerTokenDeHeader };
