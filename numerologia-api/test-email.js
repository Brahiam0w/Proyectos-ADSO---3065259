const { enviarNotificacionLecturaDiaria } = require('./src/utils/mailer');
require('dotenv').config();

const correoPrueba = 'brahiamjavierr@gmail.com';
const nombrePrueba = 'Brahiam';

console.log(`🚀 Iniciando prueba de envío a: ${correoPrueba}...`);

enviarNotificacionLecturaDiaria(correoPrueba, nombrePrueba)
  .then(res => {
    if (res.success) {
      console.log('✅ ¡ÉXITO! El correo de prueba ha sido enviado al oráculo.');
    } else {
      console.log('❌ ERROR: No se pudo enviar el correo. Revisa tus credenciales en el .env');
      console.error(res.error);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('💥 ERROR CRÍTICO:', err);
    process.exit(1);
  });
