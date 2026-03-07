<template>
  <q-layout view="lHh Lpr lFf" class="mystic-dark-layout">

    <!-- SIDEBAR (Oculto por defecto) -->
    <q-drawer
      v-model="drawer"
      side="left"
      overlay
      behavior="mobile"
      :width="280"
      class="sidebar-mystic"
    >
      <div class="sidebar-content column full-height">
        <div class="column items-center q-py-xl sidebar-header">
          <q-avatar size="80px" class="avatar-mystic-static q-mb-md">
            <img v-if="user.avatar" :src="user.avatar">
            <span v-else>{{ user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U' }}</span>
          </q-avatar>
          <div class="text-gold text-h6 title-font">{{ user.nombre }}</div>
          <q-btn flat round icon="close" color="gold" class="absolute-top-right q-ma-sm" @click="drawer = false" />
        </div>

        <q-separator color="rgba(212, 175, 55, 0.2)" inset />

        <q-list padding class="q-px-md q-mt-md">
          <q-item clickable class="nav-item" @click="router.push('/perfil')">
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>Mi Perfil</q-item-section>
          </q-item>
          <q-item clickable class="nav-item" @click="router.push('/lecturas')">
            <q-item-section avatar><q-icon name="menu_book" /></q-item-section>
            <q-item-section>Lecturas</q-item-section>
          </q-item>
          <q-item clickable class="nav-item" @click="router.push('/planes')">
            <q-item-section avatar><q-icon name="stars" /></q-item-section>
            <q-item-section>Planes</q-item-section>
          </q-item>
          <q-item clickable class="nav-item" @click="router.push('/historial')">
            <q-item-section avatar><q-icon name="history_edu" /></q-item-section>
            <q-item-section>Historial</q-item-section>
          </q-item>
          <q-item clickable active-class="nav-active" active class="nav-item">
            <q-item-section avatar><q-icon name="settings" /></q-item-section>
            <q-item-section>Configuración</q-item-section>
          </q-item>
        </q-list>

        <q-space />
        <div class="q-pa-md">
          <q-btn flat no-caps color="red-4" icon="logout" label="Cerrar Portal" class="full-width logout-btn" @click="handleLogout" />
        </div>
      </div>
    </q-drawer>

    <!-- BOTÓN AVATAR FLOTANTE -->
    <div v-if="!drawer" class="fixed-top-left z-top q-ma-lg">
      <div class="avatar-trigger-wrapper">
        <div class="pulse-ring"></div>
        <q-avatar size="64px" class="avatar-mystic-trigger cursor-pointer shadow-10" @click="drawer = true">
          <img v-if="user.avatar" :src="user.avatar">
          <span v-else>{{ user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U' }}</span>
        </q-avatar>
      </div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container>
      <q-page class="main-content-dark">
        <div class="container scroll-area">
          
          <div class="row q-mb-lg">
            <div class="animate-fade">
              <div class="text-gold text-caption text-uppercase text-weight-bold tracking-widest opacity-80">Ajustes del Oráculo</div>
              <div class="text-h3 text-weight-bold text-white title-font">Configuración</div>
            </div>
          </div>

          <div class="row q-col-gutter-lg">
            <!-- SECCIÓN: PERFIL PÚBLICO -->
            <div class="col-12 col-md-7">
              <q-card class="mystic-card-dark">
                <q-card-section>
                  <div class="text-h6 text-gold q-mb-md flex items-center">
                    <q-icon name="edit" class="q-mr-sm" /> Datos del Avatar
                  </div>
                  
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6">
                      <q-input dark filled v-model="profileForm.nombre" label="Nombre" color="amber" />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-select dark filled v-model="profileForm.genero" :options="generos" label="Género" color="amber" />
                    </div>
                    
                    <!-- CARGA DE ARCHIVO PARA AVATAR -->
                    <div class="col-12">
                      <div class="row items-center q-col-gutter-md">
                        <div class="col-auto">
                          <q-avatar size="80px" class="avatar-mystic-static">
                            <img v-if="profileForm.avatar" :src="profileForm.avatar">
                            <span v-else>{{ profileForm.nombre ? profileForm.nombre.charAt(0).toUpperCase() : '?' }}</span>
                          </q-avatar>
                        </div>
                        <div class="col">
                          <q-file
                            dark filled
                            v-model="avatarFile"
                            label="Subir foto de perfil"
                            accept=".jpg, .jpeg, .png, .webp"
                            max-file-size="2048000"
                            color="amber"
                            @update:model-value="onFileSelected"
                            @rejected="onFileRejected"
                          >
                            <template v-slot:prepend>
                              <q-icon name="cloud_upload" />
                            </template>
                            <template v-if="profileForm.avatar" v-slot:append>
                              <q-icon name="close" @click.stop="profileForm.avatar = ''; avatarFile = null" class="cursor-pointer" />
                            </template>
                          </q-file>
                          <div class="text-caption text-grey-5 q-mt-xs">Máximo 2MB. Formatos: JPG, PNG, WEBP.</div>
                        </div>
                      </div>
                    </div>

                    <div class="col-12">
                      <q-btn 
                        label="Guardar Cambios" 
                        color="amber-9" 
                        class="full-width" 
                        unelevated 
                        @click="updateProfile"
                        :loading="userStore.loading"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- SECCIÓN: SEGURIDAD -->
            <div class="col-12 col-md-5">
              <q-card class="mystic-card-dark">
                <q-card-section>
                  <div class="text-h6 text-gold q-mb-md flex items-center">
                    <q-icon name="lock" class="q-mr-sm" /> Seguridad
                  </div>
                  <q-form class="q-gutter-sm">
                    <q-input 
                      dark filled 
                      v-model="passForm.passwordActual" 
                      :type="showPassActual ? 'text' : 'password'" 
                      label="Contraseña Actual" 
                      color="amber"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="showPassActual ? 'visibility' : 'visibility_off'"
                          class="cursor-pointer"
                          @click="showPassActual = !showPassActual"
                        />
                      </template>
                    </q-input>

                    <q-input 
                      dark filled 
                      v-model="passForm.nuevaPassword" 
                      :type="showPassNueva ? 'text' : 'password'" 
                      label="Nueva Contraseña" 
                      color="amber"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="showPassNueva ? 'visibility' : 'visibility_off'"
                          class="cursor-pointer"
                          @click="showPassNueva = !showPassNueva"
                        />
                      </template>
                    </q-input>
                    <q-btn 
                      label="Actualizar Contraseña" 
                      color="indigo-7" 
                      class="full-width q-mt-md" 
                      unelevated 
                      @click="updatePassword"
                      :loading="userStore.loading"
                    />
                  </q-form>
                </q-card-section>
              </q-card>
            </div>

            <!-- SECCIÓN: MEMBRESÍA -->
            <div class="col-12 col-md-6">
              <q-card class="mystic-card-dark full-height">
                <q-card-section>
                  <div class="text-h6 text-gold q-mb-md flex items-center">
                    <q-icon name="credit_card" class="q-mr-sm" /> Suscripción
                  </div>
                  <div class="data-box-dark q-mb-md">
                    <div class="text-overline text-amber">Estado de Conexión</div>
                    <div class="text-h5 text-white">{{ user.estado === 'activo' ? 'Plan Místico Activo' : 'Sin Plan Activo' }}</div>
                  </div>
                  <p class="text-grey-5 text-body2">
                    {{ user.estado === 'activo' ? 'Tu suscripción está vinculada a las estrellas. Puedes cancelarla en cualquier momento.' : 'Aún no has activado tu suscripción mística.' }}
                  </p>
                  <q-btn 
                    v-if="user.estado === 'activo'" 
                    outline color="red-5" 
                    label="Cancelar Plan de Pago" 
                    class="full-width q-mt-sm" 
                    no-caps 
                  />
                  <q-btn 
                    v-else 
                    color="amber-9" 
                    label="Ver Planes Disponibles" 
                    class="full-width q-mt-sm" 
                    @click="router.push('/planes')" 
                    unelevated 
                  />
                </q-card-section>
              </q-card>
            </div>

            <!-- SECCIÓN: ZONA DE PELIGRO -->
            <div class="col-12 col-md-6">
              <q-card class="mystic-card-dark border-red full-height">
                <q-card-section>
                  <div class="text-h6 text-red-4 q-mb-md flex items-center">
                    <q-icon name="warning" class="q-mr-sm" /> Zona de Peligro
                  </div>
                  <p class="text-grey-5">Eliminar tu cuenta borrará permanentemente todo tu historial de lecturas y datos del oráculo.</p>
                  <q-btn 
                    color="red-9" 
                    label="Eliminar Cuenta Permanentemente" 
                    class="full-width q-mt-md" 
                    no-caps 
                    unelevated 
                    @click="confirmDelete"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>

        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()
const drawer = ref(false)

const user = computed(() => authStore.user || {})
const generos = ['masculino', 'femenino', 'otro', 'prefiero no decirlo']

const profileForm = reactive({
  nombre: '',
  genero: '',
  avatar: ''
})

const avatarFile = ref(null)

const passForm = reactive({
  passwordActual: '',
  nuevaPassword: ''
})

const showPassActual = ref(false)
const showPassNueva = ref(false)

onMounted(() => {
  if (user.value) {
    profileForm.nombre = user.value.nombre || ''
    profileForm.genero = user.value.genero || 'prefiero no decirlo'
    profileForm.avatar = user.value.avatar || ''
  }
})

// Función para procesar el archivo seleccionado
const onFileSelected = (file) => {
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    // e.target.result contiene la cadena Base64
    profileForm.avatar = e.target.result
  }
  reader.readAsDataURL(file)
}

const onFileRejected = (rejectedEntries) => {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} archivo(s) rechazado(s). Asegúrate de que sean imágenes de máximo 2MB.`
  })
}

const updateProfile = async () => {
  const res = await userStore.actualizarPerfil(profileForm)
  if (res.success) {
    $q.notify({ color: 'positive', message: 'Perfil actualizado con éxito', icon: 'check' })
    avatarFile.value = null // Limpiar el selector después de guardar
  } else {
    $q.notify({ color: 'negative', message: res.mensaje, icon: 'error' })
  }
}

const updatePassword = async () => {
  if (!passForm.passwordActual || !passForm.nuevaPassword) {
    $q.notify({ color: 'warning', message: 'Completa ambos campos de contraseña' })
    return
  }
  const res = await userStore.cambiarPassword(passForm)
  if (res.success) {
    $q.notify({ color: 'positive', message: 'Contraseña actualizada', icon: 'lock' })
    passForm.passwordActual = ''
    passForm.nuevaPassword = ''
  } else {
    $q.notify({ color: 'negative', message: res.mensaje, icon: 'error' })
  }
}

const confirmDelete = () => {
  $q.dialog({
    title: '¿Eliminar Cuenta?',
    message: 'Esta acción es irreversible y perderás todo tu progreso místico.',
    cancel: true,
    persistent: true,
    ok: { color: 'red-9', label: 'Eliminar definitivamente' },
    dark: true
  }).onOk(async () => {
    const res = await userStore.eliminarCuenta()
    if (res.success) {
      router.push('/')
      $q.notify({ color: 'info', message: 'Cuenta eliminada. Hasta pronto, viajero.' })
    } else {
      $q.notify({ color: 'negative', message: res.mensaje })
    }
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.title-font { font-family: 'Playfair Display', serif; }
.text-gold { color: #d4af37; }

.mystic-dark-layout { background: #0a0612; color: #e0e0e0; height: 100vh; overflow: hidden; }
.main-content-dark { 
  height: 100vh; overflow: hidden;
  background-image: radial-gradient(circle at 0% 0%, rgba(115, 17, 212, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
}

.container { max-width: 1000px; margin: auto; padding: 20px 24px; height: 100%; display: flex; flex-direction: column; justify-content: center; }
.scroll-area { overflow-y: auto; max-height: 100vh; padding-bottom: 40px; }

/* Sidebar */
.sidebar-mystic { background: #110a1f !important; color: #e0d5f5; border-right: none !important; }
.nav-item { border-radius: 10px; margin-bottom: 6px; color: #a094b8; }
.nav-active { background: rgba(212, 175, 55, 0.1) !important; color: #d4af37 !important; border: 1px solid rgba(212, 175, 55, 0.2); }

/* Avatar Trigger */
.avatar-trigger-wrapper { position: relative; display: inline-block; }
.avatar-mystic-trigger { background: #110a1f; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; overflow: hidden; }
.pulse-ring { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 4px solid #d4af37; animation: pulse-gold 2s infinite; }
@keyframes pulse-gold { 0% { transform: scale(0.9); opacity: 1; } 70% { transform: scale(1.2); opacity: 0; } 100% { transform: scale(0.9); opacity: 0; } }
.avatar-mystic-static { background: #1a0f2e; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; overflow: hidden; }

/* Cards */
.mystic-card-dark { border-radius: 20px; background: #160f24; border: 1px solid rgba(255, 255, 255, 0.05); }
.border-red { border: 1px solid rgba(244, 67, 54, 0.3); }
.data-box-dark { background: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade { animation: fadeIn 0.8s ease-out; }

/* Custom Scrollbar for the dark theme - HIDDEN */
.scroll-area::-webkit-scrollbar { 
  display: none;
  width: 0;
}
.scroll-area {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
