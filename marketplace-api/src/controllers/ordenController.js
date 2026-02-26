const Orden = require('../models/Orden');
const Producto = require('../models/Producto');
const mongoose = require('mongoose');
const gemini = require('../config/gemini');

class OrdenController {

  // POST /api/ordenes (solo compradores)
  static async crear(req, res, next) {
    // Iniciamos una sesión de MongoDB para la transacción
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { items, direccion_envio, notas } = req.body;

      let total = 0;
      const itemsCompletos = [];

      // FASE 1: Validar stock y precio de cada producto

      for (const item of items) {
        const producto = await Producto.findById(item.producto).session(session);

        if (!producto || !producto.activo) {
          throw new Error(`Producto ${item.producto} no encontrado o inactivo`);
        }

        if (producto.stock < item.cantidad) {
          throw new Error(
            `Stock insuficiente para "${producto.nombre}". ` +
            `Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`
          );
        }

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        itemsCompletos.push({
          producto: producto._id,
          nombre_producto: producto.nombre, // Snapshot del nombre actual
          cantidad: item.cantidad,
          precio_unitario: producto.precio,
          subtotal
        });

        // FASE 2: Reducir stock

        await Producto.findByIdAndUpdate(
          producto._id,
          { $inc: { stock: -item.cantidad } }, // $inc incrementa (o decrementa con negativo)
          { session }
        );
      }

      // FASE 3: Crear la orden

      const [orden] = await Orden.create([{
        comprador: req.usuario._id,
        items: itemsCompletos,
        total,
        direccion_envio,
        notas
      }], { session });

      // Todo salió bien: confirmar la transacción
      await session.commitTransaction();

      // Populate para la respuesta
      await orden.populate('comprador', 'nombre email');

      res.status(201).json({
        error: false,
        mensaje: 'Orden creada exitosamente',
        orden
      });
    } catch (error) {
      // Algo falló: revertir TODOS los cambios (stock, orden, etc.)
      await session.abortTransaction();

      // Errores de validación de negocio los mandamos como 400
      if (error.message.includes('Stock') || error.message.includes('no encontrado')) {
        return res.status(400).json({ error: true, mensaje: error.message });
      }
      next(error);
    } finally {
      session.endSession();
    }
  }

  // GET /api/ordenes (el comprador ve las suyas, admin ve todas)
  static async listar(req, res, next) {
    try {
      const { estado, pagina = 1, limite = 10 } = req.query;
      const filtro = {};

      // Si no es admin, solo ve sus propias órdenes
      if (req.usuario.rol !== 'admin') {
        filtro.comprador = req.usuario._id;
      }

      if (estado) filtro.estado = estado;

      const limiteParsed = Math.min(parseInt(limite), 50);
      const skip = (parseInt(pagina) - 1) * limiteParsed;

      const [ordenes, total] = await Promise.all([
        Orden.find(filtro)
          .populate('comprador', 'nombre email')
          .sort('-createdAt')
          .skip(skip)
          .limit(limiteParsed),
        Orden.countDocuments(filtro)
      ]);

      res.json({
        error: false,
        ordenes,
        paginacion: { total, pagina: parseInt(pagina), limite: limiteParsed }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/ordenes/:id
  static async obtener(req, res, next) {
    try {
      const orden = await Orden.findById(req.params.id)
        .populate('comprador', 'nombre email')
        .populate('items.producto', 'nombre imagen_url');

      if (!orden) {
        return res.status(404).json({ error: true, mensaje: 'Orden no encontrada' });
      }

      // Verificar que le pertenece (o es admin)
      const esComprador = orden.comprador._id.toString() === req.usuario._id.toString();
      if (!esComprador && req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: true, mensaje: 'Sin acceso a esta orden' });
      }

      res.json({ error: false, orden });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/ordenes/:id/estado (solo admin)
  static async actualizarEstado(req, res, next) {
    try {
      const { estado, notas } = req.body;

      const estadosValidos = ['pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          error: true,
          mensaje: `Estado inválido. Opciones: ${estadosValidos.join(', ')}`
        });
      }

      const orden = await Orden.findByIdAndUpdate(
        req.params.id,
        { estado, ...(notas && { notas }) },
        { new: true }
      );

      if (!orden) {
        return res.status(404).json({ error: true, mensaje: 'Orden no encontrada' });
      }

      // Si se cancela, devolvemos el stock
      if (estado === 'cancelada') {
        for (const item of orden.items) {
          await Producto.findByIdAndUpdate(
            item.producto,
            { $inc: { stock: item.cantidad } }
          );
        }
      }

      res.json({ error: false, mensaje: `Orden actualizada a: ${estado}`, orden });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/ordenes/mis-estadisticas (para el comprador autenticado)
  static async misEstadisticas(req, res, next) {
    try {
      const ordenes = await Orden.find({ comprador: req.usuario._id }).sort('-createdAt');

      if (ordenes.length === 0) {
        return res.json({
          error: false,
          estadisticas: { total_ordenes: 0, total_gastado: 0 },
          analisis_ia: null
        });
      }

      const totalGastado = ordenes.reduce((sum, o) => sum + o.total, 0);

      let analisis_ia = null;
      try {
        analisis_ia = await gemini.analizarPatronesCompra(ordenes);
      } catch {
        // Si Gemini falla, no rompemos la respuesta
        analisis_ia = { mensaje: 'Análisis de IA no disponible en este momento' };
      }

      res.json({
        error: false,
        estadisticas: {
          total_ordenes: ordenes.length,
          total_gastado: totalGastado,
          promedio_por_orden: (totalGastado / ordenes.length).toFixed(2)
        },
        analisis_ia
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrdenController;
