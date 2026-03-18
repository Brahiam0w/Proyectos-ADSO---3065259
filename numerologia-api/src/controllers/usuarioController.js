const Usuario = require('../models/Usuario');
const Pago = require('../models/Pago');

/**
 * GET /api/usuarios
 * [Admin] Lista todos los usuarios registrados
 */
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.status(200).json({ success: true, usuarios });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * GET /api/usuarios/:id
 * Obtiene un usuario por ID
 */
const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }
    res.status(200).json({ success: true, usuario });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * PUT /api/usuarios/:id
 * Actualiza un usuario por ID
 */
const actualizarUsuario = async (req, res) => {
  try {
    const dataActualizacion = { ...req.body };

    // Si el administrador cambia el estado a 'activo', nos aseguramos de que tenga fecha de expiración
    if (dataActualizacion.estado === 'activo') {
      const usuarioActual = await Usuario.findById(req.params.id);
      if (usuarioActual) {
        const hoy = new Date();
        // Si no tiene fecha o ya expiró, le damos 30 días por defecto
        if (!usuarioActual.fecha_expiracion_plan || usuarioActual.fecha_expiracion_plan < hoy) {
          const nuevaFecha = new Date();
          nuevaFecha.setDate(nuevaFecha.getDate() + 30);
          dataActualizacion.fecha_expiracion_plan = nuevaFecha;
        }
      }
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, dataActualizacion, {
      new: true,
      runValidators: true,
    });

    if (!usuarioActualizado) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    res.status(200).json({ 
      success: true, 
      mensaje: 'Perfil actualizado correctamente.',
      usuario: {
        _id: usuarioActualizado._id,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
        fecha_nacimiento: usuarioActualizado.fecha_nacimiento,
        genero: usuarioActualizado.genero,
        avatar: usuarioActualizado.avatar,
        pais: usuarioActualizado.pais,
        estado: usuarioActualizado.estado,
        rol: usuarioActualizado.rol,
        fecha_expiracion_plan: usuarioActualizado.fecha_expiracion_plan
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

/**
 * PATCH /api/usuarios/:id/estado
 * [Admin] Cambia el estado de un usuario
 */
const cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    res.status(200).json({ success: true, usuario });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

/**
 * DELETE /api/usuarios/:id
 * [Admin] Elimina un usuario definitivamente
 */
const eliminarUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, mensaje: 'Usuario eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * PUT /api/usuarios/perfil/password
 * [Usuario] Cambia su propia contraseña
 */
const actualizarPassword = async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;
    const usuario = await Usuario.findById(req.usuario._id).select('+password');

    if (!usuario || !(await usuario.compararPassword(passwordActual))) {
      return res.status(401).json({ success: false, mensaje: 'La contraseña actual es incorrecta.' });
    }

    usuario.password = nuevaPassword;
    await usuario.save();

    res.status(200).json({ success: true, mensaje: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

/**
 * DELETE /api/usuarios/perfil/eliminar
 * [Usuario] Elimina su propia cuenta
 */
const eliminarMiCuenta = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.usuario._id);
    res.status(200).json({ success: true, mensaje: 'Tu cuenta ha sido eliminada permanentemente.' });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * POST /api/usuarios/perfil/activar-plan
 * [Usuario] Simula la activación del plan místico
 */
const activarPlanMistico = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });

    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 30);

    usuario.estado = 'activo';
    usuario.fecha_expiracion_plan = fechaExpiracion;
    await usuario.save();

    await Pago.create({
      usuario_id: usuario._id,
      monto: 9.99,
      fecha_vencimiento: fechaExpiracion,
      metodo: 'tarjeta'
    });

    res.status(200).json({ 
      success: true, 
      mensaje: '¡Plan Místico activado con éxito! Registro guardado en base de datos.',
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        fecha_nacimiento: usuario.fecha_nacimiento,
        genero: usuario.genero,
        avatar: usuario.avatar,
        estado: usuario.estado,
        rol: usuario.rol,
        fecha_expiracion_plan: usuario.fecha_expiracion_plan
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  cambiarEstado,
  eliminarUsuario,
  actualizarPassword,
  eliminarMiCuenta,
  activarPlanMistico,
};
