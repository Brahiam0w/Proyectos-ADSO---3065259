import db from '../config/db.js';

export const createPago = async ({usuario_id,monto,fecha_pago,fecha_vencimiento,metodo}) => {
  const [res] = await db.execute(
    'INSERT INTO pagos (usuario_id,monto,fecha_pago,fecha_vencimiento,metodo) VALUES (?,?,?,?,?)',
    [usuario_id,monto,fecha_pago,fecha_vencimiento,metodo]
  );
  return res.insertId;
};

export const getPagosByUsuario = async (usuario_id) => {
  const [rows] = await db.execute('SELECT * FROM pagos WHERE usuario_id = ?', [usuario_id]);
  return rows;
};

export const getAllPagos = async () => {
  const [rows] = await db.execute('SELECT * FROM pagos');
  return rows;
};

export const getEstadoMembresia = async (usuario_id) => {
  const [rows] = await db.execute('SELECT fecha_vencimiento FROM pagos WHERE usuario_id = ? ORDER BY fecha_vencimiento DESC LIMIT 1', [usuario_id]);
  if(rows.length === 0) return { activo: false, fecha_vencimiento: null };
  const fv = rows[0].fecha_vencimiento;
  const hoy = new Date();
  const activo = new Date(fv) >= new Date(hoy.toISOString().split('T')[0]);
  return { activo, fecha_vencimiento: fv };
};
