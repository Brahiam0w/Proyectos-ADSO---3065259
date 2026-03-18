require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('./src/models/Plan');
const connectDB = require('./src/config/db');

const planesIniciales = [
  { 
    nombre: 'Plan Iniciado', 
    tag: 'Gratuito', 
    precio: 0, 
    periodo: 'vida', 
    icon: 'brightness_5', 
    features: [
      'Lectura Principal Personalizada',
      'Cálculo de Número de Vida',
      'Acceso al Portal Místico'
    ],
    planColor: 'blue-10'
  },
  { 
    nombre: 'Plan Místico', 
    tag: 'Premium', 
    precio: 9.99, 
    periodo: 'mes', 
    icon: 'auto_fix_high', 
    features: [
      'Lecturas Diarias con IA Gemini',
      'Notificaciones Diarias por Email',
      'Historial de Lecturas Ilimitado',
      'Descarga de Guías en PDF',
      'Análisis Profundo de Vibración'
    ],
    planColor: 'amber-10'
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    await Plan.deleteMany({});
    await Plan.insertMany(planesIniciales);
    console.log('✅ Base de datos actualizada: Soporte por comunidad eliminado del Plan Iniciado.');
    process.exit();
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedDB();