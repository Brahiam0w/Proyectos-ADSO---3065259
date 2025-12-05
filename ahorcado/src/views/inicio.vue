<template>
  <div class="contenido">
    <div class="my-card">
      <q-img src="/img/ahorcado-fondo1.png" alt="Imagen ejemplo" style="object-fit: contain;" />
    </div>
    <div class="contenedor-inicio">
      <q-input 
        type="text" 
        v-model="nombre"
        label="Escribe tu nombre!"
        class="full-width rounded-borders q-pa-xs text-input"
      />
      <q-btn 
        color="primary" 
        text-color="white" 
        label="Iniciar Juego" 
        @click="iniciarJuego"
        class="text-weight-bold"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombre = ref(localStorage.getItem('nombreJugador') || '')

function iniciarJuego() {
  if (!nombre.value || nombre.value.trim() === '') {
    alert('Por favor ingresa tu nombre')
    return
  }
  
  localStorage.setItem('nombreJugador', nombre.value)
  router.push('/categoria')
}
</script>

<style scoped>
.my-card {
  width: 700px;
  border-radius: 16px;
}

.contenido {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.contenedor-inicio {
  display: flex; 
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  width: 400px;
  gap: 25px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.text-input {
  background: white;
}
</style>