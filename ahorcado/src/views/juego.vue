<template>
    <div class="principal">
        <div class="bg-amber-10 panel-izquierdo">
            <!-- Información del jugador -->
            <q-card class="info-card">
                <q-card-section>
                    <div class="text-h6">{{ nombreJugador }}</div>
                    <div class="text-caption">Intentos: {{ intentosRestantes }}/6</div>
                </q-card-section>
            </q-card>

            <!-- Dibujo ahorcado -->
            <q-card class="hangman-card">
                <q-card-section>
                    <svg width="200" height="250" viewBox="0 0 200 250">
                        <line x1="10" y1="230" x2="150" y2="230" stroke="#8B4513" stroke-width="4"/>
                        <line x1="50" y1="230" x2="50" y2="20" stroke="#8B4513" stroke-width="4"/>
                        <line x1="50" y1="20" x2="130" y2="20" stroke="#8B4513" stroke-width="4"/>
                        <line x1="130" y1="20" x2="130" y2="50" stroke="#8B4513" stroke-width="2"/>
                        
                        <circle v-if="intentosIncorrectos >= 1" cx="130" cy="70" r="20" 
                                stroke="#333" stroke-width="3" fill="none"/>
                        <line v-if="intentosIncorrectos >= 2" x1="130" y1="90" x2="130" y2="150" 
                              stroke="#333" stroke-width="3"/>
                        <line v-if="intentosIncorrectos >= 3" x1="130" y1="110" x2="100" y2="130" 
                              stroke="#333" stroke-width="3"/>
                        <line v-if="intentosIncorrectos >= 4" x1="130" y1="110" x2="160" y2="130" 
                              stroke="#333" stroke-width="3"/>
                        <line v-if="intentosIncorrectos >= 5" x1="130" y1="150" x2="110" y2="190" 
                              stroke="#333" stroke-width="3"/>
                        <line v-if="intentosIncorrectos >= 6" x1="130" y1="150" x2="150" y2="190" 
                              stroke="#333" stroke-width="3"/>
                    </svg>
                </q-card-section>
            </q-card>
        </div>

        <div class="contenedor-abc panel-derecho"> 
            <!-- Palabra -->
            <div class="word-display">
                <span v-for="(letra, index) in palabraMostrada" :key="index" class="letter-box">
                    {{ letra }}
                </span>
            </div>

            <!-- Teclado -->
            <div class="abc">
                <q-btn 
                    v-for="letra in letras" 
                    :key="letra"
                    :class="getColorLetra(letra)"
                    :disable="letrasUsadas.includes(letra) || juegoTerminado"
                    @click="adivinarLetra(letra)"
                >
                    {{ letra }}
                </q-btn>
            </div>

            <!-- Botones -->
            <div class="botones">
                <q-btn color="primary" label="Nuevo Juego" @click="nuevoJuego"/>
                <q-btn color="secondary" outline label="Volver" to="/categoria"/>
            </div>
        </div>

        <!-- Diálogo Victoria -->
        <q-dialog v-model="mostrarVictoria" persistent>
            <q-card>
                <q-card-section class="text-center">
                    <q-icon name="celebration" size="60px" color="positive"/>
                    <div class="text-h5 q-mt-md">¡Ganaste!</div>
                    <div class="text-body1 q-mt-sm">La palabra era: <strong>{{ palabraActual }}</strong></div>
                </q-card-section>
                <q-card-actions>
                    <q-btn color="primary" label="Jugar de nuevo" @click="nuevoJuego"/>
                    <q-btn color="secondary" label="Menú" to="/categoria" v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Diálogo Derrota -->
        <q-dialog v-model="mostrarDerrota" persistent>
            <q-card>
                <q-card-section class="text-center">
                    <q-icon name="sentiment_dissatisfied" size="60px" color="negative"/>
                    <div class="text-h5 q-mt-md">Perdiste</div>
                    <div class="text-body1 q-mt-sm">La palabra era: <strong>{{ palabraActual }}</strong></div>
                </q-card-section>
                <q-card-actions>
                    <q-btn color="primary" label="Intentar de nuevo" @click="nuevoJuego"/>
                    <q-btn color="secondary" label="Menú" to="/categoria" v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado
const nombreJugador = ref(localStorage.getItem('nombreJugador') || 'Jugador')
const palabraActual = ref(localStorage.getItem('palabraActual') || '')
const letrasUsadas = ref(JSON.parse(localStorage.getItem('letrasAdivinadas') || '[]'))
const intentosIncorrectos = ref(parseInt(localStorage.getItem('intentosIncorrectos') || '0'))
const mostrarVictoria = ref(false)
const mostrarDerrota = ref(false)

const letras = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 
                'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ',
                'Z', 'X', 'C', 'V', 'B', 'N', 'M']

// Computed
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

// Watch
watch([letrasUsadas, intentosIncorrectos], () => {
    localStorage.setItem('letrasAdivinadas', JSON.stringify(letrasUsadas.value))
    localStorage.setItem('intentosIncorrectos', intentosIncorrectos.value.toString())
    verificarEstadoJuego()
}, { deep: true })

// Funciones
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
    // Verificar victoria
    const todasAdivinadas = palabraActual.value.split('').every(letra => 
        letrasUsadas.value.includes(letra)
    )
    
    if (todasAdivinadas) {
        setTimeout(() => {
            mostrarVictoria.value = true
        }, 500)
        return
    }
    
    // Verificar derrota
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

// Validación inicial
if (!palabraActual.value) {
    alert('Debes seleccionar una categoría y nivel primero')
    router.push('/categoria')
}
</script>

<style scoped>
.principal{
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    gap: 30px;
}

.panel-izquierdo {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 300px;
}

.panel-derecho {
    flex: 1;
    max-width: 700px;
}

.info-card,
.hangman-card {
    background: white;
    border-radius: 15px;
}

.word-display {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.letter-box {
    width: 40px;
    height: 50px;
    border-bottom: 3px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: bold;
    color: white;
}

.abc{
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 10px;
    margin-bottom: 30px;
}

.contenedor-abc{
    background-color: rgba(255, 255, 255, 0.2);
    padding: 30px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
}

.botones {
    display: flex;
    gap: 15px;
    justify-content: center;
}

@media (max-width: 1024px) {
    .principal {
        flex-direction: column;
        align-items: center;
    }
    
    .panel-izquierdo {
        width: 100%;
        max-width: 500px;
    }
    
    .abc {
        grid-template-columns: repeat(7, 1fr);
    }
}
</style>