import cron from 'node-cron';
import db from '../config/db.js';

// Se ejecuta cada día a las 00:05 para actualizar estados
cron.schedule('5 0 * * *', async () => {
  try {
    const [users] = await db.execute('SELECT id FROM usuarios');
    const hoy = new Date().toISOString().split('T')[0];
    for(const u of users){
      const [rows] = await db.execute('SELECT fecha_vencimiento FROM pagos WHERE usuario_id = ? ORDER BY fecha_vencimiento DESC LIMIT 1', [u.id]);
      if(rows.length === 0){
        await db.execute('UPDATE usuarios SET estado = ? WHERE id = ?', ['inactivo', u.id]);
      } else {
        const fv = rows[0].fecha_vencimiento;
        if(new Date(fv) < new Date(hoy)){
          await db.execute('UPDATE usuarios SET estado = ? WHERE id = ?', ['inactivo', u.id]);
        } else {
          await db.execute('UPDATE usuarios SET estado = ? WHERE id = ?', ['activo', u.id]);
        }
      }
    }
    console.log('Cron: estados de membresía actualizados');
  } catch(err){
    console.error('Cron error', err);
  }
}, { timezone: 'America/Bogota' });
