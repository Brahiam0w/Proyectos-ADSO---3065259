import db from '../config/db.js';

export const createLectura = async ({usuario_id,tipo,contenido}) => {
  const [res] = await db.execute(
    'INSERT INTO lecturas (usuario_id,tipo,contenido) VALUES (?,?,?)',
    [usuario_id,tipo,contenido] 
  );
  return res.insertId;
};

export const getLecturasByUsuario = async (usuario_id) => {
  const [rows] = await db.execute('SELECT * FROM lecturas WHERE usuario_id = ?', [usuario_id]);
  return rows;
};

export const getLecturaById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM lecturas WHERE id = ?', [id]);
  return rows[0];
};

export const existsPrincipal = async (usuario_id) => {
  const [rows] = await db.execute('SELECT id FROM lecturas WHERE usuario_id = ? AND tipo = ?', [usuario_id,'principal']);
  return rows.length > 0;
};
