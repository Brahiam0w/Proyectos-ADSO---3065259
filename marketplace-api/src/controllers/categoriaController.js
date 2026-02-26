// ============================================================
// MÓDULO 7: Controlador de Categorías
// ============================================================

const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');
const gemini = require('../config/gemini');
const fs = require('fs');

class CategoriaController {

  // POST /api/categorias (solo admin)
  static async crear(req, res, next) {
    try {
      const { nombre, descripcion } = req.body;

      const datosCat = { nombre, descripcion };

      // Si subió icono
      if (req.file) {
        datosCat.imagen_icono = `/uploads/categorias/${req.file.filename}`;
      }

      const categoria = await Categoria.create(datosCat);

      res.status(201).json({
        error: false,
        mensaje: 'Categoría creada exitosamente',
        categoria
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: true, mensaje: 'Ya existe una categoría con ese nombre' });
      }
      next(error);
    }
  }

  // GET /api/categorias
  static async listar(req, res, next) {
    try {
      const { q, pagina = 1, limite = 20 } = req.query;

      const filtro = { activa: true };
      if (q) filtro.nombre = { $regex: q, $options: 'i' };

      const limiteParsed = Math.min(parseInt(limite), 50);
      const skip = (parseInt(pagina) - 1) * limiteParsed;

      const [categorias, total] = await Promise.all([
        Categoria.find(filtro)
          .sort({ nombre: 1 })
          .skip(skip)
          .limit(limiteParsed)
          .populate('totalProductos'), // Virtual field
        Categoria.countDocuments(filtro)
      ]);

      res.json({
        error: false,
        categorias,
        paginacion: { total, pagina: parseInt(pagina), limite: limiteParsed }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/categorias/:id
  static async obtener(req, res, next) {
    try {
      const categoria = await Categoria.findById(req.params.id).populate('totalProductos');

      if (!categoria) {
        return res.status(404).json({ error: true, mensaje: 'Categoría no encontrada' });
      }

      res.json({ error: false, categoria });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/categorias/:id/productos
  static async obtenerProductos(req, res, next) {
    try {
      const { pagina = 1, limite = 10, orden = '-createdAt' } = req.query;
      const limiteParsed = Math.min(parseInt(limite), 50);
      const skip = (parseInt(pagina) - 1) * limiteParsed;

      const [productos, total] = await Promise.all([
        Producto.find({ categoria: req.params.id, activo: true })
          .populate('vendedor', 'nombre email')
          .sort(orden)
          .skip(skip)
          .limit(limiteParsed),
        Producto.countDocuments({ categoria: req.params.id, activo: true })
      ]);

      res.json({
        error: false,
        productos,
        paginacion: { total, pagina: parseInt(pagina), limite: limiteParsed }
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/categorias/:id (solo admin)
  static async actualizar(req, res, next) {
    try {
      const { nombre, descripcion } = req.body;
      const cambios = {};
      if (nombre) cambios.nombre = nombre;
      if (descripcion !== undefined) cambios.descripcion = descripcion;
      if (req.file) cambios.imagen_icono = `/uploads/categorias/${req.file.filename}`;

      const categoria = await Categoria.findByIdAndUpdate(
        req.params.id,
        cambios,
        { new: true, runValidators: true }
      );

      if (!categoria) {
        return res.status(404).json({ error: true, mensaje: 'Categoría no encontrada' });
      }

      res.json({ error: false, mensaje: 'Categoría actualizada', categoria });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: true, mensaje: 'Ya existe una categoría con ese nombre' });
      }
      next(error);
    }
  }

  // DELETE /api/categorias/:id (solo admin)
  static async eliminar(req, res, next) {
    try {
      // Verificar si tiene productos activos
      const productosActivos = await Producto.countDocuments({
        categoria: req.params.id,
        activo: true
      });

      if (productosActivos > 0) {
        return res.status(409).json({
          error: true,
          mensaje: `No se puede eliminar: tiene ${productosActivos} producto(s) activo(s) asociados`
        });
      }

      const categoria = await Categoria.findByIdAndUpdate(
        req.params.id,
        { activa: false },
        { new: true }
      );

      if (!categoria) {
        return res.status(404).json({ error: true, mensaje: 'Categoría no encontrada' });
      }

      res.json({ error: false, mensaje: 'Categoría desactivada exitosamente' });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/categorias/:id/generar-descripcion-ia (solo admin)
  static async generarDescripcionIA(req, res, next) {
    try {
      const categoria = await Categoria.findById(req.params.id);
      if (!categoria) {
        return res.status(404).json({ error: true, mensaje: 'Categoría no encontrada' });
      }

      const descripcionIA = await gemini.generarDescripcionCategoria(categoria.nombre);

      categoria.descripcion_ia = descripcionIA;
      await categoria.save();

      res.json({
        error: false,
        mensaje: 'Descripción generada por IA',
        descripcion_ia: descripcionIA,
        categoria
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoriaController;
