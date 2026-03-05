const mongoose = require('mongoose');

const lecturaSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario es obligatorio'],
    },
    tipo: {
      type: String,
      enum: ['principal', 'diaria'],
      required: [true, 'El tipo de lectura es obligatorio'],
    },
    contenido: {
      type: String,
      required: [true, 'El contenido de la lectura es obligatorio'],
    },
    numero_camino_vida: {
      type: Number, // Número numerológico calculado
    },
    fecha_lectura: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lectura', lecturaSchema);
