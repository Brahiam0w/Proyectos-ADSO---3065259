require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { iniciarCronJobs } = require('./src/utils/cron');

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const pagoRoutes = require('./src/routes/pagoRoutes');
const lecturaRoutes = require('./src/routes/lecturaRoutes');
const planRoutes = require('./src/routes/planRoutes');

const app = express();

// ========================
// Middlewares globales
// ========================
app.use(cors()); // Permitir peticiones desde otros orígenes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// Conectar a MongoDB
// ========================
connectDB();

// ========================
// Rutas de la API
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/lecturas', lecturaRoutes);
app.use('/api/planes', planRoutes);

// Ruta raíz de bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Numerología — Sistema de Lecturas Inteligentes',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      pagos: '/api/pagos',
      lecturas: '/api/lecturas',
    },
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ success: false, mensaje: 'Ruta no encontrada.' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, mensaje: 'Error interno del servidor.' });
});

// ========================
// Iniciar servidor y CRON
// ========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  iniciarCronJobs();
});
