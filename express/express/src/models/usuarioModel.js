import {pool} from "../config/db.js";

// Obtener todos los usuarios
export async function getUsuarios() {
  const [rows] = await pool.query("SELECT * FROM usuarios");
  return rows;
}

// Obtener un usuario por ID
export async function getUsuarioById(id) {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
  return rows[0];
}

// Crear un nuevo usuario
export async function createUsuario({ nombre, email, fecha_nacimiento }) {
  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, email, fecha_nacimiento) VALUES (?, ?, ?)",
    [nombre, email, fecha_nacimiento]
  );
  return result.insertId;
}

// Actualizar un usuario
export async function updateUsuario(id, { nombre, email, fecha_nacimiento }) {
  const [result] = await pool.query(
    "UPDATE usuarios SET nombre=?, email=?, fecha_nacimiento=? WHERE id=?",
    [nombre, email, fecha_nacimiento, id]
  );
  return result.affectedRows > 0;
}

// Eliminar un usuario
export async function deleteUsuario(id) {
  const [result] = await pool.query("DELETE FROM usuarios WHERE id=?", [id]);
  return result.affectedRows > 0;
}

export async function setEstadoUsuario(id, estado) {
  const [result] = await pool.query(
    "UPDATE usuarios SET estado = ? WHERE id = ?",
    [estado, id]
  );
  return result.affectedRows > 0;
}