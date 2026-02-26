import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../models/usuarioModel.js";

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await getUsuarioById(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, fecha_nacimiento } = req.body;
    if (!nombre || !email || !fecha_nacimiento) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    const id = await createUsuario({ nombre, email, fecha_nacimiento });
    res.status(201).json({ message: "Usuario registrado correctamente", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, fecha_nacimiento } = req.body;
    const actualizado = await updateUsuario(req.params.id, { nombre, email, fecha_nacimiento });
    if (!actualizado) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await deleteUsuario(req.params.id);
    if (!eliminado) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
