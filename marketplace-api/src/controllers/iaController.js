const gemini = require('../config/gemini');
const Producto = require('../models/Producto');

class IAController {

  // POST /api/ia/generar-descripcion
  static async generarDescripcion(req, res, next) {
    try {
      const { nombre, categoria, caracteristicas } = req.body;

      if (!nombre || !categoria) {
        return res.status(400).json({
          error: true,
          mensaje: 'Se requieren: nombre y categoria'
        });
      }

      const descripcion = await gemini.generarDescripcionProducto(nombre, categoria, caracteristicas);

      res.json({
        error: false,
        descripcion_generada: descripcion,
        aviso: 'Esta descripción fue generada por IA. Revísala antes de publicar.'
      });
    } catch (error) {
      res.status(503).json({
        error: true,
        mensaje: `Servicio de IA no disponible: ${error.message}`
      });
    }
  }

  // POST /api/ia/sugerir-categorias
  static async sugerirCategorias(req, res, next) {
    try {
      const { nombre, descripcion } = req.body;

      if (!nombre) {
        return res.status(400).json({ error: true, mensaje: 'El nombre del producto es obligatorio' });
      }

      const categorias = await gemini.sugerirCategorias(nombre, descripcion);

      res.json({
        error: false,
        categorias_sugeridas: categorias
      });
    } catch (error) {
      res.status(503).json({
        error: true,
        mensaje: `Servicio de IA no disponible: ${error.message}`
      });
    }
  }

  // POST /api/ia/analizar-precio
  static async analizarPrecio(req, res, next) {
    try {
      const { nombre, categoria, precio, descripcion } = req.body;

      if (!nombre || !precio) {
        return res.status(400).json({ error: true, mensaje: 'Se requieren nombre y precio' });
      }

      const prompt = `
Analiza si el precio de este producto es competitivo para un marketplace latinoamericano:

PRODUCTO: ${nombre}
CATEGORÍA: ${categoria || 'No especificada'}
PRECIO: $${precio} USD
DESCRIPCIÓN: ${descripcion || 'No disponible'}

Responde SOLO con JSON válido:
{
  "evaluacion": "bajo|justo|alto",
  "razon": "breve explicación en 1-2 oraciones",
  "rango_sugerido": { "min": número, "max": número }
}
      `.trim();

      const contenidoRaw = await gemini.generarContenido(prompt, { temperatura: 0.3 });
      const contenidoLimpio = contenidoRaw.replace(/```json?|```/g, '').trim();
      const analisis = JSON.parse(contenidoLimpio);

      res.json({ error: false, precio_analizado: precio, analisis });
    } catch (error) {
      res.status(503).json({
        error: true,
        mensaje: `Servicio de IA no disponible: ${error.message}`
      });
    }
  }
}

module.exports = IAController;
