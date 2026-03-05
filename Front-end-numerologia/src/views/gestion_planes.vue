<template>
  <q-layout view="hHh lpR fff" class="bg-background-light font-display">
    
    <q-header elevated class="bg-white/80 backdrop-blur text-grey-9 q-py-sm q-px-md lg-px-xl border-bottom-light">
      <q-toolbar class="justify-between">
        <div class="row items-center q-gutter-x-xl">
          <div class="row items-center q-gutter-x-sm text-primary">
            <div class="bg-primary-10 rounded-lg p-2 flex flex-center">
              <q-icon name="auto_awesome" size="sm" color="primary" />
            </div>
            <div class="text-subtitle1 text-weight-bold tracking-tight">Numerología Admin</div>
          </div>
          
          <q-input 
            v-model="filtroBusqueda" 
            dense 
            standout="bg-grey-2 text-grey-9"
            bg-color="grey-2"
            placeholder="Buscar suscriptores..." 
            class="gt-sm"
            style="min-width: 250px; border-radius: 8px; overflow: hidden;"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-5" />
            </template>
          </q-input>
        </div>

        <div class="row items-center q-gutter-x-lg">
          <div class="gt-sm row items-center q-gutter-x-md">
            <a href="#" class="text-grey-6 text-weight-medium text-subtitle2 nav-link">Dashboard</a>
            <a href="#" class="text-grey-6 text-weight-medium text-subtitle2 nav-link">Usuarios</a>
            <a href="#" class="text-primary text-weight-bold text-subtitle2 nav-link active">Suscripciones</a>
            <a href="#" class="text-grey-6 text-weight-medium text-subtitle2 nav-link">Reportes</a>
          </div>
          
          <div class="row items-center q-gutter-x-sm">
            <q-btn flat round color="grey-7" class="bg-grey-2 q-mr-sm" size="sm" icon="notifications" />
            <q-avatar size="40px" class="border-primary-light cursor-pointer">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
            </q-avatar>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md lg-px-xl q-pb-xl mx-auto" style="max-width: 1280px;">
        
        <div class="row justify-between items-center q-mb-xl q-mt-md">
          <div class="col-12 col-md-auto q-mb-md-none q-mb-sm">
            <h1 class="text-h4 text-weight-bolder text-grey-9 q-my-none tracking-tight">Gestión de Suscripciones</h1>
            <p class="text-subtitle1 text-neutral-muted q-mt-sm q-mb-none">Administra los niveles de acceso y monitorea las renovaciones de los místicos.</p>
          </div>
          <div class="col-12 col-md-auto">
            <q-btn 
              color="primary" 
              icon="add" 
              label="Crear Nuevo Plan" 
              unelevated
              class="rounded-lg q-px-md shadow-primary font-bold"
            />
          </div>
        </div>

        <div class="row q-col-gutter-lg q-mb-xl">
          
          <div class="col-12 col-md-4">
            <q-card flat class="plan-card border-light rounded-xl h-full column relative-position overflow-hidden">
              <q-icon name="brightness_5" class="bg-icon" />
              <q-card-section class="q-pb-none z-top">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-h6 text-weight-bold">Plan Básico</div>
                  <q-badge class="bg-accent-gold-10 text-accent-gold text-weight-bold text-caption uppercase q-px-sm py-1">Iniciante</q-badge>
                </div>
                <div class="row items-baseline q-gutter-x-xs">
                  <span class="text-h3 text-weight-bolder">$9.99</span>
                  <span class="text-neutral-muted text-weight-medium">/ mes</span>
                </div>
              </q-card-section>
              <q-card-section class="col grow column justify-between z-top">
                <div class="q-gutter-y-sm q-mb-lg text-grey-7">
                  <div class="row items-center q-gutter-x-sm"><q-icon name="check_circle" color="primary" size="sm" /><span>Lectura diaria de numerología</span></div>
                  <div class="row items-center q-gutter-x-sm"><q-icon name="check_circle" color="primary" size="sm" /><span>Calculadora de nombre básico</span></div>
                  <div class="row items-center q-gutter-x-sm"><q-icon name="check_circle" color="primary" size="sm" /><span>Soporte por email</span></div>
                </div>
                <q-btn outline color="primary" class="full-width rounded-lg font-bold bg-primary-5" icon="edit" label="Editar Plan" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat class="plan-card border-primary-thick shadow-xl rounded-xl h-full column relative-position overflow-hidden scale-card">
              <div class="badge-popular">Más Popular</div>
              <q-icon name="auto_fix_high" class="bg-icon" />
              <q-card-section class="q-pb-none z-top q-mt-sm">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-h6 text-weight-bold text-primary">Plan Astral</div>
                  <q-badge class="bg-primary-10 text-primary text-weight-bold text-caption uppercase q-px-sm py-1">Místico</q-badge>
                </div>
                <div class="row items-baseline q-gutter-x-xs">
                  <span class="text-h3 text-weight-bolder">$19.99</span>
                  <span class="text-neutral-muted text-weight-medium">/ mes</span>
                </div>
              </q-card-section>
              <q-card-section class="col grow column justify-between z-top">
                <div class="q-gutter-y-sm q-mb-lg text-grey-8 text-weight-medium">
                  <div class="row items-center q-gutter-x-sm"><q-icon name="check_circle" color="primary" size="sm" /><span>Todo lo del Plan Básico</span></div>
                  <div class="row items-center q-gutter-x-sm"><q-icon name="check_circle" color="primary" size="sm" /><span>Mapa natal detallado</span></div>
                  <div class="row items-center q-gutter-x-sm"><q-icon name="check_circle" color="primary" size="sm" /><span>Predicciones mensuales personalizadas</span></div>
                  <div class="row items-center q-gutter-x-sm"><q-icon name="check_circle" color="primary" size="sm" /><span>Chat con numerólogo experto</span></div>
                </div>
                <q-btn unelevated color="primary" class="full-width rounded-lg font-bold shadow-md" icon="edit" label="Editar Plan" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat class="plan-card border-light rounded-xl h-full column relative-position overflow-hidden">
              <q-icon name="stars" class="bg-icon" />
              <q-card-section class="q-pb-none z-top">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-h6 text-weight-bold">Plan Cósmico</div>
                  <q-badge class="bg-primary-10 text-primary text-weight-bold text-caption uppercase q-px-sm py-1">Premium</q-badge>
                </div>
                <div class="row items-baseline q-gutter-x-xs">
                  <span class="text-h3 text-weight-bolder">$49.99</span>
                  <span class="text-neutral-muted text-weight-medium">/ año</span>
                </div>
              </q-card-section>
              <q-card-section class="col grow column justify-between z-top">
                <div class="q-gutter-y-sm q-mb-lg text-grey-7">
                  <div class="row items-center q-gutter-x-sm"><q-icon name="check_circle" color="primary" size="sm" /><span>Acceso ilimitado total</span></div>
                  <div class="row items-center q-gutter-x-sm"><q-icon name="check_circle" color="primary" size="sm" /><span>Análisis de compatibilidad estelar</span></div>
                  <div class="row items-center q-gutter-x-sm"><q-icon name="check_circle" color="primary" size="sm" /><span>Soporte VIP 24/7</span></div>
                </div>
                <q-btn outline color="primary" class="full-width rounded-lg font-bold bg-primary-5" icon="edit" label="Editar Plan" />
              </q-card-section>
            </q-card>
          </div>

        </div>

        <div>
          <div class="row justify-between items-center q-mb-md">
            <h2 class="text-h5 text-weight-bold tracking-tight q-my-none">Suscripciones Activas</h2>
            <q-btn flat class="bg-grey-2 text-neutral-muted rounded-lg q-px-sm" icon="filter_list" label="Filtrar" size="sm" />
          </div>

          <q-table
            :rows="suscripciones"
            :columns="columnas"
            row-key="nombre"
            flat
            bordered
            class="rounded-xl border-light shadow-sm"
            table-header-class="bg-grey-1 text-grey-9 text-weight-bold uppercase"
            :pagination="{ rowsPerPage: 5 }"
          >
            <template v-slot:body-cell-usuario="props">
              <q-td :props="props">
                <div class="row items-center q-gutter-x-md">
                  <q-avatar size="32px">
                    <img :src="props.row.avatar">
                  </q-avatar>
                  <span class="text-weight-bold text-grey-9">{{ props.row.nombre }}</span>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-plan="props">
              <q-td :props="props">
                <q-chip 
                  dense
                  :class="obtenerClasePlan(props.row.plan)"
                  class="text-weight-bold text-caption q-px-sm"
                >
                  <q-icon :name="obtenerIconoPlan(props.row.plan)" size="xs" class="q-mr-xs" />
                  {{ props.row.plan }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-acciones="props">
              <q-td :props="props" class="text-center">
                <q-btn flat round size="sm" color="grey-6" icon="settings_backup_restore" class="hover-primary q-mr-xs">
                  <q-tooltip>Modificar Plan</q-tooltip>
                </q-btn>
                <q-btn flat round size="sm" color="grey-6" icon="cancel" class="hover-negative">
                  <q-tooltip>Cancelar</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const filtroBusqueda = ref('')

// Configuración de las columnas de la tabla
const columnas = [
  { name: 'usuario', label: 'Usuario', field: 'nombre', align: 'left', sortable: true },
  { name: 'plan', label: 'Plan Actual', field: 'plan', align: 'left', sortable: true },
  { name: 'inicio', label: 'Fecha de Inicio', field: 'inicio', align: 'left', sortable: true },
  { name: 'renovacion', label: 'Próxima Renovación', field: 'renovacion', align: 'left', sortable: true },
  { name: 'monto', label: 'Monto', field: 'monto', align: 'right', sortable: true, classes: 'text-weight-bold text-grey-9' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

// Datos simulados extraídos de tu diseño HTML
const suscripciones = ref([
  { nombre: 'Ana García', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg', plan: 'Astral', inicio: '01/10/2023', renovacion: '01/11/2023', monto: '$19.99' },
  { nombre: 'Roberto Luna', avatar: 'https://cdn.quasar.dev/img/avatar3.jpg', plan: 'Cósmico', inicio: '15/09/2023', renovacion: '15/09/2024', monto: '$49.99' },
  { nombre: 'Lucía Estelar', avatar: 'https://cdn.quasar.dev/img/avatar4.jpg', plan: 'Básico', inicio: '20/10/2023', renovacion: '20/11/2023', monto: '$9.99' },
  { nombre: 'Marcos Zen', avatar: 'https://cdn.quasar.dev/img/avatar5.jpg', plan: 'Astral', inicio: '05/10/2023', renovacion: '05/11/2023', monto: '$19.99' }
])

// Utilidades para los estilos de los chips según el plan
const obtenerClasePlan = (plan) => {
  switch(plan) {
    case 'Astral': return 'bg-primary-10 text-primary'
    case 'Cósmico': return 'bg-accent-gold-10 text-accent-gold'
    case 'Básico': return 'bg-grey-2 text-grey-7'
    default: return 'bg-grey-2'
  }
}

const obtenerIconoPlan = (plan) => {
  switch(plan) {
    case 'Astral': return 'auto_fix_high'
    case 'Cósmico': return 'stars'
    case 'Básico': return 'brightness_5'
    default: return 'help'
  }
}
</script>

<style scoped>
/* Variables de color base */
:root {
  --q-primary: #7311d4;
}

/* Colores personalizados */
.text-primary { color: #7311d4 !important; }
.bg-primary { background-color: #7311d4 !important; }
.text-accent-gold { color: #eab308 !important; }
.text-neutral-muted { color: #756189 !important; }
.bg-background-light { background-color: #f7f6f8; }

/* Transparencias y bordes */
.bg-primary-5 { background-color: rgba(115, 17, 212, 0.05) !important; }
.bg-primary-10 { background-color: rgba(115, 17, 212, 0.1) !important; }
.bg-accent-gold-10 { background-color: rgba(234, 179, 8, 0.1) !important; }
.border-light { border: 1px solid rgba(115, 17, 212, 0.1); }
.border-bottom-light { border-bottom: 1px solid rgba(115, 17, 212, 0.1); }
.border-primary-thick { border: 2px solid #7311d4; }
.border-primary-light { border: 2px solid rgba(115, 17, 212, 0.2); }

/* Sombras */
.shadow-primary { box-shadow: 0 10px 15px -3px rgba(115, 17, 212, 0.2); }

/* Tipografía */
.font-display { font-family: 'Inter', sans-serif; }
.tracking-tight { letter-spacing: -0.025em; }

/* Formas y layouts */
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.z-top { z-index: 10; }

/* Tarjetas de Planes - Efectos CSS de Tailwind adaptados */
.plan-card { transition: all 0.3s ease; }
.plan-card:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.plan-card .bg-icon {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 80px;
  color: #7311d4;
  opacity: 0.05;
  padding: 16px;
  transition: opacity 0.3s ease;
  z-index: 1;
}
.plan-card:hover .bg-icon { opacity: 0.15; }

/* Plan destacado */
.scale-card { transform: scale(1.03); z-index: 5; }
.badge-popular {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #7311d4;
  color: white;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  padding: 4px 16px;
  border-radius: 9999px;
  z-index: 20;
}

/* Efectos Hover de tabla */
.hover-primary:hover { color: #7311d4 !important; }
.hover-negative:hover { color: #f44336 !important; }

/* Navegación Desktop */
.nav-link { text-decoration: none; position: relative; transition: color 0.3s ease; }
.nav-link:hover { color: #7311d4 !important; }
.nav-link.active { border-bottom: 2px solid #7311d4; padding-bottom: 4px; }
</style>