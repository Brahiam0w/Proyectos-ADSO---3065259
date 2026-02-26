const Usuario = require('../models/Usuario');
const { generarToken } = require('../utils/jwt');

class AuthController {

  // POST /api/auth/registro
  static async registro(req, res, next) {
    try {
      const { nombre, email, password, rol } = req.body;

      // Verificar si el email ya existe
      const existe = await Usuario.findOne({ email });
      if (existe) {
        return res.status(409).json({
          error: true,
          mensaje: 'El email ya está registrado'
        });
      }

      // Crear usuario (el pre-save hook de Mongoose hashea la contraseña automáticamente)
      const usuario = await Usuario.create({ nombre, email, password, rol });

      // Generar token para que el usuario quede logueado inmediatamente
      const token = generarToken(usuario);

      res.status(201).json({
        error: false,
        mensaje: 'Usuario registrado exitosamente',
        usuario: usuario.toPublic(),
        token
      });
    } catch (error) {
      // Error de duplicado de MongoDB (código 11000)
      if (error.code === 11000) {
        return res.status(409).json({ error: true, mensaje: 'El email ya está registrado' });
      }
      next(error);
    }
  }

  // POST /api/auth/login
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Buscamos con +password porque por defecto select:false lo oculta
      const usuario = await Usuario.buscarConPassword(email);

      // ⚠️ SEGURIDAD: siempre el mismo mensaje para email y password incorrectos
      // (evita que un atacante sepa si el email existe)
      if (!usuario) {
        return res.status(401).json({ error: true, mensaje: 'Credenciales incorrectas' });
      }

      const passwordValida = await usuario.compararPassword(password);
      if (!passwordValida) {
        return res.status(401).json({ error: true, mensaje: 'Credenciales incorrectas' });
      }

      if (!usuario.activo) {
        return res.status(401).json({ error: true, mensaje: 'Cuenta desactivada' });
      }

      const token = generarToken(usuario);

      res.json({
        error: false,
        mensaje: 'Inicio de sesión exitoso',
        usuario: usuario.toPublic(),
        token
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/perfil (requiere token)
  static async perfil(req, res, next) {
    try {
      // req.usuario lo inyectó el middleware autenticar
      const usuario = await Usuario.findById(req.usuario._id);

      if (!usuario) {
        return res.status(404).json({ error: true, mensaje: 'Usuario no encontrado' });
      }

      res.json({ error: false, usuario: usuario.toPublic() });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/auth/cambiar-password (requiere token)
  static async cambiarPassword(req, res, next) {
    try {
      const { password_actual, password_nuevo } = req.body;

      // Necesitamos el password para comparar
      const usuario = await Usuario.findById(req.usuario._id).select('+password');

      const esValida = await usuario.compararPassword(password_actual);
      if (!esValida) {
        return res.status(400).json({ error: true, mensaje: 'La contraseña actual es incorrecta' });
      }

      usuario.password = password_nuevo; // El pre-save hook lo hashea automáticamente
      await usuario.save();

      res.json({ error: false, mensaje: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
