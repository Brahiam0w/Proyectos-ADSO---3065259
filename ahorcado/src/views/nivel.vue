<template>
  <div class="contenedor">
    <div class="titulo">
      <h2>📌 Categoría: {{ game.categoryName.value }}</h2>
      <h3>Elige la dificultad</h3>
    </div>

    <div class="nivel-container">
      <q-card
        v-for="nivel in niveles"
        :key="nivel.id"
        class="dificultad-card"
        :style="{ backgroundColor: nivel.color }"
        @click="seleccionarNivel(nivel.id)"
        clickable
        v-ripple
      >
        <q-icon :name="nivel.icon" size="50px" />
        <h4>{{ nivel.nombre }}</h4>
        <p>{{ nivel.descripcion }}</p>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGame } from '../composables/useGame'

const router = useRouter()
const game = useGame()

const niveles = ref([
  { id: 'facil', nombre: 'Fácil', icon: 'sentiment_satisfied', color: '#4CAF50', descripcion: '6 intentos + palabras cortas' },
  { id: 'medio', nombre: 'Medio', icon: 'sentiment_neutral', color: '#FF9800', descripcion: '5 intentos + palabras medias' },
  { id: 'dificil', nombre: 'Difícil', icon: 'sentiment_very_dissatisfied', color: '#F44336', descripcion: '4 intentos + palabras largas' }
])

function seleccionarNivel(dificultad) {
  game.setDifficulty(dificultad)
  if (dificultad === 'dificil') game.maxAttempts.value = 4
  else if (dificultad === 'medio') game.maxAttempts.value = 5
  else game.maxAttempts.value = 6

  game.startNewGame()
  router.push('/juego')
}
</script>

<style scoped>
.contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(120deg, #ff9a9e 0%, #fad0c4 100%);
  min-height: 100vh;
  padding: 20px;
}
.nivel-container {
  display: flex;
  gap: 20px;
}
.dificultad-card {
  width: 200px;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  color: white;
  cursor: pointer;
  box-shadow: 0px 5px 15px rgba(0,0,0,0.3);
  transition: 0.3s;
}
.dificultad-card:hover {
  transform: scale(1.05);
}
</style>
