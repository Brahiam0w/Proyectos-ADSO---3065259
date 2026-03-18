const cron = require('node-cron');
const Usuario = require('../models/Usuario');
const { enviarNotificacionLecturaDiaria } = require('./mailer');

/**
 * Inicia las tareas programadas del sistema
 */
const iniciarCronJobs = () => {
  // --- TAREA 1: Verificación horaria de planes expirados ---
  cron.schedule('0 * * * *', async () => {
    console.log(`[${new Date().toLocaleString()}] Verificando planes expirados...`);
    try {
      const hoy = new Date();
      const resultado = await Usuario.updateMany(
        {
          estado: 'activo',
          fecha_expiracion_plan: { $lte: hoy, $ne: null }
        },
        { $set: { estado: 'inactivo' } }
      );

      if (resultado.modifiedCount > 0) {
        console.log(`>>> ÉXITO: ${resultado.modifiedCount} suscripciones han expirado.`);
      }
    } catch (error) {
      console.error('Error en Cron Job (Planes):', error);
    }
  });

  // --- TAREA 2: Notificación diaria de lectura (8:00 AM) ---
  cron.schedule('0 8 * * *', async () => {
    console.log(`[${new Date().toLocaleString()}] Iniciando envío de notificaciones diarias...`);
    try {
      const usuariosActivos = await Usuario.find({ estado: 'activo' });
      
      for (const usuario of usuariosActivos) {
        await enviarNotificacionLecturaDiaria(usuario.email, usuario.nombre);
      }
      
      console.log(`>>> ÉXITO: Se procesaron ${usuariosActivos.length} notificaciones.`);
    } catch (error) {
      console.error('Error en Cron Job (Notificaciones):', error);
    }
  });

  console.log('Servicio de Tareas Programadas (Cron) activo - Tareas configuradas: Planes y Notificaciones.');
};

module.exports = { iniciarCronJobs };
