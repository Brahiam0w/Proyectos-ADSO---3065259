const Pago = require('../models/Pago');
const Usuario = require('../models/Usuario');

/**
 * GET /api/pagos
 * [Admin] Lista todos los pagos del sistema
 */
const listarPagos = async (req, res) => {
  try {
    const pagos = await Pago.find()
      .populate('usuario_id', 'nombre email estado')
      .sort({ fecha_pago: -1 });

    res.status(200).json({ success: true, total: pagos.length, pagos });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * GET /api/pagos/:usuario_id
 * [Admin] Ve todos los pagos de cualquier usuario
 * [Usuario] Solo puede ver sus propios pagos
 */
const pagosPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // Un usuario normal solo puede ver sus propios pagos
    if (req.usuario.rol === 'usuario' && req.usuario._id.toString() !== usuario_id) {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permiso para ver los pagos de otro usuario.',
      });
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    const pagos = await Pago.find({ usuario_id }).sort({ fecha_pago: -1 });

    res.status(200).json({ success: true, total: pagos.length, pagos });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

/**
 * POST /api/pagos
 * Registra un nuevo pago de membresía
 * Al registrar el pago, el usuario pasa automáticamente a "activo"
 * Body: { usuario_id, monto, metodo }
 */
const registrarPago = async (req, res) => {
  try {
    const { usuario_id, monto, metodo } = req.body;

    // Un usuario normal solo puede pagar por sí mismo
    if (req.usuario.rol === 'usuario' && req.usuario._id.toString() !== usuario_id) {
      return res.status(403).json({
        success: false,
        mensaje: 'No puedes registrar pagos para otro usuario.',
      });
    }

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    // Calcular fecha de vencimiento (+30 días desde hoy)
    const fechaPago = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);

    const nuevoPago = await Pago.create({
      usuario_id,
      monto,
      metodo,
      fecha_pago: fechaPago,
      fecha_vencimiento: fechaVencimiento,
    });

    // Actualizar estado del usuario a "activo" automáticamente
    await Usuario.findByIdAndUpdate(usuario_id, { estado: 'activo' });

    res.status(201).json({
      success: true,
      mensaje: `Pago registrado. Usuario '${usuario.nombre}' ahora está ACTIVO hasta el ${fechaVencimiento.toLocaleDateString('es-CO')}.`,
      pago: nuevoPago,
    });
  } catch (error) {
    res.status(400).json({ success: false, mensaje: error.message });
  }
};

/**
 * GET /api/pagos/estado/:usuario_id
 * Consulta si un usuario tiene membresía activa o vencida
 */
const estadoMembresia = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // Un usuario normal solo puede ver su propio estado
    if (req.usuario.rol === 'usuario' && req.usuario._id.toString() !== usuario_id) {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permiso para ver el estado de otro usuario.',
      });
    }

    const usuario = await Usuario.findById(usuario_id).select('-password');
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    // Buscar el pago más reciente
    const ultimoPago = await Pago.findOne({ usuario_id }).sort({ fecha_pago: -1 });

    const hoy = new Date();
    let estadoMembresia = 'sin membresía';
    let diasRestantes = 0;

    if (ultimoPago) {
      const vencimiento = new Date(ultimoPago.fecha_vencimiento);
      estadoMembresia = vencimiento >= hoy ? 'vigente' : 'vencida';
      diasRestantes = Math.max(
        0,
        Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))
      );
    }

    res.status(200).json({
      success: true,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        estado: usuario.estado,
      },
      membresia: {
        estado: estadoMembresia,
        diasRestantes,
        ultimoPago: ultimoPago
          ? {
              fecha_pago: ultimoPago.fecha_pago,
              fecha_vencimiento: ultimoPago.fecha_vencimiento,
              monto: ultimoPago.monto,
              metodo: ultimoPago.metodo,
            }
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: error.message });
  }
};

module.exports = { listarPagos, pagosPorUsuario, registrarPago, estadoMembresia };
