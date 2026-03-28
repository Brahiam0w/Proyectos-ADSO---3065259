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

          <div class="row q-col-gutter-xl justify-center items-stretch">
            
            <!-- Renderizado Dinámico de Planes desde MongoDB -->
            <div v-for="plan in planes" :key="plan._id" class="col-12 col-sm-6 col-md-5">
              <q-card 
                class="mystic-card-dark plan-card column no-wrap shadow-10" 
                :class="{
                  'current-plan-border': (plan.precio === 0 && user.plan !== 'mistico') || (plan.precio > 0 && user.plan === 'mistico'),
                  'featured-card': plan.precio > 0
                }"
              >
                <!-- Badge de Estado -->
                <div v-if="(plan.precio === 0 && user.plan !== 'mistico') || (plan.precio > 0 && user.plan === 'mistico')" class="featured-badge">PLAN ACTUAL</div>
                <div v-else-if="plan.precio > 0" class="featured-badge">RECOMENDADO</div>
                
                <q-card-section class="text-center q-pa-lg">
                  <div class="text-overline" :class="plan.precio > 0 ? 'text-amber' : 'text-grey-5'">
                    {{ plan.tag || (plan.precio > 0 ? 'ASCENDIDO' : 'VIAJERO') }}
                  </div>
                  <div class="text-h4 text-white title-font">{{ plan.nombre }}</div>
                  <div class="text-h3 text-gold text-weight-bolder">
                    {{ plan.precio === 0 ? 'Gratis' : `$${plan.precio}` }}
                    <span v-if="plan.precio > 0" class="text-caption text-grey-5">/{{ plan.periodo === 'mes' ? 'm' : 'a' }}</span>
                  </div>
                </q-card-section>

                <q-card-section class="col q-pa-lg">
                  <q-list dense>
                    <q-item v-for="feat in plan.features" :key="feat" class="q-px-none">
                      <q-item-section avatar side>
                        <q-icon :name="plan.precio > 0 ? 'auto_awesome' : 'check'" :color="plan.precio > 0 ? 'gold' : 'green-4'" size="18px" />
                      </q-item-section>
                      <q-item-section :class="plan.precio > 0 ? 'text-grey-2' : 'text-grey-4'">{{ feat }}</q-item-section>
                    </q-item>
                  </q-list>

                  <!-- CONTADOR DE DÍAS (Solo para el plan de pago si está activo) -->
                  <div v-if="plan.precio > 0 && user.plan === 'mistico' && diasRestantes !== null" class="q-mt-lg text-center days-counter animate-fade">
                    <div class="text-gold text-weight-bold h-countdown">{{ diasRestantes }}</div>
                    <div class="text-caption text-grey-4 text-uppercase tracking-widest">Días de conexión restantes</div>
                  </div>
                </q-card-section>

                <div class="action-reveal">
                  <q-btn 
                    v-if="plan.precio === 0"
                    :label="user.plan !== 'mistico' ? 'Tu Nivel Actual' : 'Plan Base'" 
                    outline 
                    :color="user.plan !== 'mistico' ? 'amber' : 'grey-7'" 
                    class="full-width reveal-btn" 
                    :disable="user.plan !== 'mistico'" 
                    no-caps 
                  />
                  <q-btn 
                    v-else
                    :label="user.plan === 'mistico' ? 'Gestionar Suscripción' : 'Suscribirse Ahora'" 
                    color="amber-9" 
                    class="full-width reveal-btn btn-gold-pulse text-weight-bold" 
                    unelevated 
                    no-caps 
                    @click="handlePlanClick(plan)"
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
const planes = ref([]);

const user = computed(() => authStore.user || {});

const obtenerPlanes = async () => {
  try {
    const res = await api.get('/planes');
    if (res.data.success) {
      planes.value = res.data.planes;
    }
  } catch (err) {
    console.error("Error al obtener planes:", err);
  }
};

// Refrescar datos del usuario desde la DB al cargar
onMounted(async () => {
  obtenerPlanes();
  
  // 1. Verificar si venimos de un pago exitoso (buscamos en hash y search)
  const fullUrl = window.location.href;
  // Intentamos extraer parámetros de cualquier parte de la URL
  const queryString = fullUrl.includes('?') ? fullUrl.split('?')[1] : '';
  const urlParams = new URLSearchParams(queryString);
  
  const status = urlParams.get('status') || urlParams.get('collection_status');
  const externalReference = urlParams.get('external_reference');

  console.log('[MP-Debug] Detectado:', { status, externalReference });

  if ((status === 'success' || status === 'approved') && externalReference) {
    $q.loading.show({ message: 'Sincronizando su suscripción con el oráculo...' });
    try {
      const res = await api.get(`/pagos/confirmar?status=approved&external_reference=${externalReference}`);
      if (res.data.success) {
        $q.notify({ color: 'positive', message: '¡Plan Místico activado con éxito!', icon: 'auto_awesome', position: 'top' });
        // Limpiar URL eliminando los parámetros
        const newUrl = window.location.pathname + window.location.hash.split('?')[0];
        window.history.replaceState({}, document.title, newUrl);
      }
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al confirmar el pago';
      $q.notify({ color: 'negative', message: msg, icon: 'error' });
    } finally {
      $q.loading.hide();
    }
  } else if (status === 'failure') {
    $q.notify({ 
      color: 'negative', 
      message: 'El proceso de pago ha sido cancelado o rechazado por el portal seguro.', 
      icon: 'warning',
      position: 'top'
    });
    // Limpiar URL
    const newUrl = window.location.pathname + window.location.hash.split('?')[0];
    window.history.replaceState({}, document.title, newUrl);
  }

  // 2. Sincronizar datos normales del usuario...
  try {
    if (user.value && user.value._id) {
      const response = await api.get(`/usuarios/${user.value._id}`);
      if (response.data.success) {
        authStore.user = response.data.usuario;
      }
    }
  } catch (error) {
    console.error("Error al sincronizar datos:", error);
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
  return dias > 0 ? dias : 0;
});

const handlePlanClick = async (plan) => {
  if (user.value.plan === 'mistico') {
    router.push('/configuracion');
    return;
  }

  $q.dialog({
    title: '<div class="text-gold title-font">Portal de Pago Seguro</div>',
    message: `
      <div class="text-grey-4 q-mt-md">
        Estás por activar el <b>Plan Místico</b> por <b>$39,000 COP</b>.<br><br>
        Serás redirigido al portal seguro de <b>Mercado Pago</b> para completar la transacción.
        <p class="q-mt-md text-caption opacity-60">Seguridad garantizada por Mercado Pago.</p>
      </div>
    `,
    html: true,
    cancel: { flat: true, color: 'grey-6', label: 'Cancelar' },
    ok: { color: 'amber-9', label: 'Ir a Pagar' },
    dark: true,
    persistent: true
  }).onOk(async () => {
    try {
      $q.loading.show({ 
        message: 'Generando orden de pago...'
      });
      
      const res = await api.post('/pagos/crear-preferencia');
      
      if (res.data.success && res.data.init_point) {
        console.log('✅ Redirigiendo a Mercado Pago:', res.data.init_point);
        // Redirección directa a Mercado Pago en la misma pestaña
        window.location.href = res.data.init_point;
      } else {
        $q.loading.hide();
        const msg = res.data.mensaje || 'No se pudo generar el link de pago';
        $q.notify({ color: 'negative', message: msg, icon: 'error' });
      }
    } 
    catch (err) {
      $q.loading.hide();
      const msg = err.response?.data?.mensaje || 'Error de conexión con la pasarela';
      $q.notify({ color: 'negative', message: msg, icon: 'error' });
    }
  });
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
  overflow-y: auto;
  background-image: radial-gradient(circle at 50% 0%, rgba(115, 17, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  scrollbar-width: none;
}
.main-content-dark::-webkit-scrollbar { display: none; }

.container { max-width: 1000px; margin: auto; width: 100%; padding: 40px 20px; }

@media (max-width: 1023px) {
  .container { padding-top: 80px; }
  .text-h3 { font-size: 2rem; }
}

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
  min-height: 480px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  background: linear-gradient(to top, #160f24 80%, transparent);
  margin-top: auto;
  transition: all 0.4s ease;
}

@media (min-width: 1024px) {
  .action-reveal {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    transform: translateY(100%);
  }
  .plan-card:hover .action-reveal { transform: translateY(0); }
}

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
