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
        <!-- Avatar dentro del Menú -->
        <div class="column items-center q-py-xl sidebar-header">
          <q-avatar size="80px" class="avatar-mystic-static q-mb-md">
            <img v-if="user.avatar" :src="user.avatar">
            <span v-else>{{ user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U' }}</span>
          </q-avatar>
          <div class="text-gold text-h6 title-font">{{ user.nombre }}</div>
          <div class="text-grey-5 text-caption">{{ user.email }}</div>
          
          <q-btn 
            flat round 
            icon="close" 
            color="gold" 
            class="absolute-top-right q-ma-sm" 
            @click="drawer = false" 
          />
        </div>

        <q-separator color="rgba(212, 175, 55, 0.2)" inset />

        <!-- Navegación -->
        <q-list padding class="q-px-md q-mt-md">
          <q-item clickable active-class="nav-active" :active="router.currentRoute.value.path === '/perfil'" class="nav-item" @click="router.push('/perfil')">
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>Mi Perfil</q-item-section>
          </q-item>

          <q-item clickable class="nav-item" @click="router.push('/Lecturas')">
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

          <q-item clickable class="nav-item" @click="router.push('/configuracion')">
            <q-item-section avatar><q-icon name="settings" /></q-item-section>
            <q-item-section>Configuración</q-item-section>
          </q-item>
        </q-list>

        <q-space />

        <div class="q-pa-md">
          <q-btn
            flat no-caps
            color="red-4"
            icon="logout"
            label="Cerrar Portal"
            class="full-width logout-btn"
            @click="handleLogout"
          />
        </div>
      </div>
    </q-drawer>

    <!-- BOTÓN AVATAR FLOTANTE -->
    <div v-if="!drawer" class="fixed-top-left z-top q-ma-lg">
      <div class="avatar-trigger-wrapper">
        <div class="pulse-ring"></div>
        <q-avatar 
          size="64px" 
          class="avatar-mystic-trigger cursor-pointer shadow-10"
          @click="drawer = true"
        >
          <img v-if="user.avatar" :src="user.avatar" style="object-fit: cover;">
          <span v-else>{{ user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U' }}</span>
          <q-tooltip anchor="center right" self="center left" class="bg-gold text-black">Abrir Oráculo</q-tooltip>
        </q-avatar>
      </div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container>
      <q-page class="main-content-dark">
        <div class="container">

          <!-- Saludo -->
          <div class="row q-mb-xl">
            <div class="animate-fade">
              <div class="text-gold text-caption text-uppercase text-weight-bold tracking-widest opacity-80">
                Sintonía con el Universo
              </div>
              <div class="text-h2 text-weight-bold text-white title-font">
                Hola, <span class="text-gold">{{ user.nombre }}</span>
              </div>
              <div class="text-grey-4 text-subtitle1">
                Bienvenida a tu espacio sagrado de numerología.
              </div>
            </div>
          </div>

          <!-- TARJETAS DE NUMEROLOGÍA -->
          <div class="row q-col-gutter-lg q-mb-xl">
            <div v-for="(num, index) in numerologia" :key="index" class="col-12 col-md-4">
              <q-card class="mystic-card-dark shadow-2">
                <q-card-section>
                  <div class="row items-center q-mb-md">
                    <q-icon :name="num.icon" :color="num.color" size="24px" />
                    <div class="text-subtitle1 text-weight-bold q-ml-sm text-grey-3 text-uppercase tracking-wider">
                      {{ num.title }}
                    </div>
                  </div>
                  <div class="text-gold number-display-dark">{{ num.val }}</div>
                  <div class="badge-label-dark">{{ num.label }}</div>
                  <div class="text-grey-5 q-mt-md text-body2 line-height-1-6">
                    {{ num.desc }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- INFORMACIÓN PERSONAL -->
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-lg-8">
              <q-card class="profile-card-dark shadow-1">
                <q-card-section class="q-pa-lg">
                  <div class="text-h6 text-weight-bold q-mb-xl text-white flex items-center">
                    <q-icon name="auto_fix_normal" color="amber-8" class="q-mr-sm" />
                    Mapa de Identidad
                  </div>
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-md-6">
                      <div class="custom-label">Nombre Terrenal</div>
                      <div class="custom-data-field">{{ user.nombre }}</div>
                    </div>
                    <div class="col-12 col-md-6">
                      <div class="custom-label">Ascensión</div>
                      <div class="custom-data-field">{{ formatFecha(user.fecha_nacimiento) }}</div>
                    </div>
                    <div class="col-12">
                      <div class="custom-label">Frecuencia Digital</div>
                      <div class="custom-data-field">{{ user.email }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-lg-4">
              <q-card class="membership-card-dark shadow-10 text-white">
                <q-card-section class="q-pa-lg">
                  <div class="text-subtitle2 text-gold opacity-80 text-uppercase tracking-wider">
                    Membresía
                  </div>
                  <div class="text-h5 text-weight-bold q-mb-md">
                    {{ user.estado === 'activo' ? 'Plan Místico' : 'Plan Iniciado' }}
                  </div>

                  <q-list dense class="q-mb-md">
                    <q-item class="q-px-none">
                      <q-item-section avatar side><q-icon name="stars" color="amber" size="18px" /></q-item-section>
                      <q-item-section class="text-grey-3">
                        {{ user.estado === 'activo' ? 'Lecturas IA Activas' : 'Lecturas Limitadas' }}
                      </q-item-section>
                    </q-item>
                    <q-item class="q-px-none">
                      <q-item-section avatar side><q-icon name="stars" color="amber" size="18px" /></q-item-section>
                      <q-item-section class="text-grey-3">
                        {{ user.estado === 'activo' ? 'Sincronía Total' : 'Conexión Base' }}
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <q-btn
                    color="amber-9"
                    :label="user.estado === 'activo' ? 'Ver Suscripción' : 'Activar Plan Místico'"
                    class="full-width q-mt-md text-weight-bold btn-gold"
                    unelevated
                    @click="router.push('/planes')"
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
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const drawer = ref(false)

const user = computed(() => authStore.user || {})

const formatFecha = (f) => {
  if (!f) return '---'
  const d = new Date(f)
  return isNaN(d) ? f : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

// Lógica de Numerología
const pythagoreanMap = { a:1, j:1, s:1, b:2, k:2, t:2, c:3, l:3, u:3, d:4, m:4, v:4, e:5, n:5, w:5, f:6, o:6, x:6, g:7, p:7, y:7, h:8, q:8, z:8, i:9, r:9 }
const reduce = (n) => {
  let r = n
  while (r > 9 && r !== 11 && r !== 22 && r !== 33) r = r.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0)
  return r
}

const nVida = computed(() => {
  const f = user.value.fecha_nacimiento; if (!f) return '?'
  return reduce(f.replace(/\D/g, '').split('').reduce((a, b) => parseInt(a) + parseInt(b), 0))
})

const nDestino = computed(() => {
  const n = user.value.nombre; if (!n) return '?'
  let s = 0; const l = n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  for (let c of l) if (pythagoreanMap[c]) s += pythagoreanMap[c]
  return reduce(s)
})

const nAlma = computed(() => {
  const n = user.value.nombre; if (!n) return '?'
  let s = 0; const v = "aeiou"; const l = n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  for (let c of l) if (v.includes(c) && pythagoreanMap[c]) s += pythagoreanMap[c]
  return reduce(s)
})

const getLabel = (n) => {
  const labels = { 1:'Líder', 2:'Mediador', 3:'Creativo', 4:'Constructor', 5:'Aventurero', 6:'Protector', 7:'Sabio', 8:'Ejecutivo', 9:'Humanitario', 11:'Maestro', 22:'Arquitecto', 33:'Guía' }
  return labels[n] || 'Místico'
}

const numerologia = computed(() => [
  { title: 'Número de Vida', val: nVida.value, label: getLabel(nVida.value), icon: 'hourglass_empty', color: 'cyan-4', desc: 'Tu camino sagrado y misión principal.' },
  { title: 'Número del Destino', val: nDestino.value, label: getLabel(nDestino.value), icon: 'explore', color: 'amber-6', desc: 'Tus talentos naturales y manifestación.' },
  { title: 'Número del Alma', val: nAlma.value, label: getLabel(nAlma.value), icon: 'auto_awesome', color: 'purple-3', desc: 'Tus deseos más profundos y verdad interior.' }
])

const handleLogout = () => { authStore.logout(); router.push('/') }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.title-font { font-family: 'Playfair Display', serif; }
.text-gold { color: #d4af37; }
.bg-gold { background: #d4af37; }

/* LAYOUT BASE */
.mystic-dark-layout { 
  background: #0a0612; 
  color: #e0e0e0; 
  height: 100vh;
  overflow: hidden; 
}

.main-content-dark {
  height: 100vh;
  overflow-y: auto;
  background-image: radial-gradient(circle at 0% 0%, rgba(115, 17, 212, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  scrollbar-width: none;
}
.main-content-dark::-webkit-scrollbar { display: none; }

.container { 
  max-width: 1100px; 
  margin: auto; 
  padding: 40px 24px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 1023px) {
  .container { padding: 100px 16px 40px 16px; justify-content: flex-start; }
  .text-h2 { font-size: 2.5rem; }
}

/* Sidebar */
.sidebar-mystic { background: #110a1f !important; color: #e0d5f5; border-right: 1px solid rgba(212, 175, 55, 0.2); }
.nav-item { border-radius: 10px; margin-bottom: 6px; color: #a094b8; transition: 0.3s; }
.nav-item:hover { background: rgba(255, 255, 255, 0.03); color: #d4af37; }
.nav-active { background: rgba(212, 175, 55, 0.1) !important; color: #d4af37 !important; border: 1px solid rgba(212, 175, 55, 0.2); }

/* Avatar Trigger Flotante */
.avatar-trigger-wrapper { 
  position: relative; 
  display: inline-block;
  width: 64px;
  height: 64px;
}

.avatar-mystic-trigger {
  background: #110a1f; 
  border: 2px solid #d4af37; 
  color: #d4af37; 
  font-weight: 900;
  transition: all 0.3s ease;
}

.pulse-ring {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%; border: 4px solid #d4af37;
  animation: pulse-gold 2s infinite;
}

@keyframes pulse-gold {
  0% { transform: scale(0.9); opacity: 1; }
  70% { transform: scale(1.2); opacity: 0; }
  100% { transform: scale(0.9); opacity: 0; }
}

.avatar-mystic-static { 
  background: #1a0f2e; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; 
  overflow: hidden;
}

/* Cards */
.mystic-card-dark { border-radius: 24px; background: #160f24; border: 1px solid rgba(255, 255, 255, 0.05); transition: 0.3s; }
.number-display-dark { font-size: 48px; font-weight: 800; color: #d4af37; line-height: 1; margin: 10px 0; }
.badge-label-dark { display: inline-block; background: rgba(212, 175, 55, 0.1); color: #f7ef8a; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }

.profile-card-dark { border-radius: 24px; background: #160f24; border: 1px solid rgba(255, 255, 255, 0.05); }
.custom-label { font-size: 11px; font-weight: 800; color: #d4af37; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
.custom-data-field { background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 12px; color: white; border: 1px solid rgba(255, 255, 255, 0.08); }

.membership-card-dark { background: linear-gradient(135deg, #1a0f2e, #0a0612); border-radius: 24px; border: 1px solid rgba(115, 17, 212, 0.3); }
.btn-gold { background: linear-gradient(45deg, #d4af37, #b8860b); color: #0a0612; border-radius: 12px; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade { animation: fadeIn 0.8s ease-out; }
</style>
