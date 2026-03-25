const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración del transportador (SMTP)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envía un correo con diseño místico
 * @param {string} email - Correo del destinatario
 * @param {string} nombre - Nombre del usuario
 */
const enviarNotificacionLecturaDiaria = async (email, nombre) => {
  const mailOptions = {
    from: `"Oráculo de Sabiduría" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✨ ${nombre}, tu guía mística de hoy ya ha sido revelada`,
    html: `
      <div style="background-color: #0a0612; color: #e0e0e0; font-family: 'Playfair Display', serif; padding: 40px; text-align: center; border: 2px solid #d4af37;">
        <div style="margin-bottom: 20px;">
          <span style="font-size: 40px; color: #d4af37;">✨</span>
        </div>
        <h1 style="color: #d4af37; font-size: 28px; text-transform: uppercase; letter-spacing: 3px;">
          Tu Destino te Espera
        </h1>
        <p style="font-size: 18px; line-height: 1.6; color: #f0f0f0;">
          Hola, <strong>${nombre}</strong>. Las estrellas se han alineado y tu lectura diaria de numerología ya está disponible en tu portal.
        </p>
        <p style="font-style: italic; color: #a094b8; margin: 30px 0;">
          "Los números son el lenguaje en el que el universo nos habla."
        </p>
        <div style="margin-top: 40px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/lecturas" 
             style="background: linear-gradient(45deg, #d4af37, #b8860b); color: #0a0612; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; text-transform: uppercase; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
            Revelar mi Guía Diaria
          </a>
        </div>
        <div style="margin-top: 50px; border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 20px; font-size: 12px; color: #666;">
          © 2026 Oráculo de Sabiduría. Todos los derechos reservados.<br>
          Recibes este correo porque tienes una membresía activa en nuestro portal místico.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email enviado con éxito a ${email}: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error('Error al enviar email:', error);
    return { success: false, error };
  }
};

/**
 * Envía un correo para restablecer la contraseña
 * @param {string} email - Correo del destinatario
 * @param {string} resetURL - URL para restablecer contraseña
 */
const enviarCorreoRecuperacion = async (email, resetURL) => {
  const mailOptions = {
    from: `"Oráculo de Sabiduría" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Restablecer tu Contraseña - Oráculo de Sabiduría',
    html: `
      <div style="background-color: #0a0612; color: #e0e0e0; font-family: 'Playfair Display', serif; padding: 40px; text-align: center; border: 2px solid #d4af37;">
        <div style="margin-bottom: 20px;">
          <span style="font-size: 40px; color: #d4af37;">🔐</span>
        </div>
        <h1 style="color: #d4af37; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">
          Restablecer Contraseña
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #f0f0f0;">
          Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar. 
          Este enlace expirará en 1 hora.
        </p>
        <div style="margin-top: 30px;">
          <a href="${resetURL}" 
             style="background: linear-gradient(45deg, #d4af37, #b8860b); color: #0a0612; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase;">
            Restablecer mi Contraseña
          </a>
        </div>
        <p style="margin-top: 30px; font-size: 14px; color: #a094b8;">
          Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
        </p>
        <div style="margin-top: 50px; border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 20px; font-size: 12px; color: #666;">
          © 2026 Oráculo de Sabiduría. Todos los derechos reservados.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error al enviar email de recuperación:', error);
    return { success: false, error };
  }
};

module.exports = { enviarNotificacionLecturaDiaria, enviarCorreoRecuperacion };
