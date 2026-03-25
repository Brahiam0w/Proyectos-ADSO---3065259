const cron = require('node-cron');
const Usuario = require('../models/Usuario');
const { enviarNotificacionLecturaDiaria } = require('./mailer');

/**
 * Inicia las tareas programadas del sistema
 */
const iniciarCronJobs = () => {
  // --- TAREA 1: Verificación diaria de planes expirados (12:00 AM) ---
  cron.schedule('0 0 * * *', async () => {
    console.log(`[${new Date().toLocaleString()}] Verificando planes expirados...`);
    try {
      const hoy = new Date();
      // Buscamos usuarios con plan místico cuya fecha de expiración sea menor o igual a hoy
      const resultado = await Usuario.updateMany(
        {
          plan: 'mistico',
          fecha_expiracion_plan: { $lte: hoy, $ne: null }
        },
        { 
          $set: { plan: 'gratuito' } // El usuario vuelve al plan base, no se desactiva su cuenta
        }
      );

      if (resultado.modifiedCount > 0) {
        console.log(`>>> ÉXITO: ${resultado.modifiedCount} suscripciones místicas han expirado y vuelto a plan gratuito.`);
      }
    } catch (error) {
      console.error('Error en Cron Job (Planes):', error);
    }
  });

  // --- TAREA 2: Notificación diaria de lectura (12:00 AM) ---
  cron.schedule('0 0 * * *', async () => {
    console.log(`[${new Date().toLocaleString()}] Iniciando envío de notificaciones diarias...`);
    try {
      // Enviamos notificaciones solo a usuarios con cuenta activa
      const usuariosActivos = await Usuario.find({ estado: 'activo' });
      
      for (const usuario of usuariosActivos) {
        await enviarNotificacionLecturaDiaria(usuario.email, usuario.nombre);
      }
      
      console.log(`>>> ÉXITO: Se procesaron ${usuariosActivos.length} notificaciones.`);
    } catch (error) {
      console.error('Error en Cron Job (Notificaciones):', error);
    }
  });

  console.log('Servicio de Tareas Programadas (Cron) activo - Tareas configuradas para las 12:00 AM.');
};

module.exports = { iniciarCronJobs };
