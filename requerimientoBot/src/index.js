require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Seguridad
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());

// Registro de peticiones HTTP (Logging)
app.use(morgan('dev'));

// Middleware para procesar datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos para el Dashboard (Frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Conexión a MongoDB (Placeholder - se moverá a src/config/db.js más adelante)
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/requerimientoBot';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conexión a MongoDB exitosa');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    // En producción podrías querer salir si falla la conexión inicial
    // process.exit(1);
  }
};

connectDB();

// Rutas base (Placeholder para src/routes/)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db_connected: mongoose.connection.readyState === 1
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo salió mal!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor base corriendo en http://localhost:${PORT}`);
  console.log(`📂 Panel de administración (Frontend) disponible desde /public`);
});
