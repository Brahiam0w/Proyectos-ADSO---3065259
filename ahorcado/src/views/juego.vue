<template>
    <div class="principal">
        <div class="panel-izquierdo">
            <q-card class="info-card">
                <q-card-section>
                    <div class="text-h6">{{ nombreJugador }}</div>
                    <div class="text-subtitle2">Categoría: {{ categoriaActual }}</div>
                    <div class="text-caption">Intentos: {{ intentosRestantes }}/6</div>
                    <q-linear-progress 
                        :value="intentosRestantes / 6" 
                        :color="intentosRestantes > 3 ? 'positive' : intentosRestantes > 1 ? 'warning' : 'negative'"
                        size="10px"
                        class="q-mt-sm"
                    />
                </q-card-section>
            </q-card>

            <q-card class="pista-card">
                <q-card-section>
                    <div class="text-h6 flex items-center q-mb-sm">
                        <q-icon name="lightbulb" color="amber-8" size="sm" class="q-mr-sm"/>
                        Pista
                    </div>
                    <div class="text-body2">{{ pistaActual }}</div>
                </q-card-section>
            </q-card>

            <div class="botones-navegacion">
                <q-btn 
                    color="purple-8" 
                    label="Cambiar Nivel" 
                    icon="arrow_back"
                    to="/nivel"
                    size="md"
                    unelevated
                    class="full-width"
                />
                <q-btn 
                    color="amber-8" 
                    label="Ver Puntajes" 
                    icon="emoji_events"
                    to="/puntaje"
                    size="md"
                    unelevated
                    class="full-width"
                />
            </div>
        </div>

        <div class="contenedor-abc panel-derecho"> 
            <div class="word-display">
                <span v-for="(letra, index) in palabraMostrada" :key="index" class="letter-box">
                    {{ letra }}
                </span>
            </div>

            <q-card class="hangman-card">
                <q-card-section class="flex justify-center">
                    <svg width="220" height="280" viewBox="0 0 220 280">
                        <defs>
                            <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
                            </linearGradient>
                            <filter id="shadow">
                                <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                            </filter>
                        </defs>
                        
                        <ellipse cx="110" cy="265" rx="80" ry="8" fill="#333" opacity="0.2"/>
                        <rect x="10" y="250" width="150" height="15" fill="url(#woodGradient)" rx="2" filter="url(#shadow)"/>
                        <rect x="45" y="20" width="12" height="230" fill="url(#woodGradient)" filter="url(#shadow)"/>
                        <rect x="45" y="20" width="100" height="10" fill="url(#woodGradient)" filter="url(#shadow)"/>
                        <line x1="57" y1="30" x2="90" y2="70" stroke="#8B4513" stroke-width="8" opacity="0.6"/>
                        <line x1="145" y1="30" x2="145" y2="60" stroke="#DAA520" stroke-width="3"/>
                        
                        <g v-if="intentosIncorrectos >= 1">
                            <circle cx="145" cy="80" r="22" stroke="#FFD700" stroke-width="2" fill="#FFE4B5" filter="url(#shadow)"/>
                            <template v-if="intentosIncorrectos < 6">
                                <circle cx="138" cy="75" r="2.5" fill="#333"/>
                                <circle cx="152" cy="75" r="2.5" fill="#333"/>
                            </template>
                            <template v-else>
                                <line x1="136" y1="73" x2="140" y2="77" stroke="#DC143C" stroke-width="2"/>
                                <line x1="140" y1="73" x2="136" y2="77" stroke="#DC143C" stroke-width="2"/>
                                <line x1="150" y1="73" x2="154" y2="77" stroke="#DC143C" stroke-width="2"/>
                                <line x1="154" y1="73" x2="150" y2="77" stroke="#DC143C" stroke-width="2"/>
                            </template>
                            <path d="M 137 88 Q 145 85 153 88" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>
                            <line x1="135" y1="70" x2="141" y2="69" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="149" y1="69" x2="155" y2="70" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
                        </g>
                        
                        <g v-if="intentosIncorrectos >= 2">
                            <rect x="135" y="102" width="20" height="50" fill="#4A90E2" rx="3" filter="url(#shadow)"/>
                            <circle cx="145" cy="115" r="2" fill="#FFD700"/>
                            <circle cx="145" cy="127" r="2" fill="#FFD700"/>
                            <circle cx="145" cy="139" r="2" fill="#FFD700"/>
                        </g>
                        
                        <g v-if="intentosIncorrectos >= 3">
                            <line x1="135" y1="115" x2="110" y2="140" stroke="#4A90E2" stroke-width="6" stroke-linecap="round" filter="url(#shadow)"/>
                            <circle cx="110" cy="140" r="5" fill="#FFE4B5" filter="url(#shadow)"/>
                        </g>
                        
                        <g v-if="intentosIncorrectos >= 4">
                            <line x1="155" y1="115" x2="180" y2="140" stroke="#4A90E2" stroke-width="6" stroke-linecap="round" filter="url(#shadow)"/>
                            <circle cx="180" cy="140" r="5" fill="#FFE4B5" filter="url(#shadow)"/>
                        </g>
                        
                        <g v-if="intentosIncorrectos >= 5">
                            <line x1="145" y1="152" x2="125" y2="195" stroke="#2C3E50" stroke-width="7" stroke-linecap="round" filter="url(#shadow)"/>
                            <ellipse cx="125" cy="198" rx="8" ry="5" fill="#333" filter="url(#shadow)"/>
                        </g>
                        
                        <g v-if="intentosIncorrectos >= 6">
                            <line x1="145" y1="152" x2="165" y2="195" stroke="#2C3E50" stroke-width="7" stroke-linecap="round" filter="url(#shadow)"/>
                            <ellipse cx="165" cy="198" rx="8" ry="5" fill="#333" filter="url(#shadow)"/>
                        </g>
                    </svg>
                </q-card-section>
            </q-card>

            <div class="abc">
                <q-btn 
                    v-for="letra in letras" 
                    :key="letra"
                    :class="getColorLetra(letra)"
                    :disable="letrasUsadas.includes(letra) || juegoTerminado"
                    @click="adivinarLetra(letra)"
                    class="letra-btn"
                    size="md"
                    unelevated
                >
                    {{ letra }}
                </q-btn>
            </div>

            <div class="botones">
                <q-btn 
                    color="primary" 
                    label="Nuevo Juego" 
                    icon="refresh"
                    @click="nuevoJuego"
                    size="lg"
                    unelevated
                />
                <q-btn 
                    color="secondary" 
                    outline 
                    label="Categorías" 
                    icon="category"
                    to="/categoria"
                    size="lg"
                />
            </div>
        </div>

        <q-dialog v-model="mostrarVictoria" persistent>
            <q-card class="dialog-card">
                <q-card-section class="text-center q-pa-lg">
                    <div class="celebration-animation">
                        <q-icon name="emoji_events" size="80px" color="amber-8"/>
                    </div>
                    <div class="text-h4 text-weight-bold q-mt-md text-positive">¡Felicidades!</div>
                    <div class="text-h6 q-mt-sm">¡Has ganado!</div>
                    <div class="text-body1 q-mt-md">
                        La palabra era: <strong class="text-primary text-h5">{{ palabraActual }}</strong>
                    </div>
                    <div class="puntos-ganados q-mt-md">
                        <q-chip color="amber" text-color="white" icon="stars" size="lg">
                            +{{ puntosGanados }} puntos
                        </q-chip>
                    </div>
                    <div class="text-caption q-mt-sm text-grey-7">
                        Intentos fallidos: {{ intentosIncorrectos }}/6
                    </div>
                </q-card-section>
                <q-card-actions class="q-pa-md q-gutter-sm">
                    <q-btn 
                        color="primary" 
                        label="Jugar de nuevo" 
                        icon="refresh"
                        @click="nuevoJuego"
                        class="full-width"
                        size="lg"
                        unelevated
                    />
                    <q-btn 
                        color="amber-8" 
                        label="Ver Puntajes" 
                        icon="emoji_events"
                        to="/puntaje" 
                        v-close-popup
                        class="full-width"
                        size="lg"
                        unelevated
                    />
                    <q-btn 
                        color="secondary" 
                        label="Menú Principal" 
                        icon="home"
                        to="/categoria" 
                        v-close-popup
                        class="full-width"
                        size="lg"
                        outline
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="mostrarDerrota" persistent>
            <q-card class="dialog-card">
                <q-card-section class="text-center q-pa-lg">
                    <q-icon name="sentiment_very_dissatisfied" size="80px" color="negative"/>
                    <div class="text-h4 text-weight-bold q-mt-md text-negative">¡Oh no!</div>
                    <div class="text-h6 q-mt-sm">Se acabaron los intentos</div>
                    <div class="text-body1 q-mt-md">
                        La palabra era: <strong class="text-primary text-h5">{{ palabraActual }}</strong>
                    </div>
                    <div class="text-caption q-mt-sm text-grey-7">
                        ¡No te rindas, inténtalo de nuevo!
                    </div>
                </q-card-section>
                <q-card-actions class="q-pa-md q-gutter-sm">
                    <q-btn 
                        color="primary" 
                        label="Intentar de nuevo" 
                        icon="replay"
                        @click="nuevoJuego"
                        class="full-width"
                        size="lg"
                        unelevated
                    />
                    <q-btn 
                        color="secondary" 
                        label="Menú Principal" 
                        icon="home"
                        to="/categoria" 
                        v-close-popup
                        class="full-width"
                        size="lg"
                        outline
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nombreJugador = ref(localStorage.getItem('nombreJugador') || 'Jugador')
const palabraActual = ref(localStorage.getItem('palabraActual') || '')
const categoriaActual = ref(localStorage.getItem('categoria') || '')
const pistaActual = ref(localStorage.getItem('pistaActual') || 'Sin pista disponible')
const letrasUsadas = ref(JSON.parse(localStorage.getItem('letrasAdivinadas') || '[]'))
const intentosIncorrectos = ref(parseInt(localStorage.getItem('intentosIncorrectos') || '0'))
const mostrarVictoria = ref(false)
const mostrarDerrota = ref(false)
const puntosGanados = ref(0)

const letras = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 
                'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ',
                'Z', 'X', 'C', 'V', 'B', 'N', 'M']

const palabraMostrada = computed(() => {
    return palabraActual.value.split('').map(letra => 
        letrasUsadas.value.includes(letra) ? letra : '_'
    )
})

const intentosRestantes = computed(() => {
    return 6 - intentosIncorrectos.value
})

const juegoTerminado = computed(() => {
    return mostrarVictoria.value || mostrarDerrota.value
})

function calcularPuntos() {
    const dificultad = localStorage.getItem('dificultad') || 'medio'
    const multiplicadores = { facil: 10, medio: 20, dificil: 30 }
    const base = multiplicadores[dificultad] || 20
    const bonus = intentosRestantes.value * 5
    return base + bonus
}

function guardarPuntaje() {
    const puntos = calcularPuntos()
    puntosGanados.value = puntos
    
    const puntajes = JSON.parse(localStorage.getItem('puntajes') || '[]')
    
    puntajes.push({
        nombre: nombreJugador.value,
        puntos: puntos,
        categoria: categoriaActual.value,
        dificultad: localStorage.getItem('dificultad') || 'medio',
        fecha: new Date().toLocaleDateString()
    })
    
    localStorage.setItem('puntajes', JSON.stringify(puntajes))
}

function adivinarLetra(letra) {
    if (letrasUsadas.value.includes(letra)) return
    
    letrasUsadas.value.push(letra)
    
    if (!palabraActual.value.includes(letra)) {
        intentosIncorrectos.value++
    }
}

function getColorLetra(letra) {
    if (letrasUsadas.value.includes(letra)) {
        return palabraActual.value.includes(letra) ? 'bg-positive' : 'bg-negative'
    }
    return 'bg-blue-11'
}

function verificarEstadoJuego() {
    const todasAdivinadas = palabraActual.value.split('').every(letra => 
        letrasUsadas.value.includes(letra)
    )
    
    if (todasAdivinadas && palabraActual.value) {
        guardarPuntaje()
        setTimeout(() => {
            mostrarVictoria.value = true
        }, 500)
        return
    }
    
    if (intentosIncorrectos.value >= 6) {
        setTimeout(() => {
            mostrarDerrota.value = true
        }, 500)
    }
}

function nuevoJuego() {
    mostrarVictoria.value = false
    mostrarDerrota.value = false
    router.push('/nivel')
}

watch([letrasUsadas, intentosIncorrectos], () => {
    localStorage.setItem('letrasAdivinadas', JSON.stringify(letrasUsadas.value))
    localStorage.setItem('intentosIncorrectos', intentosIncorrectos.value.toString())
    verificarEstadoJuego()
}, { deep: true })

onMounted(() => {
    if (!palabraActual.value) {
        alert('Debes seleccionar una categoría y nivel primero')
        router.push('/categoria')
    }
})
</script>

<style scoped>
.principal {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    gap: 20px;
    box-sizing: border-box;
    overflow: hidden;
}

.panel-izquierdo {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 300px;
    flex-shrink: 0;
    min-width: 250px;
}

.panel-derecho {
    flex: 1;
    max-width: 700px;
    min-width: 0; /* Importante para evitar desbordamiento */
}

.info-card,
.hangman-card,
.pista-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden; /* Previene desbordamiento interno */
}

.pista-card {
    background: linear-gradient(135deg, #FFF9E6 0%, #FFE8A1 100%);
}

.hangman-card {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    margin: 15px 0;
}

.botones-navegacion {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.contenedor-abc {
    background-color: rgba(255, 255, 255, 0.15);
    padding: 20px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: column;
    min-height: 0; /* Importante para flexbox */
}

.word-display {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 15px;
    flex-wrap: wrap;
    min-height: 60px;
}

.letter-box {
    width: 35px;
    height: 45px;
    border-bottom: 4px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    font-weight: bold;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    animation: letterPop 0.5s ease;
    flex-shrink: 0; /* Evita que las letras se encojan */
}

@keyframes letterPop {
    0% { transform: scale(0); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.abc {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 5px;
    margin: 10px 0;
    min-height: 0; /* Permite que se ajuste al contenedor */
}

.letra-btn {
    font-weight: bold;
    font-size: 13px;
    transition: all 0.2s ease;
    padding: 4px 0;
    min-width: 0; /* Evita que los botones crezcan demasiado */
    min-height: 35px;
}

.letra-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.letra-btn:active:not(:disabled) {
    transform: translateY(0);
}

.botones {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 15px;
    flex-wrap: wrap; /* Permite que los botones se ajusten en pantallas pequeñas */
}

.dialog-card {
    min-width: 400px;
    border-radius: 20px;
    max-width: 90vw; /* Limita el ancho en pantallas pequeñas */
}

.celebration-animation {
    animation: bounce 1s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}

.puntos-ganados {
    animation: pulse 1.5s ease infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

/* Media Queries para responsividad */
@media (max-width: 1200px) {
    .principal {
        gap: 15px;
        padding: 15px;
    }
    
    .panel-izquierdo {
        width: 280px;
    }
    
    .abc {
        grid-template-columns: repeat(8, 1fr);
    }
}

@media (max-width: 1024px) {
    .principal {
        flex-direction: column;
        align-items: center;
        overflow: auto; /* Permite scroll en móvil */
    }
    
    .panel-izquierdo {
        width: 100%;
        max-width: 600px;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .panel-izquierdo > * {
        flex: 1;
        min-width: 250px;
        max-width: 300px;
    }
    
    .panel-derecho {
        width: 100%;
        max-width: 600px;
    }
    
    .abc {
        grid-template-columns: repeat(7, 1fr);
    }
    
    .dialog-card {
        min-width: 350px;
    }
}

@media (max-width: 768px) {
    .principal {
        padding: 10px;
        gap: 10px;
    }
    
    .panel-izquierdo {
        flex-direction: column;
        align-items: stretch;
    }
    
    .panel-izquierdo > * {
        max-width: 100%;
    }
    
    .abc {
        grid-template-columns: repeat(5, 1fr);
        gap: 4px;
    }
    
    .letter-box {
        width: 30px;
        height: 40px;
        font-size: 22px;
    }
    
    .letra-btn {
        font-size: 12px;
        min-height: 30px;
    }
    
    .contenedor-abc {
        padding: 15px;
    }
    
    .hangman-card {
        margin: 10px 0;
    }
    
    .hangman-card svg {
        width: 180px;
        height: 240px;
    }
    
    .dialog-card {
        min-width: 300px;
        margin: 10px;
    }
}

@media (max-width: 480px) {
    .abc {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .letter-box {
        width: 25px;
        height: 35px;
        font-size: 18px;
    }
    
    .botones {
        flex-direction: column;
        align-items: stretch;
    }
    
    .botones .q-btn {
        width: 100%;
    }
    
    .hangman-card svg {
        width: 150px;
        height: 200px;
    }
}

@media (max-height: 700px) {
    .principal {
        min-height: 100vh;
        overflow-y: auto; /* Permite scroll vertical */
    }
    
    .letter-box {
        width: 30px;
        height: 40px;
        font-size: 20px;
    }
    
    .hangman-card {
        margin: 8px 0;
    }
    
    .hangman-card svg {
        width: 160px;
        height: 200px;
    }
    
    .abc {
        gap: 3px;
        margin: 8px 0;
    }
    
    .letra-btn {
        font-size: 11px;
        min-height: 28px;
        padding: 2px 0;
    }
    
    .contenedor-abc {
        padding: 15px;
    }
}

/* Corrección especial para pantallas muy pequeñas */
@media (max-width: 350px) {
    .abc {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .letter-box {
        width: 22px;
        height: 32px;
        font-size: 16px;
    }
    
    .hangman-card svg {
        width: 130px;
        height: 170px;
    }
}

/* Prevenir desbordamiento horizontal */
* {
    box-sizing: border-box;
}

/* Asegurar que los elementos no excedan el ancho */
img, svg, video {
    max-width: 100%;
    height: auto;
}
</style>