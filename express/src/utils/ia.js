import { OpenRouterService } from './openrouter.js';

export const generarLecturaPrincipal = async (fechaNacimiento, nombre) => {
  try {
    console.log('[IA] Generando lectura principal con OpenRouter...');
    const lectura = await OpenRouterService.generarLecturaPrincipal(
      fechaNacimiento,
      nombre
    );
    return lectura || generarLecturaPrincipalLocal(fechaNacimiento, nombre);
  } catch (error) {
    console.error('[IA] Error IA:', error.message);
    return generarLecturaPrincipalLocal(fechaNacimiento, nombre);
  }
};

export const generarLecturaDiaria = async (nombre) => {
  try {
    console.log('[IA] Generando lectura diaria con OpenRouter...');
    const lectura = await OpenRouterService.generarLecturaDiaria(nombre);
    return lectura || generarLecturaDiariaLocal(nombre);
  } catch (error) {
    console.error('[IA] Error IA:', error.message);
    return generarLecturaDiariaLocal(nombre);
  }
};


function generarLecturaPrincipalLocal(fechaNacimiento, nombre) {
  return `
Lectura Principal

Hola ${nombre}.
Tu fecha de nacimiento (${fechaNacimiento}) señala un camino de aprendizaje profundo.
Estás en un momento ideal para confiar en tu intuición y avanzar con equilibrio.
Escucha tu voz interior: ahí está tu mayor fortaleza.
  `.trim();
}

function generarLecturaDiariaLocal(nombre) {
  return `
Lectura Diaria

${nombre}, hoy es un buen día para avanzar con calma.
Una pequeña decisión consciente puede traer claridad.
Confía en el proceso.
  `.trim();
}
