<template>
  <q-layout view="hHh lpR fff" class="bg-page-bg font-display">
    
    <q-header elevated class="bg-white text-grey-8 q-py-sm q-px-lg lg-px-xl">
      <q-toolbar class="justify-between">
        <div class="row items-center q-gutter-x-md">
          <div class="row items-center q-gutter-x-sm text-primary">
            <q-icon name="auto_awesome" size="md" />
            <div class="text-h6 text-weight-bolder tracking-tight">Numerología Admin</div>
          </div>
          
          <div class="gt-sm row items-center q-gutter-x-lg q-ml-xl">
            <a href="#" class="text-grey-6 text-weight-bold text-subtitle2 nav-link">Dashboard</a>
            <a href="#" class="text-primary text-weight-bold text-subtitle2 nav-link active">Usuarios</a>
            <a href="#" class="text-grey-6 text-weight-bold text-subtitle2 nav-link">Reportes</a>
            <a href="#" class="text-grey-6 text-weight-bold text-subtitle2 nav-link">Ajustes</a>
          </div>
        </div>

        <div class="row items-center q-gutter-x-sm">
          <q-btn flat round color="grey-6" icon="notifications" class="hover-primary" />
          <q-btn flat round color="grey-6" icon="light_mode" class="hover-primary" />
          <q-avatar size="40px" class="q-ml-md border-primary-light cursor-pointer">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-lg lg-px-xl row justify-center">
        <div class="max-w-1200 col-12">
          
          <div class="row justify-between items-end q-mb-xl q-col-gutter-y-md">
            <div>
              <h1 class="text-h3 text-primary text-weight-bolder q-my-none tracking-tight">Gestión de Usuarios</h1>
              <p class="text-subtitle1 text-grey-6 text-weight-medium q-mt-sm">Supervisa y administra los perfiles de la comunidad mística.</p>
            </div>
            
            <div class="row items-center q-gutter-x-md">
              <q-input 
                v-model="filtro" 
                outlined 
                dense 
                placeholder="Buscar por nombre o correo..." 
                class="bg-white"
                style="min-width: 320px; border-radius: 12px;"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="grey-5" />
                </template>
              </q-input>
              <q-btn 
                color="primary" 
                icon="person_add" 
                label="Añadir Usuario" 
                unelevated
                class="btn-shadow rounded-xl q-px-md q-py-sm text-weight-bold"
              />
            </div>
          </div>

          <q-tabs
            v-model="tabActual"
            dense
            class="text-grey-6 q-mb-md border-bottom-light"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="todos" label="Todos" />
            <q-tab name="admin" label="Administradores" />
            <q-tab name="usuarios" label="Usuarios" />
          </q-tabs>

          <q-table
            :rows="usuariosFiltrados"
            :columns="columnas"
            row-key="correo"
            flat
            bordered
            :filter="filtro"
            class="rounded-2xl shadow-sm text-left"
            table-header-class="bg-grey-1 text-grey-6 text-weight-bold uppercase"
            :rows-per-page-options="[5, 10, 20]"
          >
            <template v-slot:body-cell-nombre="props">
              <q-td :props="props">
                <div class="row items-center q-gutter-x-sm">
                  <q-avatar size="36px" color="primary" text-color="primary" class="bg-primary-10 text-weight-bold text-body2 border-primary-20">
                    {{ obtenerIniciales(props.row.nombre) }}
                  </q-avatar>
                  <span class="text-weight-bold text-grey-9">{{ props.row.nombre }}</span>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-rol="props">
              <q-td :props="props">
                <q-chip 
                  dense 
                  :color="props.row.rol === 'Admin' ? 'primary' : 'grey-2'" 
                  :text-color="props.row.rol === 'Admin' ? 'primary' : 'grey-7'"
                  :class="props.row.rol === 'Admin' ? 'bg-primary-10' : ''"
                  class="text-weight-bold text-caption q-px-sm"
                >
                  {{ props.row.rol }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <div class="row items-center q-gutter-x-sm">
                  <div :class="`size-2 rounded-full ${props.row.estado === 'Activo' ? 'bg-positive' : 'bg-negative'}`"></div>
                  <span :class="`text-weight-bold ${props.row.estado === 'Activo' ? 'text-positive' : 'text-negative'}`">
                    {{ props.row.estado }}
                  </span>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-acciones="props">
              <q-td :props="props" class="text-right">
                <q-btn flat round size="sm" class="text-accent-gold hover-scale" icon="edit" />
              </q-td>
            </template>
          </q-table>

        </div>
      </q-page>
    </q-page-container>

    <q-footer class="bg-white text-grey-5 border-top-light q-py-md q-px-lg lg-px-xl">
      <div class="row justify-between items-center text-subtitle2 max-w-1200 q-mx-auto w-full">
        <p class="q-my-none">© 2024 Numerología Admin. Todos los derechos reservados.</p>
        <div class="row q-gutter-x-lg">
          <a href="#" class="text-grey-5 hover-primary" style="text-decoration: none;">Privacidad</a>
          <a href="#" class="text-grey-5 hover-primary" style="text-decoration: none;">Términos</a>
          <a href="#" class="text-grey-5 hover-primary" style="text-decoration: none;">Soporte</a>
        </div>
      </div>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'

// Estados
const filtro = ref('')
const tabActual = ref('todos')

// Configuración de Tabla
const columnas = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'correo', label: 'Correo', field: 'correo', align: 'left', sortable: true },
  { name: 'rol', label: 'Rol', field: 'rol', align: 'left', sortable: true },
  { name: 'estado', label: 'Estado de Membresía', field: 'estado', align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha de Registro', field: 'fecha', align: 'left', sortable: true },
  { name: 'acciones', label: 'Acciones', align: 'right' }
]

// Datos simulados (Reemplazar con tu llamada a la API en Node.js/MongoDB)
const usuarios = ref([
  { nombre: 'Alejandro Magno', correo: 'ale@misterio.com', rol: 'Admin', estado: 'Activo', fecha: '12/01/2024' },
  { nombre: 'Elena Mística', correo: 'elena@cosmos.es', rol: 'Usuario', estado: 'Inactivo', fecha: '15/01/2024' },
  { nombre: 'Julián Astro', correo: 'julian@vibracion.com', rol: 'Usuario', estado: 'Activo', fecha: '20/01/2024' },
  { nombre: 'Sofía Oráculo', correo: 'sofia@luna.com', rol: 'Admin', estado: 'Activo', fecha: '22/01/2024' }
])

// Lógica de filtrado por tabs
const usuariosFiltrados = computed(() => {
  if (tabActual.value === 'admin') return usuarios.value.filter(u => u.rol === 'Admin')
  if (tabActual.value === 'usuarios') return usuarios.value.filter(u => u.rol === 'Usuario')
  return usuarios.value
})

// Utilidad para extraer iniciales
const obtenerIniciales = (nombre) => {
  return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}
</script>

<style scoped>
/* Integración de colores personalizados del diseño original */
:root {
  --q-primary: #7311d4;
}

.text-primary { color: #7311d4 !important; }
.bg-primary { background-color: #7311d4 !important; }
.text-accent-gold { color: #eab308 !important; }
.bg-page-bg { background-color: #F8F8FA; }

.bg-primary-10 { background-color: rgba(115, 17, 212, 0.1) !important; }
.border-primary-20 { border: 1px solid rgba(115, 17, 212, 0.2); }
.border-primary-light { border: 2px solid rgba(115, 17, 212, 0.2); }
.border-bottom-light { border-bottom: 1px solid #e2e8f0; }
.border-top-light { border-top: 1px solid #e2e8f0; }

.font-display { font-family: 'Inter', sans-serif; }
.tracking-tight { letter-spacing: -0.025em; }
.max-w-1200 { max-width: 1200px; width: 100%; }
.lg-px-xl { padding-left: 2.5rem; padding-right: 2.5rem; }

.rounded-xl { border-radius: 0.75rem; }
.rounded-2xl { border-radius: 1rem; }
.size-2 { width: 0.5rem; height: 0.5rem; }

.btn-shadow { box-shadow: 0 10px 15px -3px rgba(115, 17, 212, 0.2), 0 4px 6px -4px rgba(115, 17, 212, 0.1); }

/* Efectos Hover */
.hover-primary:hover { color: #7311d4 !important; background-color: rgba(115, 17, 212, 0.1); transition: all 0.3s ease; }
.hover-scale:hover { transform: scale(1.1); transition: transform 0.2s ease; }

/* Navegación Desktop */
.nav-link { text-decoration: none; position: relative; transition: color 0.3s ease; }
.nav-link:hover { color: #7311d4 !important; }
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #7311d4;
  border-radius: 9999px;
}
</style>