const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      unique: true,
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede superar 100 caracteres']
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres']
    },
    imagen_icono: {
      type: String,
      default: null
    },
    activa: {
      type: Boolean,
      default: true
    },
    // Campo generado por IA (Gemini)
    descripcion_ia: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    // Campo virtual: cuenta de productos (se calcula, no se guarda)
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//cantidad de productos en esta categoría
CategoriaSchema.virtual('totalProductos', {
  ref: 'Producto',
  localField: '_id',
  foreignField: 'categoria',
  count: true // Solo cuenta, no trae todos los docs
});

module.exports = mongoose.model('Categoria', CategoriaSchema);
