const cron = require('node-cron');
const Usuario = require('../models/Usuario');

/**
 * Inicia las tareas programadas del sistema
 */
const iniciarCronJobs = () => {
  // Se ejecuta cada hora para mayor precisión (puedes volver a '0 0 * * *' si prefieres solo medianoche)
  cron.schedule('0 * * * *', async () => {
    console.log(`[${new Date().toLocaleString()}] Verificando planes expirados...`);
    try {
      const hoy = new Date();

      // Buscamos usuarios activos cuya fecha de expiración sea menor o igual a la actual
      const resultado = await Usuario.updateMany(
        {
          estado: 'activo',
          fecha_expiracion_plan: { $lte: hoy, $ne: null }
        },
        {
          $set: { estado: 'inactivo' }
        }
      );

      if (resultado.modifiedCount > 0) {
        console.log(`>>> ÉXITO: ${resultado.modifiedCount} suscripciones han expirado.`);
      }
    } catch (error) {
      console.error('Error en Cron Job:', error);
    }
  });

  console.log('Servicio de Tareas Programadas (Cron) activo - Verificación horaria iniciada.');
};

module.exports = { iniciarCronJobs };
