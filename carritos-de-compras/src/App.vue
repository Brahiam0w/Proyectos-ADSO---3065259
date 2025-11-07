<template>

  <div class="min-h-screen bg-slate-50">
    <main class="flex gap-4 p-4 m-4 h-[96vh] ">
      <section class="flex-1 bg-gray-200 rounded-2xl p-6 overflow-auto" aria-label="Contenido principal">
        <h2 class="text-lg font-bold text-slate-800 mb-4 uppercase">Productos</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <!-- Card Audífonos -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 overflow-hidden">
              <img src="/img/audifonos.webp" alt="Audífonos"
                class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform">
            </div>
            <div class="p-4 h-48 flex flex-col">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">Audífonos Gaming</h3>
                <p class="text-gray-600 text-sm mt-1">Audífonos gaming con sonido envolvente</p>
              </div>
              <div class="mt-auto flex justify-between items-center">
                <span class="text-xl font-bold text-amber-600">$99.99</span>
                <button class="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 cursor-pointer">
                  Añadir
                </button>
              </div>
            </div>
          </div>

          <!-- Card Celular -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 overflow-hidden">
              <img src="/img/celular.png" alt="Celular"
                class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform">
            </div>
            <div class="p-4 h-48 flex flex-col">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">Smartphone Pro</h3>
                <p class="text-gray-600 text-sm mt-1">Último modelo con cámara profesional</p>
              </div>
              <div class="mt-auto flex justify-between items-center">
                <span class="text-xl font-bold text-amber-600">$899.99</span>
                <button class="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 cursor-pointer">
                  Añadir
                </button>
              </div>
            </div>
          </div>

          <!-- Card Mando -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 overflow-hidden">
              <img src="/img/mando.jpg" alt="Mando"
                class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform">
            </div>
            <div class="p-4 h-48 flex flex-col">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">Control Gaming</h3>
                <p class="text-gray-600 text-sm mt-1">Control inalámbrico para gaming</p>
              </div>
              <div class="mt-auto flex justify-between items-center">
                <span class="text-xl font-bold text-amber-600">$59.99</span>
                <button class="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 cursor-pointer">
                  Añadir
                </button>
              </div>
            </div>
          </div>

          <!-- Card Monitor -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 overflow-hidden">
              <img src="/img/monitor.webp" alt="Monitor"
                class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform">
            </div>
            <div class="p-4 h-48 flex flex-col">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">Monitor Gaming</h3>
                <p class="text-gray-600 text-sm mt-1">Monitor 144Hz Ultra HD</p>
              </div>
              <div class="mt-auto flex justify-between items-center">
                <span class="text-xl font-bold text-amber-600">$299.99</span>
                <button class="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 cursor-pointer">
                  Añadir
                </button>
              </div>
            </div>
          </div>

          <!-- Card Mouse -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 overflow-hidden">
              <img src="/img/mouse.webp" alt="Mouse"
                class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform">
            </div>
            <div class="p-4 h-48 flex flex-col">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">Mouse Gaming</h3>
                <p class="text-gray-600 text-sm mt-1">Mouse ergonómico RGB</p>
              </div>
              <div class="mt-auto flex justify-between items-center">
                <span class="text-xl font-bold text-amber-600">$45.99</span>
                <button class="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 cursor-pointer">
                  Añadir
                </button>
              </div>
            </div>
          </div>

          <!-- Card Portátil -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 overflow-hidden">
              <img src="/img/portatil.jpg" alt="Portátil"
                class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform">
            </div>
            <div class="p-4 h-48 flex flex-col">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">Laptop Gaming</h3>
                <p class="text-gray-600 text-sm mt-1">Portátil gaming de última generación</p>
              </div>
              <div class="mt-auto flex justify-between items-center">
                <span class="text-xl font-bold text-amber-600">$1299.99</span>
                <button class="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 cursor-pointer">
                  Añadir
                </button>
              </div>
            </div>
          </div>

          <!-- Card Silla -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 overflow-hidden">
              <img src="/img/silla.webp" alt="Silla"
                class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform">
            </div>
            <div class="p-4 h-48 flex flex-col">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">Silla Gaming</h3>
                <p class="text-gray-600 text-sm mt-1">Silla ergonómica para gaming</p>
              </div>
              <div class="mt-auto flex justify-between items-center">
                <span class="text-xl font-bold text-amber-600">$199.99</span>
                <button class="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 cursor-pointer">
                  Añadir
                </button>
              </div>
            </div>
          </div>

          <!-- Card Teclado -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div class="h-48 overflow-hidden">
              <img src="/img/teclado.webp" alt="Teclado"
                class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform">
            </div>
            <div class="p-4 h-48 flex flex-col">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">Teclado Mecánico</h3>
                <p class="text-gray-600 text-sm mt-1">Teclado mecánico RGB</p>
              </div>
              <div class="mt-auto flex justify-between items-center">
                <span class="text-xl font-bold text-amber-600">$89.99</span>
                <button class="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 cursor-pointer">
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="w-1/4 min-w-[300px] bg-white rounded-2xl shadow-lg flex flex-col h-full" aria-label="Carrito de compras">
        <!-- Encabezado fijo -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-800">Carrito</h2>
            <span class="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">(7) items</span>
          </div>
        </div>

        <!-- Área scrolleable de productos -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <!-- Item 1: Audífonos -->
          <div class="bg-gray-50 rounded-lg p-4 flex gap-4">
            <img src="/img/audifonos.webp" alt="Audífonos" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
              <h3 class="text-slate-800 font-medium">Audífonos Gaming</h3>
              <p class="text-amber-600 font-bold">$99.99</p>
              <div class="flex items-center gap-2 mt-2">
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">-</button>
                <span class="text-gray-800">1</span>
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">+</button>
                <button class="ml-auto text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Item 2: Mouse -->
          <div class="bg-gray-50 rounded-lg p-4 flex gap-4">
            <img src="/img/mouse.webp" alt="Mouse" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
              <h3 class="text-slate-800 font-medium">Mouse Gaming</h3>
              <p class="text-amber-600 font-bold">$45.99</p>
              <div class="flex items-center gap-2 mt-2">
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">-</button>
                <span class="text-gray-800">2</span>
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">+</button>
                <button class="ml-auto text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Item 3: Monitor -->
          <div class="bg-gray-50 rounded-lg p-4 flex gap-4">
            <img src="/img/monitor.webp" alt="Monitor" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
              <h3 class="text-slate-800 font-medium">Monitor Gaming</h3>
              <p class="text-amber-600 font-bold">$299.99</p>
              <div class="flex items-center gap-2 mt-2">
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">-</button>
                <span class="text-gray-800">1</span>
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">+</button>
                <button class="ml-auto text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Item 4: Teclado -->
          <div class="bg-gray-50 rounded-lg p-4 flex gap-4">
            <img src="/img/teclado.webp" alt="Teclado" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
              <h3 class="text-slate-800 font-medium">Teclado Mecánico</h3>
              <p class="text-amber-600 font-bold">$89.99</p>
              <div class="flex items-center gap-2 mt-2">
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">-</button>
                <span class="text-gray-800">1</span>
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">+</button>
                <button class="ml-auto text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Item 5: Silla -->
          <div class="bg-gray-50 rounded-lg p-4 flex gap-4">
            <img src="/img/silla.webp" alt="Silla" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
              <h3 class="text-slate-800 font-medium">Silla Gaming</h3>
              <p class="text-amber-600 font-bold">$199.99</p>
              <div class="flex items-center gap-2 mt-2">
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">-</button>
                <span class="text-gray-800">1</span>
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">+</button>
                <button class="ml-auto text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Item 6: Laptop -->
          <div class="bg-gray-50 rounded-lg p-4 flex gap-4">
            <img src="/img/portatil.jpg" alt="Laptop" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
              <h3 class="text-slate-800 font-medium">Laptop Gaming</h3>
              <p class="text-amber-600 font-bold">$1299.99</p>
              <div class="flex items-center gap-2 mt-2">
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">-</button>
                <span class="text-gray-800">1</span>
                <button class="bg-gray-200 text-gray-600 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300">+</button>
                <button class="ml-auto text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Área fija de totales y botón de pago -->
        <div class="p-6 border-t border-gray-200 bg-white">
          <div class="space-y-4">
            <div class="flex justify-between text-slate-800">
              <span>Subtotal</span>
              <span class="font-medium">$2,035.94</span>
            </div>
            <div class="flex justify-between text-slate-800">
              <span>Envío</span>
              <span class="font-medium">$15.00</span>
            </div>
            <div class="flex justify-between text-slate-800 text-lg font-bold">
              <span>Total</span>
              <span>$2,050.94</span>
            </div>
            
            <button class="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors">
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>

</script>

<style></style>
