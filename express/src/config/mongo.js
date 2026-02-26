import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Estas opciones evitan warnings de deprecación
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    console.log(`Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error('Error al conectar MongoDB:', error.message);
    process.exit(1); // Detiene el servidor si no hay DB
  }
};

// Eventos de conexión para monitorear el estado
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB desconectado');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconectado');
});

export {connectDB};