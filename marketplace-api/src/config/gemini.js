const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

class GeminiClient {
  constructor() {
    this.client = axios.create({
      baseURL: GEMINI_BASE_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Función base para llamar a la API de Gemini
   */
  async generarContenido(prompt, opciones = {}) {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no configurada en el .env');
    }

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: opciones.temperatura ?? 0.7,
        topK: opciones.topK || 40,
        topP: opciones.topP || 0.95,
        maxOutputTokens: opciones.maxTokens || 1024
      }
    };

    try {
      const response = await this.client.post(
        `/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        payload
      );

      if (!response.data.candidates?.length) {
        throw new Error('Gemini no retornó respuesta');
      }

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('Límite de peticiones a Gemini excedido. Intenta en unos minutos.');
      }
      if (error.response?.status === 400) {
        throw new Error('Prompt inválido para Gemini');
      }
      throw new Error(`Error de Gemini: ${error.message}`);
    }
  }

  /**
   * Genera descripción profesional para un producto
   */
  async generarDescripcionProducto(nombre, categoria, caracteristicas = '') {
    const prompt = `
Eres un copywriter experto en e-commerce. Genera una descripción atractiva y profesional para:

PRODUCTO: ${nombre}
CATEGORÍA: ${categoria}
CARACTERÍSTICAS ADICIONALES: ${caracteristicas || 'ninguna especificada'}

REGLAS:
- Máximo 150 palabras
- Destaca beneficios para el usuario, no solo características técnicas
- Usa un tono persuasivo pero honesto
- Estructura en 2-3 párrafos cortos
- No uses asteriscos ni markdown

Responde SOLO con la descripción, sin saludos ni explicaciones.
`.trim();

    const contenido = await this.generarContenido(prompt, { temperatura: 0.8, maxTokens: 300 });
    return contenido.trim();
  }

  /**
   * Sugiere categorías para un producto
   */
  async sugerirCategorias(nombre, descripcion) {
    const prompt = `
Analiza este producto y sugiere las 3 categorías más apropiadas de la lista:

PRODUCTO: ${nombre}
DESCRIPCIÓN: ${descripcion || 'sin descripción'}

CATEGORÍAS DISPONIBLES:
Electrónicos, Ropa y Accesorios, Hogar y Jardín, Deportes y Aire Libre,
Salud y Belleza, Libros y Medios, Juguetes y Juegos, Alimentos y Bebidas,
Herramientas, Mascotas, Arte y Manualidades, Automotriz

Responde EXACTAMENTE con 3 categorías de la lista, separadas por comas.
Ejemplo: Electrónicos, Hogar y Jardín, Herramientas
`.trim();

    const contenido = await this.generarContenido(prompt, { temperatura: 0.3, maxTokens: 50 });
    return contenido.trim().split(',').map(c => c.trim());
  }

  /**
   * Genera descripción de una categoría
   */
  async generarDescripcionCategoria(nombreCategoria) {
    const prompt = `
Genera una descripción corta y atractiva para la categoría de un marketplace llamada: "${nombreCategoria}"

REGLAS:
- Máximo 80 palabras
- Menciona qué tipos de productos incluye
- Tono amigable y directo
- Sin markdown

Responde SOLO con la descripción.
`.trim();

    return await this.generarContenido(prompt, { temperatura: 0.7, maxTokens: 150 });
  }

  /**
   * Analiza patrones de compra de un usuario
   */
  async analizarPatronesCompra(ordenes) {
    const resumen = ordenes.map(o => ({
      total: o.total,
      fecha: o.createdAt,
      productos: o.items?.length || 0,
      estado: o.estado
    }));

    const prompt = `
Analiza estos datos de compras y genera insights:

DATOS: ${JSON.stringify(resumen)}

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "frecuencia": "descripción del patrón de frecuencia",
  "promedio_gasto": número,
  "tendencias": "descripción de tendencias",
  "recomendaciones": ["recomendación 1", "recomendación 2", "recomendación 3"]
}
`.trim();

    try {
      const contenido = await this.generarContenido(prompt, { temperatura: 0.4, maxTokens: 400 });
      // Limpia posibles backticks de markdown
      const jsonLimpio = contenido.replace(/```json?|```/g, '').trim();
      return JSON.parse(jsonLimpio);
    } catch {
      return {
        frecuencia: 'No se pudo analizar con los datos disponibles',
        promedio_gasto: 0,
        tendencias: 'Datos insuficientes',
        recomendaciones: ['Realiza más compras para obtener recomendaciones personalizadas']
      };
    }
  }

  /**
   * Responde preguntas sobre un producto
   */
  async responderPreguntaProducto(producto, pregunta) {
    const prompt = `
Eres un asistente de ventas experto. Un cliente hace una pregunta sobre este producto:

PRODUCTO: ${producto.nombre}
DESCRIPCIÓN: ${producto.descripcion || 'No disponible'}
PRECIO: $${producto.precio}
STOCK: ${producto.stock} unidades

PREGUNTA DEL CLIENTE: ${pregunta}

Responde de forma concisa, honesta y útil en máximo 3 oraciones. Sin markdown.
`.trim();

    return await this.generarContenido(prompt, { temperatura: 0.6, maxTokens: 200 });
  }
}

module.exports = new GeminiClient(); // Singleton: una sola instancia para toda la app
