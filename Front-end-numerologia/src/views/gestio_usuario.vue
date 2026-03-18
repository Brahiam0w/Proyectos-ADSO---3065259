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
          <q-item clickable active-class="nav-active" active class="nav-item">
            <q-item-section avatar><q-icon name="people" /></q-item-section>
            <q-item-section>Gestión de Usuarios</q-item-section>
          </q-item>

          <q-item clickable class="nav-item" @click="router.push('/GestionPlanes')">
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
        <div class="container column no-wrap full-height">
          
          <!-- Header de Sección -->
          <div class="header-section q-mb-lg animate-fade">
            <div class="row justify-between items-end q-col-gutter-md">
              <div class="col-12 col-md-auto">
                <div class="text-gold text-caption text-uppercase text-weight-bold tracking-widest opacity-80">Sistema de Control</div>
                <div class="text-h3 text-weight-bold text-white title-font">Gestión de Usuarios</div>
              </div>
              
              <div class="col-12 col-md-auto row items-center q-gutter-sm">
                <q-input 
                  v-model="filtro" 
                  dark 
                  dense 
                  filled 
                  placeholder="Buscar por nombre o email..." 
                  class="search-input-mystic"
                  style="min-width: 280px;"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" color="amber-8" />
                  </template>
                </q-input>
                <q-btn 
                  color="amber-9" 
                  icon="person_add" 
                  label="Nuevo Usuario" 
                  unelevated
                  class="btn-gold text-weight-bold"
                  no-caps
                  @click="abrirDialogoCrear"
                />
              </div>
            </div>
          </div>

          <!-- Filtros Rápidos -->
          <div class="q-mb-md animate-fade" style="animation-delay: 0.2s">
            <q-tabs
              v-model="tabActual"
              dense
              class="text-grey-5 tabs-mystic"
              active-color="amber-8"
              indicator-color="amber-8"
              align="left"
              narrow-indicator
              no-caps
            >
              <q-tab name="todos" label="Todos los usuarios" />
              <q-tab name="admin" label="Administradores" />
              <q-tab name="usuarios" label="Usuarios Finales" />
            </q-tabs>
          </div>

          <!-- Tabla de Usuarios -->
          <div class="flex-grow-1 relative-position animate-fade" style="animation-delay: 0.4s; min-height: 0;">
            <q-table
              :rows="usuariosFiltrados"
              :columns="columnas"
              row-key="_id"
              flat
              dark
              binary-state-sort
              :loading="loading"
              class="mystic-table-dark full-height"
              :rows-per-page-options="[10, 20, 50]"
            >
              <!-- Cell: Nombre/Email -->
              <template v-slot:body-cell-nombre="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-x-md">
                    <q-avatar size="32px" class="avatar-mystic-static">
                      <img v-if="props.row.avatar" :src="props.row.avatar">
                      <span v-else>{{ props.row.nombre.charAt(0).toUpperCase() }}</span>
                    </q-avatar>
                    <div class="column">
                      <span class="text-weight-bold text-white">{{ props.row.nombre }}</span>
                      <span class="text-caption text-grey-5">{{ props.row.email }}</span>
                    </div>
                  </div>
                </q-td>
              </template>

              <!-- Cell: Rol -->
              <template v-slot:body-cell-rol="props">
                <q-td :props="props">
                  <q-badge 
                    :color="props.row.rol === 'admin' ? 'amber-10' : 'blue-10'" 
                    class="role-badge q-px-sm q-py-xs"
                    outline
                  >
                    {{ props.row.rol === 'admin' ? 'ADMIN' : 'USUARIO' }}
                  </q-badge>
                </q-td>
              </template>

              <!-- Cell: Estado -->
              <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                  <div class="row items-center q-gutter-x-sm">
                    <div :class="`status-dot ${props.row.estado === 'activo' ? 'bg-green-8 glow-green' : 'bg-red-8'}`"></div>
                    <span :class="props.row.estado === 'activo' ? 'text-green-5 text-weight-bold' : 'text-red-5'">
                      {{ props.row.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </q-td>
              </template>

              <!-- Cell: Membresía -->
              <template v-slot:body-cell-expiracion="props">
                <q-td :props="props">
                  <div class="column">
                    <span :class="props.row.estado === 'activo' ? 'text-amber-5' : 'text-grey-6'">
                      {{ calcularDiasRestantes(props.row.fecha_expiracion_plan) }}
                    </span>
                    <span v-if="props.row.fecha_expiracion_plan" class="text-tiny text-grey-7" style="font-size: 10px">
                      Vence: {{ new Date(props.row.fecha_expiracion_plan).toLocaleDateString() }}
                    </span>
                  </div>
                </q-td>
              </template>

              <!-- Cell: Acciones -->
              <template v-slot:body-cell-acciones="props">
                <q-td :props="props" class="text-right">
                  <q-btn flat round size="sm" color="amber-5" icon="edit" class="hover-scale" @click="abrirDialogoEditar(props.row)">
                    <q-tooltip class="bg-amber-9">Editar</q-tooltip>
                  </q-btn>
                  <q-btn flat round size="sm" color="red-5" icon="delete" class="hover-scale q-ml-xs" @click="confirmarEliminar(props.row)">
                    <q-tooltip class="bg-red-9">Eliminar</q-tooltip>
                  </q-btn>
                </q-td>
              </template>

              <!-- Loading State -->
              <template v-slot:loading>
                <q-inner-loading showing dark class="bg-dark-overlay">
                  <q-spinner-dots color="amber-8" size="4em" />
                  <div class="text-amber-8 q-mt-md">Cargando base de datos...</div>
                </q-inner-loading>
              </template>
            </q-table>
          </div>

        </div>
      </q-page>
    </q-page-container>

    <!-- DIÁLOGO DE CRUD -->
    <q-dialog v-model="modalAbierto" persistent backdrop-filter="blur(10px)">
      <q-card class="mystic-card-dark modal-form-mystic shadow-24 column no-wrap" style="max-height: 90vh; width: 500px;">
        
        <!-- Header -->
        <q-card-section class="row items-center q-pb-none relative-position q-pt-lg q-px-xl shrink-0">
          <div class="column">
            <div class="text-gold text-overline tracking-widest">Panel Administrativo</div>
            <div class="text-h5 title-font text-white">{{ editando ? 'Modificar Usuario' : 'Crear Nuevo Usuario' }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="amber-8" class="hover-scale" />
          <div class="header-glow"></div>
        </q-card-section>

        <!-- Formulario -->
        <q-card-section class="q-pa-xl col scroll-area-mystic">
          <q-form @submit.prevent="guardarUsuario" class="q-gutter-y-lg">
            
            <div class="form-section-mystic">
              <div class="section-tag-mystic q-mb-md">Datos Personales</div>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input v-model="formUsuario.nombre" label="Nombre Completo" dark filled dense label-color="amber-5" class="mystic-input" :rules="[val => !!val || 'El nombre es requerido']" />
                </div>
                <div class="col-12">
                  <q-input v-model="formUsuario.email" label="Correo Electrónico" type="email" dark filled dense label-color="amber-5" class="mystic-input" :disable="editando" :rules="[val => !!val || 'El correo es requerido']" />
                </div>
                <div class="col-12" v-if="!editando">
                  <q-input v-model="formUsuario.password" label="Contraseña" type="password" dark filled dense label-color="amber-5" class="mystic-input" :rules="[val => !!val || 'La contraseña es requerida']" />
                </div>
              </div>
            </div>

            <div class="form-section-mystic">
              <div class="section-tag-mystic q-mb-md">Configuración de Cuenta</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="formUsuario.fecha_nacimiento" label="Fecha Nacimiento" type="date" dark filled dense label-color="amber-5" stack-label class="mystic-input" />
                </div>
                <div class="col-12 col-md-6">
                  <q-select v-model="formUsuario.genero" :options="genderOptions" label="Género" dark filled dense emit-value map-options label-color="amber-5" class="mystic-input" />
                </div>
                <div class="col-12 col-md-6">
                  <q-select v-model="formUsuario.rol" :options="roleOptions" label="Rol del Usuario" dark filled dense emit-value map-options label-color="amber-5" class="mystic-input" />
                </div>
                <div class="col-12 col-md-6">
                  <q-select v-model="formUsuario.estado" :options="statusOptions" label="Estado" dark filled dense emit-value map-options label-color="amber-5" class="mystic-input" />
                </div>
                <div class="col-12">
                  <q-input v-model="formUsuario.pais" label="País" dark filled dense label-color="amber-5" class="mystic-input" />
                </div>
              </div>
            </div>

            <input type="submit" style="display:none" />
          </q-form>
        </q-card-section>

        <!-- Footer -->
        <q-card-section class="row justify-end q-pa-lg shrink-0 border-top-mystic">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup no-caps class="hover-scale" />
          <q-btn 
            :label="editando ? 'Guardar Cambios' : 'Crear Usuario'" 
            class="btn-gold-glow q-px-xl q-ml-md" 
            unelevated no-caps 
            @click="guardarUsuario"
            :loading="guardando"
          />
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
const filtro = ref('')
const tabActual = ref('todos')
const usuarios = ref([])

const modalAbierto = ref(false)
const editando = ref(false)
const usuarioIdActual = ref(null)

const formUsuario = reactive({
  nombre: '',
  email: '',
  password: '',
  fecha_nacimiento: '',
  rol: 'usuario',
  estado: 'inactivo',
  genero: 'prefiero no decirlo',
  pais: ''
})

const adminUser = computed(() => authStore.user || {})

const roleOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Usuario Estándar', value: 'usuario' }
]

const statusOptions = [
  { label: 'Activo', value: 'activo' },
  { label: 'Inactivo', value: 'inactivo' }
]

const genderOptions = [
  { label: 'Masculino', value: 'masculino' },
  { label: 'Femenino', value: 'femenino' },
  { label: 'Otro', value: 'otro' },
  { label: 'Prefiero no decirlo', value: 'prefiero no decirlo' }
]

const columnas = [
  { name: 'nombre', label: 'Nombre / Correo', field: 'nombre', align: 'left', sortable: true },
  { name: 'rol', label: 'Rol', field: 'rol', align: 'left', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left', sortable: true },
  { name: 'expiracion', label: 'Membresía', field: 'fecha_expiracion_plan', align: 'left', sortable: true },
  { name: 'fecha_registro', label: 'Fecha Registro', field: 'fecha_registro', align: 'left', sortable: true, format: val => new Date(val).toLocaleDateString() },
  { name: 'acciones', label: 'Acciones', align: 'right' }
]

const calcularDiasRestantes = (fecha) => {
  if (!fecha) return 'Sin plan'
  const hoy = new Date()
  const exp = new Date(fecha)
  const diff = exp - hoy
  const dias = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return dias > 0 ? `${dias} días restantes` : 'Expirado'
}

const obtenerUsuarios = async () => {
  loading.value = true
  try {
    const res = await api.get('/usuarios')
    if (res.data.success) {
      usuarios.value = res.data.usuarios
    }
  } catch (err) {
    $q.notify({ color: 'negative', message: 'Error al obtener usuarios', icon: 'error' })
  } finally {
    loading.value = false
  }
}

const abrirDialogoCrear = () => {
  editando.value = false
  usuarioIdActual.value = null
  Object.assign(formUsuario, {
    nombre: '',
    email: '',
    password: '',
    fecha_nacimiento: '',
    rol: 'usuario',
    estado: 'inactivo',
    genero: 'prefiero no decirlo',
    pais: ''
  })
  modalAbierto.value = true
}

const abrirDialogoEditar = (usuario) => {
  editando.value = true
  usuarioIdActual.value = usuario._id
  Object.assign(formUsuario, {
    nombre: usuario.nombre,
    email: usuario.email,
    fecha_nacimiento: usuario.fecha_nacimiento ? usuario.fecha_nacimiento.split('T')[0] : '',
    rol: usuario.rol,
    estado: usuario.estado,
    genero: usuario.genero || 'prefiero no decirlo',
    pais: usuario.pais || ''
  })
  modalAbierto.value = true
}

const guardarUsuario = async () => {
  guardando.value = true
  try {
    if (editando.value) {
      // Al editar, creamos una copia del form y eliminamos la password si está vacía
      const payload = { ...formUsuario }
      if (!payload.password) delete payload.password

      const res = await api.put(`/usuarios/${usuarioIdActual.value}`, payload)
      if (res.data.success) {
        $q.notify({ color: 'positive', message: 'Usuario actualizado', icon: 'check_circle' })
        obtenerUsuarios()
        modalAbierto.value = false
      }
    } else {
      const endpoint = formUsuario.rol === 'admin' ? '/auth/crear-admin' : '/auth/registro'
      const res = await api.post(endpoint, formUsuario)
      if (res.data.success) {
        $q.notify({ color: 'positive', message: 'Usuario creado', icon: 'person_add' })
        obtenerUsuarios()
        modalAbierto.value = false
      }
    }
  } catch (err) {
    $q.notify({ color: 'negative', message: err.response?.data?.mensaje || 'Error en la operación', icon: 'error' })
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = (usuario) => {
  $q.dialog({
    title: '<span class="text-gold title-font">Confirmar Eliminación</span>',
    message: `¿Está seguro de que desea eliminar a <b>${usuario.nombre}</b>? Esta acción es definitiva.`,
    html: true,
    dark: true,
    cancel: { flat: true, label: 'Cancelar', color: 'grey-5' },
    ok: { flat: false, label: 'Eliminar', color: 'red-9', unelevated: true },
    persistent: true
  }).onOk(() => {
    eliminarUsuario(usuario._id)
  })
}

const eliminarUsuario = async (id) => {
  try {
    const res = await api.delete(`/usuarios/${id}`)
    if (res.data.success) {
      $q.notify({ color: 'positive', message: 'Usuario eliminado', icon: 'delete' })
      obtenerUsuarios()
    }
  } catch (err) {
    $q.notify({ color: 'negative', message: 'Error al eliminar usuario', icon: 'error' })
  }
}

const usuariosFiltrados = computed(() => {
  let list = usuarios.value

  // 1. Filtrar por pestaña (Rol)
  if (tabActual.value === 'admin') {
    list = list.filter(u => u.rol === 'admin')
  } else if (tabActual.value === 'usuarios') {
    list = list.filter(u => u.rol === 'usuario')
  }

  // 2. Filtrar por texto (Buscador robusto)
  const term = filtro.value.toLowerCase().trim()
  if (term) {
    list = list.filter(u => {
      const nombre = (u.nombre || '').toLowerCase()
      const email = (u.email || '').toLowerCase()
      return nombre.includes(term) || email.includes(term)
    })
  }

  return list
})

const handleLogout = () => { authStore.logout(); router.push('/') }

onMounted(() => {
  obtenerUsuarios()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.title-font { font-family: 'Playfair Display', serif; }
.text-gold { color: #d4af37; }

/* FIX LAYOUT */
.mystic-dark-layout { 
  background: #0a0612; 
  color: #e0e0e0; 
  height: 100vh; 
  overflow: hidden; 
}

.main-content-dark { 
  height: 100vh; 
  padding: 0 !important; 
  background-image: radial-gradient(circle at 50% 50%, rgba(115, 17, 212, 0.05) 0%, transparent 100%); 
}

.container { 
  max-width: 1200px; 
  width: 100%; 
  margin: 0 auto;
  padding: 40px 24px; 
}

/* Sidebar */
.sidebar-mystic { background: #110a1f !important; border-right: 1px solid rgba(212, 175, 55, 0.2); }
.nav-item { border-radius: 10px; margin-bottom: 4px; color: #a094b8; transition: 0.3s; }
.nav-active { background: rgba(212, 175, 55, 0.1) !important; color: #d4af37 !important; border: 1px solid rgba(212, 175, 55, 0.2); }

/* Avatar Trigger */
.avatar-mystic-trigger { background: #110a1f; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; position: relative; z-index: 2; }
.pulse-ring { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 4px solid #d4af37; animation: pulse-gold 2s infinite; }
@keyframes pulse-gold { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } }

.avatar-mystic-static { background: #1a0f2e; border: 1px solid #d4af37; color: #d4af37; font-weight: 900; }

/* Tabla y Componentes */
.mystic-table-dark {
  background: rgba(22, 15, 36, 0.6) !important;
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 20px;
}

.search-input-mystic :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.tabs-mystic {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-gold {
  background: linear-gradient(45deg, #d4af37, #b8860b);
  color: #0a0612;
  border-radius: 10px;
}

.role-badge {
  border-radius: 6px;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 1px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.glow-amber {
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.glow-green { box-shadow: 0 0 10px rgba(76, 175, 80, 0.5); }

.bg-dark-overlay {
  background: rgba(10, 6, 18, 0.8) !important;
}

.hover-scale:hover { transform: scale(1.15); transition: 0.2s; }

/* Animations */
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade { animation: fadeIn 0.8s ease-out forwards; }

/* Scrollbar para la tabla */
:deep(.q-table__middle) {
  scrollbar-width: thin;
  scrollbar-color: #d4af37 rgba(255, 255, 255, 0.05);
}
:deep(.q-table__middle::-webkit-scrollbar) { width: 6px; }
:deep(.q-table__middle::-webkit-scrollbar-thumb) { background: #d4af37; border-radius: 3px; }

/* MODAL REDISEÑADO */
.modal-form-mystic {
  background: rgba(15, 10, 25, 0.9) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  border-radius: 24px !important;
  overflow: hidden;
}

.header-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  box-shadow: 0 0 15px #d4af37;
}

.form-section-mystic {
  background: rgba(255, 255, 255, 0.02);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.section-tag-mystic {
  color: #d4af37;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.8;
}

.mystic-input :deep(.q-field__control) {
  border-radius: 10px !important;
  background: rgba(255, 255, 255, 0.03) !important;
}

.btn-gold-glow {
  background: linear-gradient(45deg, #d4af37, #b8860b);
  color: #0a0612;
  font-weight: 800;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
  transition: 0.3s;
}

.btn-gold-glow:hover {
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
  transform: translateY(-2px);
}

.scroll-area-mystic {
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scroll-area-mystic::-webkit-scrollbar {
  display: none;
}

.shrink-0 {
  flex-shrink: 0;
}

.border-top-mystic {
  border-top: 1px solid rgba(212, 175, 55, 0.1);
}
</style>