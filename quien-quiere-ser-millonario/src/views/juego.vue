<template>
  <div class="game-container">
    <header class="header">
      <div class="logo-area">
        <h1 class="game-title">WHO WANTS TO BE A<br><span class="title-highlight">MILLIONAIRE</span></h1>
      </div>
      
      <div class="lifelines-area">
        <div class="timer-badge">50:50</div>
        <button 
          v-for="(lifeline, index) in lifelines" 
          :key="index"
          class="lifeline-btn"
          :class="{ 'used': lifeline.used }"
          :disabled="lifeline.used || showResult"
          @click="useLifeline(index)"
        >
          <span class="lifeline-icon">{{ lifeline.icon }}</span>
        </button>
      </div>
    </header>

    <div class="main-layout">
      <div class="game-board">
        
        <div class="question-wrapper">
          <div class="hex-border">
            <div class="hex-content question-box">
              {{ questions[currentQuestion].question }}
            </div>
          </div>
          <div class="line-connector left"></div>
          <div class="line-connector right"></div>
        </div>

        <div class="answers-grid">
          <div
            v-for="(option, index) in questions[currentQuestion].options"
            :key="index"
            class="answer-wrapper"
            :class="{
              'hidden': hiddenOptions.includes(index)
            }"
            @click="selectAnswer(index)"
          >
            <div class="hex-border" 
                 :class="{
                   'selected': selectedAnswer === index,
                   'correct': showResult && index === questions[currentQuestion].correct,
                   'incorrect': showResult && selectedAnswer === index && index !== questions[currentQuestion].correct,
                   'disabled': showResult
                 }">
              <div class="hex-content answer-box">
                <span class="option-letter">{{ ['A', 'B', 'C', 'D'][index] }}:</span>
                <span class="option-text">{{ option }}</span>
              </div>
            </div>
            <div class="answer-line" :class="index % 2 === 0 ? 'right' : 'left'"></div>
          </div>
        </div>
      </div>

      <aside class="sidebar">
        <div class="prize-ladder">
          <div class="prize-row current-prize-header">
            <span class="prize-level">{{ currentQuestion + 1 }}</span>
            <span class="prize-amount">{{ formatMoney(prizes[currentQuestion].amount) }}</span>
          </div>

          <div 
            v-for="(prize, index) in [...prizes].reverse()" 
            :key="index"
            class="prize-row"
            :class="{
              'active': (prizes.length - 1 - index) === currentQuestion,
              'passed': (prizes.length - 1 - index) < currentQuestion,
              'milestone': prize.milestone
            }"
          >
            <span class="row-num">{{ prizes.length - index }}</span>
            <span class="row-value">{{ formatMoney(prize.amount) }}</span>
            <span v-if="prize.milestone" class="lock-icon">🔒</span>
          </div>
        </div>
      </aside>
    </div>

    <footer class="footer">
      <div class="winnings-info">
        <div class="stat-group">
          <span class="label">CURRENT WINNINGS</span>
          <span class="value">{{ formatMoney(currentPrizeEarned) }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-group">
          <span class="label">SAFETY NET</span>
          <span class="value">{{ formatMoney(safetyNet) }}</span>
        </div>
      </div>

      <div class="footer-actions">
        <div class="timer-circle">
          <span>45</span>
        </div>
        
        <button 
          class="walk-away-btn" 
          @click="retirarse"
          :disabled="showResult"
        >
          WALK AWAY
        </button>
      </div>
    </footer>

    <div v-if="showGameOver" class="modal-overlay" @click="showGameOver = false">
      <div class="modal-card" @click.stop>
        <h2>{{ isWinner ? '¡MILLONARIO!' : 'JUEGO TERMINADO' }}</h2>
        <div class="final-prize">{{ formatMoney(finalPrize) }}</div>
        <p>{{ gameOverMessage }}</p>
        <div class="modal-actions">
          <button class="btn-restart" @click="restartGame">JUGAR DE NUEVO</button>
        </div>
      </div>
    </div>
    
    <div v-if="notification" class="notification-toast" :class="notification.type">
      {{ notification.message }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// --- ESTADO DEL JUEGO ---
const currentQuestion = ref(0);
const selectedAnswer = ref(null);
const showResult = ref(false);
const showGameOver = ref(false);
const isWinner = ref(false);
const finalPrize = ref(0);
const totalQuestions = 15;
const hiddenOptions = ref([]);
const isProcessingAnswer = ref(false);
const notification = ref(null);

// Premios y Preguntas (Datos)
const prizes = ref([
  { amount: 100, milestone: false },
  { amount: 200, milestone: false },
  { amount: 300, milestone: false },
  { amount: 500, milestone: false },
  { amount: 1000, milestone: true }, // Seguro 1
  { amount: 2000, milestone: false },
  { amount: 4000, milestone: false },
  { amount: 8000, milestone: false },
  { amount: 16000, milestone: false },
  { amount: 32000, milestone: true }, // Seguro 2
  { amount: 64000, milestone: false },
  { amount: 125000, milestone: false },
  { amount: 250000, milestone: false },
  { amount: 500000, milestone: false },
  { amount: 1000000, milestone: true } // Gran Premio
]);

const lifelines = ref([
  { name: 'phone', icon: '📞', used: false },
  { name: 'audience', icon: '👥', used: false }
]);
// Nota: El 50:50 lo he puesto como decorativo en el header según la imagen, 
// o podemos añadirlo a la lista. Lo mantendré lógico aquí:
const fiftyFiftyUsed = ref(false);

const questions = ref([
  { question: '¿Cuál de estos elementos químicos lleva el nombre de la palabra griega para "sol"?', options: ['Helio', 'Neón', 'Argón', 'Kriptón'], correct: 0 },
  { question: '¿Cuál es la capital de Francia?', options: ['Londres', 'Berlín', 'París', 'Madrid'], correct: 2 },
  { question: '¿En qué año llegó el hombre a la Luna?', options: ['1965', '1969', '1972', '1975'], correct: 1 },
  { question: '¿Cuál es el océano más grande del mundo?', options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'], correct: 3 },
  { question: '¿Quién pintó la Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Rafael', 'Donatello'], correct: 1 },
  { question: '¿Cuál es el planeta más grande del sistema solar?', options: ['Saturno', 'Neptuno', 'Júpiter', 'Urano'], correct: 2 },
  { question: '¿Qué país tiene forma de bota?', options: ['España', 'Italia', 'Grecia', 'Portugal'], correct: 1 },
  { question: '¿Cuántos lados tiene un hexágono?', options: ['5', '6', '7', '8'], correct: 1 },
  { question: '¿Quién escribió "Don Quijote"?', options: ['Cervantes', 'Shakespeare', 'Dante', 'Homer'], correct: 0 },
  { question: '¿Cuál es el río más largo del mundo?', options: ['Nilo', 'Amazonas', 'Yangtsé', 'Misisipi'], correct: 1 }, // Amazonas es técnicamente más largo según estudios recientes
  { question: '¿Símbolo químico del Oro?', options: ['Ag', 'Au', 'Fe', 'Cu'], correct: 1 },
  { question: '¿Continentes en la Tierra?', options: ['5', '6', '7', '8'], correct: 2 },
  { question: '¿Primer presidente de USA?', options: ['Lincoln', 'Washington', 'Jefferson', 'Adams'], correct: 1 },
  { question: '¿Dónde está la Torre Eiffel?', options: ['Italia', 'España', 'Francia', 'Alemania'], correct: 2 },
  { question: '¿Montaña más alta?', options: ['K2', 'Everest', 'Kilimanjaro', 'Fuji'], correct: 1 }
]);

// --- COMPUTED ---
const currentPrizeEarned = computed(() => {
  if (currentQuestion.value === 0) return 0;
  return prizes.value[currentQuestion.value - 1].amount;
});

const safetyNet = computed(() => {
  // Encuentra el último milestone alcanzado
  let safeAmount = 0;
  for (let i = currentQuestion.value - 1; i >= 0; i--) {
    if (prizes.value[i].milestone) {
      safeAmount = prizes.value[i].amount;
      break;
    }
  }
  return safeAmount;
});

const gameOverMessage = computed(() => {
  if (isWinner.value) return '¡Increíble! Has ganado el premio mayor.';
  return `Te llevas a casa ${formatMoney(finalPrize.value)}`;
});

// --- LOGICA ---

watch(currentQuestion, () => {
  hiddenOptions.value = [];
  fiftyFiftyUsed.value = false;
});

const formatMoney = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const showNotification = (message, type = 'info') => {
  notification.value = { message, type };
  setTimeout(() => notification.value = null, 3000);
};

const selectAnswer = (index) => {
  if (showResult.value || isProcessingAnswer.value || hiddenOptions.value.includes(index)) return;

  selectedAnswer.value = index;
  isProcessingAnswer.value = true;

  // Simular tensión
  setTimeout(() => {
    confirmAnswer();
  }, 1500);
};

const confirmAnswer = () => {
  showResult.value = true;
  const isCorrect = selectedAnswer.value === questions.value[currentQuestion.value].correct;

  if (isCorrect) {
    setTimeout(() => {
      if (currentQuestion.value === totalQuestions - 1) {
        isWinner.value = true;
        finalPrize.value = prizes.value[currentQuestion.value].amount;
        showGameOver.value = true;
      } else {
        nextQuestion();
      }
    }, 2000);
  } else {
    setTimeout(() => {
      finalPrize.value = safetyNet.value;
      isWinner.value = false;
      showGameOver.value = true;
    }, 2000);
  }
};

const nextQuestion = () => {
  currentQuestion.value++;
  selectedAnswer.value = null;
  showResult.value = false;
  isProcessingAnswer.value = false;
};

const useLifeline = (index) => {
  // Lógica simplificada para demo
  if (lifelines.value[index].used) return;
  lifelines.value[index].used = true;
  showNotification('Comodín activado (Simulado)', 'info');
};

const retirarse = () => {
  if(showResult.value) return;
  finalPrize.value = currentPrizeEarned.value;
  isWinner.value = false;
  showGameOver.value = true;
};

const restartGame = () => {
  currentQuestion.value = 0;
  selectedAnswer.value = null;
  showResult.value = false;
  showGameOver.value = false;
  isProcessingAnswer.value = false;
  lifelines.value.forEach(l => l.used = false);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');

* {
  box-sizing: border-box;
  user-select: none;
}

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.game-container {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #0b1740 0%, #020b20 80%, #000000 100%);
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px 40px;
}

/* --- HEADER --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 100px;
  position: relative;
  z-index: 10;
}

.game-title {
  margin: 0;
  font-size: 1.2rem;
  font-style: italic;
  color: #fff;
  font-weight: 900;
  letter-spacing: 1px;
}

.title-highlight {
  color: #3f6eff;
  font-size: 1.4rem;
  text-shadow: 0 0 10px rgba(63, 110, 255, 0.6);
}

.lifelines-area {
  display: flex;
  gap: 15px;
  align-items: center;
}

.timer-badge {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #5a7bda;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  background: rgba(0,0,0,0.3);
  box-shadow: 0 0 10px rgba(90, 123, 218, 0.2);
}

.lifeline-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #a0aec0;
  background: transparent;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.lifeline-btn:hover:not(:disabled) {
  border-color: #fff;
  background: rgba(255,255,255,0.1);
  box-shadow: 0 0 15px rgba(255,255,255,0.3);
}

.lifeline-btn.used {
  border-color: #ef4444;
  color: #ef4444;
  opacity: 0.5;
  position: relative;
}

.lifeline-btn.used::after {
  content: '❌';
  position: absolute;
  font-size: 1.5rem;
}

/* --- MAIN LAYOUT --- */
.main-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  align-items: center;
  margin-top: -40px; /* Pull content up slightly */
}

.game-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

/* --- QUESTION STYLING (HEXAGON) --- */
.question-wrapper {
  width: 100%;
  margin-bottom: 30px;
  position: relative;
  padding: 0 20px;
}

/* El truco del borde hexagonal usando clip-path en dos capas */
.hex-border {
  background: #3f6eff; /* Color del borde */
  padding: 2px; /* Grosor del borde */
  clip-path: polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%);
  transition: all 0.3s ease;
}

.hex-content {
  background: linear-gradient(180deg, #0f183d 0%, #050a1f 50%, #0f183d 100%);
  width: 100%;
  height: 100%;
  clip-path: polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.question-box {
  min-height: 100px;
  padding: 0 50px;
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.4;
}

/* Líneas decorativas que salen de la pregunta */
.line-connector {
  position: absolute;
  top: 50%;
  width: 40%;
  height: 2px;
  background: #3f6eff;
  z-index: -1;
  opacity: 0.5;
}
.line-connector.left { left: -30%; }
.line-connector.right { right: -30%; }

/* --- ANSWERS STYLING --- */
.answers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 30px;
  width: 100%;
}

.answer-wrapper {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.answer-wrapper:hover .hex-border {
  background: #e6b800; /* Hover border gold */
}

.answer-box {
  min-height: 60px;
  padding: 0 35px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.option-letter {
  color: #e6b800; /* Gold */
  font-weight: 900;
  font-size: 1.2rem;
}

.option-text {
  font-size: 1.1rem;
  color: white;
}

/* Estados de respuesta */
.hex-border.selected {
  background: #e67e22; /* Orange border */
}
.hex-border.selected .hex-content {
  background: #e67e22;
  color: black;
}
.hex-border.selected .option-letter,
.hex-border.selected .option-text {
  color: black;
}

.hex-border.correct {
  background: #2ecc71; /* Green */
  animation: flash 0.5s infinite alternate;
}
.hex-border.correct .hex-content {
  background: #2ecc71;
  color: black;
}
.hex-border.correct .option-letter,
.hex-border.correct .option-text { color: black; }

.hex-border.incorrect {
  background: #e74c3c;
}
.hex-border.incorrect .hex-content { background: #e74c3c; }

@keyframes flash {
  from { opacity: 1; }
  to { opacity: 0.7; }
}

.answer-wrapper.hidden {
  opacity: 0;
  pointer-events: none;
}

/* --- SIDEBAR (PRIZE LADDER) --- */
.sidebar {
  height: 100%;
  display: flex;
  align-items: center;
}

.prize-ladder {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #333;
  border-radius: 12px;
  padding: 5px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.prize-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #e6b800; /* Default goldish text for numbers */
}

.prize-row.current-prize-header {
  /* La caja grande de arriba mostrando el premio actual */
  display: none; /* Oculto en la lista normal, pero útil si quieres mostrarlo aparte */
}

.row-num {
  width: 30px;
  color: #888;
}

.row-value {
  color: #fff;
  font-weight: 500;
}

.prize-row.milestone .row-value {
  color: white;
  font-weight: 700;
}

.prize-row.active {
  background: linear-gradient(90deg, #e6b800, #f39c12);
  border-radius: 20px;
  color: black;
  box-shadow: 0 0 15px rgba(230, 184, 0, 0.4);
}

.prize-row.active .row-num,
.prize-row.active .row-value {
  color: black;
  font-weight: 800;
}

.prize-row.passed {
  opacity: 0.5;
}

/* --- FOOTER --- */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 10px;
  margin-top: 10px;
}

.winnings-info {
  border: 1px solid #3f6eff;
  border-radius: 8px;
  display: flex;
  background: rgba(0, 10, 40, 0.8);
}

.stat-group {
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
}

.stat-divider {
  width: 1px;
  background: #3f6eff;
}

.label {
  font-size: 0.7rem;
  color: #3f6eff;
  letter-spacing: 1px;
  font-weight: 700;
  margin-bottom: 4px;
}

.value {
  color: #e6b800;
  font-size: 1.2rem;
  font-weight: 700;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.timer-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #e67e22;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.walk-away-btn {
  background: linear-gradient(180deg, #3f6eff 0%, #1a4bd6 100%);
  border: none;
  color: white;
  padding: 12px 30px;
  border-radius: 6px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 0 #1034a6;
  transition: transform 0.1s;
}

.walk-away-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #1034a6;
}

/* --- MODAL --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-card {
  background: #020b20;
  border: 2px solid #e6b800;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 0 50px rgba(230, 184, 0, 0.2);
}

.final-prize {
  font-size: 3rem;
  color: #e6b800;
  margin: 20px 0;
  font-weight: 900;
}

.btn-restart {
  background: #2ecc71;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 50px;
  color: #004d26;
}

.notification-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 25px;
  border-radius: 8px;
  background: white;
  color: black;
  font-weight: bold;
  z-index: 200;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

/* Responsividad básica */
@media (max-width: 900px) {
  .game-container { padding: 10px; }
  .main-layout { grid-template-columns: 1fr; margin-top: 0; }
  .sidebar { display: none; } /* Ocultar escalera en móvil o hacerla flotante */
  .answers-grid { grid-template-columns: 1fr; }
  .header { height: auto; margin-bottom: 20px; }
}
</style>