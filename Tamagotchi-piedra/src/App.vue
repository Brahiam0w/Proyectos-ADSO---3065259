<template>
  <div class="pagina-completa secciones-container">
    <!-- Sección izquierda - Entretenimiento -->
    <div class="seccion seccion-izquierda column justify-center items-center q-pa-md">
      <h1 class="text-h5 text-center text-bold q-mb-lg text-black">zona de entretenimiento</h1>
      
      <q-btn 
        @click="alimentar" 
        color="orange-8" 
        size="lg" 
        class="full-width q-mb-md"
        icon="restaurant"
        label="Alimentar"
      />
      
      <div class="barra-container q-mb-md">
        <p class="text-subtitle2 text-bold text-black">Hambre</p>
        <q-linear-progress 
          :value="hambre / 100" 
          size="20px" 
          :color="getColorBarra(hambre)" 
          class="rounded-borders"
        />
        <p class="text-caption text-right text-black">{{ hambre }}%</p>
      </div>

      <!-- NUEVA SECCIÓN DE JUEGO - Estructurada igual que baño y limpieza -->
      <q-btn 
        @click="jugar" 
        color="purple-8" 
        size="lg" 
        class="full-width q-mb-md"
        icon="sports_esports"
        label="Jugar"
      />
      
      <div class="barra-container">
        <p class="text-subtitle2 text-bold text-black">Diversión</p>
        <q-linear-progress 
          :value="diversion / 100" 
          size="20px" 
          :color="getColorBarra(diversion)" 
          class="rounded-borders"
        />
        <p class="text-caption text-right text-black">{{ diversion }}%</p>
      </div>
    </div>

    <!-- Sección central -->
    <div class="seccion seccion-central column items-center q-pa-md">
      <div class="contenido-superior">
        <!-- Mensaje de estado emocional -->
        <div :class="['mensaje-estado', `estado-${estadoEmocional.clase}`]" class="q-mt-sm q-pa-sm rounded-borders">
          <span class="text-h6 text-bold">{{ estadoEmocional.mensaje }}</span>
        </div>
        
        <q-linear-progress 
          :value="felicidad / 100" 
          size="25px" 
          :color="estadoEmocional.color" 
          class="q-mt-md rounded-borders bg-amber-1"
        />
        <p class="text-caption text-center q-mt-xs text-black">Felicidad: {{ felicidad }}%</p>
        
      </div>
      
      <div class="imagen-contenedor">
        <!-- Cacas invisibles -->
        <div v-for="caca in cacasInvisibles" :key="caca.id" class="caca-invisible" :style="{ left: caca.x + '%' }">
          💩
        </div>
        
        <img src="/img/piedra.png" alt="piedra" class="imagen-grande" />
      </div>
    </div>

    <!-- Sección derecha - Limpieza -->
    <div class="seccion seccion-derecha column justify-center items-center q-pa-md">
      <h1 class="text-h5 text-center text-bold q-mb-lg text-black">zona de limpieza</h1>
      
      <q-btn 
        @click="banar" 
        color="blue-7" 
        size="lg" 
        class="full-width q-mb-md"
        icon="shower"
        label="Bañar"
      />
      
      <div class="barra-container q-mb-md">
        <p class="text-subtitle2 text-bold text-black">Higiene</p>
        <q-linear-progress 
          :value="higiene / 100" 
          size="20px" 
          :color="getColorBarra(higiene)" 
          class="rounded-borders"
        />
        <p class="text-caption text-right text-black">{{ higiene }}%</p>
      </div>
      
      <q-btn 
        @click="limpiarCaca" 
        color="brown-7" 
        size="lg" 
        class="full-width q-mb-md"
        icon="cleaning_services"
      >
        <div class="column items-center">
          <span>Limpiar Caca</span>
          <span class="text-caption">({{ cacasInvisibles.length }} invisibles)</span>
        </div>
      </q-btn>
      
      <div class="barra-container">
        <p class="text-subtitle2 text-bold text-black">Limpieza</p>
        <q-linear-progress 
          :value="limpieza / 100" 
          size="20px" 
          :color="getColorBarra(limpieza)" 
          class="rounded-borders"
        />
        <p class="text-caption text-right text-black">{{ limpieza }}%</p>
      </div>
    </div>

    <!-- Popup de mensajes -->
    <transition name="popup">
      <div v-if="mostrarDialog" class="popup-mensaje">
        <div class="popup-contenido">
          <p class="text-body1 text-bold text-black">{{ mensaje }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const nombre = "brahiam"
const hambre = ref(100)
const diversion = ref(100) // NUEVO: Estado para la diversión
const higiene = ref(100)
const limpieza = ref(100)
const mensaje = ref("")
const cacasInvisibles = ref([])
const mostrarDialog = ref(false)

// Variables para manejar la cola de mensajes
const mensajeTimeout = ref(null)
const colaMensajes = ref([])
const procesandoMensaje = ref(false)

let intervalo = null

// Mensajes creativos para alimentar
const mensajesAlimentar = [
  "La piedra dice 'mmm delicioso'... o eso creo",
  "¿Las piedras tienen estómago? Bueno, da igual",
  "La piedra aprecia tu gesto inútil pero adorable",
  "Acabas de alimentar a una roca. Reflexiona sobre tu vida",
  "La comida atravesó la piedra. Física básica",
  "La piedra no masticó. Ni siquiera lo intentó",
  "Gastaste comida en una piedra. Genio nivel: experto",
  "La piedra no tiene boca pero igual la alimentaste",
  "Plot twist: la piedra sigue siendo una piedra",
  "Tu dedicación a esta roca es admirable y preocupante",
  "No tienes que hacer la API con el profe Miguel? No pierdas el tiempo!!",
  "La piedra hizo 'ñam ñam'... en matrix",
  "Nutrición mineral level: experto",
  "¿Le pones ketchup a las piedras o solo sal?",
  "Tu piedra está más alimentada que tu motivación",
  "Alimentar rocas: el nuevo curso de gastronomía"
]

// NUEVO: Mensajes creativos para jugar
const mensajesJugar = [
  "Jugaste con la piedra... ella no se movió",
  "La piedra ganó al escondite. Siempre gana",
  "Tu piedra es el oponente más quieto que tendrás",
  "Jugar con piedras: el nuevo entretenimiento de la era digital",
  "La piedra disfrutó más este juego que tú tu último examen",
  "La piedra es demasiado buena en 'piedra, papel o tijera'",
  "Tu piedra tiene más habilidades de juego que tu personaje en RPG",
  "La piedra está en modo 'hardcore'. No muestra emociones",
  "Jugar con una roca: nivel máximo de paciencia",
  "La piedra está en el top del ranking de piedras gamers",
  "Tu piedra tiene más logros desbloqueados que tú en Steam",
  "La piedra está en su elemento. Literalmente",
  "Ganaste contra la piedra... o te dejó ganar?",
  "La piedra está en modo AFK... como siempre"
]

// Mensajes creativos para bañar
const mensajesBanar = [
  "La piedra está mojada. Eso es literalmente todo",
  "Acabas de desperdiciar agua en una roca. Ecología 0",
  "La piedra no olía mal... porque es una piedra",
  "El jabón se pregunta por qué existe en este momento",
  "Las burbujas rodaron por la piedra en silencio mortal",
  "La piedra no agradeció el baño. Qué mal educada",
  "Ahora tienes una piedra mojada. Felicidades",
  "Usaste shampoo en una roca. SHAMPOO. EN UNA ROCA",
  "La piedra sigue sucia de existencia",
  "Bañaste una piedra. Tu diploma universitario llora",
  "Le cayo jabón en los ojoooos, ahh falsa alarma",
  "La piedra ahora huele a... piedra mojada. Wow",
  "¿Usaste acondicionador? Para el brillo mineral",
  "Tu piedra está más limpia que tu historial de commits",
  "Baño de piedras: la nueva tendencia en spa",
  "La piedra disfrutó más este baño que tú tu ducha matutina"
]

// Mensajes creativos para limpiar caca
const mensajesLimpiarCaca = [
  "Limpiaste caca que NO EXISTE. Déjalo hundirse",
  "La caca invisible ha sido derrotada. Eres un héroe",
  "Removiste materia fecal del plano astral",
  "La piedra no agradeció que limpiaras su caca imaginaria",
  "Usaste papel higiénico en el aire. Eficiente",
  "Plot twist: nunca hubo caca. O tal vez sí. Quién sabe",
  "Limpiaste caca invisible mejor que tu cuarto real",
  "La caca se fue a la dimensión de las cosas inexistentes",
  "La caca invisible olía a... nada. Obvio",
  "Gastaste más energía limpiando esto que estudiando",
  "Ya limpiaste la de firulais en casa?",
  "Limpiar caca imaginaria: habilidades para el CV",
  "Tu piedra produce más caca que ideas productivas",
  "¿La caca invisible cuenta para el reciclaje?",
  "Esa caca tenía mejor forma que tu código",
  "Limpiar caca fantasma. Ahora eres un exterminador paranormal"
]

// Mensajes cuando no hay caca para limpiar
const mensajesNoCaca = [
  "No hay caca. Nunca la hubo. ¿O sí?",
  "Buscaste caca invisible y no encontraste nada. Lógico",
  "La ausencia de caca invisible es filosóficamente profunda",
  "Las cacas están en otra dimensión ahora",
  "Intentaste limpiar el vacío existencial",
  "Buscas caca donde no hay... como bugs en tu código",
  "No hay caca, pero sigue buscando. La esperanza es lo último que se pierde",
  "Caca no encontrada 404",
  "Tu piedra es ecológica: cero emisiones",
  "Limpiar caca que no existe: nivel pro de procrastinación"
]

// Computed: Calcular felicidad como promedio de las otras barras (ahora incluye diversion)
const felicidad = computed(() => {
  return Math.round((hambre.value + diversion.value + higiene.value + limpieza.value) / 4)
})

// Computed: Estado emocional basado en la felicidad
const estadoEmocional = computed(() => {
  if (felicidad.value >= 80) {
    return {
      mensaje: 'Muy Feliz',
      color: 'positive',
      clase: 'muy-feliz'
    }
  } else if (felicidad.value >= 60) {
    return {
      mensaje: 'Feliz',
      color: 'positive',
      clase: 'feliz'
    }
  } else if (felicidad.value >= 40) {
    return {
      mensaje: 'Normal',
      color: 'warning',
      clase: 'normal'
    }
  } else if (felicidad.value >= 20) {
    return {
      mensaje: 'Triste',
      color: 'orange',
      clase: 'triste'
    }
  } else {
    return {
      mensaje: 'Muy Triste',
      color: 'negative',
      clase: 'muy-triste'
    }
  }
})

// Computed: Número total de cacas
const totalCacas = computed(() => cacasInvisibles.value.length)

// Sistema mejorado de mensajes con cola
const procesarColaMensajes = () => {
  if (colaMensajes.value.length > 0 && !procesandoMensaje.value) {
    procesandoMensaje.value = true
    mensaje.value = colaMensajes.value.shift()
    mostrarDialog.value = true
    
    // Limpiar timeout anterior si existe
    if (mensajeTimeout.value) {
      clearTimeout(mensajeTimeout.value)
    }
    
    // Configurar nuevo timeout
    mensajeTimeout.value = setTimeout(() => {
      mostrarDialog.value = false
      // Pequeño delay antes del siguiente mensaje
      setTimeout(() => {
        procesandoMensaje.value = false
        procesarColaMensajes()
      }, 300)
    }, 2800)
  }
}

// Función para agregar mensajes a la cola
const agregarMensajeACola = (texto) => {
  colaMensajes.value.push(texto)
  if (!procesandoMensaje.value) {
    procesarColaMensajes()
  }
}

// Watch: Alertar cuando la felicidad está muy baja
watch(felicidad, (nuevaFelicidad, felicidadAnterior) => {
  if (nuevaFelicidad < 20 && felicidadAnterior >= 20) {
    agregarMensajeACola("Tu piedra está deprimida. Una PIEDRA. Piénsalo")
  }
})

// Watch: Generar caca cuando la limpieza pasa por 95%, 90%, 85%, etc
watch(limpieza, (nuevoValor, valorAnterior) => {
  if (nuevoValor < valorAnterior) {
    for (let umbral = 95; umbral >= 0; umbral -= 5) {
      if (valorAnterior > umbral && nuevoValor <= umbral) {
        const nuevaCaca = {
          id: Date.now() + Math.random(),
          x: Math.random() * 70 + 15
        }
        cacasInvisibles.value.push(nuevaCaca)
      }
    }
  }
})

// Sistema de degradación automática
onMounted(() => {
  intervalo = setInterval(() => {
    // Las barras bajan más despacio (1% cada 1.2 segundos)
    hambre.value = Math.max(0, hambre.value - 1)
    diversion.value = Math.max(0, diversion.value - 1) // NUEVO: La diversión también disminuye
    higiene.value = Math.max(0, higiene.value - 1)
    limpieza.value = Math.max(0, limpieza.value - 1)
  }, 1200)
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
  if (mensajeTimeout.value) clearTimeout(mensajeTimeout.value)
})

const getColorBarra = (valor) => {
  if (valor >= 70) return 'positive'
  if (valor >= 40) return 'warning'
  return 'negative'
}

const obtenerMensajeAleatorio = (arrayMensajes) => {
  return arrayMensajes[Math.floor(Math.random() * arrayMensajes.length)]
}

const alimentar = () => {
  hambre.value = Math.min(100, hambre.value + 5)
  agregarMensajeACola(obtenerMensajeAleatorio(mensajesAlimentar))
}

// NUEVO: Función para jugar
const jugar = () => {
  diversion.value = Math.min(100, diversion.value + 5)
  agregarMensajeACola(obtenerMensajeAleatorio(mensajesJugar))
}

const banar = () => {
  higiene.value = Math.min(100, higiene.value + 5)
  agregarMensajeACola(obtenerMensajeAleatorio(mensajesBanar))
}

const limpiarCaca = () => {
  if (cacasInvisibles.value.length > 0) {
    cacasInvisibles.value.shift()
    
    const cacasRestantes = cacasInvisibles.value.length
    const aumentoLimpieza = 5 + (cacasRestantes * 2)
    
    limpieza.value = Math.min(100, limpieza.value + aumentoLimpieza)
    
    let mensajeBase = obtenerMensajeAleatorio(mensajesLimpiarCaca)
    
    if (cacasRestantes > 0) {
      agregarMensajeACola(`${mensajeBase} - Quedan ${cacasRestantes}`)
    } else {
      agregarMensajeACola(`${mensajeBase} - Todo limpio (o eso crees)`)
    }
  } else {
    agregarMensajeACola(obtenerMensajeAleatorio(mensajesNoCaca))
  }
}
</script>

<style scoped>
.pagina-completa {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/img/fondo.png') center/cover no-repeat;
  overflow: hidden;
}

.secciones-container {
  display: flex;
  height: 100vh;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

.seccion {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.seccion-izquierda {
  flex: 1;
  justify-content: center;
}

.seccion-central {
  flex: 2;
  min-height: 0;
  justify-content: flex-start;
  position: relative;
}

.seccion-derecha {
  flex: 1;
  justify-content: center;
}

.contenido-superior {
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.mensaje-estado {
  text-align: center;
  transition: all 0.3s ease;
}

.estado-muy-feliz {
  background-color: #4caf50;
  color: white;
}

.estado-feliz {
  background-color: #8bc34a;
  color: white;
}

.estado-normal {
  background-color: #ff9800;
  color: white;
}

.estado-triste {
  background-color: #ff5722;
  color: white;
}

.estado-muy-triste {
  background-color: #f44336;
  color: white;
}

.barra-container {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 10px;
  border-radius: 8px;
}

.imagen-contenedor {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  flex: 1;
  min-height: 0;
  margin-bottom: -90px;
  position: relative;
}

.imagen-grande {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.caca-invisible {
  position: absolute;
  bottom: 20px;
  font-size: 30px;
  opacity: 0.6;
  z-index: 1;
}

/* Popup de mensajes */
.popup-mensaje {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.popup-contenido {
  background: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
  min-width: 300px;
  max-width: 600px;
  text-align: center;
}

.text-black {
  color: #000000 !important;
}

/* Animación del popup */
.popup-enter-active, .popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.popup-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>