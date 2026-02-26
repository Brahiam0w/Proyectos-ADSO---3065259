import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// Validar API key
if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'tu_api_key_de_groq_aqui') {
  console.log("❌ [GROQ] API Key no configurada o es el valor por defecto");
} else {
  console.log("✅ [GROQ] API Key configurada correctamente");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export class GroqService {

  static async generarLecturaPrincipal(fechaNacimiento, nombre) {
    try {
      console.log("🔮 [GROQ] Generando lectura principal...");

      if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'tu_api_key_de_groq_aqui') {
        throw new Error("API Key de Groq no configurada");
      }

      let fechaStr;
      if (fechaNacimiento instanceof Date) {
        fechaStr = fechaNacimiento.toISOString().split("T")[0];
      } else {
        fechaStr = fechaNacimiento;
      }

      console.log("📡 [GROQ] Enviando solicitud...");

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Eres un numerólogo espiritual experto. Proporcionas lecturas numerológicas detalladas, personalizadas e inspiradoras basadas en fechas de nacimiento.",
          },
          {
            role: "user",
            content: `Genera una lectura numerológica para ${nombre} nacido el ${fechaStr}. 
Formato: **Número de Vida:** [número] **Lectura Espiritual:** [texto] **Energía del Día:** [mensaje]`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const texto = completion.choices[0].message.content;
      console.log("✅ [GROQ] Lectura principal generada:", texto.length);
      return texto;

    } catch (error) {
      console.error("❌ [GROQ] Error detallado:", {
        message: error.message,
        type: error.type,
        code: error.code,
        status: error.status,
      });
      throw new Error(`Error de Groq: ${error.message}`);
    }
  }

  static async generarLecturaDiaria(nombre) {
    try {
      console.log("🔮 [GROQ] Generando lectura diaria...");

      if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'tu_api_key_de_groq_aqui') {
        throw new Error("API Key de Groq no configurada");
      }

      const fechaActual = new Date().toLocaleDateString("es-ES");

      console.log("📡 [GROQ] Enviando solicitud diaria...");

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Eres un numerólogo espiritual que proporciona lecturas diarias breves, positivas e inspiradoras.",
          },
          {
            role: "user",
            content: `Genera una lectura numerológica diaria breve para ${nombre} hoy ${fechaActual}. 
Formato: **Número del Día:** [número] **Energía Diaria:** [texto] **Consejo Práctico:** [acción]`,
          },
        ],
        max_tokens: 200,
        temperature: 0.8,
      });

      const texto = completion.choices[0].message.content;
      console.log("✅ [GROQ] Lectura diaria generada");
      return texto;

    } catch (error) {
      console.error("❌ [GROQ] Error en lectura diaria:", error.message);
      throw new Error(`Error de Groq: ${error.message}`);
    }
  }

  static async verificarConexion() {
    try {
      console.log("🔍 [GROQ] Verificando conexión...");

      if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'tu_api_key_de_groq_aqui') {
        return false;
      }

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "user", content: 'Responde solo con "OK"' }],
        max_tokens: 5,
      });

      const respuesta = completion.choices[0].message.content;
      return respuesta.includes("OK");

    } catch (error) {
      console.error("❌ [GROQ] Error de conexión:", error.message);
      return false;
    }
  }
}
