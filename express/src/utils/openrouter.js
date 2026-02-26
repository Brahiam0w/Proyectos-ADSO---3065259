const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODEL = 'mistralai/mistral-7b-instruct';

class OpenRouterServiceClass {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;

    if (!this.apiKey || this.apiKey === 'OPENROUTER_API_KEY') {
      console.warn('[OPENROUTER] API Key NO configurada');
    } else {
      console.log('[OPENROUTER] API Key configurada correctamente');
    }
  }

  async call(messages, temperature = 0.8, maxTokens = 400) {
    if (!this.apiKey || this.apiKey === 'OPENROUTER_API_KEY') {
      throw new Error('API Key de OpenRouter no configurada');
    }

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Numerologia Backend',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[OPENROUTER] Error HTTP:', response.status, text);
      throw new Error('Error en OpenRouter');
    }

    const data = await response.json();

    if (
      !data ||
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      console.error('[OPENROUTER] Respuesta inválida:', data);
      throw new Error('Respuesta inválida de OpenRouter');
    }

    return data.choices[0].message.content.trim();
  }

  async generarLecturaPrincipal(fechaNacimiento, nombre) {
    const messages = [
      {
        role: 'system',
        content:
          'Eres un experto en numerología y guía espiritual. Tu tono es inspirador, claro y humano.',
      },
      {
        role: 'user',
        content: `
Genera una lectura numerológica personalizada.

Nombre: ${nombre}
Fecha de nacimiento: ${fechaNacimiento}

Incluye:
- propósito de vida
- energía dominante
- consejo espiritual

Escribe en párrafos, sin listas.
        `,
      },
    ];

    return this.call(messages, 0.9, 500);
  }

  async generarLecturaDiaria(nombre) {
    const messages = [
      {
        role: 'system',
        content:
          'Eres un guía espiritual que ofrece mensajes diarios breves y positivos.',
      },
      {
        role: 'user',
        content: `
Genera una lectura diaria corta y motivadora para ${nombre}.
Máximo 3 párrafos.
        `,
      },
    ];

    return this.call(messages, 0.7, 250);
  }

  async verificarConexion() {
    try {
      const messages = [{ role: 'user', content: 'Responde solo con OK' }];
      const res = await this.call(messages, 0, 10);
      return res.includes('OK');
    } catch {
      return false;
    }
  }
}

export const OpenRouterService = new OpenRouterServiceClass();
