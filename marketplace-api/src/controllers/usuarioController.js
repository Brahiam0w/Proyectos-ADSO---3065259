const Usuario = require('../models/Usuario');

class UsuarioController {

  // GET /api/usuarios (solo admin)
  static async listar(req, res, next) {
    try {
      const { rol, q, pagina = 1, limite = 10, orden = '-createdAt' } = req.query;

      // Construimos el filtro dinámicamente
      const filtro = { activo: true };
      if (rol) filtro.rol = rol;
      if (q) {
        // Búsqueda por nombre O email
        filtro.$or = [
          { nombre: { $regex: q, $options: 'i' } }, // i = case insensitive
          { email: { $regex: q, $options: 'i' } }
        ];
      }

      const limiteParsed = Math.min(parseInt(limite), 50);
      const skip = (parseInt(pagina) - 1) * limiteParsed;

      // Ejecutamos la consulta y el conteo en paralelo (más rápido)
      const [usuarios, total] = await Promise.all([
        Usuario.find(filtro)
          .select('-password -__v')
          .sort(orden)
          .skip(skip)
          .limit(limiteParsed),
        Usuario.countDocuments(filtro)
      ]);

      res.json({
        error: false,
        usuarios,
        paginacion: {
          total,
          pagina: parseInt(pagina),
          limite: limiteParsed,
          total_paginas: Math.ceil(total / limiteParsed)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/usuarios/:id
  static async obtener(req, res, next) {
    try {
      const usuario = await Usuario.findById(req.params.id).select('-password -__v');

      if (!usuario) {
        return res.status(404).json({ error: true, mensaje: 'Usuario no encontrado' });
      }

      res.json({ error: false, usuario });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/usuarios/:id
  static async actualizar(req, res, next) {
    try {
      // Solo permitimos actualizar estos campos (no email ni password por esta ruta)
      const { nombre, avatar_url } = req.body;
      const camposActualizar = {};
      if (nombre) camposActualizar.nombre = nombre;
      if (avatar_url) camposActualizar.avatar_url = avatar_url;

      // Si subió imagen de avatar
      if (req.file) {
        camposActualizar.avatar_url = `/uploads/usuarios/${req.file.filename}`;
      }

      const usuario = await Usuario.findByIdAndUpdate(
        req.params.id,
        camposActualizar,
        { new: true, runValidators: true } // new:true retorna el documento actualizado
      ).select('-password -__v');

      if (!usuario) {
        return res.status(404).json({ error: true, mensaje: 'Usuario no encontrado' });
      }

      res.json({ error: false, mensaje: 'Usuario actualizado', usuario });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/usuarios/:id (eliminación lógica)
  static async eliminar(req, res, next) {
    try {
      // Eliminación LÓGICA: marcamos como inactivo, no borramos de DB
      // Así conservamos el historial de órdenes y no rompemos referencias
      const usuario = await Usuario.findByIdAndUpdate(
        req.params.id,
        { activo: false },
        { new: true }
      );

      if (!usuario) {
        return res.status(404).json({ error: true, mensaje: 'Usuario no encontrado' });
      }

      res.json({ error: false, mensaje: 'Usuario desactivado exitosamente' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsuarioController;
