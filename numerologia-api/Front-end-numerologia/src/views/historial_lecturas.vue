<template>
  <q-layout view="lHh Lpr lFf" class="mystical-bg text-dark">

    <!-- NAVBAR -->
    <q-header elevated class="bg-white header-blur">
      <q-toolbar class="container">
        <q-icon name="auto_awesome" color="amber-8" size="28px" />
        <q-toolbar-title class="text-weight-bold text-indigo-10">
          NUMEROLOGÍA
        </q-toolbar-title>

        <q-btn flat label="Inicio" />
        <q-btn flat label="Lecturas" />

        <q-avatar color="amber-2" text-color="amber-9" size="32px">
          JD
        </q-avatar>
      </q-toolbar>
    </q-header>

    <!-- CONTENIDO -->
    <q-page-container>
      <q-page class="q-pa-xl">

        <div class="container">

          <!-- HEADER -->
          <div class="row items-end justify-between q-mb-xl">

            <div>
              <div class="text-h4 text-weight-bold q-mb-sm">
                Tu Historial
              </div>

              <div class="text-grey-7">
                Explora tu viaje a través de los números.
              </div>
            </div>

            <div class="row q-gutter-sm">
              <q-btn
                outline
                icon="filter_list"
                label="Filtrar"
                class="rounded-btn"
              />
              <q-btn
                outline
                icon="sort"
                label="Más recientes"
                class="rounded-btn"
              />
            </div>

          </div>

          <!-- LISTADO -->
          <div class="q-gutter-y-lg">

            <q-card
              v-for="(item, index) in readings"
              :key="index"
              class="clean-card hover-card"
            >
              <div class="row items-center q-col-gutter-lg">

                <!-- CÍRCULO NUMERO -->
                <div class="col-auto">
                  <div class="number-circle">
                    <div class="label">{{ item.tipo }}</div>
                    <div class="number">{{ item.numero }}</div>
                  </div>
                </div>

                <!-- CONTENIDO -->
                <div class="col">
                  <div class="row items-center q-gutter-sm q-mb-xs">
                    <q-chip
                      dense
                      size="sm"
                      color="purple-1"
                      text-color="purple-8"
                    >
                      {{ item.categoria }}
                    </q-chip>

                    <div class="text-caption text-grey-6">
                      <q-icon name="calendar_today" size="14px" class="q-mr-xs"/>
                      {{ item.fecha }}
                    </div>
                  </div>

                  <div class="text-h6 text-weight-bold q-mb-xs">
                    {{ item.titulo }}
                  </div>

                  <div class="text-body2 text-grey-7">
                    {{ item.descripcion }}
                  </div>
                </div>

                <!-- BOTÓN -->
                <div class="col-12 col-md-auto">
                  <q-btn
                    label="Ver lectura"
                    icon-right="arrow_forward"
                    class="gold-btn full-width"
                    unelevated
                  />
                </div>

              </div>
            </q-card>

          </div>

          <!-- PAGINACIÓN -->
          <div class="row justify-center q-mt-xl">
            <q-pagination
              v-model="page"
              :max="3"
              direction-links
              color="amber-8"
              active-color="amber-8"
              boundary-numbers
            />
          </div>

        </div>

      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const page = ref(1);

const readings = ref([
  {
    tipo: "Vida",
    numero: 7,
    categoria: "Carta Natal",
    fecha: "14 OCT 2023",
    titulo: "El Camino del Buscador",
    descripcion: "Un análisis profundo sobre tu propósito de vida y desafíos espirituales..."
  },
  {
    tipo: "Alma",
    numero: 11,
    categoria: "Número Maestro",
    fecha: "02 SEP 2023",
    titulo: "Vibración Maestra: El Iluminado",
    descripcion: "Descubre el potencial oculto de tu número maestro y cómo canalizar su energía..."
  },
  {
    tipo: "Año",
    numero: 4,
    categoria: "Predicción Anual",
    fecha: "28 AGO 2023",
    titulo: "Año Personal 4: Estructura",
    descripcion: "Un año para construir bases sólidas y organizar tu vida material..."
  }
]);
</script>

<style scoped>

/* Fondo místico */
.mystical-bg {
  background: linear-gradient(135deg, #FDFBF7 0%, #F3E8FF 50%, #F5F3FF 100%);
  min-height: 100vh;
}

/* Navbar blur */
.header-blur {
  backdrop-filter: blur(10px);
}

/* Contenedor central */
.container {
  max-width: 1100px;
  margin: auto;
}

/* Card limpia */
.clean-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* Hover elegante */
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px -15px rgba(124, 58, 237, 0.25);
}

/* Círculo número */
.number-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #ffffff, #f1f5f9);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.label {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  color: #94a3b8;
}

.number {
  font-size: 22px;
  font-weight: 800;
  color: #1e1b4b;
}

/* Botón dorado */
.gold-btn {
  background: linear-gradient(to right, #D4AF37, #E6C65B);
  color: white;
  border-radius: 12px;
  font-weight: bold;
  padding: 10px 20px;
}

.gold-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
}

/* Botones redondeados */
.rounded-btn {
  border-radius: 9999px;
}

</style>