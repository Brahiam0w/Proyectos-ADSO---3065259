const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario es obligatorio'],
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0, 'El monto no puede ser negativo'],
    },
    fecha_pago: {
      type: Date,
      default: Date.now,
    },
    fecha_vencimiento: {
      type: Date,
      required: true,
    },
    metodo: {
      type: String,
      enum: ['tarjeta', 'efectivo', 'transferencia', 'Mercado Pago'],
      required: [true, 'El método de pago es obligatorio'],
    },
    mpPreferenceId: {
      type: String,
      default: null,
    },
    mpPaymentId: {
      type: String,
      default: null,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'aprobado', 'rechazado', 'fallido'],
      default: 'pendiente',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pago', pagoSchema);
