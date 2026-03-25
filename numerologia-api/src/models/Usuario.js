const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de correo inválido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No se retorna por defecto en consultas
    },
    fecha_nacimiento: {
      type: Date,
      required: [true, 'La fecha de nacimiento es obligatoria'],
    },
    genero: {
      type: String,
      enum: ['masculino', 'femenino', 'otro', 'prefiero no decirlo'],
      default: 'prefiero no decirlo',
    },
    avatar: {
      type: String,
      default: '', // URL de la imagen
    },
    pais: {
      type: String,
      default: '',
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo'],
      default: 'inactivo',
    },
    rol: {
      type: String,
      enum: ['admin', 'usuario'],
      default: 'usuario',
    },
    plan: {
      type: String,
      enum: ['gratuito', 'mistico'],
      default: 'gratuito',
    },
    fecha_expiracion_plan: {
      type: Date,
      default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: { createdAt: 'fecha_registro', updatedAt: 'fecha_actualizacion' },
  }
);

// Encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
