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
      enum: ['tarjeta', 'efectivo', 'transferencia'],
      required: [true, 'El método de pago es obligatorio'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pago', pagoSchema);
