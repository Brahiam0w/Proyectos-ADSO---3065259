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
          <q-item clickable active-class="nav-active" active class="nav-item"><q-item-section avatar><q-icon name="menu_book" /></q-item-section><q-item-section>Lecturas</q-item-section></q-item>
          <q-item clickable class="nav-item" @click="router.push('/planes')"><q-item-section avatar><q-icon name="stars" /></q-item-section><q-item-section>Planes</q-item-section></q-item>
          <q-item clickable class="nav-item" @click="router.push('/historial')"><q-item-section avatar><q-icon name="history_edu" /></q-item-section><q-item-section>Historial</q-item-section></q-item>
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
      <q-page class="main-content-dark column no-wrap items-center justify-center" @click="lecturaStore.lecturaActual = null">
        <div class="container column no-wrap" @click.stop>
          
          <!-- Header -->
          <div class="header-section q-mb-md">
            <div class="animate-fade">
              <div class="text-gold text-caption text-uppercase text-weight-bold tracking-widest opacity-80">Portal de Sabiduría</div>
              <div class="text-h4 text-weight-bold text-white title-font">Oráculo de Lecturas</div>
            </div>
          </div>

          <!-- Tablero Principal -->
          <div class="row q-col-gutter-lg items-stretch board-row">
            
            <!-- PANEL IZQUIERDO: CONTROLES -->
            <div class="col-12 col-lg-4 column q-gutter-y-md">
              <q-card class="mystic-card-dark q-pa-lg shadow-10">
                <div class="text-h6 text-gold q-mb-md">Generar Conexión</div>
                <div class="data-box-dark q-mb-lg">
                  <div class="text-overline text-amber">Consultante</div>
                  <div class="text-subtitle1 text-white">{{ user.nombre }}</div>
                  <div class="text-caption text-grey-5">{{ formatFecha(user.fecha_nacimiento) }}</div>
                </div>
                <div class="column q-gutter-y-sm">
                  <q-btn label="Lectura Principal" icon="auto_awesome" color="amber-9" unelevated class="full-width btn-mystic" @click="handleGenerarLectura" :loading="lecturaStore.loading" />
                  <q-btn label="Lectura Diaria" icon="today" outline color="amber" class="full-width" @click="handleGenerarDiaria" :loading="lecturaStore.loading" />
                </div>
              </q-card>

              <q-card class="membership-card-dark shadow-10 text-white">
                <q-card-section class="q-pa-md">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="stars" color="gold" size="sm" class="q-mr-sm" />
                    <div class="text-subtitle2 title-font">Tu Estado</div>
                  </div>
                  <div class="text-caption text-grey-4 q-mb-md">
                    {{ user.estado === 'activo' ? 'Conexión mística activa.' : 'Activa el plan para guías diarias IA.' }}
                  </div>
                  <q-btn
                    dense flat
                    class="full-width btn-gold-link"
                    :label="user.estado === 'activo' ? 'Gestionar Plan' : 'Mejorar Conexión'"
                    @click="router.push('/planes')"
                  />
                </q-card-section>
              </q-card>
            </div>

            <!-- PANEL DERECHO: RESULTADOS -->
            <div class="col-12 col-lg-8 column no-wrap">
              <div v-if="lecturaActual" class="animate-fade column no-wrap flex-grow-1" style="min-height: 0;">
                <q-card class="mystic-card-dark result-card column no-wrap full-height shadow-24">
                  <q-card-section class="q-pa-md row justify-between items-center bg-dark-overlay no-shrink">
                    <div class="text-h6 text-gold title-font">{{ lecturaActual.tipo === 'principal' ? 'Misión de Vida' : 'Guía Diaria' }}</div>
                    <q-badge color="amber-10" class="text-weight-bold" size="lg">NÚMERO {{ lecturaActual.numero_camino_vida }}</q-badge>
                  </q-card-section>

                  <q-separator color="rgba(212, 175, 55, 0.2)" />

                  <q-card-section class="scroll-text-area">
                    <div class="content-text text-grey-3">
                      {{ lecturaActual.contenido }}
                    </div>
                  </q-card-section>

                  <q-separator color="rgba(212, 175, 55, 0.1)" />

                  <q-card-section class="q-pa-sm row justify-end no-shrink">
                    <q-btn flat round icon="picture_as_pdf" color="amber" size="md" @click="descargarPDF">
                      <q-tooltip class="bg-amber text-black">Guardar PDF</q-tooltip>
                    </q-btn>
                  </q-card-section>
                </q-card>
              </div>

              <!-- ESTADO VACÍO -->
              <div v-else class="column items-center justify-center flex-grow-1 opacity-20 empty-placeholder">
                <q-icon name="auto_awesome" size="80px" color="grey-8" />
                <div class="text-h6 text-white q-mt-md">Oráculo en Espera</div>
              </div>
            </div>

          </div>
        </div>

        <!-- TEMPLATE PDF -->
        <div style="position: absolute; left: -9999px; top: 0;">
          <div id="pdf-template" class="pdf-container">
            <div class="pdf-border">
              <div class="pdf-inner-border">
                <div class="pdf-header">
                  <div class="pdf-logo"><q-icon name="auto_awesome" size="60px" color="amber" /></div>
                  <h1 class="pdf-title title-font">Destino Místico</h1>
                  <div class="pdf-subtitle">REVELACIÓN NUMEROLÓGICA</div>
                </div>
                
                <div class="pdf-body">
                  <div class="pdf-user-info">
                    <span><strong>CONSULTANTE:</strong> {{ user.nombre }}</span>
                    <span><strong>FECHA:</strong> {{ new Date().toLocaleDateString() }}</span>
                  </div>
                  
                  <div class="pdf-vibration">
                    <div class="vibe-label">Frecuencia del Camino de Vida</div>
                    <div class="vibe-circle">
                      <div class="vibe-number">{{ lecturaActual?.numero_camino_vida }}</div>
                    </div>
                  </div>
                  
                  <div class="pdf-content">
                    {{ lecturaActual?.contenido }}
                  </div>
                </div>

                <div class="pdf-footer">
                  Guía espiritual generada por IA - Portal de Sabiduría Universal
                </div>
              </div>
            </div>
          </div>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useLecturaStore } from "../stores/lectura";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const authStore = useAuthStore();
const lecturaStore = useLecturaStore();
const $q = useQuasar();
const router = useRouter();
const drawer = ref(false);

const user = computed(() => authStore.user || {});
const lecturaActual = computed(() => lecturaStore.lecturaActual);

const formatFecha = (f) => {
  if (!f) return '---'
  const d = new Date(f)
  return isNaN(d) ? f : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

const handleGenerarLectura = async () => {
  const res = await lecturaStore.generarLecturaPrincipal(user.value?._id);
  if (res.success) {
    $q.notify({ color: "positive", message: res.mensaje || "Lectura generada", icon: "stars", position: 'top', timeout: 2000 });
  } else {
    $q.notify({ color: "negative", message: res.mensaje, icon: "error", position: 'top' });
  }
};

const handleGenerarDiaria = async () => {
  const res = await lecturaStore.generarLecturaDiaria(user.value?._id);
  if (res.success) {
    $q.notify({ color: "positive", message: res.mensaje || "Guía diaria lista", icon: "today", position: 'top', timeout: 2000 });
  } else {
    $q.notify({ color: "negative", message: res.mensaje, icon: "lock", position: 'top' });
  }
};

const descargarPDF = async () => {
  if (!lecturaActual.value) return;
  if (user.value.estado !== 'activo') {
    $q.notify({ color: 'warning', message: 'PDF exclusivo del Plan Místico', icon: 'lock', actions: [{ label: 'Planes', color: 'white', handler: () => router.push('/planes') }] });
    return;
  }
  $q.loading.show({ message: 'Preparando pergamino...' });
  try {
    const element = document.getElementById('pdf-template');
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#0a0612' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const canvasHeightInMm = (imgProps.height * pdfWidth) / imgProps.width;
    const finalPdf = canvasHeightInMm > pdf.internal.pageSize.getHeight() ? new jsPDF('p', 'mm', [pdfWidth, canvasHeightInMm]) : pdf;
    finalPdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, canvasHeightInMm);
    const tipoLabel = lecturaActual.value.tipo === 'principal' ? 'Principal' : 'Diaria';
    const fechaDescarga = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
    finalPdf.save(`Lectura_${tipoLabel}_${user.value.nombre}_${fechaDescarga}.pdf`);
    $q.notify({ color: 'positive', message: 'Descargado', icon: 'check' });
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error PDF' });
  } finally {
    $q.loading.hide();
  }
};

const handleLogout = () => { authStore.logout(); router.push('/') }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
.title-font { font-family: 'Playfair Display', serif; }
.text-gold { color: #d4af37; }

/* FIX LAYOUT */
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
  max-width: 1200px; 
  width: 100%; 
  padding: 20px 24px; 
  display: flex; 
  flex-direction: column; 
  z-index: 1;
}

/* Board */
.board-row { margin-bottom: 10px; }

/* Sidebar */
.sidebar-mystic { background: #110a1f !important; border-right: none !important; }
.nav-item { border-radius: 10px; margin-bottom: 4px; color: #a094b8; transition: 0.3s; }
.nav-active { background: rgba(212, 175, 55, 0.1) !important; color: #d4af37 !important; }

/* Avatar */
.avatar-mystic-trigger { background: #110a1f; border: 2px solid #d4af37; color: #d4af37; font-weight: 900; }
.pulse-ring { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 4px solid #d4af37; animation: pulse-gold 2s infinite; }
@keyframes pulse-gold { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } }

/* Cards */
.mystic-card-dark { border-radius: 20px; background: #160f24; border: 1px solid rgba(255, 255, 255, 0.05); }
.data-box-dark { background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); }
.membership-card-dark { background: linear-gradient(135deg, #1a0f2e, #0a0612); border-radius: 20px; border: 1px solid rgba(115, 17, 212, 0.2); }

/* Results */
.result-card { 
  background: #160f24; 
  border: 1px solid rgba(212, 175, 55, 0.3); 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
  height: calc(100vh - 240px) !important; /* Altura fija en escritorio para forzar scroll */
}

.scroll-text-area { 
  flex: 1; 
  overflow-y: auto !important; 
  min-height: 0; 
  padding: 30px;
  background: rgba(0, 0, 0, 0.25);
  display: block; /* Asegurar que se comporte como bloque para el scroll */
}

/* Scrollbar personalizada muy visible */
.scroll-text-area::-webkit-scrollbar { 
  width: 10px; 
}
.scroll-text-area::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.scroll-text-area::-webkit-scrollbar-thumb { 
  background: linear-gradient(to bottom, #d4af37, #b8860b);
  border-radius: 5px;
}

.content-text { 
  line-height: 1.8; 
  white-space: pre-line; 
  font-style: italic; 
  font-size: 1.2rem; 
  color: #f0f0f0;
  padding-bottom: 20px;
}

.empty-placeholder { background: rgba(255, 255, 255, 0.02); border-radius: 24px; border: 1px dashed rgba(212, 175, 55, 0.1); width: 100%; height: 100%; }

.btn-gold-link { color: #d4af37; font-weight: bold; border-top: 1px solid rgba(212, 175, 55, 0.1); border-radius: 0; padding-top: 10px; }

/* Responsive Adjustments */
@media (max-width: 1023px) {
  .mystic-dark-layout, .main-content-dark {
    height: auto !important;
    overflow-y: auto !important;
  }
  .container {
    height: auto !important;
    overflow: visible !important;
    padding: 15px;
  }
  .board-row {
    flex: none !important;
    height: auto !important;
    overflow: visible !important;
  }
  .result-card {
    height: 500px !important;
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .empty-placeholder {
    min-height: 300px;
  }
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade { animation: fadeIn 0.8s ease-out; }

/* PDF Styles - Pergamino Místico */
.pdf-container { 
  width: 210mm; 
  min-height: 297mm; 
  padding: 0; 
  background-color: #0a0612; 
  color: #e0e0e0; 
  font-family: 'Playfair Display', serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pdf-border { 
  width: 190mm;
  min-height: 277mm; /* Cambiado de height a min-height */
  border: 2px solid #d4af37; 
  padding: 2mm;
  position: relative;
  margin: 10mm;
  display: flex;
  flex-direction: column;
}

.pdf-inner-border {
  flex: 1; /* Asegura que ocupe todo el espacio del borde */
  border: 1px solid rgba(212, 175, 55, 0.4);
  padding: 15mm;
  display: flex;
  flex-direction: column;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 80%),
    url('https://www.transparenttextures.com/patterns/dark-matter.png');
}

.pdf-header { 
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  padding-bottom: 20px;
}

.pdf-logo { margin-bottom: 10px; }

.pdf-title { 
  font-size: 38pt; 
  color: #d4af37; 
  margin: 0;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.pdf-subtitle {
  font-size: 14pt;
  color: #a094b8;
  letter-spacing: 2px;
  margin-top: 5px;
}

.pdf-body { flex: 1; }

.pdf-user-info { 
  font-size: 12pt;
  margin-bottom: 40px;
  color: #d4af37;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed rgba(212, 175, 55, 0.2);
  padding-bottom: 10px;
}

.pdf-vibration { 
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vibe-label {
  font-size: 10pt;
  text-transform: uppercase;
  color: #a094b8;
  margin-bottom: 10px;
}

.vibe-circle {
  width: 100px;
  height: 100px;
  border: 3px double #d4af37;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
}

.vibe-number { 
  font-size: 42pt; 
  color: #d4af37; 
  font-weight: bold;
}

.pdf-content { 
  line-height: 1.8; 
  white-space: pre-line; 
  font-size: 13pt;
  text-align: justify;
  color: #f0f0f0;
  font-style: italic;
}

.pdf-footer {
  margin-top: auto;
  text-align: center;
  font-size: 10pt;
  color: rgba(212, 175, 55, 0.5);
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  padding-top: 20px;
}
</style>
