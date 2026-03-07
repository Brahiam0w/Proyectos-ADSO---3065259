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
          <q-item clickable class="nav-item" @click="router.push('/Lecturas')">
            <q-item-section avatar><q-icon name="menu_book" /></q-item-section>
            <q-item-section>Lecturas</q-item-section>
          </q-item>
          <q-item clickable active-class="nav-active" active class="nav-item">
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
          <q-btn flat no-caps color="red-4" icon="logout" label="Cerrar Portal" class="full-width logout-btn" @click="handleLogout" />
        </div>
      </div>
    </q-drawer>

    <!-- AVATAR TRIGGER -->
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
      <q-page class="main-content-dark column items-center justify-center">
        <div class="container column no-wrap">
          
          <div class="header-section text-center q-mb-xl">
            <div class="animate-fade">
              <div class="text-gold text-caption text-uppercase text-weight-bold tracking-widest opacity-80">Eleva tu Conexión</div>
              <div class="text-h3 text-weight-bold text-white title-font q-my-sm">Planes Místicos</div>
              <div class="text-grey-5 text-subtitle2">Elige la frecuencia que mejor resuene con tu camino</div>
            </div>
          </div>

          <div class="row q-col-gutter-xl justify-center items-center">
            
            <!-- PLAN BÁSICO -->
            <div class="col-12 col-sm-6 col-md-5">
              <q-card class="mystic-card-dark plan-card column no-wrap shadow-10" :class="{'current-plan-border': user.estado !== 'activo'}">
                <q-card-section class="text-center q-pa-lg">
                  <div class="text-overline text-grey-5">VIAJERO</div>
                  <div class="text-h4 text-white title-font">Iniciado</div>
                  <div class="text-h3 text-gold text-weight-bolder">Gratis</div>
                </q-card-section>

                <q-card-section class="col q-pa-lg">
                  <q-list dense>
                    <q-item v-for="feat in ['Lectura Principal', 'Perfil Básico']" :key="feat" class="q-px-none">
                      <q-item-section avatar side><q-icon name="check" color="green-4" size="16px" /></q-item-section>
                      <q-item-section class="text-grey-4">{{ feat }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>

                <div class="action-reveal">
                  <q-btn 
                    :label="user.estado !== 'activo' ? 'Plan Actual' : 'Plan Base'" 
                    outline 
                    :color="user.estado !== 'activo' ? 'amber' : 'grey-7'" 
                    class="full-width reveal-btn" 
                    :disable="user.estado !== 'activo'" 
                    no-caps 
                  />
                </div>
              </q-card>
            </div>

            <!-- PLAN PREMIUM -->
            <div class="col-12 col-sm-6 col-md-5">
              <q-card class="mystic-card-dark plan-card featured-card column no-wrap shadow-24" :class="{'current-plan-border': user.estado === 'activo'}">
                <div v-if="user.estado === 'activo'" class="featured-badge">PLAN ACTIVO</div>
                <div v-else class="featured-badge">RECOMENDADO</div>
                
                <q-card-section class="text-center q-pa-lg">
                  <div class="text-overline text-amber">ASCENDIDO</div>
                  <div class="text-h4 text-white title-font">Místico</div>
                  <div class="text-h3 text-gold text-weight-bolder">$9.99<span class="text-caption text-grey-5">/m</span></div>
                </q-card-section>

                <q-card-section class="col q-pa-lg">
                  <q-list dense>
                    <q-item v-for="feat in ['Lecturas Ilimitadas', 'Guía Diaria IA', 'Descargas PDF', 'Historial Completo']" :key="feat" class="q-px-none">
                      <q-item-section avatar side><q-icon name="auto_awesome" color="gold" size="18px" /></q-item-section>
                      <q-item-section class="text-grey-2">{{ feat }}</q-item-section>
                    </q-item>
                  </q-list>

                  <!-- CONTADOR DE DÍAS -->
                  <div v-if="user.estado === 'activo' && diasRestantes !== null" class="q-mt-lg text-center days-counter animate-fade">
                    <div class="text-gold text-weight-bold h-countdown">{{ diasRestantes }}</div>
                    <div class="text-caption text-grey-4 text-uppercase tracking-widest">Días de conexión restantes</div>
                  </div>
                </q-card-section>

                <div class="action-reveal">
                  <q-btn 
                    :label="user.estado === 'activo' ? 'Gestionar Suscripción' : 'Suscribirse Ahora'" 
                    color="amber-9" 
                    class="full-width reveal-btn btn-gold-pulse text-weight-bold" 
                    unelevated 
                    no-caps 
                    @click="handlePlanClick"
                    :loading="userStore.loading"
                  />
                </div>
              </q-card>
            </div>

          </div>

          <div class="text-center q-mt-xl opacity-30">
            <p class="text-grey-5 text-caption">Pagos procesados mediante conexión cifrada.</p>
          </div>

        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import api from "../api/axios";

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();
const $q = useQuasar();
const drawer = ref(false);

const user = computed(() => authStore.user || {});

// Refrescar datos del usuario desde la DB al cargar
onMounted(async () => {
  try {
    if (user.value && user.value._id) {
      console.log("Sincronizando usuario:", user.value._id);
      const response = await api.get(`/usuarios/${user.value._id}`);
      if (response.data.success) {
        console.log("Datos recibidos:", response.data.usuario);
        authStore.user = response.data.usuario;
      }
    } else {
      console.warn("No hay ID de usuario para sincronizar");
    }
  } catch (error) {
    console.error("Error al sincronizar datos del usuario:", error);
  }
});

const diasRestantes = computed(() => {
  if (!user.value || !user.value.fecha_expiracion_plan) return null;
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const expiracion = new Date(user.value.fecha_expiracion_plan);
  expiracion.setHours(0, 0, 0, 0);
  
  const diferenciaMs = expiracion.getTime() - hoy.getTime();
  const dias = Math.round(diferenciaMs / (1000 * 60 * 60 * 24));
  
  console.log("Cálculo de días:", {
    hoy,
    expiracion,
    diferenciaMs,
    dias
  });
  
  return dias > 0 ? dias : 0;
});

const handlePlanClick = () => {
  if (user.value.estado === 'activo') {
    router.push('/configuracion');
  } else {
    // Diálogo místico de pago
    $q.dialog({
      title: '<div class="text-gold title-font">Portal de Pago Místico</div>',
      message: `
        <div class="text-grey-4 q-mt-md">
          Estás por activar el <b>Plan Místico</b> por <b>$9.99 USD</b>.<br><br>
          <div class="q-pa-md bg-dark-purple border-amber-light text-center rounded-borders">
            <q-icon name="credit_card" size="md" color="amber" class="q-mb-sm" /><br>
            **** **** **** 4242
          </div>
          <p class="q-mt-md text-caption opacity-60">Al confirmar, el oráculo se vinculará a tu cuenta por 30 días.</p>
        </div>
      `,
      html: true,
      cancel: { flat: true, color: 'grey-6', label: 'Volver' },
      ok: { color: 'amber-9', label: 'Confirmar Activación' },
      dark: true,
      persistent: true
    }).onOk(async () => {
      const res = await userStore.activarPlan();
      if (res.success) {
        $q.notify({
          color: 'positive',
          message: res.mensaje,
          icon: 'stars',
          position: 'top',
          timeout: 5000
        });
      } else {
        $q.notify({
          color: 'negative',
          message: res.mensaje,
          icon: 'error'
        });
      }
    });
  }
};

const handleLogout = () => { authStore.logout(); router.push('/') }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.title-font { font-family: 'Playfair Display', serif; }
.text-gold { color: #d4af37; }

.mystic-dark-layout { background: #0a0612; color: #e0e0e0; height: 100vh; overflow: hidden; }
.main-content-dark { 
  height: 100vh;
  background-image: radial-gradient(circle at 50% 0%, rgba(115, 17, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
}

.container { max-width: 1000px; margin: auto; width: 100%; }

/* Sidebar */
.sidebar-mystic { background: #110a1f !important; color: #e0d5f5; border-right: none !important; }
.nav-item { border-radius: 10px; margin-bottom: 6px; color: #a094b8; transition: 0.3s; }
.nav-item:hover { background: rgba(255, 255, 255, 0.03); color: #d4af37; }
.nav-active { background: rgba(212, 175, 55, 0.1) !important; color: #d4af37 !important; border: 1px solid rgba(212, 175, 55, 0.2); }

/* Avatar */
.avatar-trigger-wrapper { position: relative; display: inline-block; }
.avatar-mystic-trigger { background: #110a1f; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; overflow: hidden; }
.pulse-ring { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 4px solid #d4af37; animation: pulse-gold 2s infinite; }
@keyframes pulse-gold { 0% { transform: scale(0.9); opacity: 1; } 70% { transform: scale(1.2); opacity: 0; } 100% { transform: scale(0.9); opacity: 0; } }
.avatar-mystic-static { background: #1a0f2e; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; overflow: hidden; }

/* PLAN CARDS */
.plan-card {
  border-radius: 24px;
  background: #160f24;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: 460px;
  position: relative;
  overflow: hidden;
}

.current-plan-border {
  border: 1px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
}

.plan-card:hover {
  transform: translateY(-10px);
  border-color: rgba(212, 175, 55, 0.4);
  background: #1c142e;
  box-shadow: 0 20px 50px rgba(0,0,0,0.7);
}

/* EFECTO REVELAR */
.action-reveal {
  padding: 20px;
  background: linear-gradient(to top, #160f24, transparent);
  position: absolute;
  bottom: 0; left: 0; right: 0;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.plan-card:hover .action-reveal { transform: translateY(0); }
.reveal-btn { height: 50px; }

.featured-card { background: linear-gradient(135deg, #1a0f2e 0%, #110a1f 100%); }
.featured-badge { position: absolute; top: 15px; right: -5px; background: #d4af37; color: #0a0612; padding: 4px 12px; font-size: 10px; font-weight: 900; border-radius: 4px; z-index: 5; }

/* COUNTDOWN */
.days-counter { padding: 10px; border-top: 1px solid rgba(212, 175, 55, 0.15); }
.h-countdown { font-size: 2.5rem; line-height: 1; }

.btn-gold-pulse { background: #d4af37; color: #0a0612; animation: btn-pulse 2s infinite; }
@keyframes btn-pulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); } 70% { box-shadow: 0 0 0 12px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }

/* Clases auxiliares para el diálogo */
.bg-dark-purple { background: #110a1f; }
.border-amber-light { border: 1px solid rgba(212, 175, 55, 0.3); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade { animation: fadeIn 0.8s ease-out; }
</style>
