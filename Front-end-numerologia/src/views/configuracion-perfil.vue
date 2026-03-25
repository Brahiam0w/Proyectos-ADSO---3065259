<template>
  <q-layout view="lHh Lpr lFf" class="mystic-dark-layout">

    <!-- SIDEBAR -->
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
          <q-avatar size="80px" class="avatar-mystic-static q-mb-md shadow-10">
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
        <div class="container scroll-area q-py-lg">
          
          <!-- Encabezado Elegante -->
          <div class="header-section q-mb-md text-center animate-fade">
            <div class="text-gold text-caption text-uppercase text-weight-bold tracking-widest opacity-80 q-mb-xs">Personalización del Destino</div>
            <div class="text-h4 text-weight-bold text-white title-font">Configuración</div>
            <div class="header-line q-mx-auto q-mt-sm"></div>
          </div>

          <div class="row justify-center q-col-gutter-md">
            
            <!-- SECCIÓN: PERFIL -->
            <div class="col-12 col-lg-10">
              <q-card class="mystic-card-dark glass-effect border-gold-soft">
                <q-card-section class="q-pa-lg">
                  <div class="row q-col-gutter-lg items-center">
                    
                    <!-- Avatar Upload -->
                    <div class="col-12 col-md-4 text-center">
                      <div class="avatar-upload-wrapper">
                        <q-avatar size="100px" class="avatar-mystic-static shadow-24 q-mb-md border-gold">
                          <img v-if="profileForm.avatar" :src="profileForm.avatar">
                          <span v-else class="text-h4">{{ profileForm.nombre ? profileForm.nombre.charAt(0).toUpperCase() : '?' }}</span>
                          
                          <q-btn 
                            round color="amber-10" icon="photo_camera" size="xs" 
                            class="absolute-bottom-right shadow-10"
                            @click="$refs.avatarInput.pickFiles()"
                          />
                        </q-avatar>
                        
                        <q-file
                          ref="avatarInput"
                          v-model="avatarFile"
                          accept=".jpg, .jpeg, .png, .webp"
                          style="display: none"
                          @update:model-value="onFileSelected"
                        />
                        <div class="text-gold text-caption text-weight-bold">Transmutar imagen</div>
                      </div>
                    </div>

                    <!-- Profile Form -->
                    <div class="col-12 col-md-8">
                      <div class="text-h6 text-gold q-mb-md title-font flex items-center">
                        <q-icon name="auto_fix_normal" class="q-mr-sm" /> Identidad en el Oráculo
                      </div>
                      
                      <q-form ref="profileFormRef" @submit.prevent="updateProfile" class="row q-col-gutter-md">
                        <div class="col-12 col-sm-6">
                          <q-input 
                            dark filled dense
                            v-model="profileForm.nombre" 
                            label="Nombre de Iniciado" 
                            color="amber" 
                            bg-color="rgba(255,255,255,0.03)"
                            class="mystic-input"
                            :rules="[val => !!val || 'El nombre es obligatorio']"
                          />
                        </div>
                        <div class="col-12 col-sm-6">
                          <q-select 
                            dark filled dense
                            v-model="profileForm.genero" 
                            :options="generos" 
                            label="Esencia (Género)" 
                            color="amber" 
                            bg-color="rgba(255,255,255,0.03)"
                            class="mystic-input"
                            :rules="[val => !!val || 'El género es obligatorio']"
                          />
                        </div>
                        
                        <div class="col-12">
                          <q-btn 
                            type="submit"
                            label="Actualizar Identidad" 
                            color="amber-10" 
                            class="full-width mystic-btn-glow" 
                            unelevated 
                            no-caps
                            size="md"
                            :loading="userStore.loading"
                          />
                        </div>
                      </q-form>
                    </div>

                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- SECCIÓN INF: MEMBRESÍA Y ZONA DE PELIGRO -->
            <div class="col-12 col-lg-10">
              <div class="row q-col-gutter-md">
                
                <!-- MEMBRESÍA -->
                <div class="col-12 col-md-6">
                  <q-card class="mystic-card-dark glass-effect border-gold-soft">
                    <q-card-section class="q-pa-md">
                      <div class="text-subtitle1 text-gold q-mb-sm flex items-center title-font">
                        <q-icon name="stars" class="q-mr-sm" /> Vínculo Cósmico
                      </div>
                      
                      <div class="status-box q-mb-md q-pa-sm">
                        <div class="text-overline text-amber opacity-70" style="line-height: 1">Estado</div>
                        <div class="row items-center justify-between">
                          <div class="text-subtitle1 text-white">{{ user.plan === 'mistico' ? 'Plan Místico' : 'Plan Estelar' }}</div>
                          <q-badge :color="user.plan === 'mistico' ? 'amber-10' : 'grey-8'" class="q-px-sm">
                            {{ user.plan === 'mistico' ? 'ACTIVO' : 'BÁSICO' }}
                          </q-badge>
                        </div>
                      </div>
                      
                      <p class="text-grey-5 text-caption q-mb-sm">
                        {{ user.plan === 'mistico' ? 'Acceso ilimitado a los secretos del universo.' : 'Desbloquee su potencial con el Plan Místico.' }}
                      </p>
                      
                      <q-btn 
                        v-if="user.plan === 'mistico'" 
                        flat color="red-5" dense
                        label="Suspender Vínculo" 
                        class="full-width" 
                        no-caps 
                        @click="confirmarSuspenderPlan"
                        :loading="userStore.loading"
                      />
                      <q-btn 
                        v-else 
                        color="amber-9" dense
                        label="Elevar mi Plan" 
                        class="full-width mystic-btn-glow" 
                        @click="router.push('/planes')" 
                        unelevated 
                        no-caps
                      />
                    </q-card-section>
                  </q-card>
                </div>

                <!-- ZONA DE PELIGRO -->
                <div class="col-12 col-md-6">
                  <q-card class="mystic-card-dark glass-effect border-red-soft">
                    <q-card-section class="q-pa-md">
                      <div class="text-subtitle1 text-red-4 q-mb-sm flex items-center title-font">
                        <q-icon name="warning_amber" class="q-mr-sm" /> Sendero del Olvido
                      </div>
                      <p class="text-grey-5 text-caption q-mb-md">Si decide borrar su rastro, perderá permanentemente su historial. Esta acción es irrevocable.</p>
                      
                      <q-btn 
                        outline color="red-9" dense
                        label="Eliminar Cuenta" 
                        class="full-width q-mt-xs" 
                        no-caps 
                        unelevated 
                        @click="confirmDelete"
                      />
                    </q-card-section>
                  </q-card>
                </div>

              </div>
            </div>

          </div>

          <div class="text-center q-mt-md opacity-30">
            <q-icon name="auto_awesome" size="md" color="gold" />
          </div>

        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()
const drawer = ref(false)

const profileFormRef = ref(null)

const user = computed(() => authStore.user || {})
const generos = ['masculino', 'femenino', 'otro', 'prefiero no decirlo']

const profileForm = reactive({
  nombre: '',
  genero: '',
  avatar: ''
})

const avatarFile = ref(null)

// Sincronizar formulario con datos de la base de datos
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    profileForm.nombre = newUser.nombre || ''
    profileForm.genero = newUser.genero || 'prefiero no decirlo'
    profileForm.avatar = newUser.avatar || ''
  }
}, { immediate: true })

const onFileSelected = (file) => {
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    profileForm.avatar = e.target.result
  }
  reader.readAsDataURL(file)
}

const updateProfile = async () => {
  const isValid = await profileFormRef.value.validate()
  if (!isValid) return

  const res = await userStore.actualizarPerfil(profileForm)
  if (res.success) {
    $q.notify({ 
      color: 'positive', 
      message: 'Su identidad ha sido actualizada en las estrellas', 
      icon: 'auto_fix_high',
      position: 'top-right'
    })
    avatarFile.value = null
  } else {
    $q.notify({ color: 'negative', message: res.mensaje, icon: 'error' })
  }
}

const confirmarSuspenderPlan = () => {
  $q.dialog({
    title: `
      <div class="column items-center q-gutter-sm">
        <q-icon name="auto_awesome_motion" color="amber-10" size="48px" class="q-mb-sm" />
        <div class="text-amber-10 title-font text-h5 text-center">¿Desvanecer el Vínculo Místico?</div>
      </div>
    `,
    message: `
      <div class="text-center q-pa-md">
        <p class="text-grey-4 text-body1 leading-relaxed">
          Al suspender su <span class="text-amber-10 text-weight-bold">Plan Místico</span>, las puertas del conocimiento profundo se cerrarán parcialmente.
        </p>
        <p class="text-grey-5 text-caption q-mt-md italic">
          Perderá el acceso a las lecturas avanzadas e ilimitadas y regresará al Plan Estelar Gratuito.
        </p>
      </div>
    `,
    cancel: { 
      flat: true, 
      color: 'grey-6', 
      label: 'Mantener Vínculo',
      noCaps: true,
      class: 'q-px-lg'
    },
    persistent: true,
    ok: { 
      color: 'amber-10', 
      label: 'Confirmar Suspensión', 
      unelevated: true,
      noCaps: true,
      class: 'mystic-btn-glow q-px-xl'
    },
    dark: true,
    html: true,
    class: 'mystic-card-dark glass-effect border-gold-soft'
  }).onOk(async () => {
    const res = await userStore.suspenderPlan()
    if (res.success) {
      $q.notify({ 
        color: 'info', 
        message: 'Su vínculo ha regresado al estado básico.', 
        icon: 'stars',
        position: 'top-right'
      })
    } else {
      $q.notify({ color: 'negative', message: res.mensaje })
    }
  })
}

const confirmDelete = () => {
  $q.dialog({
    title: '<div class="text-red-5 title-font">¿Desea borrar su rastro?</div>',
    message: 'Esta acción es irreversible y perderá todo su progreso místico y lecturas guardadas.',
    cancel: { flat: true, color: 'grey-5', label: 'Seguir en el portal' },
    persistent: true,
    ok: { color: 'red-9', label: 'Borrar rastro permanentemente', unelevated: true },
    dark: true,
    html: true
  }).onOk(async () => {
    const res = await userStore.eliminarCuenta()
    if (res.success) {
      router.push('/')
      $q.notify({ color: 'info', message: 'Su presencia ha sido desvanecida. Adiós, viajero.' })
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;600&display=swap');

.title-font { font-family: 'Playfair Display', serif; }
.text-gold { color: #d4af37; }

.mystic-dark-layout { background: #0a0612; color: #e0e0e0; height: 100vh; overflow: hidden; }
.main-content-dark { 
  height: 100vh; overflow-y: auto;
  background-image: 
    radial-gradient(circle at 0% 0%, rgba(115, 17, 212, 0.08) 0%, transparent 50%), 
    radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  scrollbar-width: none;
}
.main-content-dark::-webkit-scrollbar { display: none; }

.container { max-width: 800px; margin: auto; padding: 40px 24px; min-height: 100%; display: flex; flex-direction: column; justify-content: center; }

@media (max-width: 1023px) {
  .container { padding-top: 80px; justify-content: flex-start; }
  .text-h4 { font-size: 1.8rem; }
}

.scroll-area { width: 100%; }

/* Header */
.header-line { width: 80px; height: 2px; background: linear-gradient(to right, transparent, #d4af37, transparent); }

/* Sidebar */
.sidebar-mystic { background: #0d081a !important; color: #e0d5f5; border-right: 1px solid rgba(212, 175, 55, 0.1) !important; }
.nav-item { border-radius: 12px; margin-bottom: 8px; color: #a094b8; transition: all 0.3s ease; }
.nav-item:hover { background: rgba(255, 255, 255, 0.03); color: #d4af37; }
.nav-active { background: rgba(212, 175, 55, 0.1) !important; color: #d4af37 !important; border: 1px solid rgba(212, 175, 55, 0.2); }

/* Avatar */
.avatar-trigger-wrapper { position: relative; }
.avatar-mystic-trigger { background: #0d081a; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; }
.avatar-mystic-static { background: #160f24; border: 2px solid rgba(212, 175, 55, 0.5); color: #d4af37; font-weight: 900; position: relative; }
.border-gold { border: 2px solid #d4af37 !important; }

.avatar-upload-wrapper { position: relative; display: inline-block; }

.pulse-ring { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 3px solid #d4af37; animation: pulse-gold 2s infinite; }
@keyframes pulse-gold { 0% { transform: scale(0.95); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }

/* Cards */
.mystic-card-dark { border-radius: 28px; background: rgba(22, 15, 36, 0.4); overflow: hidden; }
.glass-effect { backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
.border-gold-soft { border: 1px solid rgba(212, 175, 55, 0.15); }
.border-red-soft { border: 1px solid rgba(244, 67, 54, 0.15); }

.status-box { background: rgba(212, 175, 55, 0.05); padding: 16px; border-radius: 16px; border: 1px solid rgba(212, 175, 55, 0.1); }

/* Inputs & Buttons */
.mystic-input :deep(.q-field__control) { border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; }
.mystic-input :deep(.q-field__control:hover) { border-color: rgba(212, 175, 55, 0.5); }

.mystic-btn-glow {
  background: linear-gradient(45deg, #d4af37, #b8860b) !important;
  color: #0d081a !important;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
}
.mystic-btn-glow:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5); }

.animate-fade { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

.leading-relaxed { line-height: 1.6; }
.tracking-widest { letter-spacing: 0.2em; }
</style>
