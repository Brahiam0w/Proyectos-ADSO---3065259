<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center bg-gradient">
        <div class="game-container">
          <!-- Pantalla de inicio -->
          <div v-if="gameStore.gameState === 'start'" class="start-screen">
            <h1 class="game-title animate-pulse">
              ¿Quién Quiere Ser<br>
              <span class="text-yellow">Millonario?</span>
            </h1>
            <q-btn
              size="xl"
              color="yellow-9"
              text-color="black"
              label="Comenzar Juego"
              @click="gameStore.startGame"
              class="start-button"
              unelevated
              rounded
            />
          </div>

          <!-- Pantalla del juego -->
          <div v-else-if="gameStore.gameState === 'playing'" class="playing-screen">
            <!-- Panel superior con información -->
            <div class="top-panel">
              <div class="question-info">
                <span class="question-number">Pregunta {{ gameStore.currentQuestionIndex + 1 }} de {{ gameStore.totalQuestions }}</span>
                <span class="current-prize">Premio: ${{ gameStore.currentPrize.toLocaleString() }}</span>
              </div>
              
              <!-- Comodines -->
              <div class="lifelines">
                <q-btn
                  :disable="gameStore.lifelines.fiftyFifty.used"
                  @click="gameStore.useFiftyFifty"
                  color="primary"
                  icon="filter_2"
                  round
                  size="md"
                  class="lifeline-btn"
                >
                  <q-tooltip>50/50</q-tooltip>
                </q-btn>
                <q-btn
                  :disable="gameStore.lifelines.audience.used"
                  @click="gameStore.useAudience"
                  color="green"
                  icon="groups"
                  round
                  size="md"
                  class="lifeline-btn"
                >
                  <q-tooltip>Pregunta al público</q-tooltip>
                </q-btn>
                <q-btn
                  :disable="gameStore.lifelines.phone.used"
                  @click="gameStore.usePhone"
                  color="orange"
                  icon="phone"
                  round
                  size="md"
                  class="lifeline-btn"
                >
                  <q-tooltip>Llamada a un amigo</q-tooltip>
                </q-btn>
              </div>
            </div>

            <!-- Pregunta -->
            <div class="question-box">
              <p class="question-text">{{ gameStore.currentQuestion.question }}</p>
            </div>

            <!-- Opciones de respuesta -->
            <div class="answers-grid">
              <q-btn
                v-for="(option, index) in gameStore.currentQuestion.options"
                :key="index"
                :label="`${String.fromCharCode(65 + index)}: ${option}`"
                :color="getOptionColor(index)"
                :disable="gameStore.optionDisabled[index] || gameStore.answered"
                @click="gameStore.selectAnswer(index)"
                class="answer-btn"
                unelevated
                align="left"
                no-caps
              />
            </div>

            <!-- Información de comodines activos -->
            <div v-if="gameStore.audienceResults" class="audience-results">
              <h3>Resultados del público:</h3>
              <div class="audience-bars">
                <div v-for="(percentage, index) in gameStore.audienceResults" :key="index" class="bar-container">
                  <div class="bar" :style="{ height: percentage + '%' }">
                    <span>{{ percentage }}%</span>
                  </div>
                  <span class="bar-label">{{ String.fromCharCode(65 + index) }}</span>
                </div>
              </div>
            </div>

            <div v-if="gameStore.phoneAdvice" class="phone-advice">
              <q-icon name="phone" size="sm" />
              <span>{{ gameStore.phoneAdvice }}</span>
            </div>

            <!-- Escalera de premios -->
            <div class="prize-ladder">
              <h3>Premios</h3>
              <div
                v-for="(prize, index) in gameStore.prizes"
                :key="index"
                :class="['prize-item', { 
                  'current': index === gameStore.currentQuestionIndex,
                  'completed': index < gameStore.currentQuestionIndex,
                  'safe-haven': prize.safeHaven
                }]"
              >
                <span class="prize-number">{{ gameStore.prizes.length - index }}</span>
                <span class="prize-amount">${{ prize.amount.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Pantalla de fin del juego -->
          <div v-else-if="gameStore.gameState === 'end'" class="end-screen">
            <h1 class="game-over-title">
              {{ gameStore.won ? '¡Felicitaciones!' : 'Juego Terminado' }}
            </h1>
            <div class="final-prize">
              <p>Premio ganado:</p>
              <h2 class="text-yellow">${{ gameStore.finalPrize.toLocaleString() }}</h2>
            </div>
            <div class="end-buttons">
              <q-btn
                label="Jugar de Nuevo"
                color="yellow-9"
                text-color="black"
                @click="gameStore.resetGame"
                size="lg"
                unelevated
                rounded
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useGameStore } from './stores/gameStore'

const gameStore = useGameStore()

const getOptionColor = (index) => {
  if (gameStore.selectedAnswer === null) return 'grey-8'
  
  if (gameStore.selectedAnswer === index) {
    return gameStore.currentQuestion.correct === index ? 'green' : 'red'
  }
  
  if (gameStore.answered && gameStore.currentQuestion.correct === index) {
    return 'green'
  }
  
  return 'grey-8'
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 100vh;
}

.game-container {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
}

/* Pantalla de inicio */
.start-screen {
  text-align: center;
  color: white;
}

.game-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
  text-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.start-button {
  font-size: 1.5rem;
  padding: 15px 40px;
  box-shadow: 0 10px 30px rgba(255, 193, 7, 0.3);
}

/* Pantalla de juego */
.playing-screen {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 20px;
  color: white;
}

.top-panel {
  grid-column: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.question-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.question-number {
  font-size: 1.2rem;
  color: #ffc107;
}

.current-prize {
  font-size: 1.5rem;
  font-weight: bold;
}

.lifelines {
  display: flex;
  gap: 10px;
}

.lifeline-btn {
  transition: all 0.3s;
}

.lifeline-btn:not(:disabled):hover {
  transform: scale(1.1);
}

.question-box {
  grid-column: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #ffc107;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.question-text {
  font-size: 1.8rem;
  text-align: center;
  margin: 0;
}

.answers-grid {
  grid-column: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.answer-btn {
  padding: 20px;
  font-size: 1.1rem;
  min-height: 70px;
  transition: all 0.3s;
}

.answer-btn:not(:disabled):hover {
  transform: translateX(10px);
}

.audience-results {
  grid-column: 1;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.audience-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 150px;
  margin-top: 15px;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.bar {
  width: 60px;
  background: linear-gradient(to top, #4caf50, #8bc34a);
  border-radius: 5px 5px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5px;
  font-weight: bold;
  transition: height 0.5s;
}

.bar-label {
  font-size: 1.2rem;
  font-weight: bold;
}

.phone-advice {
  grid-column: 1;
  background: rgba(255, 152, 0, 0.2);
  border-left: 4px solid #ff9800;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
}

.prize-ladder {
  grid-column: 2;
  grid-row: 1 / -1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

.prize-ladder h3 {
  text-align: center;
  margin-bottom: 15px;
  color: #ffc107;
}

.prize-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

.prize-item.current {
  background: #ffc107;
  color: #000;
  font-weight: bold;
  transform: scale(1.05);
}

.prize-item.completed {
  background: rgba(76, 175, 80, 0.3);
}

.prize-item.safe-haven {
  border: 2px solid #ff9800;
}

.prize-number {
  font-weight: bold;
}

/* Pantalla final */
.end-screen {
  text-align: center;
  color: white;
}

.game-over-title {
  font-size: 3rem;
  margin-bottom: 2rem;
}

.final-prize {
  margin: 3rem 0;
}

.final-prize p {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.final-prize h2 {
  font-size: 4rem;
  font-weight: bold;
  text-shadow: 0 0 30px rgba(255, 193, 7, 0.5);
}

.end-buttons {
  margin-top: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .playing-screen {
    grid-template-columns: 1fr;
  }
  
  .prize-ladder {
    grid-column: 1;
    grid-row: auto;
    max-height: 300px;
  }
  
  .answers-grid {
    grid-template-columns: 1fr;
  }
  
  .game-title {
    font-size: 2rem;
  }
  
  .question-text {
    font-size: 1.3rem;
  }
}
</style>
