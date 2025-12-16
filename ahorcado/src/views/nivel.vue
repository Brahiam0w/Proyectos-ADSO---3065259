<template>
  <div class="contenedor">
    <q-btn 
      flat 
      round 
      icon="arrow_back" 
      color="white" 
      size="lg" 
      @click="volver" 
      class="btn-volver"
    />
    
    <div class="titulo">
      <h2>¡Selecciona una Dificultad!</h2>
      <p>Con cada nivel es un nuevo desafío. ¡Escoge con sabiduría!</p>
    </div>
    
    <div class="contenedor-2">
      <router-link to="/juego" class="no-decoration" @click="seleccionarNivel('facil')">
        <div class="dificultad bg-green-11">
          <q-icon name="sentiment_satisfied" size="50px" class="q-mb-md" />
          <h2>Fácil</h2>
          <p>Palabras cortas y comunes para empezar.</p>
          <q-badge color="white" text-color="black" class="q-mt-sm">
            +10 puntos base
          </q-badge>
        </div>
      </router-link>
      
      <router-link to="/juego" class="no-decoration" @click="seleccionarNivel('medio')">
        <div class="dificultad bg-amber-11">
          <q-icon name="psychology" size="50px" class="q-mb-md" />
          <h2>Medio</h2>
          <p>Un reto equilibrado con palabras variadas.</p>
          <q-badge color="white" text-color="black" class="q-mt-sm">
            +20 puntos base
          </q-badge>
        </div>
      </router-link>
      
      <router-link to="/juego" class="no-decoration" @click="seleccionarNivel('dificil')">
        <div class="dificultad bg-red-11">
          <q-icon name="whatshot" size="50px" class="q-mb-md" />
          <h2>Difícil</h2>
          <p>Palabras complejas solo para conocedores.</p>
          <q-badge color="white" text-color="black" class="q-mt-sm">
            +30 puntos base
          </q-badge>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const palabrasConPistas = {
  animales: {
    facil: [
      { palabra: 'GATO', pista: 'Mascota felina que maúlla y le gusta dormir' },
      { palabra: 'PERRO', pista: 'El mejor amigo del hombre, leal y juguetón' },
      { palabra: 'PATO', pista: 'Ave acuática que hace "cuac cuac"' },
      { palabra: 'OSO', pista: 'Gran mamífero peludo que hiberna en invierno' },
      { palabra: 'LEON', pista: 'El rey de la selva con gran melena' },
      { palabra: 'RANA', pista: 'Anfibio que salta y vive en charcos' },
      { palabra: 'PEZ', pista: 'Animal acuático que respira por branquias' },
      { palabra: 'AVE', pista: 'Animal con plumas, alas y pico' },
      { palabra: 'VACA', pista: 'Animal de granja que da leche y hace "muu"' },
      { palabra: 'OVEJA', pista: 'Animal lanudo que bala y sigue al rebaño' }
    ],
    medio: [
      { palabra: 'ELEFANTE', pista: 'El animal terrestre más grande con trompa larga' },
      { palabra: 'JIRAFA', pista: 'Tiene el cuello más largo de todos los animales' },
      { palabra: 'TIGRE', pista: 'Gran felino con rayas naranjas y negras' },
      { palabra: 'CABALLO', pista: 'Animal de montar con crines y cola larga' },
      { palabra: 'DELFIN', pista: 'Mamífero marino muy inteligente y juguetón' },
      { palabra: 'KOALA', pista: 'Marsupial australiano que come eucalipto' },
      { palabra: 'CANGURO', pista: 'Animal australiano que salta y tiene bolsa' },
      { palabra: 'PANDA', pista: 'Oso blanco y negro que come bambú' },
      { palabra: 'CEBRA', pista: 'Animal africano con rayas blancas y negras' },
      { palabra: 'HIPOPOTAMO', pista: 'Gran mamífero africano que vive en ríos' }
    ],
    dificil: [
      { palabra: 'RINOCERONTE', pista: 'Mamífero africano con cuerno en el hocico' },
      { palabra: 'ORNITORRINCO', pista: 'Extraño mamífero australiano con pico de pato' },
      { palabra: 'MURCIELAGO', pista: 'Único mamífero volador, activo de noche' },
      { palabra: 'ARMADILLO', pista: 'Mamífero con caparazón que se enrolla como bola' },
      { palabra: 'PEREZOSO', pista: 'Animal que vive en árboles y se mueve muy lento' },
      { palabra: 'CAMELLO', pista: 'Animal del desierto con jorobas para almacenar agua' },
      { palabra: 'LEOPARDO', pista: 'Felino con pelaje manchado y gran agilidad' },
      { palabra: 'PINGÜINO', pista: 'Ave no voladora que vive en la Antártida' },
      { palabra: 'BUFALO', pista: 'Bóvido grande con cuernos curvos' },
      { palabra: 'ALCE', pista: 'Ciervo grande con enormes astas en los machos' }
    ]
  },
  cultura: {
    facil: [
      { palabra: 'ARTE', pista: 'Expresión creativa visual o escénica' },
      { palabra: 'LIBRO', pista: 'Conjunto de páginas con historias escritas' },
      { palabra: 'DANZA', pista: 'Expresión artística con movimiento del cuerpo' },
      { palabra: 'CINE', pista: 'Séptimo arte donde se proyectan películas' },
      { palabra: 'MUSICA', pista: 'Arte de combinar sonidos y silencios' },
      { palabra: 'PINTOR', pista: 'Persona que crea cuadros con colores' },
      { palabra: 'POEMA', pista: 'Composición literaria en verso' },
      { palabra: 'TEATRO', pista: 'Arte escénico donde actúan personas en vivo' },
      { palabra: 'BAILE', pista: 'Movimiento rítmico del cuerpo al compás de música' },
      { palabra: 'NOVELA', pista: 'Relato literario de ficción extenso' }
    ],
    medio: [
      { palabra: 'PINTURA', pista: 'Arte de plasmar colores en un lienzo' },
      { palabra: 'ESCULTURA', pista: 'Arte de moldear figuras tridimensionales' },
      { palabra: 'TEATRO', pista: 'Lugar donde los actores representan obras' },
      { palabra: 'LITERATURA', pista: 'Arte de la expresión escrita' },
      { palabra: 'ARQUITECTURA', pista: 'Arte y técnica de diseñar edificios' },
      { palabra: 'FOTOGRAFIA', pista: 'Arte de capturar imágenes con cámara' },
      { palabra: 'OPERA', pista: 'Género musical teatral con canto y orquesta' },
      { palabra: 'BALLET', pista: 'Danza clásica con movimientos precisos' },
      { palabra: 'SINFONIA', pista: 'Composición musical para orquesta' },
      { palabra: 'MURAL', pista: 'Pintura de gran tamaño en una pared' }
    ],
    dificil: [
      { palabra: 'RENACIMIENTO', pista: 'Periodo cultural europeo entre los siglos XIV y XVI' },
      { palabra: 'ARQUEOLOGIA', pista: 'Ciencia que estudia civilizaciones del pasado' },
      { palabra: 'ANTROPOLOGIA', pista: 'Estudio del ser humano y sus culturas' },
      { palabra: 'FILOSOFIA', pista: 'Estudio de cuestiones fundamentales de la existencia' },
      { palabra: 'MITOLOGIA', pista: 'Conjunto de mitos de una cultura' },
      { palabra: 'PALEONTOLOGIA', pista: 'Ciencia que estudia fósiles de seres vivos' },
      { palabra: 'ETNOGRAFIA', pista: 'Estudio descriptivo de las culturas' },
      { palabra: 'SEMIOTICA', pista: 'Ciencia que estudia los signos y símbolos' },
      { palabra: 'ESTETICA', pista: 'Rama de la filosofía que estudia la belleza' },
      { palabra: 'ICONOGRAFIA', pista: 'Estudio de las imágenes y su significado' }
    ]
  },
  paises: {
    facil: [
      { palabra: 'PERU', pista: 'País sudamericano hogar de Machu Picchu' },
      { palabra: 'CHILE', pista: 'País largo y angosto en la costa del Pacífico' },
      { palabra: 'CUBA', pista: 'Isla caribeña famosa por sus puros y música' },
      { palabra: 'IRAN', pista: 'País del Medio Oriente, antigua Persia' },
      { palabra: 'CHINA', pista: 'País más poblado del mundo en Asia' },
      { palabra: 'INDIA', pista: 'País con gran diversidad cultural y Taj Mahal' },
      { palabra: 'RUSIA', pista: 'País más extenso del mundo, parte en Europa y Asia' },
      { palabra: 'EGIPTO', pista: 'País africano famoso por sus pirámides' },
      { palabra: 'JAPON', pista: 'País insular asiático, tierra del sol naciente' },
      { palabra: 'BRASIL', pista: 'País más grande de Sudamérica, hogar del Amazonas' }
    ],
    medio: [
      { palabra: 'COLOMBIA', pista: 'País del café, esmeraldas y Gabriel García Márquez' },
      { palabra: 'ARGENTINA', pista: 'Tierra del tango, las pampas y Messi' },
      { palabra: 'ALEMANIA', pista: 'País europeo famoso por su cerveza y tecnología' },
      { palabra: 'FRANCIA', pista: 'País europeo con Torre Eiffel y vinos' },
      { palabra: 'ITALIA', pista: 'País en forma de bota, cuna del Renacimiento' },
      { palabra: 'ESPAÑA', pista: 'País europeo famoso por flamenco y paella' },
      { palabra: 'CANADA', pista: 'Segundo país más grande, con hoja de arce en su bandera' },
      { palabra: 'AUSTRALIA', pista: 'País-continente en el hemisferio sur' },
      { palabra: 'MEXICO', pista: 'País norteamericano famoso por tacos y mayas' },
      { palabra: 'SUECIA', pista: 'País nórdico conocido por IKEA y Volvo' }
    ],
    dificil: [
      { palabra: 'UZBEKISTAN', pista: 'País de Asia Central en la antigua Ruta de la Seda' },
      { palabra: 'MADAGASCAR', pista: 'Gran isla africana con fauna única como lémures' },
      { palabra: 'KIRIBATI', pista: 'País insular en el Pacífico compuesto por atolones' },
      { palabra: 'BUTAN', pista: 'Reino en los Himalayas que mide la felicidad nacional' },
      { palabra: 'TIMOR ORIENTAL', pista: 'País más nuevo de Asia, en isla de Timor' },
      { palabra: 'BOSNIA HERZEGOVINA', pista: 'País balcánico formado tras la guerra de los 90' },
      { palabra: 'TRINIDAD Y TOBAGO', pista: 'País caribeño de dos islas, cuna del steelpan' },
      { palabra: 'SUDAN DEL SUR', pista: 'País más joven del mundo, independizado en 2011' },
      { palabra: 'BRUNEI', pista: 'Pequeño sultanato rico en petróleo en Borneo' },
      { palabra: 'MONGOLIA', pista: 'País sin salida al mar entre China y Rusia, tierra de Gengis Khan' }
    ]
  },
  ciencia: {
    facil: [
      { palabra: 'ATOMO', pista: 'Partícula más pequeña de un elemento químico' },
      { palabra: 'CELULA', pista: 'Unidad básica de todos los seres vivos' },
      { palabra: 'AGUA', pista: 'H2O, líquido esencial para la vida' },
      { palabra: 'LUZ', pista: 'Forma de energía que nos permite ver' },
      { palabra: 'AIRE', pista: 'Mezcla de gases que respiramos' },
      { palabra: 'FUERZA', pista: 'Acción que modifica el movimiento de un cuerpo' },
      { palabra: 'ENERGIA', pista: 'Capacidad para realizar trabajo' },
      { palabra: 'PLANETA', pista: 'Cuerpo celeste que orbita alrededor de una estrella' },
      { palabra: 'VOLCAN', pista: 'Montaña que expulsa lava y cenizas' },
      { palabra: 'RAYO', pista: 'Descarga eléctrica durante una tormenta' }
    ],
    medio: [
      { palabra: 'ELECTRON', pista: 'Partícula subatómica con carga negativa' },
      { palabra: 'MOLECULA', pista: 'Conjunto de átomos unidos químicamente' },
      { palabra: 'GRAVEDAD', pista: 'Fuerza que atrae objetos hacia la Tierra' },
      { palabra: 'ECOSISTEMA', pista: 'Comunidad de seres vivos y su entorno' },
      { palabra: 'EVOLUCION', pista: 'Proceso de cambio en las especies a través del tiempo' },
      { palabra: 'QUIMICA', pista: 'Ciencia que estudia la composición de la materia' },
      { palabra: 'FISICA', pista: 'Ciencia que estudia las propiedades de la energía y materia' },
      { palabra: 'BIOLOGIA', pista: 'Ciencia que estudia los seres vivos' },
      { palabra: 'GENETICA', pista: 'Ciencia que estudia la herencia biológica' },
      { palabra: 'GALAXIA', pista: 'Conjunto enorme de estrellas, gas y polvo' }
    ],
    dificil: [
      { palabra: 'TERMODINAMICA', pista: 'Rama de la física que estudia calor y energía' },
      { palabra: 'BIOQUIMICA', pista: 'Estudio de procesos químicos en organismos vivos' },
      { palabra: 'ASTROFISICA', pista: 'Rama de la astronomía que estudia propiedades físicas del universo' },
      { palabra: 'NEUROCIENCIA', pista: 'Estudio del sistema nervioso y cerebro' },
      { palabra: 'NANOTECNOLOGIA', pista: 'Manipulación de materia a escala nanométrica' },
      { palabra: 'EPIGENETICA', pista: 'Estudio de cambios hereditarios sin alterar ADN' },
      { palabra: 'CRIOGENIA', pista: 'Ciencia que estudia temperaturas extremadamente bajas' },
      { palabra: 'COSMOLOGIA', pista: 'Estudio del origen y evolución del universo' },
      { palabra: 'PALEONTOLOGIA', pista: 'Ciencia que estudia fósiles de seres vivos' },
      { palabra: 'QUIMICA CUANTICA', pista: 'Rama de la química que aplica mecánica cuántica' }
    ]
  },
  peliculas: {
    facil: [
      { palabra: 'TITANIC', pista: 'Romance trágico en un barco hundido en 1912' },
      { palabra: 'AVATAR', pista: 'Película de James Cameron con alienígenas azules' },
      { palabra: 'ROCKY', pista: 'Boxeador que entrena subiendo escaleras' },
      { palabra: 'TOY STORY', pista: 'Juguetes que cobran vida cuando no los ven' },
      { palabra: 'FROZEN', pista: 'Hermana con poderes de hielo busca a su hermana' },
      { palabra: 'SHREK', pista: 'Ogro verde que rescata princesa con ayuda de un burro' },
      { palabra: 'SPIDERMAN', pista: 'Joven mordido por araña se convierte en héroe' },
      { palabra: 'BATMAN', pista: 'Superhéroe enmascarado de Gotham sin superpoderes' },
      { palabra: 'JURASSIC PARK', pista: 'Parque temático con dinosaurios clonados' },
      { palabra: 'STAR WARS', pista: 'Saga espacial con jedis, siths y la Fuerza' }
    ],
    medio: [
      { palabra: 'GLADIADOR', pista: 'Guerrero romano busca venganza en la arena' },
      { palabra: 'INCEPTION', pista: 'Film de Christopher Nolan sobre sueños compartidos' },
      { palabra: 'MATRIX', pista: 'Neo descubre que vive en realidad simulada' },
      { palabra: 'PULP FICTION', pista: 'Película no lineal de Tarantino con diálogos icónicos' },
      { palabra: 'FIGHT CLUB', pista: 'Club secreto donde hombres pelean para sentirse vivos' },
      { palabra: 'FORREST GUMP', pista: 'Hombre con discapacidad vive eventos históricos importantes' },
      { palabra: 'INTERESTELAR', pista: 'Viaje espacial para salvar a la humanidad buscando nuevo hogar' },
      { palabra: 'EL SEÑOR DE LOS ANILLOS', pista: 'Hobbit debe destruir anillo poderoso en el Monte del Destino' },
      { palabra: 'HARRY POTTER', pista: 'Joven mago que asiste a Hogwarts y lucha contra Voldemort' },
      { palabra: 'EL PADRINO', pista: 'Trilogía sobre la familia mafiosa Corleone' }
    ],
    dificil: [
      { palabra: 'RESPLANDOR', pista: 'Terror de Stanley Kubrick en hotel Overlook' },
      { palabra: 'CASABLANCA', pista: 'Clásico romántico de 1942 en Marruecos' },
      { palabra: 'PSICOSIS', pista: 'Clásico de Hitchcock con escena de ducha icónica' },
      { palabra: 'APOCALYPSE NOW', pista: 'Viaje por río en Vietnam durante la guerra' },
      { palabra: 'BLADE RUNNER', pista: 'Cazador de replicantes en futuro distópico' },
      { palabra: 'CIUDADANO KANE', pista: 'Periodista investiga última palabra de magnate' },
      { palabra: 'LA NARANJA MECANICA', pista: 'Joven violento sometido a terapia de aversión' },
      { palabra: 'EL SILENCIO DE LOS INOCENTES', pista: 'Agente del FBI consulta a asesino caníbal' },
      { palabra: 'TAXI DRIVER', pista: 'Taxista solitario planea asesinato en Nueva York' }
    ]
  },
  musica: {
    facil: [
      { palabra: 'ROCK', pista: 'Género musical con guitarras eléctricas potentes' },
      { palabra: 'JAZZ', pista: 'Género improvisado con saxofón y trompeta' },
      { palabra: 'SALSA', pista: 'Ritmo caribeño muy bailable y alegre' },
      { palabra: 'POP', pista: 'Música popular comercial con melodías pegadizas' },
      { palabra: 'RAP', pista: 'Música con ritmo hablado y rimas' },
      { palabra: 'REGGETON', pista: 'Género urbano originario de Puerto Rico' },
      { palabra: 'BACHATA', pista: 'Ritmo romántico de República Dominicana' },
      { palabra: 'MERENGUE', pista: 'Música dominicana de ritmo rápido' },
      { palabra: 'CUMBIA', pista: 'Ritmo colombiano con influencias indígenas y africanas' },
      { palabra: 'TANGO', pista: 'Baile y música dramática de Argentina y Uruguay' }
    ],
    medio: [
      { palabra: 'GUITARRA', pista: 'Instrumento de cuerda con seis cuerdas típicamente' },
      { palabra: 'BATERIA', pista: 'Conjunto de tambores, platillos y pedales' },
      { palabra: 'MELODIA', pista: 'Secuencia de notas musicales agradable al oído' },
      { palabra: 'ARMONIA', pista: 'Combinación de notas que suenan simultáneamente' },
      { palabra: 'RITMO', pista: 'Patrón de sonidos y silencios en el tiempo' },
      { palabra: 'COMPAS', pista: 'División del tiempo en música' },
      { palabra: 'PARTITURA', pista: 'Escritura musical con notas y símbolos' },
      { palabra: 'ORQUESTA', pista: 'Gran conjunto de músicos con instrumentos diversos' },
      { palabra: 'CORO', pista: 'Grupo de personas que cantan juntas' },
      { palabra: 'SOLISTA', pista: 'Músico que toca o canta solo' }
    ],
    dificil: [
      { palabra: 'CONTRAPUNTO', pista: 'Técnica de combinar líneas melódicas independientes' },
      { palabra: 'ORQUESTACION', pista: 'Arte de arreglar música para instrumentos de orquesta' },
      { palabra: 'POLIFONIA', pista: 'Textura musical con múltiples voces independientes' },
      { palabra: 'MODULACION', pista: 'Cambio de tonalidad dentro de una pieza musical' },
      { palabra: 'SINCRETA', pista: 'Ritmo irregular o fuera del compás establecido' },
      { palabra: 'MICROTONAL', pista: 'Música que utiliza intervalos menores al semitono' },
      { palabra: 'ALEATORIA', pista: 'Música con elementos dejados al azar' },
      { palabra: 'ELECTROACUSTICA', pista: 'Música que combina sonidos electrónicos y acústicos' },
      { palabra: 'SERIALISMO', pista: 'Técnica compositiva basada en series de doce notas' },
      { palabra: 'MINIMALISMO', pista: 'Estilo con repetición de patrones simples' }
    ]
  }
}

function volver() {
  router.push('/categoria')
}

function seleccionarNivel(nivel) {
  const categoria = localStorage.getItem('categoria')

  if (!categoria) {
    alert('Primero selecciona una categoría')
    return
  }

  localStorage.setItem('dificultad', nivel)

  const palabrasCategoria = palabrasConPistas[categoria][nivel]
  const itemAleatorio = palabrasCategoria[Math.floor(Math.random() * palabrasCategoria.length)]

  localStorage.setItem('palabraActual', itemAleatorio.palabra)
  localStorage.setItem('pistaActual', itemAleatorio.pista)
  localStorage.setItem('letrasAdivinadas', JSON.stringify([]))
  localStorage.setItem('intentosIncorrectos', '0')
  localStorage.setItem('estadoJuego', 'jugando')
}
</script>

<style scoped>
.contenedor {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  gap: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative; 
  }

.btn-volver {
  position: absolute;
  left: 30px;
  top: 30px;
  z-index: 10;
}

.contenedor-2 {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.dificultad {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  padding: 30px;
  width: 320px;
  min-height: 280px;
  font-size: 17px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.dificultad:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.dificultad h2 {
  margin: 10px 0;
  font-size: 28px;
}

.dificultad p {
  text-align: center;
  margin: 10px 0;
  line-height: 1.5;
}

.no-decoration {
  text-decoration: none;
  color: inherit;
}

.titulo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  text-align: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.titulo h2 {
  margin: 10px 0;
  font-size: 36px;
}

.titulo p {
  margin: 5px 0;
  font-size: 18px;
  opacity: 0.9;
}

@media (max-width: 1024px) {
  .contenedor-2 {
    flex-direction: column;
    align-items: center;
  }

  .dificultad {
    width: 90%;
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .btn-volver {
    left: 15px;
    top: 15px;
  }
  
  .titulo h2 {
    font-size: 28px;
  }
  
  .titulo p {
    font-size: 16px;
  }
}
</style>