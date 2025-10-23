<template>
  <div class="flex justify-around">
    <div>
      <div class="flex flex-col min-h-screen">
        <header class="border-b border-primary/20 dark:border-primary/30"></header>

        <main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div class="w-full max-w-md space-y-8">
            <div>
              <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Calculadora de IMC
              </h2>
              <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Calcula tu Índice de Masa Corporal.
              </p>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="calcular" class="mt-8 space-y-6">
              <div class="rounded-lg shadow-sm -space-y-px">
                <div>
                  <label id="nombre" class="sr-only" for="name">Nombre</label>
                  <input
                    v-model="Nombre"
                    class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark rounded-t-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Nombre"
                    type="text"
                  />
                </div>
                <div>
                  <label class="sr-only" for="weight">Peso (kg)</label>
                  <input
                    v-model="Peso"
                    class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Peso (kg)"
                    type="number"
                  />
                </div>
                <div>
                  <input
                    v-model="Estatura"
                    class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-background-light dark:bg-background-dark rounded-b-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Estatura (m, Ejemplo: 1.6)"
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="group relative w-full flex justify-center py-3 px-4 border text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-primary cursor-pointer border-amber-400"
                >
                  Calcular IMC
                </button>

                <div v-if="error" class="mt-4 text-center text-red-600">
                  {{ error }}
                </div>

                <div v-if="mostrarResultado" class="mt-4 text-center">
                  <p>{{ NombreGuardado }}, tu IMC es de: {{ imc }}</p>
                  <p class="mt-2">
                    Estado:
                    <span
                      v-if="parseFloat(imc) < 18.5"
                      class="font-bold text-amber-300"
                      >Bajo peso</span
                    >
                    <span
                      v-else-if="parseFloat(imc) >= 18.5 && parseFloat(imc) < 24.9"
                      class="font-bold text-green-600"
                      >Peso normal</span
                    >
                    <span
                      v-else-if="parseFloat(imc) >= 24.9 && parseFloat(imc) < 29.9"
                      class="font-bold text-amber-700"
                      >Sobrepeso</span
                    >
                    <span
                      v-else-if="parseFloat(imc) >= 30"
                      class="font-bold text-red-700"
                      >Obesidad</span
                    >
                  </p>
                </div>
              </div>
            </form>

            <!-- Tabla de registros -->
            <div v-if="registros.length > 0" class="mt-8">
              <h3 class="text-lg font-semibold mb-4">Historial de Registros</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatura (m)</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMC</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="registro in registros" :key="registro.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registro.id }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ registro.nombre }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registro.peso }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registro.estatura }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ registro.imc }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          :class="{
                            'px-2 py-1 rounded-full text-xs font-semibold': true,
                            'bg-blue-100 text-blue-800': registro.estado === 'Bajo peso',
                            'bg-green-100 text-green-800': registro.estado === 'Peso normal',
                            'bg-yellow-100 text-yellow-800': registro.estado === 'Sobrepeso',
                            'bg-red-100 text-red-800': registro.estado === 'Obesidad'
                          }"
                        >
                          {{ registro.estado }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Imágenes del resultado -->
    <div>
      <img v-if="mostrarResultado && imc < 18.5" src="/img/bajo.jpg" alt="bajo" />
      <img v-else-if="mostrarResultado && imc >= 18.5 && imc < 24.9" src="/img/normal.png" alt="normal" />
      <img v-else-if="mostrarResultado && imc >= 24.9 && imc < 29.9" src="/img/sobrepeso.webp" alt="sobrepeso" />
      <img v-else-if="mostrarResultado && imc >= 30" src="/img/obeso.jpg" alt="obesidad" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let Peso = ref("");
let Estatura = ref("");
let Nombre = ref("");
let NombreGuardado = ref(""); // Guardará el nombre del último cálculo
let imc = ref("");
let registros = ref([]);
let mostrarResultado = ref(false);
let error = ref("");

function validarDatos() {
  if (!Nombre.value.trim()) {
    error.value = "Por favor ingresa tu nombre";
    return false;
  }
  if (!Peso.value || Peso.value <= 0) {
    error.value = "Por favor ingresa un peso válido";
    return false;
  }
  if (!Estatura.value || Estatura.value < 0.5 || Estatura.value > 2.5) {
    error.value = "Por favor ingresa una estatura válida (entre 0.5 y 2.5 metros)";
    return false;
  }
  error.value = "";
  return true;
}

function calcular() {
  if (!validarDatos()) {
    mostrarResultado.value = false;
    return;
  }

  const imcCalculado = (Peso.value / (Estatura.value * Estatura.value)).toFixed(2);
  imc.value = imcCalculado;
  mostrarResultado.value = true;
  NombreGuardado.value = Nombre.value; // Guardamos el nombre mostrado

  // Guardar el registro actual
  registros.value.push({
    id: registros.value.length + 1,
    nombre: Nombre.value,
    peso: Peso.value,
    estatura: Estatura.value,
    imc: imcCalculado,
    estado: obtenerEstado(imcCalculado)
  });

  // Limpiar solo los campos del formulario
  Nombre.value = "";
  Peso.value = "";
  Estatura.value = "";
}

function obtenerEstado(imcValor) {
  const valor = parseFloat(imcValor);
  if (valor < 18.5) return "Bajo peso";
  if (valor >= 18.5 && valor < 24.9) return "Peso normal";
  if (valor >= 24.9 && valor < 29.9) return "Sobrepeso";
  return "Obesidad";
}
</script>

<style></style>
