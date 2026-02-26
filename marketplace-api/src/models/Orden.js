const mongoose = require('mongoose');

const DetalleOrdenSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  nombre_producto: { type: String, required: true }, // Snapshot: guardamos el nombre por si el producto se elimina
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1']
  },
  precio_unitario: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo']
  },
  subtotal: {
    type: Number,
    required: true
  }
}, { _id: false }); // No necesitamos _id propio para los detalles

const OrdenSchema = new mongoose.Schema(
  {
    comprador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El comprador es obligatorio']
    },
    items: {
      type: [DetalleOrdenSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: 'La orden debe tener al menos un producto'
      }
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo']
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada'],
      default: 'pendiente'
    },
    direccion_envio: {
      type: String,
      trim: true
    },
    notas: {
      type: String,
      trim: true,
      maxlength: [500, 'Las notas no pueden superar 500 caracteres']
    }
  },
  {
    timestamps: true
  }
);

OrdenSchema.index({ comprador: 1 });
OrdenSchema.index({ estado: 1 });
OrdenSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Orden', OrdenSchema);
