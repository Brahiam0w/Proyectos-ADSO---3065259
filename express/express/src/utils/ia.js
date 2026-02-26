import { GroqService } from './groq.js';

// GENERAR LECTURA PRINCIPAL CON GROQ
export const generarLecturaPrincipal = async (fechaNacimiento, nombre) => {
  try {
    console.log('🔮 [IA] Generando lectura principal con Groq...');
    
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'tu_api_key_de_groq_aqui') {
      console.log('❌ [IA] Groq API Key no configurada, usando local');
      return generarLecturaPrincipalLocal(fechaNacimiento, nombre);
    }

    const lectura = await GroqService.generarLecturaPrincipal(fechaNacimiento, nombre);
    console.log('✅ [IA] Lectura principal generada con Groq');
    return lectura;

  } catch (error) {
    console.error('💥 [IA] Error con Groq:', error.message);
    return generarLecturaPrincipalLocal(fechaNacimiento, nombre);
  }
};

// GENERAR LECTURA DIARIA CON GROQ
export const generarLecturaDiaria = async (nombre) => {
  try {
    console.log('🔮 [IA] Generando lectura diaria con Groq...');
    
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'tu_api_key_de_groq_aqui') {
      console.log('❌ [IA] Groq API Key no configurada, usando local');
      return generarLecturaDiariaLocal(nombre);
    }

    const lectura = await GroqService.generarLecturaDiaria(nombre);
    console.log('✅ [IA] Lectura diaria generada con Groq');
    return lectura;

  } catch (error) {
    console.error('💥 [IA] Error con Groq:', error.message);
    return generarLecturaDiariaLocal(nombre);
  }
};

// LECTURAS LOCALES COMO FALLBACK (manteniendo tu código actual)
// Puedes pegar aquí las funciones locales que ya tenías
function generarLecturaPrincipalLocal(fechaNacimiento, nombre) {
  console.log('📚 [IA] Usando lectura local - Principal');
  // ... tu código local actual
}

function generarLecturaDiariaLocal(nombre) {
  console.log('📚 [IA] Usando lectura local - Diaria');
  // ... tu código local actual
}
