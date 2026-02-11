<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page>
        <div class="game-container">
          <!-- Fondo con estrellas -->
          <div 
            v-for="n in 30" 
            :key="n" 
            class="sparkle"
            :style="{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's'
            }"
          />

          <!-- Panel superior - Pregunta y número -->
          <div class="top-panel">
            <div class="question-number">
              Pregunta {{ currentQuestion + 1 }} de {{ totalQuestions }}
            </div>
            <div class="prize-amount">
              {{ formatMoney(currentPrize) }}
            </div>
          </div>

          <!-- Pregunta -->
          <div class="question-section">
            <div class="question-box">
              <p class="question-text">{{ questions[currentQuestion].question }}</p>
            </div>
          </div>

          <!-- Opciones de respuesta -->
          <div class="answers-section">
            <div class="answers-grid">
              <div
                v-for="(option, index) in questions[currentQuestion].options"
                :key="index"
                class="answer-option"
                :class="{
                  'selected': selectedAnswer === index,
                  'correct': showResult && index === questions[currentQuestion].correct,
                  'incorrect': showResult && selectedAnswer === index && index !== questions[currentQuestion].correct,
                  'disabled': showResult || selectedAnswer !== null
                }"
                @click="selectAnswer(index)"
              >
                <div class="option-letter">{{ ['A', 'B', 'C', 'D'][index] }}</div>
                <div class="option-text">{{ option }}</div>
              </div>
            </div>
          </div>

          <!-- Comodines -->
          <div class="lifelines-section">
            <q-btn
              v-for="(lifeline, index) in lifelines"
              :key="index"
              :disable="lifeline.used || showResult"
              :class="['lifeline-btn', { 'used': lifeline.used }]"
              rounded
              @click="useLifeline(index)"
            >
              <q-icon :name="lifeline.icon" size="sm" />
              <div class="lifeline-text">{{ lifeline.name }}</div>
            </q-btn>
          </div>

          <!-- Escalera de premios (lateral derecha) -->
          <div class="prize-ladder">
            <div class="ladder-title">PREMIOS</div>
            <div
              v-for="(prize, index) in prizes"
              :key="index"
              class="prize-item"
              :class="{
                'current': index === currentQuestion,
                'completed': index < currentQuestion,
                'milestone': prize.milestone
              }"
            >
              <div class="prize-number">{{ prizes.length - index }}</div>
              <div class="prize-value">{{ formatMoney(prize.amount) }}</div>
            </div>
          </div>

          <!-- Botón de confirmación -->
          <div v-if="selectedAnswer !== null && !showResult" class="confirm-section">
            <q-btn
              class="confirm-btn"
              label="Respuesta Final"
              rounded
              unelevated
              @click="confirmAnswer"
            />
          </div>

          <!-- Diálogo de resultado -->
          <q-dialog v-model="showGameOver" persistent>
            <q-card class="game-over-card">
              <q-card-section class="text-center">
                <q-icon 
                  :name="isWinner ? 'emoji_events' : 'sentiment_dissatisfied'" 
                  :color="isWinner ? 'yellow' : 'red'"
                  size="100px"
                />
                <h4 class="q-mt-md q-mb-sm">
                  {{ isWinner ? '¡FELICITACIONES!' : 'Juego Terminado' }}
                </h4>
                <p class="text-h6">
                  {{ gameOverMessage }}
                </p>
                <p class="text-h5 text-weight-bold text-positive">
                  Premio: {{ formatMoney(finalPrize) }}
                </p>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  label="Volver al Inicio"
                  color="primary"
                  rounded
                  @click="goHome"
                />
                <q-btn
                  label="Jugar de Nuevo"
                  color="positive"
                  rounded
                  @click="restartGame"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

import { useRouter } from 'vue-router'

const router = useRouter()

const $q = useQuasar();

// Estado del juego
const currentQuestion = ref(0);
const selectedAnswer = ref(null);
const showResult = ref(false);
const showGameOver = ref(false);
const isWinner = ref(false);
const finalPrize = ref(0);
const totalQuestions = 15;

// Premios (de menor a mayor)
const prizes = ref([
  { amount: 1000000, milestone: true },
  { amount: 500000, milestone: false },
  { amount: 250000, milestone: false },
  { amount: 125000, milestone: false },
  { amount: 64000, milestone: true },
  { amount: 32000, milestone: false },
  { amount: 16000, milestone: false },
  { amount: 8000, milestone: false },
  { amount: 4000, milestone: false },
  { amount: 2000, milestone: true },
  { amount: 1000, milestone: false },
  { amount: 500, milestone: false },
  { amount: 300, milestone: false },
  { amount: 200, milestone: false },
  { amount: 100, milestone: false }
].reverse());

// Comodines
const lifelines = ref([
  { name: '50:50', icon: 'filter_2', used: false },
  { name: 'Llamada', icon: 'phone', used: false },
  { name: 'Público', icon: 'groups', used: false }
]);

// Preguntas del juego
const questions = ref([
  {
    question: '¿Cuál es la capital de Francia?',
    options: ['Londres', 'Berlín', 'París', 'Madrid'],
    correct: 2
  },
  {
    question: '¿En qué año llegó el hombre a la Luna?',
    options: ['1965', '1969', '1972', '1975'],
    correct: 1
  },
  {
    question: '¿Cuál es el océano más grande del mundo?',
    options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
    correct: 3
  },
  {
    question: '¿Quién pintó la Mona Lisa?',
    options: ['Michelangelo', 'Leonardo da Vinci', 'Rafael', 'Donatello'],
    correct: 1
  },
  {
    question: '¿Cuál es el planeta más grande del sistema solar?',
    options: ['Saturno', 'Neptuno', 'Júpiter', 'Urano'],
    correct: 2
  },
  {
    question: '¿En qué continente se encuentra Egipto?',
    options: ['Asia', 'África', 'Europa', 'Oceanía'],
    correct: 1
  },
  {
    question: '¿Cuántos lados tiene un hexágono?',
    options: ['5', '6', '7', '8'],
    correct: 1
  },
  {
    question: '¿Quién escribió "Don Quijote de la Mancha"?',
    options: ['Lope de Vega', 'Miguel de Cervantes', 'Garcilaso de la Vega', 'Francisco de Quevedo'],
    correct: 1
  },
  {
    question: '¿Cuál es el río más largo del mundo?',
    options: ['Nilo', 'Amazonas', 'Yangtsé', 'Misisipi'],
    correct: 0
  },
  {
    question: '¿En qué año comenzó la Segunda Guerra Mundial?',
    options: ['1937', '1939', '1941', '1943'],
    correct: 1
  },
  {
    question: '¿Cuál es el elemento químico con símbolo Au?',
    options: ['Plata', 'Oro', 'Aluminio', 'Argón'],
    correct: 1
  },
  {
    question: '¿Cuántos continentes hay en la Tierra?',
    options: ['5', '6', '7', '8'],
    correct: 2
  },
  {
    question: '¿Quién fue el primer presidente de Estados Unidos?',
    options: ['Thomas Jefferson', 'George Washington', 'Abraham Lincoln', 'John Adams'],
    correct: 1
  },
  {
    question: '¿En qué país se encuentra la Torre Eiffel?',
    options: ['Italia', 'España', 'Francia', 'Alemania'],
    correct: 2
  },
  {
    question: '¿Cuál es la montaña más alta del mundo?',
    options: ['K2', 'Kangchenjunga', 'Monte Everest', 'Lhotse'],
    correct: 2
  }
]);

// Computed
const currentPrize = computed(() => {
  return prizes.value[currentQuestion.value].amount;
});

const gameOverMessage = computed(() => {
  if (isWinner.value) {
    return '¡Has ganado el premio mayor!';
  } else if (currentQuestion.value === 0) {
    return 'No te llevas ningún premio.';
  } else {
    return `Has llegado a la pregunta ${currentQuestion.value + 1}`;
  }
});

// Métodos
const formatMoney = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

const selectAnswer = (index) => {
  if (showResult.value || selectedAnswer.value !== null) return;
  selectedAnswer.value = index;
};

const confirmAnswer = () => {
  showResult.value = true;
  
  const isCorrect = selectedAnswer.value === questions.value[currentQuestion.value].correct;
  
  if (isCorrect) {
    $q.notify({
      message: '¡Respuesta Correcta!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
      timeout: 2000
    });
    
    setTimeout(() => {
      if (currentQuestion.value === totalQuestions - 1) {
        // Ganó el juego
        isWinner.value = true;
        finalPrize.value = prizes.value[currentQuestion.value].amount;
        showGameOver.value = true;
      } else {
        // Siguiente pregunta
        nextQuestion();
      }
    }, 2000);
  } else {
    $q.notify({
      message: 'Respuesta Incorrecta',
      color: 'negative',
      icon: 'cancel',
      position: 'top',
      timeout: 2000
    });
    
    setTimeout(() => {
      // Calcular premio de seguridad
      finalPrize.value = calculateSafePrize();
      showGameOver.value = true;
    }, 2000);
  }
};

const calculateSafePrize = () => {
  // Encontrar el último hito alcanzado
  for (let i = currentQuestion.value - 1; i >= 0; i--) {
    if (prizes.value[i].milestone) {
      return prizes.value[i].amount;
    }
  }
  return 0;
};

const nextQuestion = () => {
  currentQuestion.value++;
  selectedAnswer.value = null;
  showResult.value = false;
};

const useLifeline = (index) => {
  lifelines.value[index].used = true;
  
  switch (index) {
    case 0: // 50:50
      $q.notify({
        message: 'Comodín 50:50 usado - Se eliminan 2 respuestas incorrectas',
        color: 'info',
        icon: 'info',
        position: 'top',
        timeout: 3000
      });
      break;
    case 1: // Llamada
      $q.notify({
        message: 'Comodín de llamada usado - Tu amigo sugiere una respuesta',
        color: 'info',
        icon: 'phone',
        position: 'top',
        timeout: 3000
      });
      break;
    case 2: // Público
      $q.notify({
        message: 'Comodín del público usado - Opinión de la audiencia',
        color: 'info',
        icon: 'groups',
        position: 'top',
        timeout: 3000
      });
      break;
  }
};

const goHome = () => {
  // Aquí iría la navegación al home
  // router.push({ name: 'home' })
  $q.notify({
    message: 'Volviendo al inicio...',
    color: 'info',
    position: 'top'
  });
};

const restartGame = () => {
  currentQuestion.value = 0;
  selectedAnswer.value = null;
  showResult.value = false;
  showGameOver.value = false;
  isWinner.value = false;
  finalPrize.value = 0;
  lifelines.value.forEach(l => l.used = false);
  
  $q.notify({
    message: 'Nuevo juego iniciado',
    color: 'positive',
    position: 'top'
  });
};
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f4d 50%, #2d3561 100%);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  grid-template-columns: 1fr 250px;
  gap: 20px;
  padding: 20px;
}

.sparkle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: sparkle 3s infinite;
  z-index: 1;
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

/* Panel superior */
.top-panel {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;
}

.question-number {
  font-size: 1.2rem;
  color: #a0c4ff;
  font-weight: 500;
}

.prize-amount {
  font-size: 1.8rem;
  color: #ffd700;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

/* Sección de pregunta */
.question-section {
  grid-column: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.question-box {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.3));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(138, 43, 226, 0.5);
  border-radius: 20px;
  padding: 40px 50px;
  box-shadow: 0 10px 40px rgba(138, 43, 226, 0.3);
  max-width: 800px;
  width: 100%;
}

.question-text {
  font-size: 1.6rem;
  color: white;
  text-align: center;
  margin: 0;
  font-weight: 500;
  line-height: 1.6;
}

/* Sección de respuestas */
.answers-section {
  grid-column: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.answers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  max-width: 900px;
  width: 100%;
}

.answer-option {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 80px;
}

.answer-option:hover:not(.disabled) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.answer-option.selected {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.2));
  border-color: #ffd700;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
}

.answer-option.correct {
  background: linear-gradient(135deg, rgba(0, 255, 0, 0.3), rgba(0, 200, 0, 0.2));
  border-color: #00ff00;
  animation: correctPulse 0.5s ease;
}

.answer-option.incorrect {
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.3), rgba(200, 0, 0, 0.2));
  border-color: #ff0000;
  animation: shake 0.5s ease;
}

.answer-option.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.option-letter {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #0a0e27;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.option-text {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  flex: 1;
}

/* Comodines */
.lifelines-section {
  grid-column: 1;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  z-index: 2;
}

.lifeline-btn {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)) !important;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  padding: 15px 25px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  transition: all 0.3s ease !important;
}

.lifeline-btn:hover:not(.used) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15)) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  transform: translateY(-3px);
}

.lifeline-btn.used {
  opacity: 0.3;
  cursor: not-allowed;
}

.lifeline-text {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Escalera de premios */
.prize-ladder {
  grid-column: 2;
  grid-row: 1 / -1;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  overflow-y: auto;
  z-index: 2;
  max-height: calc(100vh - 40px);
}

.ladder-title {
  text-align: center;
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.prize-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.prize-item.current {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.2));
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  transform: scale(1.05);
}

.prize-item.completed {
  background: rgba(0, 255, 0, 0.1);
  border-color: rgba(0, 255, 0, 0.3);
}

.prize-item.milestone {
  background: rgba(255, 215, 0, 0.15);
  border: 2px solid rgba(255, 215, 0, 0.4);
}

.prize-number {
  color: #a0c4ff;
  font-weight: 600;
  font-size: 0.9rem;
}

.prize-value {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

/* Botón de confirmación */
.confirm-section {
  grid-column: 1;
  display: flex;
  justify-content: center;
  z-index: 2;
  margin-top: -20px;
}

.confirm-btn {
  background: linear-gradient(135deg, #ff8c00, #ff6600) !important;
  color: white !important;
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  padding: 18px 50px !important;
  box-shadow: 0 10px 30px rgba(255, 140, 0, 0.4) !important;
  border: 2px solid #ffaa00 !important;
  letter-spacing: 1px !important;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.confirm-btn:hover {
  box-shadow: 0 15px 40px rgba(255, 140, 0, 0.6) !important;
}

/* Diálogo de fin de juego */
.game-over-card {
  min-width: 400px;
  background: linear-gradient(135deg, #1a1f4d, #2d3561);
  color: white;
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 20px;
}

/* Scrollbar personalizado para la escalera */
.prize-ladder::-webkit-scrollbar {
  width: 8px;
}

.prize-ladder::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.prize-ladder::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 10px;
}

.prize-ladder::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.5);
}

/* Asegurar que no haya scroll */
:deep(body), 
:deep(html),
:deep(#q-app),
:deep(.q-layout),
:deep(.q-page-container),
:deep(.q-page) {
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>