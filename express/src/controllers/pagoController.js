import * as Pago from '../models/pagoModel.js';
import * as Usuario from '../models/usuarioModel.js';

export const registrarPago = async (req, res) => {
  try {
    const { usuario_id, monto, metodo } = req.body;

    // 1️⃣ Verificar que el usuario exista
    const usuario = await Usuario.getUsuarioById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 2️⃣ Calcular fechas
    const hoy = new Date();
    const fecha_pago = hoy.toISOString().split('T')[0];

    const fv = new Date();
    fv.setDate(fv.getDate() + 30);
    const fecha_vencimiento = fv.toISOString().split('T')[0];

    // 3️⃣ Registrar pago
    const id = await Pago.createPago({
      usuario_id,
      monto,
      fecha_pago,
      fecha_vencimiento,
      metodo
    });

    // 4️⃣ Actualizar estado Y fecha de vencimiento del usuario
    await Usuario.actualizarMembresia(usuario_id, {
      estado: 'activo',
      fecha_vencimiento
    });

    return res.status(201).json({
      mensaje: 'Pago registrado y membresía activada',
      pago_id: id,
      fecha_vencimiento
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

export const listarPagos = async (req, res) => {
  try {
    const rows = await Pago.getAllPagos();
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

export const pagosPorUsuario = async (req, res) => {
  try {
    const rows = await Pago.getPagosByUsuario(req.params.usuario_id);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

export const estadoMembresia = async (req, res) => {
  try {
    const estado = await Pago.getEstadoMembresia(req.params.usuario_id);
    return res.json(estado);
  } catch (err) {
    return res.status(500).json({ error: 'Error del servidor' });
  }
};
