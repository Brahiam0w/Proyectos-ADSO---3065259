const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const gemini = require('../config/gemini');

class ProductoController {

  // POST /api/productos (solo vendedores y admins)
  static async crear(req, res, next) {
    try {
      const { nombre, descripcion, precio, stock, categoria } = req.body;

      // Verificar que la categoría existe
      const catExiste = await Categoria.findById(categoria);
      if (!catExiste) {
        return res.status(404).json({ error: true, mensaje: 'Categoría no encontrada' });
      }

      const datosProducto = {
        nombre,
        descripcion,
        precio,
        stock,
        categoria,
        vendedor: req.usuario._id // El vendedor es quien hace el request
      };

      // Si subió imagen
      if (req.file) {
        datosProducto.imagen_url = `/uploads/productos/${req.file.filename}`;
      }

      const producto = await Producto.create(datosProducto);

      // Populate para devolver datos completos
      await producto.populate([
        { path: 'vendedor', select: 'nombre email' },
        { path: 'categoria', select: 'nombre' }
      ]);

      res.status(201).json({
        error: false,
        mensaje: 'Producto creado exitosamente',
        producto
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/productos (público)
  static async listar(req, res, next) {
    try {
      const {
        q, categoria, vendedor,
        precio_min, precio_max, en_stock,
        pagina = 1, limite = 10,
        orden = '-createdAt'
      } = req.query;

      const filtro = { activo: true };

      // Búsqueda full-text (gracias al índice 'text' del modelo)
      if (q) {
        filtro.$text = { $search: q };
      }

      if (categoria) filtro.categoria = categoria;
      if (vendedor) filtro.vendedor = vendedor;
      if (en_stock === 'true') filtro.stock = { $gt: 0 };

      // Rango de precio
      if (precio_min || precio_max) {
        filtro.precio = {};
        if (precio_min) filtro.precio.$gte = parseFloat(precio_min);
        if (precio_max) filtro.precio.$lte = parseFloat(precio_max);
      }

      const limiteParsed = Math.min(parseInt(limite), 50);
      const skip = (parseInt(pagina) - 1) * limiteParsed;

      const [productos, total] = await Promise.all([
        Producto.find(filtro)
          .populate('vendedor', 'nombre email')
          .populate('categoria', 'nombre imagen_icono')
          .sort(orden)
          .skip(skip)
          .limit(limiteParsed)
          .select('-__v'),
        Producto.countDocuments(filtro)
      ]);

      res.json({
        error: false,
        productos,
        paginacion: {
          total,
          pagina: parseInt(pagina),
          limite: limiteParsed,
          total_paginas: Math.ceil(total / limiteParsed),
          hay_mas: (parseInt(pagina) * limiteParsed) < total
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/productos/:id
  static async obtener(req, res, next) {
    try {
      const producto = await Producto.findById(req.params.id)
        .populate('vendedor', 'nombre email')
        .populate('categoria', 'nombre descripcion');

      if (!producto || !producto.activo) {
        return res.status(404).json({ error: true, mensaje: 'Producto no encontrado' });
      }

      res.json({ error: false, producto });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/productos/:id (solo dueño o admin)
  static async actualizar(req, res, next) {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).json({ error: true, mensaje: 'Producto no encontrado' });
      }

      // Verificar que es el vendedor dueño o un admin
      const esDuenio = producto.vendedor.toString() === req.usuario._id.toString();
      const esAdmin = req.usuario.rol === 'admin';

      if (!esDuenio && !esAdmin) {
        return res.status(403).json({ error: true, mensaje: 'Solo el vendedor dueño puede editar este producto' });
      }

      // Campos permitidos a actualizar
      const camposPermitidos = ['nombre', 'descripcion', 'precio', 'stock', 'categoria'];
      const cambios = {};

      camposPermitidos.forEach(campo => {
        if (req.body[campo] !== undefined) cambios[campo] = req.body[campo];
      });

      if (req.file) cambios.imagen_url = `/uploads/productos/${req.file.filename}`;

      const productoActualizado = await Producto.findByIdAndUpdate(
        req.params.id,
        cambios,
        { new: true, runValidators: true }
      ).populate('vendedor', 'nombre').populate('categoria', 'nombre');

      res.json({ error: false, mensaje: 'Producto actualizado', producto: productoActualizado });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/productos/:id
  static async eliminar(req, res, next) {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).json({ error: true, mensaje: 'Producto no encontrado' });
      }

      const esDuenio = producto.vendedor.toString() === req.usuario._id.toString();
      const esAdmin = req.usuario.rol === 'admin';

      if (!esDuenio && !esAdmin) {
        return res.status(403).json({ error: true, mensaje: 'Sin permisos para eliminar este producto' });
      }

      await Producto.findByIdAndUpdate(req.params.id, { activo: false });

      res.json({ error: false, mensaje: 'Producto eliminado exitosamente' });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/productos/:id/generar-descripcion-ia
  static async generarDescripcionIA(req, res, next) {
    try {
      const producto = await Producto.findById(req.params.id)
        .populate('categoria', 'nombre');

      if (!producto) {
        return res.status(404).json({ error: true, mensaje: 'Producto no encontrado' });
      }

      const { caracteristicas } = req.body;
      const descripcionIA = await gemini.generarDescripcionProducto(
        producto.nombre,
        producto.categoria?.nombre || 'General',
        caracteristicas
      );

      producto.descripcion_ia = descripcionIA;
      await producto.save();

      res.json({
        error: false,
        mensaje: 'Descripción generada por IA',
        descripcion_ia: descripcionIA
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/productos/:id/preguntar
  static async preguntarProducto(req, res, next) {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).json({ error: true, mensaje: 'Producto no encontrado' });
      }

      const { pregunta } = req.body;
      if (!pregunta?.trim()) {
        return res.status(400).json({ error: true, mensaje: 'La pregunta es obligatoria' });
      }

      const respuesta = await gemini.responderPreguntaProducto(producto, pregunta);

      res.json({ error: false, pregunta, respuesta });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductoController;
