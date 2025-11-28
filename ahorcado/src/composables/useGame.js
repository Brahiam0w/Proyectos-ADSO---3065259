// src/composables/useGame.js
import { ref, computed, watch } from 'vue'

const playerName = ref(localStorage.getItem('playerName') || '')
const selectedCategory = ref('')
const selectedDifficulty = ref('')
const currentWord = ref('')
const guessedLetters = ref([])
const wrongAttempts = ref(0)
const maxAttempts = ref(6)
const gameStatus = ref('playing')
const score = ref(parseInt(localStorage.getItem('score')) || 0)
const gamesHistory = ref(JSON.parse(localStorage.getItem('gamesHistory')) || [])

const words = {
  animales: {
    facil: ['GATO', 'PERRO', 'PATO', 'OSO', 'LEON', 'LORO', 'PEZ'],
    medio: ['ELEFANTE', 'JIRAFA', 'TIGRE', 'CABALLO', 'DELFIN', 'COCODRILO'],
    dificil: ['RINOCERONTE', 'ORNITORRINCO', 'MURCIELAGO', 'HIPOPOTAMO']
  },
  cultura: {
    facil: ['ARTE', 'LIBRO', 'DANZA', 'CINE', 'MUSICA', 'TEATRO'],
    medio: ['PINTURA', 'ESCULTURA', 'POESIA', 'LITERATURA', 'FOLKLORE'],
    dificil: ['RENACIMIENTO', 'ARQUEOLOGIA', 'MITOLOGIA', 'ANTROPOLOGIA']
  },
  paises: {
    facil: ['PERU', 'CHILE', 'CUBA', 'IRAN', 'JAPON', 'ITALIA'],
    medio: ['COLOMBIA', 'ARGENTINA', 'ALEMANIA', 'PORTUGAL', 'BELGICA'],
    dificil: ['UZBEKISTAN', 'MADAGASCAR', 'LIECHTENSTEIN', 'KAZAJISTAN']
  },
  ciencia: {
    facil: ['ATOMO', 'CELULA', 'AGUA', 'OXIGENO', 'CARBONO'],
    medio: ['ELECTRON', 'MOLECULA', 'FOTOSINTESIS', 'GRAVEDAD', 'ENERGIA'],
    dificil: ['TERMODINAMICA', 'ELECTROMAGNETISMO', 'BIOQUIMICA']
  },
  peliculas: {
    facil: ['TITANIC', 'AVATAR', 'ROCKY', 'JOKER', 'ALIEN'],
    medio: ['GLADIADOR', 'INCEPTION', 'MATRIX', 'INTERESTELAR'],
    dificil: ['RESPLANDOR', 'CASABLANCA', 'METROPOLIS', 'PSYCHO']
  },
  musica: {
    facil: ['ROCK', 'JAZZ', 'SALSA', 'OPERA', 'BLUES', 'RAP'],
    medio: ['GUITARRA', 'BATERIA', 'MELODIA', 'ARMONIA', 'SINFONIA'],
    dificil: ['CONTRAPUNTO', 'ORQUESTACION', 'DODECAFONISMO']
  }
} // Igual al que tienes

export function useGame() {
  // Guarda datos
  watch(playerName, v => localStorage.setItem('playerName', v))
  watch(score, v => localStorage.setItem('score', v.toString()))
  watch(gamesHistory, v => localStorage.setItem('gamesHistory', JSON.stringify(v)), { deep: true })

  const displayWord = computed(() =>
    currentWord.value.split('').map(l => (guessedLetters.value.includes(l) ? l : '_')).join(' ')
  )

  const remainingAttempts = computed(() => maxAttempts.value - wrongAttempts.value)
  const isGameOver = computed(() => ['won', 'lost'].includes(gameStatus.value))
  const progressPercentage = computed(() =>
    ((maxAttempts.value - wrongAttempts.value) / maxAttempts.value) * 100
  )

  const categoryName = computed(() => ({
    animales: 'Animales',
    cultura: 'Cultura',
    paises: 'Países',
    ciencia: 'Ciencia',
    peliculas: 'Películas',
    musica: 'Música'
  })[selectedCategory.value] || '')

  const difficultyName = computed(() => ({
    facil: 'Fácil',
    medio: 'Medio',
    dificil: 'Difícil'
  })[selectedDifficulty.value] || '')

  const totalGamesPlayed = computed(() => gamesHistory.value.length)
  const totalGamesWon = computed(() => gamesHistory.value.filter(g => g.won).length)
  const winRate = computed(() =>
    totalGamesPlayed.value ? Math.round((totalGamesWon.value / totalGamesPlayed.value) * 100) : 0
  )

  function setCategory(category) {
    selectedCategory.value = category
  }
  function setDifficulty(d) {
    selectedDifficulty.value = d
  }

  function startNewGame() {
    if (!selectedCategory.value || !selectedDifficulty.value) return

    const difficultyWords = words[selectedCategory.value]?.[selectedDifficulty.value]
    if (!difficultyWords) return

    currentWord.value = difficultyWords[Math.floor(Math.random() * difficultyWords.length)]
    guessedLetters.value = []
    wrongAttempts.value = 0
    gameStatus.value = 'playing'
  }

  function guessLetter(letter) {
    if (gameStatus.value !== 'playing' || guessedLetters.value.includes(letter)) return

    guessedLetters.value.push(letter)
    if (!currentWord.value.includes(letter)) wrongAttempts.value++

    checkGameStatus()
  }

  function checkGameStatus() {
    if (wrongAttempts.value >= maxAttempts.value) {
      gameStatus.value = 'lost'
      addToHistory(false)
    } else if (currentWord.value.split('').every(l => guessedLetters.value.includes(l))) {
      gameStatus.value = 'won'
      calculateScore()
      addToHistory(true)
    }
  }

  function calculateScore() {
    const basePoints = { facil: 100, medio: 200, dificil: 300 }
    score.value += basePoints[selectedDifficulty.value] + remainingAttempts.value * 10
  }

  function addToHistory(won) {
    gamesHistory.value.push({
      word: currentWord.value,
      category: selectedCategory.value,
      difficulty: selectedDifficulty.value,
      won,
      attempts: wrongAttempts.value,
      date: new Date().toISOString()
    })

    gamesHistory.value = gamesHistory.value.slice(-50)
  }

  function resetGame() {
    guessedLetters.value = []
    wrongAttempts.value = 0
    gameStatus.value = 'playing'
    currentWord.value = ''
  }

  function resetAll() {
    playerName.value = ''
    selectedCategory.value = ''
    selectedDifficulty.value = ''
    currentWord.value = ''
    guessedLetters.value = []
    wrongAttempts.value = 0
    gameStatus.value = 'playing'
    score.value = 0
    gamesHistory.value = []
    localStorage.clear()
  }

  return {
    playerName, selectedCategory, selectedDifficulty, currentWord,
    guessedLetters, wrongAttempts, maxAttempts, gameStatus,
    score, gamesHistory, displayWord, remainingAttempts,
    isGameOver, progressPercentage, categoryName, difficultyName,
    totalGamesPlayed, totalGamesWon, winRate, setCategory, setDifficulty,
    startNewGame, guessLetter, resetGame, resetAll
  }
}
