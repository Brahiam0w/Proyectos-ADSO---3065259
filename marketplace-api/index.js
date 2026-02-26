require('dotenv').config(); // 👈 PRIMERO: carga las variables del .env
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { connectDB } = require('./src/config/database');
const { specs, swaggerUi, swaggerOptions } = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Para servir imágenes
}));

// Portero: permite peticiones de otros dominios
app.use(cors());

// Reportero: registra cada petición en consola
app.use(morgan('dev'));

// Parsear JSON en el body de las peticiones
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes subidas)
// Ejemplo: GET http://localhost:3000/uploads/productos/imagen.jpg
app.use('/uploads', express.static('uploads'));

// ============================================================
// SWAGGER - Documentación interactiva
// Disponible en: http://localhost:3000/api-docs
// ============================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// ============================================================
// RUTAS
// ============================================================
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/usuarios', require('./src/routes/usuarioRoutes'));
app.use('/api/categorias', require('./src/routes/categoriaRoutes'));
app.use('/api/productos', require('./src/routes/productoRoutes'));
app.use('/api/ordenes', require('./src/routes/ordenRoutes'));
app.use('/api/ia', require('./src/routes/iaRoutes'));

// Ruta raíz - información de la API
app.get('/', (req, res) => {
  res.json({
    mensaje: '🛒 Marketplace Inteligente API',
    version: '1.0.0',
    documentacion: `${process.env.BASE_URL}/api-docs`,
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos',
      ordenes: '/api/ordenes',
      ia: '/api/ia'
    }
  });
});

app.use((err, req, res, next) => {
  console.error(' Error:', err.stack);

  // Error de Multer (archivos)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: true, mensaje: 'El archivo es demasiado grande (máximo 5MB)' });
  }

  res.status(err.status || 500).json({
    error: true,
    mensaje: err.message || 'Error interno del servidor'
  });
});

// Ruta no encontrada (debe ir AL FINAL)
app.use('*', (req, res) => {
  res.status(404).json({
    error: true,
    mensaje: `Endpoint no encontrado: ${req.method} ${req.originalUrl}`
  });
});

const startServer = async () => {
  await connectDB(); // Espera a que MongoDB esté conectado
  app.listen(PORT, () => {
    console.log(`\n Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación en http://localhost:${PORT}/api-docs`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

startServer();
