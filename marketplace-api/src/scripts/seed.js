require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');

const datos = {
  usuarios: [
    { nombre: 'Admin Sistema', email: 'admin@marketplace.com', password: 'Admin123', rol: 'admin' },
    { nombre: 'Vendedor Demo', email: 'vendedor@marketplace.com', password: 'Vendedor123', rol: 'vendedor' },
    { nombre: 'Comprador Demo', email: 'comprador@marketplace.com', password: 'Comprador123', rol: 'comprador' }
  ],
  categorias: [
    { nombre: 'Electrónicos', descripcion: 'Dispositivos y tecnología' },
    { nombre: 'Ropa y Accesorios', descripcion: 'Moda y complementos' },
    { nombre: 'Hogar y Jardín', descripcion: 'Artículos para el hogar' },
    { nombre: 'Deportes', descripcion: 'Equipamiento deportivo' },
    { nombre: 'Libros', descripcion: 'Literatura y educación' }
  ]
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones
    await Promise.all([
      Usuario.deleteMany({}),
      Categoria.deleteMany({}),
      Producto.deleteMany({})
    ]);
    console.log('🧹 Base de datos limpiada');

    // Crear usuarios
    const usuariosCreados = await Usuario.insertMany(datos.usuarios);
    console.log(`👥 ${usuariosCreados.length} usuarios creados`);

    // Crear categorías
    const categoriasCreadas = await Categoria.insertMany(datos.categorias);
    console.log(`📂 ${categoriasCreadas.length} categorías creadas`);

    // Crear productos de ejemplo
    const vendedor = usuariosCreados.find(u => u.rol === 'vendedor');
    const catElectronicos = categoriasCreadas[0];
    const catRopa = categoriasCreadas[1];

    await Producto.insertMany([
      {
        nombre: 'Smartphone Samsung Galaxy S24',
        descripcion: 'El último flagship de Samsung con cámara de 200MP',
        precio: 899.99,
        stock: 15,
        vendedor: vendedor._id,
        categoria: catElectronicos._id
      },
      {
        nombre: 'Audífonos Bluetooth Sony WH-1000XM5',
        descripcion: 'Cancelación de ruido líder en la industria',
        precio: 349.99,
        stock: 30,
        vendedor: vendedor._id,
        categoria: catElectronicos._id
      },
      {
        nombre: 'Camiseta Polo Clásica',
        descripcion: 'Algodón 100%, disponible en varios colores',
        precio: 29.99,
        stock: 100,
        vendedor: vendedor._id,
        categoria: catRopa._id
      }
    ]);
    console.log('3 productos de ejemplo creados');

    console.log('\n ¡Seed completado exitosamente!\n');
    console.log('Credenciales de prueba:');
    console.log('  Admin:     admin@marketplace.com / Admin123');
    console.log('  Vendedor:  vendedor@marketplace.com / Vendedor123');
    console.log('  Comprador: comprador@marketplace.com / Comprador123');

    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error.message);
    process.exit(1);
  }
};

seed();
