import mongoose from 'mongoose';

const lecturaSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    tipo: {
      type: String,
      enum: ['principal', 'diaria'],
      required: true
    },
    contenido: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Lectura = mongoose.model('Lectura', lecturaSchema);

export const createLectura = async ({ usuario_id, tipo, contenido }) => {
  const nuevaLectura = new Lectura({
    usuario_id,
    tipo,
    contenido
  });

  const saved = await nuevaLectura.save();
  return saved._id;
};

export const getLecturasByUsuario = async (usuario_id) => {
  return await Lectura.find({ usuario_id });
};

export const getLecturaById = async (id) => {
  return await Lectura.findById(id);
};

export const existsPrincipal = async (usuario_id) => {
  const lectura = await Lectura.findOne({
    usuario_id,
    tipo: 'principal'
  });

  return !!lectura;
};
