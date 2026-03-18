/**
 * UTILIDADES DE NUMEROLOGÍA
 * Contiene las funciones de cálculo y los textos interpretativos
 */

// Números maestros que NO se reducen
const NUMEROS_MAESTROS = [11, 22, 33];

/**
 * Reduce una suma de dígitos hasta obtener un número de 1 a 9, o un número maestro
 */
const reducirNumero = (num) => {
  while (num > 9 && !NUMEROS_MAESTROS.includes(num)) {
    num = String(num)
      .split('')
      .reduce((acc, d) => acc + parseInt(d), 0);
  }
  return num;
};

/**
 * Calcula el Número de Camino de Vida a partir de una fecha de nacimiento
 * Ejemplo: 15/06/1990 → 1+5+0+6+1+9+9+0 = 31 → 3+1 = 4
 */
const calcularNumeroCaminoVida = (fechaNacimiento) => {
  const fecha = new Date(fechaNacimiento);
  const dia = fecha.getUTCDate();
  const mes = fecha.getUTCMonth() + 1;
  const anio = fecha.getUTCFullYear();

  const suma = String(dia + mes + anio)
    .split('')
    .reduce((acc, d) => acc + parseInt(d), 0);

  // Primera reducción de la suma total
  let resultado = reducirNumero(suma);

  // Si no es maestro, seguimos reduciendo
  if (!NUMEROS_MAESTROS.includes(resultado)) {
    resultado = reducirNumero(resultado);
  }

  return resultado;
};

/**
 * Calcula el número del día actual (para lecturas diarias)
 */
const calcularNumeroDiario = () => {
  const hoy = new Date();
  const suma =
    hoy.getDate() + (hoy.getMonth() + 1) + hoy.getFullYear();
  return reducirNumero(suma);
};

/**
 * Interpretaciones para la lectura PRINCIPAL (Camino de Vida)
 */
const interpretacionesPrincipales = {
  1: {
    titulo: 'El Líder',
    descripcion:
      'Eres un pionero nato con una voluntad de hierro. Tu camino de vida te impulsa hacia la independencia y el liderazgo. Posees una energía creativa poderosa y la capacidad de iniciar proyectos con determinación. Tu mayor desafío es aprender a colaborar sin perder tu esencia individual.',
    fortalezas: ['Liderazgo', 'Independencia', 'Creatividad', 'Determinación'],
    desafios: ['Arrogancia', 'Terquedad', 'Impaciencia'],
    proposito: 'Liderar con originalidad y abrir nuevos caminos para los demás.',
  },
  2: {
    titulo: 'El Diplomático',
    descripcion:
      'Tu alma vibra en la frecuencia de la cooperación y la sensibilidad. Eres el mediador del universo, capaz de percibir las emociones más profundas de quienes te rodean. Las relaciones y las asociaciones son el terreno donde floreces. Tu poder está en la paciencia y la intuición.',
    fortalezas: ['Empatía', 'Diplomacia', 'Intuición', 'Cooperación'],
    desafios: ['Indecisión', 'Dependencia emocional', 'Timidez'],
    proposito: 'Crear armonía y ser el puente entre personas y mundos opuestos.',
  },
  3: {
    titulo: 'El Comunicador',
    descripcion:
      'Eres un ser de luz con un talento natural para la expresión creativa. El arte, la escritura y la comunicación son tus herramientas divinas. La alegría que irradias tiene el poder de transformar el ambiente a tu alrededor. Tu misión es inspirar a otros a través de tu creatividad.',
    fortalezas: ['Creatividad', 'Comunicación', 'Optimismo', 'Humor'],
    desafios: ['Superficialidad', 'Dispersión', 'Hipersensibilidad'],
    proposito: 'Elevar el espíritu humano a través del arte y la palabra.',
  },
  4: {
    titulo: 'El Constructor',
    descripcion:
      'Eres la roca sobre la que se edifican los sueños. Tu naturaleza práctica y metódica te permite construir estructuras sólidas en todos los aspectos de la vida. El trabajo duro no te asusta; es tu modo de honrar al universo. Tu legado se mide en las bases que dejas para las generaciones futuras.',
    fortalezas: ['Disciplina', 'Fiabilidad', 'Método', 'Perseverancia'],
    desafios: ['Rigidez', 'Exceso de trabajo', 'Resistencia al cambio'],
    proposito: 'Construir fundamentos duraderos sobre los que otros puedan crecer.',
  },
  5: {
    titulo: 'El Aventurero',
    descripcion:
      'La libertad es tu oxígeno y el cambio tu hogar. Tienes una curiosidad insaciable y la capacidad de adaptarte a cualquier situación. El universo te ha llamado a ser un agente de cambio y a explorar las infinitas posibilidades de la existencia humana.',
    fortalezas: ['Adaptabilidad', 'Libertad', 'Curiosidad', 'Versatilidad'],
    desafios: ['Impulsividad', 'Irresponsabilidad', 'Inconstancia'],
    proposito: 'Enseñar al mundo el valor de la libertad y la experiencia directa.',
  },
  6: {
    titulo: 'El Nutridor',
    descripcion:
      'Tu corazón es un santuario de amor incondicional. Estás aquí para servir, cuidar y embellecer el mundo. La familia, la comunidad y la responsabilidad son los pilares de tu existencia. Tienes el don de hacer que los demás se sientan seguros y amados.',
    fortalezas: ['Amor', 'Responsabilidad', 'Servicio', 'Armonía'],
    desafios: ['Perfeccionismo', 'Tendencia a entrometerse', 'Autosacrificio excesivo'],
    proposito: 'Sanar y nutrir a la humanidad a través del amor y el servicio.',
  },
  7: {
    titulo: 'El Místico',
    descripcion:
      'Eres el buscador de la verdad oculta. Tu mente analítica y tu profunda espiritualidad te llevan a los límites del conocimiento humano. La soledad no es tu enemiga; es el espacio sagrado donde encuentras las respuestas que el mundo busca.',
    fortalezas: ['Intuición', 'Inteligencia analítica', 'Espiritualidad', 'Profundidad'],
    desafios: ['Aislamiento', 'Desconfianza', 'Pesimismo'],
    proposito: 'Descubrir verdades universales y compartir la sabiduría con el mundo.',
  },
  8: {
    titulo: 'El Maestro del Poder',
    descripcion:
      'Naciste para manifestar la abundancia en todas sus formas. El universo te ha equipado con un don especial para los negocios, la autoridad y la gestión de recursos. Tu camino implica aprender que el verdadero poder proviene de dentro y que la abundancia material es solo un reflejo de tu riqueza interior.',
    fortalezas: ['Ambición', 'Liderazgo ejecutivo', 'Determinación', 'Visión'],
    desafios: ['Materialismo', 'Control excesivo', 'Intolerancia'],
    proposito: 'Demostrar que el poder y la riqueza pueden usarse para el bien mayor.',
  },
  9: {
    titulo: 'El Humanista',
    descripcion:
      'Eres el viejo alma del zodiaco numerológico. Tu compasión no conoce fronteras y tu sabiduría trasciende el tiempo. Has venido a este mundo a servir a la humanidad desde un lugar de profundo amor y comprensión universal. Tu mayor lección es aprender a soltar y confiar en el flujo divino.',
    fortalezas: ['Compasión', 'Sabiduría', 'Generosidad', 'Idealismo'],
    desafios: ['Dificultad para soltar', 'Sacrificio excesivo', 'Distancia emocional'],
    proposito: 'Elevar la consciencia colectiva a través del amor universal.',
  },
  11: {
    titulo: 'El Iluminado (Número Maestro)',
    descripcion:
      'Portador del 11, uno de los números maestros más poderosos. Eres un canal entre el mundo espiritual y el físico. Tu intuición es extraordinaria y tu sensibilidad, un don sagrado. Tienes el potencial de inspirar a masas enteras, pero primero debes aprender a confiar en tu propia luz interior.',
    fortalezas: ['Inspiración', 'Intuición elevada', 'Visión espiritual', 'Empatía profunda'],
    desafios: ['Ansiedad', 'Hipersensibilidad', 'Idealismo excesivo'],
    proposito: 'Ser un faro de luz e inspiración para la humanidad.',
  },
  22: {
    titulo: 'El Constructor Maestro (Número Maestro)',
    descripcion:
      'El 22 es el número de mayor potencial en numerología. Tienes la capacidad única de transformar los sueños más ambiciosos en realidad tangible. Combinas la intuición del 11 con la practicidad del 4, dándote una fuerza extraordinaria para crear legados duraderos.',
    fortalezas: ['Visión grandiosa', 'Capacidad de manifestación', 'Liderazgo', 'Disciplina'],
    desafios: ['Presión autoimpuesta', 'Perfeccionismo extremo', 'Burnout'],
    proposito: 'Construir sistemas y estructuras que transformen positivamente el mundo.',
  },
  33: {
    titulo: 'El Maestro Sanador (Número Maestro)',
    descripcion:
      'El 33 es la expresión máxima del amor compasivo. Eres un maestro espiritual nato cuya misión es sanar y elevar a la humanidad. Tu vida está dedicada al servicio desinteresado y a la enseñanza del amor incondicional. Es el número de los grandes líderes espirituales y sanadores.',
    fortalezas: ['Amor incondicional', 'Sabiduría maestra', 'Sanación', 'Compasión total'],
    desafios: ['Autosacrificio extremo', 'Idealismo', 'Carga emocional'],
    proposito: 'Ser un instrumento del amor divino para sanar el mundo.',
  },
};

/**
 * Genera el texto de lectura PRINCIPAL en base al número de camino de vida
 */
const generarLecturaPrincipalIA = async (usuario) => {
  const numero = calcularNumeroCaminoVida(usuario.fecha_nacimiento);
  const interp = interpretacionesPrincipales[numero] || interpretacionesPrincipales[1];

  // Intentar usar IA real si hay API key configurada
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      console.log(`GEMINI: Intentando con clave de longitud ${apiKey.length}. Comienza con ${apiKey.substring(0, 4)}...`);
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Eres un maestro numerólogo. Genera una lectura numerológica personal y profunda para ${usuario.nombre}.
Su número de Camino de Vida es el ${numero} (${interp.titulo}).
La interpretación base es: ${interp.descripcion}
Sus fortalezas son: ${interp.fortalezas.join(', ')}.
Sus desafíos son: ${interp.desafios.join(', ')}.
Su propósito de vida es: ${interp.proposito}.

Genera una lectura de 3 párrafos: 1) Descripción de su esencia, 2) Sus dones y desafíos en esta vida, 3) Un mensaje de guidance espiritual personalizado. Usa un tono cálido, profundo y esperanzador.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const contenidoIA = response.text();

      return { numero, contenido: contenidoIA };
    } catch (err) {
      console.error('ERROR CRÍTICO GEMINI (Lectura Principal):', err.message);
      if (err.stack) console.error(err.stack);
    }
  } else {
    console.warn('GEMINI_API_KEY no encontrada en el entorno.');
  }

  // Lectura simulada (sin API key)
  const contenido = `LECTURA PRINCIPAL — NÚMERO DE CAMINO DE VIDA: ${numero} (${interp.titulo})

${interp.descripcion}

TUS DONES EN ESTA VIDA:
${interp.fortalezas.map((f) => `• ${f}`).join('\n')}

TUS DESAFÍOS PARA CRECER:
${interp.desafios.map((d) => `• ${d}`).join('\n')}

TU PROPÓSITO:
${interp.proposito}

Esta lectura fue generada el ${new Date().toLocaleDateString('es-CO', { dateStyle: 'long' })} para ${usuario.nombre}.`;

  return { numero, contenido };
};

/**
 * Genera el texto de lectura DIARIA basada en el número del día + camino de vida
 */
const generarLecturaDiariaIA = async (usuario) => {
  const numeroCamino = calcularNumeroCaminoVida(usuario.fecha_nacimiento);
  const numeroDia = calcularNumeroDiario();
  const combinacion = reducirNumero(numeroCamino + numeroDia);

  const mensajesDiarios = {
    1: 'Hoy es un día para iniciar. Confía en tu instinto y da el primer paso hacia ese proyecto que has estado postergando. El universo está alineado con tu energía creadora.',
    2: 'La energía de hoy invita a la cooperación. Escucha antes de hablar; en el silencio encontrarás las respuestas que buscas. Una conversación sincera puede cambiar mucho.',
    3: 'Tu creatividad está en su punto más alto. Expresa lo que llevas dentro, ya sea a través del arte, la escritura o simplemente una conversación inspiradora.',
    4: 'Hoy es día de enfoque y disciplina. Trabaja en tus metas con constancia. Cada pequeño paso en la dirección correcta construye el mañana que deseas.',
    5: 'Los cambios que lleguen hoy son oportunidades disfrazadas. Mantente flexible y abierto. Una nueva perspectiva puede transformar tu día por completo.',
    6: 'El amor y el servicio son tus palabras de hoy. Dedica tiempo a las personas que amas. Un pequeño gesto de cuidado puede iluminar el día de alguien.',
    7: 'Tu intuición está especialmente activa. Tómate un momento de introspección. Medita, reflexiona, conecta con tu mundo interior antes de tomar decisiones.',
    8: 'La abundancia fluye hacia ti hoy. Es un excelente día para negociar, planificar y actuar con autoridad. Tu determinación abrirá puertas importantes.',
    9: 'Cierra ciclos con amor. Suelta lo que ya no te sirve y hazlo con gratitud. Cada final es el inicio de algo más grande y hermoso.',
  };

  // Intentar usar IA real (Gemini) para la lectura diaria
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Eres un maestro numerólogo. Genera una lectura diaria breve y poderosa para ${usuario.nombre}.
Hoy es ${new Date().toLocaleDateString('es-CO', { dateStyle: 'full' })}.
Su número de Camino de Vida es ${numeroCamino} y el número del día de hoy es ${numeroDia}, generando una vibración combinada de ${combinacion}.
Escribe un mensaje de máximo 3 párrafos: 1) Energía del día según la vibración ${combinacion}, 2) Consejo práctico para aprovechar esta energía, 3) Afirmación corta y poderosa. Usa un tono inspirador y personal.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const contenidoIA = response.text();

      return { numero: combinacion, contenido: contenidoIA };
    } catch (err) {
      console.error('ERROR CRÍTICO GEMINI (Lectura Diaria):', err.message);
    }
  } else {
    console.warn('GEMINI_API_KEY no encontrada en el entorno.');
  }

  const contenido = `LECTURA DIARIA — ${new Date().toLocaleDateString('es-CO', { dateStyle: 'full' })}

Para: ${usuario.nombre}
Tu Número de Camino de Vida: ${numeroCamino}
Número del Día: ${numeroDia}
Vibración de Hoy: ${combinacion}

${mensajesDiarios[combinacion] || mensajesDiarios[1]}

CONSEJO NUMEROLÓGICO:
Recuerda que el número ${combinacion} trae la energía de la ${interpretacionesPrincipales[combinacion]?.titulo || 'transformación'} a tu día. Úsala sabiamente.

Que este día esté lleno de luz y propósito.`;

  return { numero: combinacion, contenido };
};

module.exports = {
  calcularNumeroCaminoVida,
  generarLecturaPrincipalIA,
  generarLecturaDiariaIA,
};
