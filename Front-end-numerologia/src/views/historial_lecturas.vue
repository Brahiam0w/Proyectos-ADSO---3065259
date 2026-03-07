<template>
  <q-layout view="lHh Lpr lFf" class="mystic-dark-layout">

    <!-- SIDEBAR -->
    <q-drawer v-model="drawer" side="left" overlay behavior="mobile" :width="280" class="sidebar-mystic">
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
          <q-item clickable class="nav-item" @click="router.push('/perfil')"><q-item-section avatar><q-icon name="person" /></q-item-section><q-item-section>Mi Perfil</q-item-section></q-item>
          <q-item clickable class="nav-item" @click="router.push('/lecturas')"><q-item-section avatar><q-icon name="menu_book" /></q-item-section><q-item-section>Lecturas</q-item-section></q-item>
          <q-item clickable class="nav-item" @click="router.push('/planes')"><q-item-section avatar><q-icon name="stars" /></q-item-section><q-item-section>Planes</q-item-section></q-item>
          <q-item clickable active-class="nav-active" active class="nav-item"><q-item-section avatar><q-icon name="history_edu" /></q-item-section><q-item-section>Historial</q-item-section></q-item>
          <q-item clickable class="nav-item" @click="router.push('/configuracion')"><q-item-section avatar><q-icon name="settings" /></q-item-section><q-item-section>Configuración</q-item-section></q-item>
        </q-list>
        <q-space />
        <div class="q-pa-md"><q-btn flat no-caps color="red-4" icon="logout" label="Cerrar Portal" class="full-width logout-btn" @click="handleLogout" /></div>
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
          
          <!-- Header -->
          <div class="header-section q-mb-xl">
            <div class="animate-fade text-center">
              <div class="text-gold text-caption text-uppercase text-weight-bold tracking-widest opacity-80">Crónicas del Destino</div>
              <div class="text-h4 text-weight-bold text-white title-font">Tu Historial Sagrado</div>
            </div>
          </div>

          <!-- Tablero de Historial -->
          <div class="row q-col-gutter-xl flex-grow-1 overflow-hidden">
            
            <!-- COLUMNA IZQUIERDA: DIARIAS -->
            <div class="col-12 col-md-6 column no-wrap">
              <div class="column items-center q-mb-md">
                <q-icon name="today" color="amber" size="sm" class="q-mb-xs" />
                <div class="text-h6 text-gold title-font">Guías Diarias</div>
                <div class="text-caption text-grey-5">{{ lecturasDiarias.length }} revelaciones</div>
              </div>
              
              <div v-if="lecturasDiarias.length > 0" class="scroll-container q-pr-md">
                <div class="row q-col-gutter-sm">
                  <div v-for="lectura in lecturasDiarias" :key="lectura._id" class="col-12">
                    <q-card class="mystic-card-dark history-card cursor-pointer" @click="verDetalle(lectura)">
                      <div class="row no-wrap items-center q-pa-md">
                        <div class="col-auto q-mr-md">
                          <div class="vibe-circle-mini">
                            <div class="vibe-number-mini">{{ lectura.numero_camino_vida }}</div>
                          </div>
                        </div>
                        <div class="col">
                          <div class="text-grey-5 text-caption">{{ formatFecha(lectura.fecha_lectura) }}</div>
                          <div class="text-body1 text-white text-weight-medium ellipsis">
                            {{ lectura.contenido.substring(0, 70) }}...
                          </div>
                        </div>
                        <div class="col-auto">
                          <q-icon name="chevron_right" color="gold" size="xs" />
                        </div>
                      </div>
                    </q-card>
                  </div>
                </div>
              </div>
              <div v-else class="column items-center justify-center flex-grow-1 opacity-20 empty-mini q-pa-xl">
                <q-icon name="history_edu" size="60px" color="grey-8" />
                <div class="text-subtitle1 text-white q-mt-md text-center">Sin guías diarias registradas</div>
              </div>
            </div>

            <!-- COLUMNA DERECHA: PRINCIPALES -->
            <div class="col-12 col-md-6 column no-wrap">
              <div class="column items-center q-mb-md">
                <q-icon name="auto_awesome" color="indigo-4" size="sm" class="q-mb-xs" />
                <div class="text-h6 text-indigo-4 title-font">Esencias de Vida</div>
                <div class="text-caption text-grey-5">{{ lecturasPrincipales.length }} revelaciones</div>
              </div>

              <div v-if="lecturasPrincipales.length > 0" class="scroll-container q-pr-md">
                <div class="row q-col-gutter-sm">
                  <div v-for="lectura in lecturasPrincipales" :key="lectura._id" class="col-12">
                    <q-card class="mystic-card-dark history-card principal-border cursor-pointer" @click="verDetalle(lectura)">
                      <div class="row no-wrap items-center q-pa-md">
                        <div class="col-auto q-mr-md">
                          <div class="vibe-circle-mini principal-bg">
                            <div class="vibe-number-mini text-indigo-2">{{ lectura.numero_camino_vida }}</div>
                          </div>
                        </div>
                        <div class="col">
                          <div class="text-grey-5 text-caption">{{ formatFecha(lectura.fecha_lectura) }}</div>
                          <div class="text-body1 text-white text-weight-medium ellipsis">
                            {{ lectura.contenido.substring(0, 70) }}...
                          </div>
                        </div>
                        <div class="col-auto">
                          <q-icon name="chevron_right" color="indigo-4" size="xs" />
                        </div>
                      </div>
                    </q-card>
                  </div>
                </div>
              </div>
              <div v-else class="column items-center justify-center flex-grow-1 opacity-20 empty-mini q-pa-xl">
                <q-icon name="stars" size="60px" color="grey-8" />
                <div class="text-subtitle1 text-white q-mt-md text-center">Aún no hay lecturas de esencia</div>
              </div>
            </div>

          </div>

        </div>
      </q-page>
    </q-page-container>

    <!-- MODAL DETALLE -->
    <q-dialog v-model="mostrarDetalle" transition-show="scale" transition-hide="scale">
      <q-card class="mystic-dark-layout text-white modal-detail-container">
        <q-bar class="bg-dark-overlay q-pa-lg">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup color="gold">
            <q-tooltip class="bg-amber text-black">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="column items-center q-pa-xl scroll">
          <div class="container-detail">
            <div class="text-center q-mb-xl">
              <div class="text-gold text-overline q-mb-sm">{{ selectedLectura?.tipo === 'principal' ? 'Lectura de Esencia' : 'Guía del Día' }}</div>
              <div class="text-h4 title-font q-mb-md">Revelación del {{ formatFecha(selectedLectura?.fecha_lectura) }}</div>
              <div class="vibe-circle q-mx-auto">
                <div class="vibe-number">{{ selectedLectura?.numero_camino_vida }}</div>
              </div>
            </div>

            <q-card class="mystic-card-dark q-pa-xl shadow-24 detail-scroll-card">
              <div class="content-text-detail text-grey-3">
                {{ selectedLectura?.contenido }}
              </div>
            </q-card>

            <div class="row justify-center q-mt-xl">
               <q-btn label="Cerrar Pergamino" outline color="amber" v-close-popup class="q-px-xl" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useLecturaStore } from "../stores/lectura";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const authStore = useAuthStore();
const lecturaStore = useLecturaStore();
const router = useRouter();
const $q = useQuasar();

const drawer = ref(false);
const mostrarDetalle = ref(false);
const selectedLectura = ref(null);

const user = computed(() => authStore.user || {});

const lecturasDiarias = computed(() => lecturaStore.lecturas.filter(l => l.tipo === 'diaria'));
const lecturasPrincipales = computed(() => lecturaStore.lecturas.filter(l => l.tipo === 'principal'));

const formatFecha = (f) => {
  if (!f) return '---'
  const d = new Date(f)
  return isNaN(d) ? f : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

const verDetalle = (lectura) => {
  selectedLectura.value = lectura;
  mostrarDetalle.value = true;
};

const handleLogout = () => { authStore.logout(); router.push('/') }

onMounted(async () => {
  if (user.value?._id) {
    await lecturaStore.obtenerLecturasUsuario(user.value._id);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
.title-font { font-family: 'Playfair Display', serif; }
.text-gold { color: #d4af37; }

/* LAYOUT BASE */
.mystic-dark-layout { background: #0a0612; color: #e0e0e0; height: 100vh; height: 100dvh; overflow: hidden; }
.main-content-dark { 
  height: 100vh; 
  height: 100dvh; 
  padding: 0 !important; 
  background-image: radial-gradient(circle at 50% 50%, rgba(115, 17, 212, 0.05) 0%, transparent 100%); 
  overflow: hidden; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container { 
  max-width: 1000px; 
  width: 100%; 
  padding: 20px 24px; 
  display: flex; 
  flex-direction: column; 
}

.container-detail { max-width: 800px; width: 100%; }

/* Sidebar */
.sidebar-mystic { background: #110a1f !important; border-right: none !important; }
.nav-item { border-radius: 10px; margin-bottom: 4px; color: #a094b8; transition: 0.3s; }
.nav-active { background: rgba(212, 175, 55, 0.1) !important; color: #d4af37 !important; }

/* Avatar Trigger */
.avatar-mystic-trigger { background: #110a1f; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; }
.pulse-ring { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 4px solid #d4af37; animation: pulse-gold 2s infinite; }
@keyframes pulse-gold { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } }

/* Cards y Scroll */
.mystic-card-dark { border-radius: 20px; background: #160f24; border: 1px solid rgba(255, 255, 255, 0.05); transition: 0.3s; }
.history-card:hover { border-color: rgba(212, 175, 55, 0.4); background: #1c132e; transform: translateX(5px); }

.scroll-container { 
  flex: 1; 
  overflow-y: auto !important; 
  padding-right: 15px; 
}
.scroll-container::-webkit-scrollbar { width: 6px; }
.scroll-container::-webkit-scrollbar-track { background: transparent; }
.scroll-container::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 10px; }

/* Círculos de Vibración Mini */
.vibe-circle-mini { width: 45px; height: 45px; border: 1px solid #d4af37; border-radius: 50%; display: flex; justify-content: center; align-items: center; background: rgba(212, 175, 55, 0.05); }
.vibe-number-mini { font-size: 16pt; color: #d4af37; font-weight: bold; }
.principal-bg { background: rgba(121, 134, 203, 0.1); border-color: #7986cb; }
.principal-border { border-color: rgba(121, 134, 203, 0.3); }

.vibe-circle { width: 100px; height: 100px; border: 3px double #d4af37; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 20px rgba(212, 175, 55, 0.2); background: rgba(22, 15, 36, 0.8); }
.vibe-number { font-size: 42pt; color: #d4af37; font-weight: bold; }

/* Modal y Scroll Detalle */
.modal-detail-container {
  max-width: 900px !important;
  width: 90vw !important;
  border: 1px solid rgba(212, 175, 55, 0.3);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
}

.detail-scroll-card {
  max-height: 50vh;
  overflow-y: auto !important;
  background: rgba(0, 0, 0, 0.2);
}
.detail-scroll-card::-webkit-scrollbar { width: 8px; }
.detail-scroll-card::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 4px; }

.content-text-detail { line-height: 1.8; white-space: pre-line; font-style: italic; font-size: 1.2rem; color: #f0f0f0; }

.empty-mini { background: rgba(255, 255, 255, 0.01); border-radius: 20px; border: 1px dashed rgba(255, 255, 255, 0.05); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade { animation: fadeIn 0.8s ease-out; }

.bg-dark-overlay { background: rgba(0, 0, 0, 0.4); }
</style>
