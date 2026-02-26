import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    monto: {
      type: Number,
      required: true
    },
    fecha_pago: {
      type: Date,
      required: true
    },
    fecha_vencimiento: {
      type: Date,
      required: true
    },
    metodo: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Pago = mongoose.model('Pago', pagoSchema);

export const createPago = async ({ usuario_id, monto, fecha_pago, fecha_vencimiento, metodo }) => {
  const nuevoPago = new Pago({
    usuario_id,
    monto,
    fecha_pago,
    fecha_vencimiento,
    metodo
  });

  const saved = await nuevoPago.save();
  return saved._id;
};

export const getPagosByUsuario = async (usuario_id) => {
  return await Pago.find({ usuario_id }).sort({ fecha_vencimiento: -1 });
};

export const getAllPagos = async () => {
  return await Pago.find().sort({ createdAt: -1 });
};

export const getEstadoMembresia = async (usuario_id) => {
  const ultimoPago = await Pago
    .findOne({ usuario_id })
    .sort({ fecha_vencimiento: -1 });

  if (!ultimoPago) {
    return { activo: false, fecha_vencimiento: null };
  }

  const hoy = new Date();
  const activo = ultimoPago.fecha_vencimiento >= hoy;

  return {
    activo,
    fecha_vencimiento: ultimoPago.fecha_vencimiento
  };
};
