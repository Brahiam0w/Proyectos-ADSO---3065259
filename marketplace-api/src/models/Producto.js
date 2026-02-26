const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [200, 'El nombre no puede superar 200 caracteres']
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [2000, 'La descripción no puede superar 2000 caracteres']
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'El stock no puede ser negativo'],
      validate: {
        validator: Number.isInteger,
        message: 'El stock debe ser un número entero'
      }
    },
    imagen_url: {
      type: String,
      default: null
    },
    imagenes: [{ type: String }], // Galería de imágenes adicionales

    // Referencias a otros documentos (equivalente a FK en SQL)
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario', // Le dice a Mongoose qué modelo buscar al hacer populate()
      required: [true, 'El vendedor es obligatorio']
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'La categoría es obligatoria']
    },

    // Campo generado por IA
    descripcion_ia: {
      type: String,
      default: null
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índices para búsquedas rápidas (equivalente a INDEX en SQL)
ProductoSchema.index({ nombre: 'text', descripcion: 'text' }); // Búsqueda full-text
ProductoSchema.index({ precio: 1 }); // Índice ascendente por precio
ProductoSchema.index({ vendedor: 1 });
ProductoSchema.index({ categoria: 1 });

module.exports = mongoose.model('Producto', ProductoSchema);
