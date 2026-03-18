<template>
  <q-layout view="lHh Lpr lFf" class="mystic-dark-layout">
    
    <!-- SIDEBAR (Administración) -->
    <q-drawer v-model="drawer" side="left" overlay behavior="mobile" :width="280" class="sidebar-mystic">
      <div class="sidebar-content column full-height">
        <div class="column items-center q-py-xl sidebar-header">
          <q-avatar size="80px" class="avatar-mystic-static q-mb-md">
            <img v-if="user.avatar" :src="user.avatar">
            <span v-else>{{ user.nombre ? user.nombre.charAt(0).toUpperCase() : 'A' }}</span>
          </q-avatar>
          <div class="text-gold text-h6 title-font">{{ user.nombre }}</div>
          <div class="text-grey-5 text-caption">Administrador</div>
          
          <q-btn flat round icon="close" color="gold" class="absolute-top-right q-ma-sm" @click="drawer = false" />
        </div>

        <q-separator color="rgba(212, 175, 55, 0.2)" inset />

        <q-list padding class="q-px-md q-mt-md">
          <q-item clickable class="nav-item" @click="router.push('/GestionUsuarios')">
            <q-item-section avatar><q-icon name="people" /></q-item-section>
            <q-item-section>Gestión de Usuarios</q-item-section>
          </q-item>

          <q-item clickable class="nav-item" @click="router.push('/GestionPlanes')">
            <q-item-section avatar><q-icon name="card_membership" /></q-item-section>
            <q-item-section>Gestión de Planes</q-item-section>
          </q-item>

          <q-separator color="rgba(212, 175, 55, 0.1)" class="q-my-md" />

          <q-item clickable active-class="nav-active" active class="nav-item">
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
          <img v-if="user.avatar" :src="user.avatar">
          <span v-else>{{ user.nombre ? user.nombre.charAt(0).toUpperCase() : 'A' }}</span>
        </q-avatar>
      </div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container>
      <q-page class="main-content-dark">
        <div class="container animate-fade">
          
          <div class="row q-mb-lg">
            <div>
              <div class="text-gold text-caption text-uppercase text-weight-bold tracking-widest opacity-80">Administrador del Portal</div>
              <div class="text-h3 text-weight-bold text-white title-font">Mi Perfil Administrativo</div>
            </div>
          </div>

          <div class="row q-col-gutter-lg">
            <!-- Datos Personales -->
            <div class="col-12 col-md-7">
              <q-card class="mystic-card-dark">
                <q-card-section class="q-pa-xl">
                  <div class="text-h6 text-gold q-mb-xl">Datos Personales</div>
                  
                  <q-form @submit.prevent="updateProfile" class="q-gutter-y-lg">
                    <q-input v-model="form.nombre" label="Nombre Completo" dark filled dense label-color="amber-5" class="mystic-input" />
                    <q-input v-model="form.email" label="Correo Electrónico" dark filled dense label-color="amber-5" class="mystic-input" disable />
                    
                    <div class="row items-center q-col-gutter-md q-mt-md">
                      <div class="col-auto">
                        <q-avatar size="100px" class="avatar-mystic-static">
                          <img v-if="form.avatar" :src="form.avatar">
                          <span v-else>{{ form.nombre ? form.nombre.charAt(0).toUpperCase() : 'A' }}</span>
                        </q-avatar>
                      </div>
                      <div class="col">
                        <q-file dark filled dense v-model="tempFile" label="Cambiar imagen de perfil" accept="image/*" @update:model-value="onFileSelected" class="mystic-input" />
                      </div>
                    </div>

                    <div class="row justify-end q-mt-xl">
                      <q-btn label="Actualizar Mis Datos" class="btn-gold-glow q-px-xl" unelevated no-caps type="submit" :loading="loading" />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </div>

            <!-- Seguridad -->
            <div class="col-12 col-md-5">
              <q-card class="mystic-card-dark">
                <q-card-section class="q-pa-xl">
                  <div class="text-h6 text-gold q-mb-xl">Seguridad</div>
                  
                  <q-form @submit.prevent="updatePassword" class="q-gutter-y-md">
                    <q-input v-model="passForm.passwordActual" label="Contraseña Actual" type="password" dark filled dense label-color="amber-5" class="mystic-input" />
                    <q-input v-model="passForm.nuevaPassword" label="Nueva Contraseña" type="password" dark filled dense label-color="amber-5" class="mystic-input" />
                    
                    <div class="row justify-end q-mt-xl">
                      <q-btn label="Cambiar Contraseña" color="indigo-9" unelevated no-caps type="submit" class="full-width" :loading="loading" />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>

              <q-card class="mystic-card-dark q-mt-lg">
                <q-card-section class="q-pa-lg text-center">
                  <div class="text-grey-5 text-caption">Nivel de Acceso</div>
                  <q-badge color="amber-10" label="Súper Administrador" class="q-mt-sm q-px-md q-py-xs" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

const drawer = ref(false)
const loading = ref(false)
const tempFile = ref(null)

const user = computed(() => authStore.user || {})

const form = reactive({
  nombre: '',
  email: '',
  avatar: ''
})

const passForm = reactive({
  passwordActual: '',
  nuevaPassword: ''
})

onMounted(() => {
  form.nombre = user.value.nombre
  form.email = user.value.email
  form.avatar = user.value.avatar
})

const onFileSelected = (file) => {
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => { form.avatar = e.target.result }
  reader.readAsDataURL(file)
}

const updateProfile = async () => {
  loading.value = true
  const res = await userStore.actualizarPerfil({ nombre: form.nombre, avatar: form.avatar })
  loading.value = false
  if (res.success) $q.notify({ color: 'positive', message: 'Perfil administrativo actualizado', icon: 'check' })
  else $q.notify({ color: 'negative', message: res.mensaje })
}

const updatePassword = async () => {
  if (!passForm.passwordActual || !passForm.nuevaPassword) return
  loading.value = true
  const res = await userStore.cambiarPassword(passForm)
  loading.value = false
  if (res.success) {
    $q.notify({ color: 'positive', message: 'Contraseña cambiada con éxito', icon: 'lock' })
    passForm.passwordActual = ''
    passForm.nuevaPassword = ''
  } else $q.notify({ color: 'negative', message: res.mensaje })
}

const handleLogout = () => { authStore.logout(); router.push('/') }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.title-font { font-family: 'Playfair Display', serif; }
.text-gold { color: #d4af37; }

.mystic-dark-layout { background: #0a0612; color: #e0e0e0; height: 100vh; overflow: hidden; }
.main-content-dark { 
  height: 100vh; overflow-y: auto;
  background-image: radial-gradient(circle at 0% 0%, rgba(115, 17, 212, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
}

.container { max-width: 1100px; margin: auto; padding: 60px 24px; }

/* Sidebar */
.sidebar-mystic { background: #110a1f !important; border-right: 1px solid rgba(212, 175, 55, 0.2); }
.nav-item { border-radius: 10px; margin-bottom: 4px; color: #a094b8; transition: 0.3s; }
.nav-active { background: rgba(212, 175, 55, 0.1) !important; color: #d4af37 !important; border: 1px solid rgba(212, 175, 55, 0.2); }

/* Avatar Trigger */
.avatar-mystic-trigger { background: #110a1f; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; position: relative; z-index: 2; }
.pulse-ring { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 4px solid #d4af37; animation: pulse-gold 2s infinite; }
@keyframes pulse-gold { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } }
.avatar-mystic-static { background: #1a0f2e; border: 1px solid #d4af37; color: #d4af37; font-weight: 900; }

/* Cards & Inputs */
.mystic-card-dark { border-radius: 24px; background: rgba(22, 15, 36, 0.6); border: 1px solid rgba(212, 175, 55, 0.1); }
.mystic-input :deep(.q-field__control) { border-radius: 12px; background: rgba(255, 255, 255, 0.03) !important; border: 1px solid rgba(212, 175, 55, 0.2); }

.btn-gold-glow {
  background: linear-gradient(45deg, #d4af37, #b8860b);
  color: #0a0612;
  font-weight: 800;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade { animation: fadeIn 0.8s ease-out forwards; }
</style>