const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Usuario = require('../models/Usuario');
const { enviarCorreoRecuperacion } = require('../utils/mailer');

/**
 * Genera un token JWT firmado con el ID del usuario
 */
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * POST /api/auth/registro
 * Registra un nuevo usuario en la plataforma
 */
const registro = async (req, res) => {
  try {
    const { nombre, email, password, fecha_nacimiento, genero, pais } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ success: false, mensaje: 'El correo ya está registrado.' });
    }

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password,
      fecha_nacimiento,
      genero,
      pais,
      rol: 'usuario',
      estado: 'activo',
      plan: 'gratuito',
    });

    res.status(201).json({
      success: true,
      token: generarToken(nuevoUsuario._id),
      usuario: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        fecha_nacimiento: nuevoUsuario.fecha_nacimiento,
        genero: nuevoUsuario.genero,
        avatar: nuevoUsuario.avatar,
        pais: nuevoUsuario.pais,
        rol: nuevoUsuario.rol,
        estado: nuevoUsuario.estado,
        plan: nuevoUsuario.plan,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

/**
 * POST /api/auth/login
 * Autentica al usuario y devuelve el token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({ success: false, mensaje: 'Credenciales inválidas.' });
    }

    if (usuario.estado === 'activo' && usuario.fecha_expiracion_plan) {
      if (new Date() >= new Date(usuario.fecha_expiracion_plan)) {
        usuario.plan = 'gratuito'; // Solo expira la membresía
        await usuario.save();
      }
    }

    if (usuario.estado !== 'activo') {
      return res.status(403).json({ 
        success: false, 
        mensaje: 'Tu cuenta se encuentra inactiva. Por favor, contacta con el administrador del portal.' 
      });
    }

    const token = generarToken(usuario._id);

    res.status(200).json({
      success: true,
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        fecha_nacimiento: usuario.fecha_nacimiento,
        genero: usuario.genero,
        avatar: usuario.avatar,
        pais: usuario.pais,
        fecha_expiracion_plan: usuario.fecha_expiracion_plan,
        estado: usuario.estado,
        plan: usuario.plan,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * GET /api/auth/perfil
 * Obtiene los datos del usuario autenticado
 */
const perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    res.status(200).json({ success: true, usuario });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * POST /api/auth/crear-admin
 * [Solo Admin] Permite crear otros administradores
 */
const crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password, fecha_nacimiento, genero, pais } = req.body;

    const adminExiste = await Usuario.findOne({ email });
    if (adminExiste) {
      return res.status(400).json({ success: false, mensaje: 'El correo ya está registrado.' });
    }

    const nuevoAdmin = await Usuario.create({
      nombre,
      email,
      password,
      fecha_nacimiento,
      genero,
      pais,
      rol: 'admin',
      estado: 'activo',
      plan: 'mistico',
    });

    res.status(201).json({
      success: true,
      usuario: {
        _id: nuevoAdmin._id,
        nombre: nuevoAdmin.nombre,
        email: nuevoAdmin.email,
        genero: nuevoAdmin.genero,
        avatar: nuevoAdmin.avatar,
        pais: nuevoAdmin.pais,
        rol: nuevoAdmin.rol,
        plan: nuevoAdmin.plan,
        estado: nuevoAdmin.estado,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

/**
 * POST /api/auth/olvido-password
 * Genera un token de recuperación y lo envía por correo
 */
const olvidoPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(200).json({ success: true, mensaje: 'Si el correo está registrado, recibirás un enlace de recuperación.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    usuario.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    usuario.resetPasswordExpires = Date.now() + 3600000;
    await usuario.save();

    let baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Forzar http para evitar bloqueos por certificados no configurados
    baseUrl = baseUrl.replace('https://', 'http://');
    
    const resetURL = `${baseUrl}/#/recuperar-password/${resetToken}`;
    const mailSent = await enviarCorreoRecuperacion(usuario.email, resetURL);

    if (!mailSent.success) {
      usuario.resetPasswordToken = undefined;
      usuario.resetPasswordExpires = undefined;
      await usuario.save();
      return res.status(500).json({ success: false, mensaje: 'Error al enviar el correo.' });
    }

    res.status(200).json({ success: true, mensaje: 'Correo de recuperación enviado.' });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * POST /api/auth/restablecer-password/:token
 * Valida el token y actualiza la contraseña
 */
const restablecerPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const usuario = await Usuario.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!usuario) {
      return res.status(400).json({ success: false, mensaje: 'Token inválido o expirado.' });
    }

    usuario.password = password;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;
    await usuario.save();

    res.status(200).json({ success: true, mensaje: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

module.exports = { registro, login, perfil, crearAdmin, olvidoPassword, restablecerPassword };