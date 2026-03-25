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
          
          <q-btn flat round icon="close" color="amber-8" class="absolute-top-right q-ma-sm" @click="drawer = false" />
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

    <!-- AVATAR TRIGGER FLOTANTE -->
    <div v-if="!drawer" class="fixed-top-left z-top q-ma-lg">
      <div class="avatar-trigger-wrapper">
        <div class="pulse-ring"></div>
        <q-avatar size="64px" class="avatar-mystic-trigger cursor-pointer shadow-10" @click="drawer = true">
          <img v-if="adminUser.avatar" :src="adminUser.avatar">
          <span v-else class="text-white">{{ adminUser.nombre ? adminUser.nombre.charAt(0).toUpperCase() : 'A' }}</span>
        </q-avatar>
      </div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container>
      <q-page class="main-content-dark flex flex-center q-pa-md">
        
        <!-- RECUADRO CENTRAL -->
        <div class="mystic-floating-box shadow-24 animate-fade">
          <div class="row full-height items-stretch mobile-column-layout">
            
            <!-- PANEL IZQUIERDO: CONTROLES (Escritorio) -->
            <div class="col-12 col-md-4 sidebar-filters-mini q-pa-lg column gt-sm">
              
              <div class="header-section q-mb-lg">
                <div class="text-gold text-caption text-uppercase text-weight-bold tracking-widest opacity-80">Administración</div>
                <div class="text-h5 text-weight-bold text-white title-font q-mt-xs">Usuarios</div>
                <div class="header-line q-mt-sm" style="width: 40px; height: 2px; background: #d4af37;"></div>
              </div>

              <!-- Buscador Principal -->
              <div class="filter-group q-mb-md">
                <div class="text-amber-5 text-overline q-mb-xs opacity-70" style="font-size: 10px">Búsqueda rápida</div>
                <q-input 
                  v-model="filtro" 
                  dark dense filled 
                  placeholder="Buscar por nombre o email..." 
                  class="search-input-mystic-v4"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" color="amber-8" size="xs" />
                  </template>
                </q-input>
              </div>

              <!-- Filtro de Roles -->
              <div class="filter-group q-mb-md">
                <div class="text-amber-5 text-overline q-mb-xs opacity-70" style="font-size: 10px">Tipo de Usuario</div>
                <q-list dense class="role-list-mystic-mini">
                  <q-item 
                    clickable dense v-ripple 
                    :active="tabActual === 'todos'" 
                    @click="tabActual = 'todos'"
                    class="role-item-mini"
                    active-class="role-item-active"
                  >
                    <q-item-section avatar><q-icon name="groups" size="18px" /></q-item-section>
                    <q-item-section class="text-white">Todos los usuarios</q-item-section>
                  </q-item>
                  <q-item 
                    clickable dense v-ripple 
                    :active="tabActual === 'admin'" 
                    @click="tabActual = 'admin'"
                    class="role-item-mini"
                    active-class="role-item-active"
                  >
                    <q-item-section avatar><q-icon name="admin_panel_settings" size="18px" /></q-item-section>
                    <q-item-section class="text-white">Administradores</q-item-section>
                  </q-item>
                  <q-item 
                    clickable dense v-ripple 
                    :active="tabActual === 'usuarios'" 
                    @click="tabActual = 'usuarios'"
                    class="role-item-mini"
                    active-class="role-item-active"
                  >
                    <q-item-section avatar><q-icon name="person" size="18px" /></q-item-section>
                    <q-item-section class="text-white">Usuarios finales</q-item-section>
                  </q-item>
                </q-list>
              </div>

              <q-space />

              <q-btn 
                color="amber-10" 
                icon="person_add" 
                label="Registrar Usuario" 
                unelevated
                class="btn-gold-glow-v4 q-py-md text-weight-bold full-width"
                no-caps
                @click="abrirDialogoCrear"
              />
            </div>

            <!-- PANEL DERECHO: TABLA -->
            <div class="col-12 col-md-8 table-container-mystic-mini column no-wrap">
              <!-- Filtros para móviles -->
              <div class="q-pa-md gt-sm-hide">
                <q-input 
                  v-model="filtro" 
                  dark dense filled 
                  placeholder="Buscar usuarios..." 
                  class="search-input-mystic-v4 q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" color="amber-8" size="xs" />
                  </template>
                </q-input>
                <div class="row q-gutter-x-sm">
                  <q-select
                    v-model="tabActual"
                    :options="[
                      {label: 'Todos', value: 'todos'},
                      {label: 'Admins', value: 'admin'},
                      {label: 'Usuarios', value: 'usuarios'}
                    ]"
                    dark dense filled emit-value map-options
                    class="col"
                    bg-color="rgba(255,255,255,0.05)"
                  />
                </div>
              </div>

              <q-table
                :rows="usuariosFiltrados"
                :columns="columnas"
                row-key="_id"
                flat dark
                binary-state-sort
                :loading="loading"
                class="mystic-table-v4 col"
                :rows-per-page-options="[10, 20]"
                :grid="$q.screen.lt.md"
              >
                <!-- Cell: Nombre/Email (Solo para desktop) -->
                <template v-slot:body-cell-nombre="props" v-if="!$q.screen.lt.md">
                  <q-td :props="props">
                    <div class="row items-center q-gutter-x-md">
                      <q-avatar size="32px" class="avatar-table-mystic-mini">
                        <img v-if="props.row.avatar" :src="props.row.avatar">
                        <span v-else>{{ props.row.nombre.charAt(0).toUpperCase() }}</span>
                      </q-avatar>
                      <div class="column">
                        <span class="text-weight-bold text-white">{{ props.row.nombre }}</span>
                        <span class="text-caption text-amber-2 opacity-60">{{ props.row.email }}</span>
                      </div>
                    </div>
                  </q-td>
                </template>

                <!-- Diseño de Grid para Móviles -->
                <template v-slot:item="props" v-if="$q.screen.lt.md">
                  <div class="q-pa-xs col-xs-12 col-sm-6">
                    <q-card class="mystic-card-dark q-pa-md border-gold-subtle">
                      <div class="row items-center q-gutter-x-md q-mb-md">
                        <q-avatar size="40px" class="avatar-table-mystic-mini">
                          <img v-if="props.row.avatar" :src="props.row.avatar">
                          <span v-else>{{ props.row.nombre.charAt(0).toUpperCase() }}</span>
                        </q-avatar>
                        <div class="column">
                          <span class="text-weight-bold text-white">{{ props.row.nombre }}</span>
                          <span class="text-caption text-amber-2 opacity-60">{{ props.row.email }}</span>
                        </div>
                      </div>
                      
                      <div class="row justify-between items-center">
                        <q-badge :color="props.row.rol === 'admin' ? 'amber-10' : 'blue-9'" outline>
                          {{ props.row.rol === 'admin' ? 'ADMIN' : 'USUARIO' }}
                        </q-badge>
                        <div class="row items-center q-gutter-x-sm">
                          <q-icon name="circle" :color="props.row.estado === 'activo' ? 'green-5' : 'red-5'" size="10px" />
                          <span :class="props.row.estado === 'activo' ? 'text-green-5' : 'text-red-5'" class="text-weight-bold text-caption">
                            {{ props.row.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                          </span>
                        </div>
                      </div>

                      <q-separator dark class="q-my-sm opacity-20" />

                      <div class="row justify-end">
                        <q-btn flat round size="sm" color="amber-5" icon="edit" @click="abrirDialogoEditar(props.row)" />
                      </div>
                    </q-card>
                  </div>
                </template>

                <!-- Cell: Rol -->
                <template v-slot:body-cell-rol="props">
                  <q-td :props="props">
                    <q-badge 
                      :color="props.row.rol === 'admin' ? 'amber-10' : 'blue-9'" 
                      class="q-px-sm"
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
                      <q-icon name="circle" :color="props.row.estado === 'activo' ? 'green-5' : 'red-5'" size="10px" />
                      <span :class="props.row.estado === 'activo' ? 'text-green-5' : 'text-red-5'" class="text-weight-bold">
                        {{ props.row.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                      </span>
                    </div>
                  </q-td>
                </template>

                <!-- Acciones -->
                <template v-slot:body-cell-acciones="props">
                  <q-td :props="props" class="text-right">
                    <q-btn flat round size="sm" color="amber-5" icon="edit" @click="abrirDialogoEditar(props.row)" />
                  </q-td>
                </template>

                <!-- Loading State -->
                <template v-slot:loading>
                  <q-inner-loading showing dark class="bg-dark-overlay-v4">
                    <q-spinner-orbit color="amber-8" size="3em" />
                  </q-inner-loading>
                </template>
              </q-table>
            </div>

          </div>
        </div>

      </q-page>
    </q-page-container>

    <!-- DIÁLOGO DE CRUD -->
    <q-dialog v-model="modalAbierto" persistent backdrop-filter="blur(15px)">
      <q-card class="mystic-card-dark modal-form-mystic shadow-24 column no-wrap" style="max-height: 90vh; width: 850px; max-width: 95vw;">
        
        <q-card-section class="row items-center q-pb-none relative-position q-pt-lg q-px-xl shrink-0">
          <div class="column">
            <div class="text-gold text-overline tracking-widest">Administración de Usuarios</div>
            <div class="text-h5 title-font text-white">{{ editando ? 'Editar Usuario' : 'Registrar Nuevo Usuario' }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="amber-8" class="btn-close-mystic" />
          <div class="header-glow"></div>
        </q-card-section>

        <q-card-section class="q-pa-lg col scroll-area-mystic">
          <q-form ref="userForm" @submit.prevent="guardarUsuario" class="q-gutter-y-lg">
            
            <!-- SECCIÓN: INFORMACIÓN PERSONAL -->
            <div class="form-section-premium">
              <div class="section-header-mystic q-mb-lg">
                <q-icon name="person" color="amber-8" size="14px" class="q-mr-sm" />
                <span class="section-tag-mystic">Información de Usuario</span>
                <div class="header-underline-gradient"></div>
              </div>

              <div class="row q-col-gutter-lg">
                <div class="col-12 col-md-6">
                  <div class="input-wrapper-mystic">
                    <div class="input-label-mystic">Nombre Completo</div>
                    <q-input v-model="formUsuario.nombre" placeholder="Ej. Juan Pérez" dark borderless dense class="mystic-input-v2" hide-bottom-space :rules="[val => !!val || 'El nombre es obligatorio']">
                      <template v-slot:prepend>
                        <q-icon name="person" color="amber-8" size="20px" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-wrapper-mystic">
                    <div class="input-label-mystic">Email</div>
                    <q-input v-model="formUsuario.email" type="email" placeholder="correo@ejemplo.com" dark borderless dense class="mystic-input-v2" :disable="editando" hide-bottom-space :rules="[val => !!val || 'El correo es obligatorio']">
                      <template v-slot:prepend>
                        <q-icon name="alternate_email" color="amber-8" size="20px" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="col-12 col-md-6" v-if="!editando">
                  <div class="input-wrapper-mystic">
                    <div class="input-label-mystic">Contraseña</div>
                    <q-input v-model="formUsuario.password" :type="verPassword ? 'text' : 'password'" placeholder="••••••••" dark borderless dense class="mystic-input-v2" hide-bottom-space :rules="[val => !!val || 'La contraseña es obligatoria']">
                      <template v-slot:prepend>
                        <q-icon name="lock" color="amber-8" size="20px" />
                      </template>
                      <template v-slot:append>
                        <q-btn flat round dense :icon="verPassword ? 'visibility_off' : 'visibility'" color="amber-5" size="sm" @click="verPassword = !verPassword" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECCIÓN: CONFIGURACIÓN -->
            <div class="form-section-premium">
              <div class="section-header-mystic q-mb-lg">
                <q-icon name="admin_panel_settings" color="amber-8" size="14px" class="q-mr-sm" />
                <span class="section-tag-mystic">Configuración de Cuenta</span>
                <div class="header-underline-gradient"></div>
              </div>

              <div class="row q-col-gutter-lg">
                <div class="col-12 col-md-6">
                  <div class="input-wrapper-mystic">
                    <div class="input-label-mystic">Rol</div>
                    <q-select v-model="formUsuario.rol" :options="roleOptions" dark borderless dense emit-value map-options class="mystic-input-v2 q-select-mystic" popup-content-class="mystic-dropdown">
                      <template v-slot:prepend>
                        <q-icon name="shield" color="amber-8" size="20px" />
                      </template>
                    </q-select>
                  </div>
                </div>
                
                <div class="col-12 col-md-6">
                  <div class="input-wrapper-mystic">
                    <div class="input-label-mystic">Estado</div>
                    <q-select v-model="formUsuario.estado" :options="statusOptions" dark borderless dense emit-value map-options class="mystic-input-v2 q-select-mystic" popup-content-class="mystic-dropdown">
                      <template v-slot:prepend>
                        <q-icon name="toggle_on" color="amber-8" size="20px" />
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-wrapper-mystic">
                    <div class="input-label-mystic">Plan de Suscripción</div>
                    <q-select v-model="formUsuario.plan" :options="planOptions" dark borderless dense emit-value map-options class="mystic-input-v2 q-select-mystic" popup-content-class="mystic-dropdown">
                      <template v-slot:prepend>
                        <q-icon name="card_membership" color="amber-8" size="20px" />
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="input-wrapper-mystic">
                    <div class="input-label-mystic">País</div>
                    <q-input v-model="formUsuario.pais" placeholder="Ej. México" dark borderless dense class="mystic-input-v2" hide-bottom-space>
                      <template v-slot:prepend>
                        <q-icon name="public" color="amber-8" size="20px" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-section class="row justify-end q-pa-lg shrink-0 border-top-mystic">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup no-caps />
          <q-btn :label="editando ? 'Guardar Cambios' : 'Crear Usuario'" class="btn-gold-glow-v4 q-px-xl q-ml-md" unelevated no-caps @click="guardarUsuario" :loading="guardando" />
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
const filtroEstado = ref('todos')
const tabActual = ref('todos')
const usuarios = ref([])

const modalAbierto = ref(false)
const verPassword = ref(false)
const userForm = ref(null)
const editando = ref(false)
const usuarioIdActual = ref(null)

const formUsuario = reactive({
  nombre: '',
  email: '',
  password: '',
  rol: 'usuario',
  estado: 'activo',
  plan: 'gratuito',
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

const planOptions = [
  { label: 'Gratuito', value: 'gratuito' },
  { label: 'Místico', value: 'mistico' }
]

const genderOptions = [
  { label: 'Masculino', value: 'masculino' },
  { label: 'Femenino', value: 'femenino' },
  { label: 'Otro', value: 'otro' },
  { label: 'Prefiero no decirlo', value: 'prefiero no decirlo' }
]

const columnas = [
  { name: 'nombre', label: 'Nombre Completo', field: 'nombre', align: 'left', sortable: true },
  { name: 'rol', label: 'Rol', field: 'rol', align: 'left', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left', sortable: true },
  { name: 'acciones', label: 'Acciones', align: 'right' }
]

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
  Object.assign(formUsuario, { nombre: '', email: '', password: '', rol: 'usuario', estado: 'activo', plan: 'gratuito', genero: 'prefiero no decirlo', pais: '' })
  modalAbierto.value = true
}

const abrirDialogoEditar = (usuario) => {
  editando.value = true
  usuarioIdActual.value = usuario._id
  Object.assign(formUsuario, {
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    estado: usuario.estado || 'activo',
    plan: usuario.plan || 'gratuito',
    genero: usuario.genero || 'prefiero no decirlo',
    pais: usuario.pais || ''
  })
  modalAbierto.value = true
}

const guardarUsuario = async () => {
  const isValid = await userForm.value.validate()
  if (!isValid) return
  guardando.value = true
  try {
    if (editando.value) {
      const res = await api.put(`/usuarios/${usuarioIdActual.value}`, formUsuario)
      if (res.data.success) {
        $q.notify({ color: 'positive', message: 'Usuario actualizado correctamente' })
        obtenerUsuarios(); modalAbierto.value = false
      }
    } else {
      const endpoint = formUsuario.rol === 'admin' ? '/auth/crear-admin' : '/auth/registro'
      const res = await api.post(endpoint, formUsuario)
      if (res.data.success) {
        $q.notify({ color: 'positive', message: 'Nuevo usuario creado' })
        obtenerUsuarios(); modalAbierto.value = false
      }
    }
  } catch (err) {
    $q.notify({ color: 'negative', message: err.response?.data?.mensaje || 'Error en la operación' })
  } finally {
    guardando.value = false
  }
}

const usuariosFiltrados = computed(() => {
  let list = [...usuarios.value]
  if (tabActual.value === 'admin') list = list.filter(u => u.rol === 'admin')
  else if (tabActual.value === 'usuarios') list = list.filter(u => u.rol === 'usuario')
  if (filtroEstado.value !== 'todos') list = list.filter(u => u.estado === filtroEstado.value)
  const term = filtro.value.toLowerCase()
  if (term.length > 0) {
    list = list.filter(u => (u.nombre || '').toLowerCase().startsWith(term) || (u.email || '').toLowerCase().startsWith(term))
  }
  return list
})

const handleLogout = () => { authStore.logout(); router.push('/') }
onMounted(() => obtenerUsuarios())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.title-font { font-family: 'Playfair Display', serif; }
.text-gold { color: #d4af37; }

.main-content-dark { 
  height: 100vh; 
  background: radial-gradient(circle at center, #1a0f2e 0%, #0a0612 100%);
}

.mystic-floating-box {
  width: 95%;
  max-width: 1100px;
  height: 85vh;
  background: rgba(15, 10, 25, 0.85);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 24px;
  overflow: hidden;
}

@media (max-width: 1023px) {
  .mystic-floating-box {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    border: none;
  }
  .mobile-column-layout {
    flex-direction: column !important;
    overflow-y: auto !important;
  }
  .table-container-mystic-mini {
    height: auto !important;
    overflow: visible !important;
  }
}

.sidebar-filters-mini { 
  background: rgba(255, 255, 255, 0.02); 
  border-right: 1px solid rgba(212, 175, 55, 0.1);
}

.table-container-mystic-mini { background: transparent; }

/* TABLA Y GRID */
.mystic-table-v4 { background: transparent !important; }

/* FORZAR TARJETAS OSCURAS EN MÓVIL (1023px o menos) */
.mystic-table-v4 :deep(.q-table__grid-item-card),
.mystic-card-dark { 
  background: #160f24 !important; 
  background-image: radial-gradient(circle at top right, #1a0f2e, #0a0612) !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important; 
  border-radius: 20px !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
  color: white !important;
}

.mystic-table-v4 :deep(thead tr th) { 
  font-weight: 800; 
  text-transform: uppercase; 
  color: #d4af37; 
  border-bottom: 1px solid rgba(212, 175, 55, 0.2); 
}

.mystic-table-v4 :deep(tbody tr td) {
  color: #ffffff !important;
  background: transparent !important;
}

.mystic-table-v4 :deep(.q-table__card) {
  background: transparent !important;
  box-shadow: none !important;
}

.mystic-table-v4 :deep(tr:hover) {
  background: rgba(255, 255, 255, 0.03) !important;
}

/* OTROS ESTILOS */
.search-input-mystic-v4 :deep(.q-field__control) { 
  border-radius: 10px; 
  background: rgba(255, 255, 255, 0.05) !important; 
}

.role-item-mini { border-radius: 8px; margin-bottom: 6px; color: #a094b8; }
.role-item-active { background: rgba(212, 175, 55, 0.2) !important; color: #d4af37 !important; border: 1px solid rgba(212, 175, 55, 0.3); font-weight: bold; }

.status-toggle-container-v2 { background: rgba(255, 255, 255, 0.03); padding: 6px; border-radius: 14px; border: 1px solid rgba(212, 175, 55, 0.15); }
.mystic-toggle-v5 { background: transparent; }
.mystic-toggle-v5 :deep(.q-btn) { border-radius: 10px !important; margin: 0 2px; transition: all 0.3s ease; font-weight: bold; }

.btn-gold-glow-v4 { background: linear-gradient(45deg, #d4af37, #b8860b); color: #0a0612; border-radius: 12px; box-shadow: 0 0 20px rgba(212, 175, 55, 0.2); }
.avatar-table-mystic-mini { border: 1px solid #d4af37; background: #1a0f2e; color: #d4af37; }

.avatar-mystic-trigger { background: #1a0f2e; border: 2px solid #d4af37; color: #d4af37; font-weight: bold; position: relative; z-index: 2; }
.sidebar-mystic { background: #110a1f !important; border-right: 1px solid rgba(212, 175, 55, 0.2); }
.nav-item { border-radius: 10px; margin-bottom: 4px; color: #a094b8; }
.nav-active { background: rgba(212, 175, 55, 0.1) !important; color: #d4af37 !important; border: 1px solid rgba(212, 175, 55, 0.2); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade { animation: fadeIn 0.6s ease-out forwards; }

.header-glow { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 150px; height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent); box-shadow: 0 0 20px #d4af37; }

.scroll-area-mystic { overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(212, 175, 55, 0.3) transparent; padding-right: 8px; }
.scroll-area-mystic::-webkit-scrollbar { width: 6px; }
.scroll-area-mystic::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 10px; }

.border-top-mystic { border-top: 1px solid rgba(212, 175, 55, 0.2); background: rgba(10, 6, 18, 0.95); backdrop-filter: blur(10px); z-index: 10; }

.btn-close-mystic { transition: all 0.3s ease; }
.btn-close-mystic:hover { transform: rotate(90deg); background: rgba(212, 175, 55, 0.1); }

.pulse-ring { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px solid #d4af37; animation: pulse-mystic 2s infinite; }
@keyframes pulse-mystic { 0% { transform: scale(0.9); opacity: 1; } 70% { transform: scale(1.2); opacity: 0; } 100% { transform: scale(0.9); opacity: 0; } }

.mystic-dropdown { background: #110a1f !important; border: 1px solid #d4af37 !important; border-radius: 12px !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important; }
.section-tag-mystic { color: #d4af37; font-weight: bold; text-transform: uppercase; font-size: 11px; }

.form-section-premium { background: rgba(255, 255, 255, 0.03); padding: 24px; border-radius: 16px; border: 1px solid rgba(212, 175, 55, 0.1); }
.input-label-mystic { color: #d4af37; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; opacity: 0.9; }
.mystic-input-v2 { background: rgba(255, 255, 255, 0.05) !important; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 4px 12px; transition: all 0.3s ease; }
.mystic-input-v2:focus-within { border-color: #d4af37; background: rgba(212, 175, 55, 0.05) !important; box-shadow: 0 0 15px rgba(212, 175, 55, 0.1); }
.mystic-input-v2 :deep(.q-field__native), .mystic-input-v2 :deep(.q-field__input) { color: #ffffff !important; }
.mystic-input-v2 :deep(.q-placeholder) { color: rgba(255, 255, 255, 0.4) !important; }
.header-underline-gradient { height: 2px; width: 60px; background: linear-gradient(90deg, #d4af37, transparent); margin-top: 4px; }
</style>
