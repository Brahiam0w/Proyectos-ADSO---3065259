<template>
  <q-layout view="lHh Lpr lFf">
    <!-- ENCABEZADO -->
    <q-header elevated class="bg-amber-6 text-white">
      <q-toolbar>
        <q-toolbar-title>Mi Tienda Gaming</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container>
      <q-page>
        <div class="row q-col-gutter-md">
          
          <!-- Sección de productos -->
          <div class="col column bg-grey-3 rounded-borders q-pa-md products-wrap justify-center items-center " style="width: 1200px;">
            <h2 class="text-h6 text-bold text-grey-9 q-mb-md text-uppercase">Productos</h2>

            <!-- Aquí solo esta zona hace scroll -->
            <div class="products-scroll">
              <div class="row q-col-gutter-md q-ma-xs items-center justify-center">
                <q-card
                  v-for="(p, i) in productos"
                  :key="i"
                  class="col-xs-12 col-sm-6 col-md-4 col-lg-3 hover-shadow q-ma-xs"
                >
                  <div class="product-img-container">
                    <q-img 
                      :src="p.img" 
                      :alt="p.nombre" 
                      :ratio="4/3"
                      fit="contain"
                      class="cursor-pointer"
                      spinner-color="amber"
                    />
                  </div>
                  
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-bold">{{ p.nombre }}</div>
                    <div class="text-caption text-grey-7">{{ p.desc }}</div>
                  </q-card-section>
                  
                  <q-card-actions class="items-center justify-between q-pa-lg">
                    <div class="text-h7 text-amber-8">${{ p.precio }}</div>
                    <q-btn
                    class="hover-shadow"
                      color="amber-6"
                      label="Añadir"
                      @click="agregar(p)"
                    />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </div>

          <!-- Sección del carrito -->
          <div class="col-12 col-md-3 column bg-white rounded-borders shadow-2 cart-wrap q-pa-none q-ma-lg" style="max-height: 550px;">
            <!-- Encabezado carrito -->
            <div class="q-pa-md border-bottom">
              <div class="row justify-between items-center">
                <div class="text-h6 text-grey-9">Carrito</div>
                <q-badge color="amber" text-color="white" class="items-center">
                  ({{ carrito.length }}) items
                </q-badge>
              </div>
            </div>

            <!-- Lista productos carrito: solo esta zona scroll -->
            <div class="cart-scroll q-pa-md">
              <div
                v-for="(item, index) in carrito"
                :key="index"
                class="bg-grey-2 rounded-borders q-pa-sm q-mb-sm row items-center"
              >
                <q-img 
                  :src="item.img" 
                  :ratio="1"
                  fit="contain"
                  position="center center"
                  style="width: 60px; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);" 
                  class="rounded-borders" 
                />
                
                <div class="q-ml-sm col">
                  <div class="text-subtitle2">{{ item.nombre }}</div>
                  <div class="text-amber-7 text-weight-bold">${{ item.precio }}</div>
                  <div class="row items-center q-gutter-x-xs q-mt-xs">
                    <q-btn size="xs" flat dense round icon="remove" @click="disminuir(index)" />
                    <span>{{ item.cantidad }}</span>
                    <q-btn size="xs" flat dense round icon="add" @click="incrementar(index)" />
                    <q-btn
                      size="xs"
                      flat
                      dense
                      round
                      icon="delete"
                      color="red"
                      class="q-ml-auto"
                      @click="eliminar(index)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Totales (fijo, no scroll) -->
            <div class="q-pa-md border-top bg-white checkout-area">
              <div class="row justify-between text-grey-9">
                <span>Subtotal</span>
                <span class="text-weight-medium">${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="row justify-between text-grey-9">
                <span>Envío</span>
                <span class="text-weight-medium">$15.00</span>
              </div>
              <div class="row justify-between text-h6 text-weight-bold text-grey-9">
                <span>Total</span>
                <span>${{ (subtotal + 15).toFixed(2) }}</span>
              </div>

              <q-btn
                label="Proceder al pago"
                color="amber-6"
                class="full-width q-mt-md"
                unelevated
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      productos: [
        { nombre: 'Audífonos Gaming', desc: 'Sonido envolvente', precio: 99.99, img: '/img/audifonos.webp' },
        { nombre: 'Smartphone Pro', desc: 'Cámara profesional', precio: 899.99, img: '/img/celular.png' },
        { nombre: 'Control Gaming', desc: 'Inalámbrico', precio: 59.99, img: '/img/mando.jpg' },
        { nombre: 'Monitor Gaming', desc: '144Hz Ultra HD', precio: 299.99, img: '/img/monitor.webp' },
        { nombre: 'Mouse Gaming', desc: 'Ergonómico RGB', precio: 45.99, img: '/img/mouse.webp' },
        { nombre: 'Laptop Gaming', desc: 'Alta gama', precio: 1299.99, img: '/img/portatil.jpg' },
        { nombre: 'Silla Gaming', desc: 'Ergonómica', precio: 199.99, img: '/img/silla.webp' },
        { nombre: 'Teclado Mecánico', desc: 'RGB', precio: 89.99, img: '/img/teclado.webp' },
        { nombre: 'Audifonos Diadema' , desc : 'Cancelación de ruido', precio: 99.99, img: '/img/audifonos-diadema.webp'}
      ],
      carrito: []
    }
  },
  computed: {
    subtotal() {
      return this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
    }
  },
  methods: {
    agregar(prod) {
      const encontrado = this.carrito.find(p => p.nombre === prod.nombre)
      if (encontrado) {
        encontrado.cantidad++
      } else {
        this.carrito.push({ ...prod, cantidad: 1 })
      }
    },
    incrementar(i) {
      this.carrito[i].cantidad++
    },
    disminuir(i) {
      if (this.carrito[i].cantidad > 1) this.carrito[i].cantidad--
    },
    eliminar(i) {
      this.carrito.splice(i, 1)
    }
  }
}
</script>

<style>
/* Contenedor de imagen con fondo degradado */
.product-img-container {
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  display: contents;
}

.product-img-container .q-img {
  border-radius: 8px;
}

/* el area de productos ocupa el espacio restante y su lista hace scroll */
.products-wrap {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  max-height: 800px;
}

/* la lista de tarjetas hace scroll interno */
.products-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* carrito: estructura para que la lista haga scroll y los totales queden fijos */
.cart-wrap {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  max-height: 800px;
  position: sticky;
  top: 70px;
}

/* la lista del carrito */
.cart-scroll {
  flex: 1;
  overflow-y: auto;
}

/* area de totales fija al final */
.checkout-area {
  border-top: 1px solid #e0e0e0;
}

.rounded-borders {
  border-radius: 12px;
}

.border-top {
  border-top: 1px solid #e0e0e0;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

/* Mejora el hover de las tarjetas con transición suave */
.hover-shadow {
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

/* Asegura que las tarjetas tengan altura uniforme */
.hover-shadow .q-card__section {
  flex: 1;
}
</style>