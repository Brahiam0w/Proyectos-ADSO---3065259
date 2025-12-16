<template>
    <div class="contenedor-puntajes">
        <div class="header">
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
                <q-icon name="emoji_events" size="60px" color="amber-8"/>
                <h2>Tabla de Clasificación</h2>
                <p>Los mejores jugadores</p>
            </div>
        </div>

        <div class="contenedor-tabla">
            <div class="acciones">
                <!-- Filtro por dificultad -->
                <q-select
                    v-model="filtroDificultad"
                    :options="opcionesDificultad"
                    label="Filtrar por dificultad"
                    outlined
                    dense
                    class="filtro-select"
                    style="min-width: 200px; margin-right: 15px;"
                />
                
                <q-btn 
                    color="negative" 
                    label="Limpiar Puntajes" 
                    icon="delete"
                    @click="confirmarLimpiar"
                    outline
                    size="md"
                />
            </div>

            <q-card class="tabla-card">
                <q-card-section>
                    <div v-if="jugadoresOrdenados.length === 0" class="no-data">
                        <q-icon name="sentiment_dissatisfied" size="80px" color="grey-6"/>
                        <p class="text-h6 text-grey-6 q-mt-md">
                            {{ filtroDificultad.value === 'todas' 
                                ? 'No hay puntajes registrados aún' 
                                : `No hay puntajes para ${filtroDificultad.label}` }}
                        </p>
                        <q-btn 
                            color="primary" 
                            label="Jugar Ahora" 
                            icon="play_arrow"
                            to="/categoria"
                            class="q-mt-md"
                            unelevated
                        />
                    </div>

                    <q-list v-else separator class="puntajes-list">
                        <q-item 
                            v-for="(jugador, index) in jugadoresOrdenados" 
                            :key="index"
                            class="puntaje-item"
                        >
                            <q-item-section avatar>
                                <q-avatar 
                                    :color="getMedalColor(index + 1)" 
                                    text-color="white"
                                    size="60px"
                                >
                                    <span v-if="index < 3" class="medal-icon">
                                        {{ getMedalIcon(index + 1) }}
                                    </span>
                                    <span v-else class="text-h6">{{ index + 1 }}</span>
                                </q-avatar>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label class="text-h5 text-weight-bold">
                                    <q-icon name="person" size="sm" class="q-mr-sm"/>
                                    {{ jugador.nombre }}
                                </q-item-label>
                                <q-item-label caption class="text-subtitle1">
                                    <q-icon name="videogame_asset" size="xs" class="q-mr-xs"/>
                                    {{ jugador.partidas }} {{ jugador.partidas === 1 ? 'partida' : 'partidas' }} jugadas
                                    <span v-if="filtroDificultad.value !== 'todas'" class="q-ml-sm">
                                        • {{ jugador.dificultad }}
                                    </span>
                                </q-item-label>
                            </q-item-section>

                            <q-item-section side>
                                <q-chip 
                                    :color="getPuntosColor(jugador.puntosTotal)" 
                                    text-color="white"
                                    icon="stars"
                                    size="xl"
                                    class="puntos-chip"
                                >
                                    <span class="text-h5 text-weight-bold">{{ jugador.puntosTotal }}</span>
                                </q-chip>
                                <div class="text-caption text-grey-6 q-mt-xs text-center">
                                    Promedio: {{ jugador.promedio }}
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>

            <div class="estadisticas" v-if="puntajesFiltrados.length > 0">
                <q-card class="stat-card">
                    <q-card-section>
                        <div class="stat-content">
                            <q-icon name="emoji_events" size="50px" color="amber-8"/>
                            <div>
                                <div class="stat-valor">{{ totalPartidas }}</div>
                                <div class="stat-label">
                                    Partidas {{ filtroDificultad.value !== 'todas' ? filtroDificultad.label : 'Totales' }}
                                </div>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>

                <q-card class="stat-card">
                    <q-card-section>
                        <div class="stat-content">
                            <q-icon name="people" size="50px" color="primary"/>
                            <div>
                                <div class="stat-valor">{{ totalJugadores }}</div>
                                <div class="stat-label">Jugadores</div>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>

                <q-card class="stat-card">
                    <q-card-section>
                        <div class="stat-content">
                            <q-icon name="trending_up" size="50px" color="positive"/>
                            <div>
                                <div class="stat-valor">{{ mejorPuntaje }}</div>
                                <div class="stat-label">Puntaje Más Alto</div>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <q-dialog v-model="mostrarConfirmacion" persistent>
            <q-card class="dialog-confirm">
                <q-card-section class="text-center q-pa-lg">
                    <q-icon name="warning" size="60px" color="warning"/>
                    <div class="text-h5 q-mt-md text-weight-bold">¿Estás seguro?</div>
                    <div class="text-body1 q-mt-md">
                        Se eliminarán todos los puntajes registrados y estadísticas.
                    </div>
                    <div class="text-body2 text-grey-7 q-mt-sm">
                        Esta acción no se puede deshacer.
                    </div>
                </q-card-section>
                <q-card-actions class="q-pa-md q-gutter-sm">
                    <q-btn 
                        label="Cancelar" 
                        color="secondary" 
                        outline 
                        v-close-popup
                        size="lg"
                        class="q-px-xl"
                    />
                    <q-btn 
                        label="Eliminar Todo" 
                        color="negative" 
                        @click="limpiarPuntajes" 
                        v-close-popup
                        unelevated
                        size="lg"
                        class="q-px-xl"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado
const puntajes = ref([])
const mostrarConfirmacion = ref(false)
const filtroDificultad = ref({ value: 'todas', label: 'Todas las dificultades' })

// Opciones para el filtro
const opcionesDificultad = [
    { value: 'todas', label: 'Todas las dificultades' },
    { value: 'facil', label: 'Fácil' },
    { value: 'medio', label: 'Medio' },
    { value: 'dificil', label: 'Difícil' }
]

// Computed - Puntajes filtrados por dificultad
const puntajesFiltrados = computed(() => {
    if (filtroDificultad.value.value === 'todas') {
        return puntajes.value
    }
    return puntajes.value.filter(puntaje => 
        puntaje.dificultad === filtroDificultad.value.value
    )
})

// Computed - Jugadores ordenados según filtro
const jugadoresOrdenados = computed(() => {
    const jugadoresMap = {}
    
    puntajesFiltrados.value.forEach(puntaje => {
        const nombre = puntaje.nombre
        
        if (!jugadoresMap[nombre]) {
            jugadoresMap[nombre] = {
                nombre: nombre,
                puntosTotal: 0,
                partidas: 0,
                puntajes: [],
                dificultad: filtroDificultad.value.value !== 'todas' ? filtroDificultad.value.label : 'Variadas'
            }
        }
        
        jugadoresMap[nombre].puntosTotal += puntaje.puntos
        jugadoresMap[nombre].partidas += 1
        jugadoresMap[nombre].puntajes.push(puntaje.puntos)
    })
    
    const jugadoresArray = Object.values(jugadoresMap).map(jugador => ({
        ...jugador,
        promedio: Math.round(jugador.puntosTotal / jugador.partidas)
    }))
    
    return jugadoresArray.sort((a, b) => b.puntosTotal - a.puntosTotal)
})

// Estadísticas basadas en los puntajes filtrados
const totalPartidas = computed(() => puntajesFiltrados.value.length)

const totalJugadores = computed(() => {
    const nombresUnicos = new Set(puntajesFiltrados.value.map(p => p.nombre))
    return nombresUnicos.size
})

const mejorPuntaje = computed(() => {
    if (puntajesFiltrados.value.length === 0) return 0
    return Math.max(...puntajesFiltrados.value.map(p => p.puntos))
})

// Funciones
function cargarPuntajes() {
    const datos = localStorage.getItem('puntajes')
    puntajes.value = datos ? JSON.parse(datos) : []
}

function getMedalColor(posicion) {
    const colores = {
        1: 'amber-8',
        2: 'grey-6',
        3: 'orange-10'
    }
    return colores[posicion] || 'blue-6'
}

function getMedalIcon(posicion) {
    const iconos = {
        1: '🥇',
        2: '🥈',
        3: '🥉'
    }
    return iconos[posicion] || posicion
}

function getPuntosColor(puntos) {
    if (puntos >= 100) return 'purple'
    if (puntos >= 70) return 'positive'
    if (puntos >= 40) return 'warning'
    return 'info'
}

function confirmarLimpiar() {
    mostrarConfirmacion.value = true
}

function limpiarPuntajes() {
    localStorage.removeItem('puntajes')
    puntajes.value = []
    // Reiniciar el filtro
    filtroDificultad.value = { value: 'todas', label: 'Todas las dificultades' }
}

function volver() {
    router.push('/juego')
}

// Lifecycle
onMounted(() => {
    cargarPuntajes()
})
</script>

<style scoped>
.contenedor-puntajes {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
}

.header {
    position: relative;
    text-align: center;
    margin-bottom: 30px;
}

.btn-volver {
    position: absolute;
    left: 0;
    top: 0;
}

.titulo {
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.titulo h2 {
    font-size: 42px;
    margin: 10px 0;
}

.titulo p {
    font-size: 18px;
    opacity: 0.9;
}

.contenedor-tabla {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.acciones {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
}

.filtro-select {
    background: white;
    border-radius: 8px;
}

.tabla-card {
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.no-data {
    text-align: center;
    padding: 60px 20px;
}

.puntajes-list {
    max-height: 600px;
    overflow-y: auto;
}

.puntaje-item {
    padding: 20px;
    transition: all 0.3s ease;
    border-left: 5px solid transparent;
    background: white;
    margin: 5px;
    border-radius: 10px;
}

.puntaje-item:hover {
    background-color: rgba(102, 126, 234, 0.1);
    transform: translateX(5px);
    border-left-color: #667eea;
}

.medal-icon {
    font-size: 32px;
}

.puntos-chip {
    padding: 12px 20px;
}

.estadisticas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.stat-card {
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
    background: white;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.stat-content {
    display: flex;
    align-items: center;
    gap: 20px;
}

.stat-valor {
    font-size: 36px;
    font-weight: bold;
    color: #667eea;
}

.stat-label {
    font-size: 14px;
    color: #666;
    text-transform: uppercase;
    font-weight: 600;
}

.dialog-confirm {
    min-width: 400px;
    border-radius: 15px;
}

/* Indicador de dificultad en la etiqueta */
.puntaje-item .text-subtitle1 span {
    background: rgba(102, 126, 234, 0.1);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: #667eea;
    font-weight: 500;
}

@media (max-width: 768px) {
    .contenedor-puntajes {
        padding: 15px;
    }
    
    .titulo h2 {
        font-size: 28px;
    }
    
    .estadisticas {
        grid-template-columns: 1fr;
    }

    .puntaje-item {
        padding: 15px;
    }

    .dialog-confirm {
        min-width: 300px;
    }
    
    .acciones {
        flex-direction: column;
        align-items: stretch;
    }
    
    .filtro-select {
        width: 100%;
        margin-right: 0;
        margin-bottom: 10px;
    }
}

@media (max-width: 600px) {
    .puntaje-item {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .puntaje-item q-item-section {
        margin-top: 10px;
    }
}
</style>