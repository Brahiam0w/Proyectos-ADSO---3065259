<template>
  <q-layout view="lHh Lpr lFf" class="mystic-dark-layout">
    
    <!-- SIDEBAR (Administración) -->
    <q-drawer v-model="drawer" side="left" overlay behavior="mobile" :width="280" class="sidebar-mystic">
      <div class="sidebar-content column full-height">
        <div class="column items-center q-py-xl sidebar-header">
          <q-avatar size="80px" class="avatar-mystic-static q-mb-md">
            <img v-if="adminUser.avatar" :src="adminUser.avatar">
            <span v-else>{{ adminUser.nombre ? adminUser.nombre.charAt(0).toUpperCase() : 'A' }}</span>
          </q-avatar>
          <div class="text-gold text-h6 title-font">{{ adminUser.nombre }}</div>
          <div class="text-grey-5 text-caption">Administrador</div>
          
          <q-btn flat round icon="close" color="gold" class="absolute-top-right q-ma-sm" @click="drawer = false" />
        </div>

        <q-separator color="rgba(212, 175, 55, 0.2)" inset />

        <q-list padding class="q-px-md q-mt-md">
          <q-item clickable class="nav-item" @click="router.push('/GestionUsuarios')">
            <q-item-section avatar><q-icon name="people" /></q-item-section>
            <q-item-section>Gestión de Usuarios</q-item-section>
          </q-item>

          <q-item clickable active-class="nav-active" active class="nav-item">
            <q-item-section avatar><q-icon name="card_membership" /></q-item-section>
            <q-item-section>Gestión de Planes</q-item-section>
          </q-item>

          <q-separator color="rgba(212, 175, 55, 0.1)" class="q-my-md" />

          <q-item clickable class="nav-item" @click="router.push('/AdminPerfil')">
            <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
            <q-item-section>Mi Perfil</q-item-section>
          </q-item>
        </q-list>

        <q-space />

        <div class="q-pa-md">
          <q-btn flat no-caps color="red-4" icon="logout" label="Cerrar Sesión" class="full-width logout-btn" @click="handleLogout" />
        </div>
      </div>
    </q-drawer>

    <!-- AVATAR TRIGGER -->
    <div v-if="!drawer" class="fixed-top-left z-top q-ma-lg">
      <div class="avatar-trigger-wrapper">
        <div class="pulse-ring"></div>
        <q-avatar size="64px" class="avatar-mystic-trigger cursor-pointer shadow-10" @click="drawer = true">
          <img v-if="adminUser.avatar" :src="adminUser.avatar">
          <span v-else>{{ adminUser.nombre ? adminUser.nombre.charAt(0).toUpperCase() : 'A' }}</span>
        </q-avatar>
      </div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container>
      <q-page class="main-content-dark column no-wrap">
        <div class="container column no-wrap full-height scroll-area-custom">
          
          <!-- Header de Sección -->
          <div class="header-section q-mb-lg animate-fade">
            <div class="row justify-between items-end q-col-gutter-md">
              <div class="col-12 col-md-auto">
                <div class="text-gold text-caption text-uppercase text-weight-bold tracking-widest opacity-80">Administración</div>
                <div class="text-h3 text-weight-bold text-white title-font">Gestión de Planes</div>
              </div>
            </div>
          </div>

          <!-- Cards de Planes -->
          <div class="row q-col-gutter-lg q-mb-xl animate-fade justify-center" style="animation-delay: 0.2s">
            <div v-for="plan in planes" :key="plan._id" class="col-12 col-sm-6 col-md-4">
              <q-card class="mystic-card-dark plan-admin-card relative-position overflow-hidden">
                <q-icon :name="plan.icon || 'stars'" class="bg-icon-float" />
                <q-card-section>
                  <div class="row justify-between items-center q-mb-md">
                    <div class="text-h6 text-white text-weight-bold">{{ plan.nombre }}</div>
                    <q-badge color="amber-10" outline class="q-px-sm">{{ plan.tag }}</q-badge>
                  </div>
                  <div class="row items-baseline q-gutter-x-xs q-mb-lg">
                    <span class="text-h4 text-gold text-weight-bolder">${{ plan.precio }}</span>
                    <span class="text-grey-5">/ {{ plan.periodo }}</span>
                  </div>
                  <q-separator color="rgba(212, 175, 55, 0.1)" class="q-mb-lg" />
                  <div class="q-gutter-y-sm q-mb-xl" style="min-height: 120px">
                    <div v-for="feature in plan.features" :key="feature" class="row items-center q-gutter-x-sm">
                      <q-icon name="check_circle" color="amber-8" size="xs" />
                      <span class="text-grey-4 text-caption">{{ feature }}</span>
                    </div>
                  </div>
                  <q-btn outline color="amber-8" label="Editar Plan" icon="edit" class="full-width q-py-sm hover-scale" no-caps @click="abrirDialogoEditar(plan)" />
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Historial de Pagos -->
          <div class="animate-fade" style="animation-delay: 0.4s">
            <div class="row justify-between items-center q-mb-md">
              <h2 class="text-h5 text-white title-font q-my-none">Historial de Pagos Recientes</h2>
              <div class="row q-gutter-sm">
                <q-input v-model="filtroPago" dark dense filled placeholder="Buscar por cliente..." class="search-input-mystic" style="min-width: 250px">
                  <template #prepend><q-icon name="search" color="amber-8" /></template>
                </q-input>
              </div>
            </div>

            <q-table
              :rows="pagosFiltrados"
              :columns="columnasPagos"
              row-key="_id"
              flat dark
              class="mystic-table-dark"
              :pagination="{ rowsPerPage: 10 }"
              :loading="loading"
            >
              <template v-slot:body-cell-usuario="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-x-md">
                    <q-avatar size="32px" class="avatar-mystic-static">
                      <img v-if="props.row.usuario_id?.avatar" :src="props.row.usuario_id?.avatar">
                      <span v-else>{{ props.row.usuario_id?.nombre ? props.row.usuario_id?.nombre.charAt(0).toUpperCase() : '?' }}</span>
                    </q-avatar>
                    <div class="column">
                      <span class="text-weight-bold text-white">{{ props.row.usuario_id?.nombre || 'Desconocido' }}</span>
                      <span class="text-tiny text-grey-5">{{ props.row.usuario_id?.email || '---' }}</span>
                    </div>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-monto="props">
                <q-td :props="props">
                  <span class="text-weight-bold text-green-4">{{ props.value }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-metodo="props">
                <q-td :props="props">
                  <q-badge color="indigo-10" outline class="q-px-sm text-uppercase">
                    <q-icon name="payments" size="12px" class="q-mr-xs" />
                    {{ props.value }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:no-data>
                <div class="full-width row flex-center q-pa-xl text-grey-6">
                  <q-icon name="money_off" size="48px" class="q-mr-md" />
                  <span class="text-h6">No hay registros de pagos disponibles.</span>
                </div>
              </template>
            </q-table>
          </div>

        </div>
      </q-page>
    </q-page-container>

    <!-- DIÁLOGO PARA EDITAR PLAN -->
    <q-dialog v-model="modalAbierto" persistent backdrop-filter="blur(10px)">
      <q-card class="mystic-card-dark modal-form-mystic shadow-24 column no-wrap" style="max-height: 90vh; width: 500px;">
        <q-card-section class="row items-center q-pb-none relative-position q-pt-lg q-px-xl shrink-0">
          <div class="column">
            <div class="text-gold text-overline tracking-widest">Configuración de Oferta</div>
            <div class="text-h5 title-font text-white">Editar Plan</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="amber-8" />
          <div class="header-glow"></div>
        </q-card-section>

        <q-card-section class="q-pa-xl col scroll-area-mystic">
          <q-form ref="planForm" @submit.prevent="guardarPlan" class="q-gutter-y-lg">
            <div class="form-section-mystic">
              <div class="section-tag-mystic q-mb-md">Información Básica</div>
              <q-input 
                v-model="formPlan.nombre" 
                label="Nombre del Plan" 
                dark 
                filled 
                dense 
                label-color="amber-5" 
                class="mystic-input q-mb-md" 
                :rules="[val => !!val || 'El nombre es requerido']" 
              />
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input 
                    v-model.number="formPlan.precio" 
                    label="Precio ($)" 
                    type="number" 
                    step="0.01" 
                    dark 
                    filled 
                    dense 
                    label-color="amber-5" 
                    class="mystic-input" 
                    :rules="[val => val !== null && val !== undefined || 'El precio es requerido']" 
                  />
                </div>
                <div class="col-6">
                  <q-input 
                    v-model="formPlan.tag" 
                    label="Etiqueta (Tag)" 
                    dark 
                    filled 
                    dense 
                    label-color="amber-5" 
                    class="mystic-input" 
                    :rules="[val => !!val || 'El tag es requerido']" 
                  />
                </div>
              </div>
            </div>

            <div class="form-section-mystic">
              <div class="section-tag-mystic q-mb-md">Beneficios (Uno por línea)</div>
              <q-input
                v-model="featuresText"
                type="textarea"
                dark filled dense
                label-color="amber-5"
                placeholder="Ej: Lecturas ilimitadas"
                class="mystic-input"
                rows="5"
                :rules="[val => !!val || 'Debes ingresar al menos un beneficio']"
              />
              <div class="text-tiny text-grey-6 q-mt-xs">Cada salto de línea será una viñeta en la tarjeta.</div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-section class="row justify-end q-pa-lg shrink-0 border-top-mystic">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup no-caps />
          <q-btn label="Guardar Cambios" class="btn-gold-glow q-px-xl q-ml-md" unelevated no-caps :loading="guardando" @click="guardarPlan" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useQuasar } from 'quasar'
import api from '../api/axios'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const drawer = ref(false)
const loading = ref(false)
const guardando = ref(false)
const filtroPago = ref('')
const planes = ref([])
const pagos = ref([])

const modalAbierto = ref(false)
const planForm = ref(null)
const planIdActual = ref(null)
const featuresText = ref('')
const formPlan = reactive({
  nombre: '',
  precio: 0,
  tag: '',
  features: []
})

const adminUser = computed(() => authStore.user || {})

const obtenerDatos = async () => {
  loading.value = true
  try {
    const resPlanes = await api.get('/planes/admin')
    if (resPlanes.data.success) {
      planes.value = resPlanes.data.planes
    }
    const resPagos = await api.get('/pagos')
    if (resPagos.data.success) {
      pagos.value = resPagos.data.pagos
    }
  } catch (err) {
    $q.notify({ color: 'negative', message: 'Error al sincronizar con el cosmos' })
  } finally {
    loading.value = false
  }
}

const abrirDialogoEditar = (plan) => {
  planIdActual.value = plan._id
  formPlan.nombre = plan.nombre
  formPlan.precio = plan.precio
  formPlan.tag = plan.tag
  featuresText.value = (plan.features || []).join('\n')
  modalAbierto.value = true
}

const guardarPlan = async () => {
  const isValid = await planForm.value.validate()
  if (!isValid) return

  guardando.value = true
  formPlan.features = featuresText.value.split('\n').filter(f => f.trim() !== '')
  
  try {
    const res = await api.put(`/planes/${planIdActual.value}`, formPlan)
    if (res.data.success) {
      $q.notify({ color: 'positive', message: 'Plan actualizado correctamente', icon: 'check_circle' })
      obtenerDatos()
      modalAbierto.value = false
    }
  } catch (err) {
    $q.notify({ color: 'negative', message: 'Error al actualizar el plan' })
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  obtenerDatos()
})

const columnasPagos = [
  { name: 'usuario', label: 'Usuario', field: row => row.usuario_id?.nombre || 'Desconocido', align: 'left', sortable: true },
  { name: 'monto', label: 'Monto', field: 'monto', align: 'left', sortable: true, format: val => `$${val.toFixed(2)}` },
  { name: 'fecha', label: 'Fecha de Pago', field: 'fecha_pago', align: 'left', sortable: true, format: val => new Date(val).toLocaleDateString() },
  { name: 'metodo', label: 'Método', field: 'metodo', align: 'left', sortable: true },
  { name: 'vencimiento', label: 'Vence', field: 'fecha_vencimiento', align: 'left', sortable: true, format: val => new Date(val).toLocaleDateString() }
]

const pagosFiltrados = computed(() => {
  if (!filtroPago.value) return pagos.value
  const term = filtroPago.value.toLowerCase()
  return pagos.value.filter(p => 
    (p.usuario_id?.nombre || '').toLowerCase().includes(term) || 
    (p.usuario_id?.email || '').toLowerCase().includes(term)
  )
})

const handleLogout = () => { authStore.logout(); router.push('/') }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.title-font { font-family: 'Playfair Display', serif; }
.text-gold { color: #d4af37; }

.mystic-dark-layout { background: #0a0612; color: #e0e0e0; height: 100vh; overflow: hidden; }
.main-content-dark { 
  height: 100vh; padding: 0 !important;
  background-image: radial-gradient(circle at 50% 50%, rgba(115, 17, 212, 0.05) 0%, transparent 100%); 
}

.container { max-width: 1200px; width: 100%; margin: 0 auto; padding: 40px 24px; }
.scroll-area-custom { overflow-y: auto; height: 100vh; padding-bottom: 80px; scrollbar-width: none; }
.scroll-area-custom::-webkit-scrollbar { display: none; }

/* Sidebar */
.sidebar-mystic { background: #110a1f !important; border-right: 1px solid rgba(212, 175, 55, 0.2); }
.nav-item { border-radius: 10px; margin-bottom: 4px; color: #a094b8; transition: 0.3s; }
.nav-active { background: rgba(212, 175, 55, 0.1) !important; color: #d4af37 !important; border: 1px solid rgba(212, 175, 55, 0.2); }

/* Avatar Trigger */
.avatar-mystic-trigger { background: #110a1f; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; position: relative; z-index: 2; }
.pulse-ring { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 4px solid #d4af37; animation: pulse-gold 2s infinite; }
@keyframes pulse-gold { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } }
.avatar-mystic-static { background: #1a0f2e; border: 1px solid #d4af37; color: #d4af37; font-weight: 900; }

/* Cards */
.mystic-card-dark { background: rgba(22, 15, 36, 0.6) !important; border: 1px solid rgba(212, 175, 55, 0.1); border-radius: 24px; transition: 0.3s; }
.plan-admin-card:hover { transform: translateY(-5px); border-color: rgba(212, 175, 55, 0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

.bg-icon-float {
  position: absolute; top: -10px; right: -10px; font-size: 100px;
  color: #d4af37; opacity: 0.03; transform: rotate(-15deg);
}

.search-input-mystic :deep(.q-field__control) {
  border-radius: 12px; background: rgba(255, 255, 255, 0.03) !important; border: 1px solid rgba(212, 175, 55, 0.2);
}

.mystic-table-dark { background: transparent !important; }
.btn-gold { background: linear-gradient(45deg, #d4af37, #b8860b); color: #0a0612; border-radius: 10px; }

.hover-scale:hover { transform: scale(1.1); transition: 0.2s; }

/* MODAL */
.modal-form-mystic { background: rgba(15, 10, 25, 0.95) !important; backdrop-filter: blur(15px); border: 1px solid rgba(212, 175, 55, 0.3) !important; border-radius: 24px !important; }
.header-glow { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 80%; height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent); box-shadow: 0 0 15px #d4af37; }
.form-section-mystic { background: rgba(255, 255, 255, 0.02); padding: 20px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); }
.section-tag-mystic { color: #d4af37; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; }
.mystic-input :deep(.q-field__control) { border-radius: 10px !important; background: rgba(255, 255, 255, 0.03) !important; }
.btn-gold-glow { background: linear-gradient(45deg, #d4af37, #b8860b); color: #0a0612; font-weight: 800; border-radius: 12px; box-shadow: 0 0 20px rgba(212, 175, 55, 0.2); }
.scroll-area-mystic { overflow-y: auto; scrollbar-width: none; }
.scroll-area-mystic::-webkit-scrollbar { display: none; }
.shrink-0 { flex-shrink: 0; }
.border-top-mystic { border-top: 1px solid rgba(212, 175, 55, 0.1); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade { animation: fadeIn 0.8s ease-out forwards; }
</style>