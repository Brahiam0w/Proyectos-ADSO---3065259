<template>
  <q-page class="bg-medieval">
    <div class="content-container full-height">
      
      <!-- Header con diseño medieval -->
      <div class="header-medieval">
        <div class="parchment-header">
          <div class="header-content text-center">
            <div class="row items-center justify-center q-mb-sm">
              <q-icon name="edit" size="32px" class="q-mr-sm" />
              <h1 class="text-h4 q-my-none title-font">Gazette de Chismes</h1>
              <q-icon name="sports_bar" size="32px" class="q-ml-sm" />
            </div>
            <p class="text-subtitle2 motto-font q-mb-xs">
              "Donde los rumores del buen gusto se publican con distinción"
            </p>
            <div class="seal-container">
              <div class="royal-seal">
                <span class="seal-text">Anno Domini MDCCL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal sin scroll -->
      <div class="main-content">
        <!-- Botón Publicar con estilo medieval -->
        <div v-if="!mostrarFormulario" class="q-mb-sm">
          <div class="parchment-card">
            <div class="card-content">
              <q-btn
                @click="mostrarFormulario = true"
                color="brown-9"
                label="Publicar Nuevo Rumor"
                icon="edit"
                class="full-width medieval-button"
                size="md"
                unelevated
              />
            </div>
          </div>
        </div>

        <!-- Formulario de Publicación con estilo pergamino -->
        <div v-else class="q-mb-sm">
          <div class="parchment-card formulario-card">
            <div class="card-content">
              <div class="text-h6 title-font text-brown-9 q-mb-sm text-center">
                <q-icon name="create" class="q-mr-sm" />
                Nueva Publicación Real
              </div>

              <div class="form-field q-mb-sm">
                <div class="field-label text-brown-9 caption-font">Vuestro Ilustre Nombre</div>
                <q-input
                  v-model="autor"
                  placeholder="Ej: Lady Whistledown, Lord Pemberton..."
                  outlined
                  dense
                  color="brown-8"
                  class="medieval-input"
                  :disable="generandoIA"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="brown-8" />
                  </template>
                </q-input>
              </div>

              <div class="form-field q-mb-sm">
                <div class="field-label text-brown-9 caption-font">El Rumor de la Temporada</div>
                <q-input
                  v-model="nuevoChisme"
                  placeholder="Escuché que la Condesa de Harrington fue vista en el mercado comprando especias..."
                  outlined
                  type="textarea"
                  rows="3"
                  dense
                  color="brown-8"
                  class="medieval-input"
                  :disable="generandoIA"
                >
                  <template v-slot:prepend>
                    <q-icon name="description" color="brown-8" />
                  </template>
                </q-input>
              </div>

              <div class="row q-gutter-xs q-mb-sm justify-center">
                <q-btn
                  @click="sugerirExpresion"
                  label="✨ Expresión Arcaica"
                  color="deep-purple-9"
                  size="xs"
                  outline
                  class="medieval-small-btn"
                  :disable="generandoIA"
                />
                <q-btn
                  @click="generarChismeConIA"
                  :label="generandoIA ? 'Generando...' : '🪄 IA'"
                  color="indigo-9"
                  size="xs"
                  outline
                  class="medieval-small-btn"
                  :loading="generandoIA"
                  :disable="generandoIA"
                />
              </div>

              <div class="row q-gutter-xs">
                <q-btn
                  @click="publicarChisme"
                  label="Publicar"
                  icon="check_circle"
                  color="brown-9"
                  class="col medieval-button"
                  size="sm"
                  :disable="!nuevoChisme.trim() || !autor.trim() || generandoIA"
                  unelevated
                />
                <q-btn
                  @click="cancelarFormulario"
                  label="Cancelar"
                  icon="close"
                  color="grey-9"
                  outline
                  class="medieval-button"
                  size="sm"
                  :disable="generandoIA"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Lista Vacía -->
        <div v-if="chismes.length === 0" class="empty-state">
          <div class="parchment-card empty-card">
            <div class="card-content text-center">
              <q-icon name="auto_awesome" size="60px" color="brown-7" />
              <div class="text-subtitle2 text-brown-9 title-font q-mt-sm">
                Aún no hay rumores que compartir...
              </div>
              <div class="text-caption text-brown-7 caption-font q-mt-xs">
                ¡Sed el primero en publicar un escándalo!
              </div>
            </div>
          </div>
        </div>

        <!-- Tarjetas de Chismes con estilo pergamino -->
        <div class="chismes-container">
          <div
            v-for="chisme in chismes"
            :key="chisme.id"
            class="chisme-item"
          >
            <div class="parchment-card chisme-card">
              <div class="card-content">
                <div class="row items-start q-mb-sm">
                  <div class="medieval-avatar q-mr-sm">
                    <div 
                      class="avatar-circle"
                      :class="obtenerColorAvatar(chisme.autor)"
                    >
                      {{ chisme.autor[0].toUpperCase() }}
                    </div>
                  </div>
                  <div class="col">
                    <div class="row items-center">
                      <div class="text-subtitle2 text-weight-bold text-brown-9 title-font">
                        {{ chisme.autor }}
                      </div>
                      <q-icon name="workspace_premium" color="brown-7" size="14px" class="q-ml-xs" />
                    </div>
                    <div class="text-caption text-brown-7 caption-font">
                      <q-icon name="schedule" size="12px" class="q-mr-xs" />
                      {{ obtenerTiempoRelativo(chisme.timestamp) }}
                    </div>
                  </div>
                </div>

                <div class="parchment-inset q-pa-sm q-mb-sm">
                  <div class="text-body2 text-brown-9 content-font">
                    "{{ chisme.contenido }}"
                  </div>
                </div>

                <div class="divider q-mb-sm"></div>

                <div class="row q-gutter-xs flex-wrap justify-center">
                  <q-btn
                    v-for="reaccion in reaccionesEpoca"
                    :key="reaccion.nombre"
                    @click="agregarReaccion(chisme.id, reaccion.nombre)"
                    :label="`${reaccion.icon} ${chisme.reacciones[reaccion.nombre] || 0}`"
                    color="brown-3"
                    text-color="brown-9"
                    size="xs"
                    outline
                    dense
                    class="medieval-reaction-btn"
                  >
                    <q-tooltip>{{ reaccion.nombre }}</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-brown-7 q-mt-sm">
          <div class="text-caption caption-font">
            Publicado con la bendición de Su Majestad
          </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export default {
  name: 'Componetizar',

  setup() {
    const $q = useQuasar()

    const chismes = ref([])
    const nuevoChisme = ref('')
    const autor = ref('')
    const mostrarFormulario = ref(false)
    const generandoIA = ref(false)

    const expresionesArcaicas = [
      '¡Qué escándalo impropio!',
      '¡Vaya deshonra!',
      '¡Por todos los santos!',
      '¡Menuda osadía!',
      '¡Qué descaro!',
      '¡Santo cielo!',
      '¡Válgame Dios!',
    ]

    const reaccionesEpoca = [
      { icon: '🎭', nombre: 'Escandalizado' },
      { icon: '👑', nombre: 'Real' },
      { icon: '🍷', nombre: 'Brindis' },
      { icon: '🎪', nombre: 'Circo' },
      { icon: '⚜️', nombre: 'Noble' },
    ]

    const obtenerColorAvatar = (nombre) => {
      const colores = ['avatar-amber', 'avatar-pink', 'avatar-purple', 'avatar-blue', 'avatar-green', 'avatar-orange', 'avatar-lime']
      return colores[nombre.length % colores.length]
    }

    const obtenerTiempoRelativo = (timestamp) => {
      const minutos = Math.floor((Date.now() - timestamp) / 60000)
      if (minutos < 1) return 'Hace un instante'
      if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`
      const horas = Math.floor(minutos / 60)
      if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`
      const dias = Math.floor(horas / 24)
      return `Hace ${dias} día${dias > 1 ? 's' : ''}`
    }

    const cargarDatos = async () => {
      try {
        if (window.storage?.list) {
          const keys = await window.storage.list('chisme:')
          if (keys?.keys?.length) {
            const loaded = await Promise.all(
              keys.keys.map(async (key) => {
                const value = await window.storage.get(key)
                return value ? JSON.parse(value.value) : null
              })
            )
            chismes.value = loaded.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp)
          }
        }
      } catch (error) {
        console.warn('Storage no disponible, iniciando vacío')
      }
    }

    const generarChismeConIA = async () => {
      if (!GROQ_API_KEY || GROQ_API_KEY === 'TU_API_KEY_AQUI') {
        $q.notify({
          type: 'warning',
          message: '⚠️ Debes ingresar tu API Key de Groq',
          position: 'top'
        })
        return
      }

      generandoIA.value = true

      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'Genera chismes del siglo XVIII en lenguaje arcaico el rumor no tiene que ser tan largo ni elaborado usa maximo 5 renglones pero puedes usar menos.' },
              { role: 'user', content: 'Genera un rumor escandaloso.' }
            ],
            temperature: 0.9
          })
        })

        const data = await res.json()
        nuevoChisme.value = data?.choices?.[0]?.message?.content?.trim() || ''

      } catch (error) {
        $q.notify({ type: 'negative', message: 'Error generando chisme con IA' })
      } finally {
        generandoIA.value = false
      }
    }

    const publicarChisme = async () => {
      if (!nuevoChisme.value.trim() || !autor.value.trim()) return

      const chisme = {
        id: Date.now(),
        autor: autor.value,
        contenido: nuevoChisme.value,
        timestamp: Date.now(),
        reacciones: {}
      }

      if (window.storage?.set) {
        await window.storage.set(`chisme:${chisme.id}`, JSON.stringify(chisme))
      }

      chismes.value.unshift(chisme)

      nuevoChisme.value = ''
      autor.value = ''
      mostrarFormulario.value = false
    }

    const agregarReaccion = async (id, reaccion) => {
      chismes.value = chismes.value.map((c) => {
        if (c.id === id) {
          c.reacciones[reaccion] = (c.reacciones[reaccion] || 0) + 1
          if (window.storage?.set) {
            window.storage.set(`chisme:${id}`, JSON.stringify(c))
          }
        }
        return c
      })
    }

    const sugerirExpresion = () => {
      const exp = expresionesArcaicas[Math.floor(Math.random() * expresionesArcaicas.length)]
      nuevoChisme.value += ' ' + exp
    }

    const cancelarFormulario = () => {
      mostrarFormulario.value = false
      nuevoChisme.value = ''
      autor.value = ''
    }

    onMounted(() => cargarDatos())

    return {
      chismes,
      nuevoChisme,
      autor,
      mostrarFormulario,
      generandoIA,
      reaccionesEpoca,
      obtenerColorAvatar,
      obtenerTiempoRelativo,
      cargarDatos,
      generarChismeConIA,
      publicarChisme,
      agregarReaccion,
      sugerirExpresion,
      cancelarFormulario
    }
  }
}
</script>

<style scoped>
/* Fondo con textura medieval que ocupa toda la pantalla */
.bg-medieval {
  background: #d9c7a7 url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.1"><path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="%23795548" stroke-width="2"/></svg>');
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

/* Contenedor principal que ocupa toda la altura SIN SCROLL */
.content-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
  overflow: hidden;
}

/* Contenido principal SIN scroll */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header más compacto */
.header-medieval {
  flex-shrink: 0;
  margin-bottom: 12px;
}

.parchment-header {
  background: #e8d5b5;
  border: 2px solid #8b4513;
  border-radius: 4px;
  padding: 16px 12px;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 0 30px rgba(139, 69, 19, 0.1);
  position: relative;
  overflow: hidden;
}

/* Contenedor de chismes con scroll interno si es necesario */
.chismes-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 8px 0;
  padding: 0 2px;
}

/* Estados vacío */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

/* Elementos de chismes más compactos */
.chisme-item {
  margin-bottom: 8px;
}

/* Estilo de pergamino para las tarjetas (más compacto) */
.parchment-card {
  background: #f4e9d3;
  border: 1px solid #c19a6b;
  border-radius: 2px;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 0 20px rgba(193, 154, 107, 0.2);
  position: relative;
  overflow: hidden;
}

.parchment-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(90deg, transparent 98%, rgba(0,0,0,0.03) 100%),
    linear-gradient(rgba(0,0,0,0.03) 50%, transparent 50%);
  background-size: 15px 15px;
  pointer-events: none;
}

.card-content {
  position: relative;
  z-index: 1;
  padding: 12px;
}

/* Tipografías medievales */
.title-font {
  font-family: "UnifrakturMaguntia", "Times New Roman", serif;
  font-weight: normal;
  letter-spacing: 1px;
}

.motto-font {
  font-family: "Crimson Text", "Times New Roman", serif;
  font-style: italic;
}

.caption-font {
  font-family: "Crimson Text", "Times New Roman", serif;
}

.content-font {
  font-family: "Crimson Text", "Times New Roman", serif;
  line-height: 1.4;
  font-size: 0.9rem;
}

/* Sello real más pequeño */
.seal-container {
  margin-top: 8px;
}

.royal-seal {
  display: inline-block;
  padding: 4px 8px;
  border: 1px solid #8b4513;
  border-radius: 50%;
  background: #f4e9d3;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.seal-text {
  font-family: "Crimson Text", "Times New Roman", serif;
  font-size: 0.7rem;
  color: #8b4513;
  font-weight: bold;
}

/* Botones más compactos */
.medieval-button {
  border-radius: 2px !important;
  font-family: "Crimson Text", "Times New Roman", serif;
  font-weight: bold;
  text-transform: none;
  border: 1px solid rgba(0,0,0,0.2);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.medieval-small-btn {
  border-radius: 2px !important;
  font-family: "Crimson Text", "Times New Roman", serif;
  text-transform: none;
  border: 1px solid rgba(0,0,0,0.2);
  font-size: 0.7rem;
}

.medieval-reaction-btn {
  border-radius: 2px !important;
  font-family: "Crimson Text", "Times New Roman", serif;
  border: 1px solid rgba(0,0,0,0.2);
  font-size: 0.7rem;
}

/* Campos de entrada más compactos */
.medieval-input {
  font-family: "Crimson Text", "Times New Roman", serif;
}

.medieval-input :deep(.q-field__control) {
  border-radius: 2px;
  background: #f9f3e9;
  min-height: 40px;
}

.medieval-input :deep(.q-field__control:before) {
  border-color: #c19a6b;
}

.field-label {
  font-family: "Crimson Text", "Times New Roman", serif;
  margin-bottom: 4px;
  font-weight: bold;
  font-size: 0.8rem;
}

/* Avatar más pequeño */
.medieval-avatar {
  position: relative;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  border: 2px solid #8b4513;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  font-family: "Crimson Text", "Times New Roman", serif;
}

.avatar-amber { background-color: #fef3c7; color: #92400e; }
.avatar-pink { background-color: #fce7f3; color: #9d174d; }
.avatar-purple { background-color: #f3e8ff; color: #6b21a8; }
.avatar-blue { background-color: #dbeafe; color: #1e40af; }
.avatar-green { background-color: #dcfce7; color: #166534; }
.avatar-orange { background-color: #ffedd5; color: #9a3412; }
.avatar-lime { background-color: #ecfccb; color: #3f6212; }

/* Área de contenido del chisme más compacta */
.parchment-inset {
  background: #f9f3e9;
  border: 1px solid #d4b896;
  border-radius: 2px;
  position: relative;
}

.parchment-inset::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(90deg, transparent 98%, rgba(0,0,0,0.02) 100%),
    linear-gradient(rgba(0,0,0,0.02) 50%, transparent 50%);
  background-size: 12px 12px;
  pointer-events: none;
}

/* Divisor */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #c19a6b, transparent);
}

/* Estados especiales */
.formulario-card {
  border: 2px solid #8b4513;
}

.empty-card {
  border: 2px dashed #c19a6b;
  background: #f9f3e9;
  max-width: 300px;
  margin: 0 auto;
}

.chisme-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.15),
    inset 0 0 20px rgba(193, 154, 107, 0.2);
  transition: all 0.3s ease;
}

.medieval-reaction-btn:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Clase para altura completa */
.full-height {
  height: 100%;
}

/* Scrollbar personalizado solo para el contenedor de chismes */
.chismes-container::-webkit-scrollbar {
  width: 6px;
}

.chismes-container::-webkit-scrollbar-track {
  background: rgba(193, 154, 107, 0.2);
  border-radius: 3px;
}

.chismes-container::-webkit-scrollbar-thumb {
  background: #c19a6b;
  border-radius: 3px;
}

.chismes-container::-webkit-scrollbar-thumb:hover {
  background: #8b4513;
}

/* Asegurar que no haya scroll en el cuerpo principal */
:deep(.q-page) {
  overflow: hidden !important;
}

:deep(.q-layout) {
  overflow: hidden !important;
}
</style>