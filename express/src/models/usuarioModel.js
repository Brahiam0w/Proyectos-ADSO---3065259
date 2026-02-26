import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    fecha_nacimiento: {
      type: Date,
      required: true
    },
    estado: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "inactivo"
    },
    fecha_vencimiento: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

export async function getUsuarios() {
  return await Usuario.find();
}

export async function getUsuarioById(id) {
  return await Usuario.findById(id);
}

export async function createUsuario({ nombre, email, fecha_nacimiento }) {
  const nuevoUsuario = new Usuario({
    nombre,
    email,
    fecha_nacimiento
  });

  const saved = await nuevoUsuario.save();
  return saved._id;
}

export async function updateUsuario(id, { nombre, email, fecha_nacimiento }) {
  const result = await Usuario.findByIdAndUpdate(
    id,
    { nombre, email, fecha_nacimiento },
    { new: true }
  );

  return !!result;
}

export async function deleteUsuario(id) {
  const result = await Usuario.findByIdAndDelete(id);
  return !!result;
}

export async function setEstadoUsuario(id, estado) {
  const result = await Usuario.findByIdAndUpdate(
    id,
    { estado },
    { new: true }
  );

  return !!result;
}

export async function actualizarMembresia(id, { estado, fecha_vencimiento }) {
  const result = await Usuario.findByIdAndUpdate(
    id,
    { estado, fecha_vencimiento },
    { new: true }
  );

  return !!result;
}
