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
        <!-- Burbuja de diálogo sobre la piedra -->
        <transition name="burbuja">
          <div v-if="mostrarDialog" class="burbuja-dialogo">
            <p class="texto-burbuja">{{ mensaje }}</p>
            <div class="pico-burbuja"></div>
          </div>
        </transition>
        
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
        @click="limpiar" 
        color="brown-7" 
        size="lg" 
        class="full-width q-mb-md"
        icon="cleaning_services"
        label="Limpiar"
      />
      
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

    <!-- NOTIFICACIONES DEL SISTEMA - EN ESQUINA SUPERIOR DERECHA -->
    <transition name="notificacion">
      <div v-if="mostrarNotificacion" class="notificacion-sistema" :class="`notificacion-${tipoNotificacion}`">
        <div class="notificacion-contenido">
          <q-icon :name="iconoNotificacion" size="sm" class="q-mr-sm" />
          <span class="text-caption text-bold">{{ mensajeNotificacion }}</span>
          <q-icon name="close" size="xs" class="q-ml-sm cursor-pointer" @click="cerrarNotificacion" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const hambre = ref(100)
const diversion = ref(100)
const higiene = ref(100)
const limpieza = ref(100)
const mensaje = ref("")
const mostrarDialog = ref(false)

// VARIABLES PARA NOTIFICACIONES DEL SISTEMA (en lugar de alertas)
const mostrarNotificacion = ref(false)
const mensajeNotificacion = ref("")
const tipoNotificacion = ref("info")
const iconoNotificacion = ref("info")
let notificacionTimeout = null

// Variables para manejar los mensajes
const mensajeTimeout = ref(null)
const ultimoMensajeMostrado = ref("")

let intervalo = null

// MENSAJES DE NOTIFICACIÓN DEL SISTEMA
const notificacionesHambre = {
  80: "Tengo un poco de hambre...",
  60: "Mi estómago de piedra está gruñendo",
  40: "¡Tengo hambre! Aunque no sé para qué",
  20: "¿En serio no me vas a alimentar?",
  10: "Hambre nivel: caníbal..."
}

const notificacionesDiversion = {
  80: "Estoy aburrida... ¿jugamos?",
  60: "La diversión está por los suelos",
  40: "Más aburrida que una piedra en un museo",
  20: "¡Me aburro más que una piedra en un jardín!",
  10: "Nivel de aburrimiento: contar granos de arena"
}

const notificacionesHigiene = {
  80: "Empiezo a sentirme sucia...",
  60: "Huelo a musgo y tierra...",
  40: "¡Estoy más sucia que una piedra en un charco!",
  20: "Mi higiene está por debajo de mis expectativas",
  10: "¡Tengo más bichos que un jardín!"
}

const notificacionesLimpieza = {
  80: "Todo está bastante limpio pero puede mejorar",
  60: "Un poco de limpieza no vendría mal",
  40: "Empiezo a notar algo de suciedad",
  20: "La suciedad se acumula...",
  10: "¡Estoy muy sucia! ¿Me limpiarás?"
}

// MENSAJES MEJORADOS CON MÁS VARIEDAD Y HUMOR
const mensajesAlimentar = [
  "Alimentar una piedra... tu currículum acaba de actualizarse",
  "La piedra hizo 'crunch'. O tal vez fue tu autoestima",
  "Nutrición nivel roca: ahora tengo más minerales que tu vida social",
  "¿Sabías que las piedras tienen 0 calorías? Como tu conversación",
  "La piedra digirió la comida mejor que tú digieres las malas decisiones",
  "Alimentaste una roca. Tu terapeuta quiere saber tu ubicación",
  "La comida pasó directo al suelo. Eficiencia: 100%",
  "Tu piedra está más alimentada que tu motivación por el gym",
  "Las piedras no necesitan comida. Tampoco tus excusas",
  "¿Le diste de comer a una piedra? Eso explica muchas cosas",
  "La piedra apreció el gesto. Mentira, es una piedra",
  "Alimentación completada. Ahora la piedra pesa 0.0001g más",
  "Tu piedra tiene mejor dieta que tú",
  "Comida + piedra = todavía piedra. Matemáticas básicas",
  "La piedra hizo 'ñam' en su mente de piedra",
  "Gastaste comida en algo que literalmente come sol",
  "Nutrición rocosa: el nuevo curso online que nadie pidió",
  "Tu piedra está más llena que tu agenda social",
  "Alimentar piedras: habilidad número 1 en LinkedIn",
  "La piedra no dijo gracias. Qué sorpresa"
]

const mensajesJugar = [
  "Ganaste contra una piedra. ¿Quieres una medalla?",
  "La piedra jugó mejor que tú en tu último juego online",
  "Jugar con piedras: el nuevo deporte olímpico 2024",
  "Tu piedra tiene más habilidades de juego que tú en el FIFA",
  "La piedra está en modo AFK permanente. Como tú en las reuniones",
  "Ganaste! La piedra te dejó ganar por lástima",
  "Jugar con una roca es más divertido que escuchar tus chistes",
  "La piedra tiene mejor reacción que tu ex respondiendo mensajes",
  "Nivel de diversión: más bajo que tus expectativas laborales",
  "La piedra está en el top 1% de piedras gamers",
  "Jugaste con una piedra. Tu infancia llora de envidia",
  "La piedra no se movió. Estrategia nivel dios",
  "Gaming con rocas: cuando Steam está muy caro",
  "Tu piedra tiene más logros que tú en Xbox",
  "La piedra carryeó el juego. Como siempre",
  "Jugar con piedras: más emocionante que tu Tinder",
  "La piedra no ragequit. Aprendé de ella",
  "Diversión nivel: contar piedras. Wait...",
  "Tu piedra tiene mejor K/D ratio que tú",
  "Jugar con una roca es más productivo que tu trabajo"
]

const mensajesBanar = [
  "Bañaste una piedra. El agua se pregunta qué hizo mal",
  "La piedra ahora está mojada. Revolución científica",
  "Gastaste agua en una roca. Greta Thunberg quiere hablar contigo",
  "La piedra huele a... piedra mojada. Innovador",
  "Bañar piedras: la nueva tendencia en bienestar",
  "Tu piedra está más limpia que tu historial de navegación",
  "El jabón se ofendió. '¿Para esto me crearon?'",
  "La piedra disfrutó más el baño que tú tu última cita",
  "Ahora tienes una piedra limpia. Felicidades, supongo",
  "Bañar rocas: cuando el aburrimiento gana",
  "La piedra no se enjabonó bien. Drama total",
  "Tu piedra está más fresca que tus memes",
  "Agua + piedra = piedra mojada. Premio Nobel please",
  "La piedra ahora brilla más que tu futuro",
  "Baño completado. La piedra sigue siendo piedra",
  "Gastaste shampoo en algo sin cabello. Lógica: 0",
  "Tu piedra huele mejor que tu aliento matutino",
  "Bañar piedras: el nuevo yoga para procrastinadores",
  "La piedra no cantó en la ducha. Decepcionante",
  "Hidroterapia para rocas: porque why not"
]

const mensajesLimpiar = [
  "Limpiaste una piedra. Tu madre estaría orgullosa (o no)",
  "La piedra ahora tiene 0.001% menos polvo. Impactante",
  "Limpiar piedras: el nuevo coreografía de TikTok",
  "Tu piedra está más pulida que tus excusas",
  "El trapo se sintió usado. Para esto me compraron?",
  "Limpiaste algo que literalmente vive en la tierra. Ironía",
  "La piedra brilla más que tu personalidad",
  "Productividad nivel: limpiar objetos inmóviles",
  "Tu piedra está más limpia que tu habitación",
  "Limpiar rocas: cuando no hay nada mejor que hacer",
  "El polvo volverá. Como tus malas decisiones",
  "La piedra apreció el esfuerzo. Es broma, es una piedra",
  "Limpiaste algo que se ensucia con el aire. Eficiencia",
  "Tu piedra tiene mejor higiene que tu mascota",
  "Limpieza completada. La piedra sigue sin pagar impuestos",
  "Gastaste productos de limpieza en una roca. Economía 101",
  "La piedra está más reluciente que tu cerebro en vacaciones",
  "Limpiar piedras: habilidad para poner en CV",
  "Tu piedra está más impecable que tu récord criminal",
  "La limpieza fue un éxito. La piedra sigue siendo inútil"
]

// Computed: Calcular felicidad
const felicidad = computed(() => {
  return Math.round((hambre.value + diversion.value + higiene.value + limpieza.value) / 4)
})

// Computed: Estado emocional
const estadoEmocional = computed(() => {
  if (felicidad.value >= 80) {
    return { mensaje: 'Muy Feliz', color: 'positive', clase: 'muy-feliz' }
  } else if (felicidad.value >= 60) {
    return { mensaje: 'Feliz', color: 'positive', clase: 'feliz' }
  } else if (felicidad.value >= 40) {
    return { mensaje: 'Normal', color: 'warning', clase: 'normal' }
  } else if (felicidad.value >= 20) {
    return { mensaje: 'Triste', color: 'orange', clase: 'triste' }
  } else {
    return { mensaje: 'Muy Triste', color: 'negative', clase: 'muy-triste' }
  }
})

// SISTEMA DE NOTIFICACIONES DEL SISTEMA
const mostrarNotificacionSistema = (mensaje, tipo = 'info', icono = 'info') => {
  if (notificacionTimeout) {
    clearTimeout(notificacionTimeout)
  }
  
  mensajeNotificacion.value = mensaje
  tipoNotificacion.value = tipo
  iconoNotificacion.value = icono
  mostrarNotificacion.value = true
  
  notificacionTimeout = setTimeout(() => {
    mostrarNotificacion.value = false
  }, 4000)
}

const cerrarNotificacion = () => {
  mostrarNotificacion.value = false
  if (notificacionTimeout) {
    clearTimeout(notificacionTimeout)
  }
}

// SISTEMA DE VERIFICACIÓN DE NECESIDADES
const verificarNecesidades = () => {
  // No mostrar notificaciones si ya hay una activa
  if (mostrarNotificacion.value) return
  
  const necesidades = []
  
  // HAMBRE
  if (hambre.value <= 80) {
    let mensajeHambre = ''
    let tipoHambre = 'info'
    let iconoHambre = 'restaurant'
    
    if (hambre.value <= 10) {
      mensajeHambre = notificacionesHambre[10]
      tipoHambre = 'urgent'
      iconoHambre = 'warning'
    } else if (hambre.value <= 20) {
      mensajeHambre = notificacionesHambre[20]
      tipoHambre = 'warning'
      iconoHambre = 'warning'
    } else if (hambre.value <= 40) {
      mensajeHambre = notificacionesHambre[40]
      tipoHambre = 'warning'
      iconoHambre = 'info'
    } else if (hambre.value <= 60) {
      mensajeHambre = notificacionesHambre[60]
      tipoHambre = 'info'
      iconoHambre = 'info'
    } else if (hambre.value <= 80) {
      mensajeHambre = notificacionesHambre[80]
      tipoHambre = 'info'
      iconoHambre = 'info'
    }
    
    necesidades.push({
      tipo: `hambre-${hambre.value}`,
      porcentaje: hambre.value,
      mensaje: mensajeHambre,
      tipoNotificacion: tipoHambre,
      icono: iconoHambre
    })
  }
  
  // DIVERSIÓN
  if (diversion.value <= 80) {
    let mensajeDiversion = ''
    let tipoDiversion = 'info'
    let iconoDiversion = 'sports_esports'
    
    if (diversion.value <= 10) {
      mensajeDiversion = notificacionesDiversion[10]
      tipoDiversion = 'urgent'
      iconoDiversion = 'warning'
    } else if (diversion.value <= 20) {
      mensajeDiversion = notificacionesDiversion[20]
      tipoDiversion = 'warning'
      iconoDiversion = 'warning'
    } else if (diversion.value <= 40) {
      mensajeDiversion = notificacionesDiversion[40]
      tipoDiversion = 'warning'
      iconoDiversion = 'info'
    } else if (diversion.value <= 60) {
      mensajeDiversion = notificacionesDiversion[60]
      tipoDiversion = 'info'
      iconoDiversion = 'info'
    } else if (diversion.value <= 80) {
      mensajeDiversion = notificacionesDiversion[80]
      tipoDiversion = 'info'
      iconoDiversion = 'info'
    }
    
    necesidades.push({
      tipo: `diversion-${diversion.value}`,
      porcentaje: diversion.value,
      mensaje: mensajeDiversion,
      tipoNotificacion: tipoDiversion,
      icono: iconoDiversion
    })
  }
  
  // HIGIENE
  if (higiene.value <= 80) {
    let mensajeHigiene = ''
    let tipoHigiene = 'info'
    let iconoHigiene = 'shower'
    
    if (higiene.value <= 10) {
      mensajeHigiene = notificacionesHigiene[10]
      tipoHigiene = 'urgent'
      iconoHigiene = 'warning'
    } else if (higiene.value <= 20) {
      mensajeHigiene = notificacionesHigiene[20]
      tipoHigiene = 'warning'
      iconoHigiene = 'warning'
    } else if (higiene.value <= 40) {
      mensajeHigiene = notificacionesHigiene[40]
      tipoHigiene = 'warning'
      iconoHigiene = 'info'
    } else if (higiene.value <= 60) {
      mensajeHigiene = notificacionesHigiene[60]
      tipoHigiene = 'info'
      iconoHigiene = 'info'
    } else if (higiene.value <= 80) {
      mensajeHigiene = notificacionesHigiene[80]
      tipoHigiene = 'info'
      iconoHigiene = 'info'
    }
    
    necesidades.push({
      tipo: `higiene-${higiene.value}`,
      porcentaje: higiene.value,
      mensaje: mensajeHigiene,
      tipoNotificacion: tipoHigiene,
      icono: iconoHigiene
    })
  }
  
  // LIMPIEZA
  if (limpieza.value <= 80) {
    let mensajeLimpieza = ''
    let tipoLimpieza = 'info'
    let iconoLimpieza = 'cleaning_services'
    
    if (limpieza.value <= 10) {
      mensajeLimpieza = notificacionesLimpieza[10]
      tipoLimpieza = 'urgent'
      iconoLimpieza = 'warning'
    } else if (limpieza.value <= 20) {
      mensajeLimpieza = notificacionesLimpieza[20]
      tipoLimpieza = 'warning'
      iconoLimpieza = 'warning'
    } else if (limpieza.value <= 40) {
      mensajeLimpieza = notificacionesLimpieza[40]
      tipoLimpieza = 'warning'
      iconoLimpieza = 'info'
    } else if (limpieza.value <= 60) {
      mensajeLimpieza = notificacionesLimpieza[60]
      tipoLimpieza = 'info'
      iconoLimpieza = 'info'
    } else if (limpieza.value <= 80) {
      mensajeLimpieza = notificacionesLimpieza[80]
      tipoLimpieza = 'info'
      iconoLimpieza = 'info'
    }
    
    necesidades.push({
      tipo: `limpieza-${limpieza.value}`,
      porcentaje: limpieza.value,
      mensaje: mensajeLimpieza,
      tipoNotificacion: tipoLimpieza,
      icono: iconoLimpieza
    })
  }
  
  if (necesidades.length > 0) {
    const necesidadSeleccionada = necesidades.reduce((prev, current) => 
      (current.porcentaje < prev.porcentaje) ? current : prev
    )
    
    mostrarNotificacionSistema(
      necesidadSeleccionada.mensaje,
      necesidadSeleccionada.tipoNotificacion,
      necesidadSeleccionada.icono
    )
  }
}

// SISTEMA DE MENSAJES DE LA PIEDRA
const obtenerMensajeAleatorio = (arrayMensajes) => {
  let mensajeElegido;
  let intentos = 0;
  
  do {
    mensajeElegido = arrayMensajes[Math.floor(Math.random() * arrayMensajes.length)];
    intentos++;
    
    if (intentos >= 5) {
      break;
    }
  } while (mensajeElegido === ultimoMensajeMostrado.value);
  
  ultimoMensajeMostrado.value = mensajeElegido;
  return mensajeElegido;
}

const mostrarMensajePiedra = (texto) => {
  mensaje.value = texto
  mostrarDialog.value = true
  
  if (mensajeTimeout.value) {
    clearTimeout(mensajeTimeout.value)
  }
  
  mensajeTimeout.value = setTimeout(() => {
    mostrarDialog.value = false
  }, 3000)
}

// Watch: Mensaje cuando la felicidad está muy baja
watch(felicidad, (nuevaFelicidad, felicidadAnterior) => {
  if (nuevaFelicidad < 20 && felicidadAnterior >= 20) {
    mostrarMensajePiedra("Tu piedra está deprimida. Una PIEDRA. Piénsalo")
  }
})

// Watch para verificar necesidades cuando cambian los estados
watch([hambre, diversion, higiene, limpieza], () => {
  verificarNecesidades()
}, { deep: true })

// Sistema de degradación automática
onMounted(() => {
  intervalo = setInterval(() => {
    hambre.value = Math.max(0, hambre.value - 1)
    diversion.value = Math.max(0, diversion.value - 1)
    higiene.value = Math.max(0, higiene.value - 1)
    limpieza.value = Math.max(0, limpieza.value - 1)
    
    if (Math.random() < 0.3) {
      verificarNecesidades()
    }
  }, 1200)
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
  if (mensajeTimeout.value) clearTimeout(mensajeTimeout.value)
  if (notificacionTimeout) clearTimeout(notificacionTimeout)
})

const getColorBarra = (valor) => {
  if (valor >= 70) return 'positive'
  if (valor >= 40) return 'warning'
  return 'negative'
}

const alimentar = () => {
  hambre.value = Math.min(100, hambre.value + 5)
  mostrarMensajePiedra(obtenerMensajeAleatorio(mensajesAlimentar))
}

const jugar = () => {
  diversion.value = Math.min(100, diversion.value + 5)
  mostrarMensajePiedra(obtenerMensajeAleatorio(mensajesJugar))
}

// CORRECCIÓN: Bañar solo afecta la higiene, NO la limpieza
const banar = () => {
  higiene.value = Math.min(100, higiene.value + 5)
  // NOTA: Eliminé la línea que aumentaba limpieza.value
  mostrarMensajePiedra(obtenerMensajeAleatorio(mensajesBanar))
}

const limpiar = () => {
  limpieza.value = Math.min(100, limpieza.value + 10)
  mostrarMensajePiedra(obtenerMensajeAleatorio(mensajesLimpiar))
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
  position: relative;
  padding-bottom: 20px;
}

.imagen-grande {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: none;
}

/* BURBUJA DE LA PIEDRA - CENTRO DE LA PANTALLA */
.burbuja-dialogo {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 12px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 350px;
  z-index: 20;
  border: 3px solid #333;
  pointer-events: none;
}

.texto-burbuja {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-align: center;
  line-height: 1.4;
}

.pico-burbuja {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 15px solid #333;
}

.pico-burbuja::before {
  content: '';
  position: absolute;
  bottom: 3px;
  left: -12px;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid white;
}

/* NOTIFICACIONES DEL SISTEMA - ESQUINA SUPERIOR DERECHA */
.notificacion-sistema {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 100;
  min-width: 280px;
  max-width: 400px;
}

.notificacion-contenido {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: slideInRight 0.4s ease-out;
}

.notificacion-info {
  background: linear-gradient(135deg, #2196F3, #21CBF3);
  color: white;
}

.notificacion-warning {
  background: linear-gradient(135deg, #FF9800, #FFC107);
  color: white;
}

.notificacion-urgent {
  background: linear-gradient(135deg, #f44336, #E91E63);
  color: white;
  animation: pulse 2s infinite;
}

/* TRANSICIONES */
.burbuja-enter-active,
.burbuja-leave-active {
  transition: all 0.4s ease;
}

.burbuja-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.8);
}

.burbuja-enter-to {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}

.burbuja-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}

.burbuja-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.8);
}

.notificacion-enter-active,
.notificacion-leave-active {
  transition: all 0.5s ease;
}

.notificacion-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notificacion-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.notificacion-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.notificacion-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* ANIMACIONES */
@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.cursor-pointer {
  cursor: pointer;
}

/* Asegurar que las secciones tengan fondo semi-transparente para mejor legibilidad */
.seccion-izquierda, .seccion-derecha {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.seccion-central {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>