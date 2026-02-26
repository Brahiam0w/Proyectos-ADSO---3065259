const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede superar 100 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true, // Equivalente a UNIQUE en SQL
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false // 🔐 IMPORTANTE: nunca se devuelve en queries por defecto
    },
    rol: {
      type: String,
      enum: ['comprador', 'vendedor', 'admin'],
      default: 'comprador'
    },
    avatar_url: {
      type: String,
      default: null
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    toJSON: { virtuals: true }, // Incluye campos virtuales en JSON
    toObject: { virtuals: true }
  }
);

UsuarioSchema.pre('save', async function (next) {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified('password')) return next();

  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});


UsuarioSchema.methods.compararPassword = async function (passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

// Retorna el usuario sin campos sensibles
UsuarioSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

UsuarioSchema.statics.buscarConPassword = function (email) {
  // +password porque por defecto select: false lo oculta
  return this.findOne({ email }).select('+password');
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
