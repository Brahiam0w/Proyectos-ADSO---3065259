const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

/**
 * Genera un token JWT firmado con el ID del usuario
 */
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // El token expira en 30 días
  });
};

/**
 * POST /api/auth/registro
 * Crea un nuevo usuario en la base de datos
 */
const registro = async (req, res) => {
  try {
    const { nombre, email, password, fecha_nacimiento, genero, pais, estado } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ success: false, mensaje: 'El correo ya está registrado.' });
    }

    // Crear el usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      fecha_nacimiento,
      genero,
      pais,
      estado: estado || 'inactivo',
    });

    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
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

    // Buscar usuario y seleccionar password (que está oculta por defecto)
    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({ success: false, mensaje: 'Credenciales inválidas.' });
    }

    // --- REFUERZO: Verificar expiración al iniciar sesión ---
    if (usuario.estado === 'activo' && usuario.fecha_expiracion_plan) {
      if (new Date() >= new Date(usuario.fecha_expiracion_plan)) {
        usuario.estado = 'inactivo';
        await usuario.save();
      }
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
        fecha_expiracion_plan: usuario.fecha_expiracion_plan,
        estado: usuario.estado,
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
    const { nombre, email, password, fecha_nacimiento, genero, pais, estado } = req.body;

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
      estado: estado || 'activo',
    });

    res.status(201).json({
      success: true,
      usuario: {
        _id: nuevoAdmin._id,
        nombre: nuevoAdmin.nombre,
        email: nuevoAdmin.email,
        rol: nuevoAdmin.rol,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

module.exports = { registro, login, perfil, crearAdmin };
