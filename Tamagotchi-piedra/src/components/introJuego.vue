<!-- Introduccion donde tenemos posibilidades de ingresar nombre a la piedra y dar play al juego -->
<template>
  <div class="pantalla-presentacion">
    <div class="contenido-presentacion">
      <div class="tarjeta-presentacion">
        <h1 class="titulo-presentacion">¡Bienvenido a Piedra Virtual!</h1>
        
        <div class="imagen-presentacion">
          <img src="/img/piedra.png" alt="piedra" class="piedra-presentacion" />
        </div>
        
        <div class="formulario-nombre">
          <q-input
            v-model="nombreLocal"
            label="¿Cómo quieres llamar a tu piedra?"
            class="input-nombre"
            filled
            color="primary"
            maxlength="20"
            counter
            :rules="[val => !!val || '¡Tu piedra necesita un nombre!']"
          />
          
          <q-btn
            @click="emitirNombre"
            color="primary"
            size="lg"
            class="boton-comenzar"
            icon-right="play_arrow"
            label="Comenzar"
            :disable="!nombreLocal"
          />
        </div>
        
        <div class="consejos">
          <p class="texto-consejo">💡 <strong>Consejo:</strong> Cuida a tu piedra como si fuera real... pero recuerda que es una piedra.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nombreLocal = ref('')
const emit = defineEmits(['comenzar'])

const emitirNombre = () => {
  if (nombreLocal.value.trim()) {
    emit('comenzar', nombreLocal.value)
  }
}
</script>

<style scoped>
.pantalla-presentacion {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.contenido-presentacion {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.tarjeta-presentacion {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.titulo-presentacion {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.imagen-presentacion {
  margin: 30px 0;
}

.piedra-presentacion {
  width: 150px;
  height: 150px;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
  animation: flotar 3s ease-in-out infinite;
}

@keyframes flotar {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.formulario-nombre {
  margin: 30px 0;
}

.input-nombre {
  margin-bottom: 20px;
}

.boton-comenzar {
  width: 100%;
  font-size: 1.1rem;
  font-weight: bold;
}

.consejos {
  margin-top: 30px;
  padding: 15px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 10px;
}

.texto-consejo {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}
</style>