const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del plan es obligatorio'],
      unique: true,
      trim: true,
    },
    tag: {
      type: String, // Ejemplo: 'Iniciante', 'Místico', 'Premium'
      default: '',
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
    },
    periodo: {
      type: String,
      enum: ['mes', 'año', 'vida'],
      default: 'mes',
    },
    icon: {
      type: String, // Nombre del icono de Quasar/Material
      default: 'stars',
    },
    features: {
      type: [String], // Array de características
      default: [],
    },
    planColor: {
      type: String, // Color para badges
      default: 'amber-10',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Plan', planSchema);