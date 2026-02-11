import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    gameState: 'start', // 'start', 'playing', 'end'
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answered: false,
    won: false,
    finalPrize: 0,
    
    // Comodines
    lifelines: {
      fiftyFifty: { used: false },
      audience: { used: false },
      phone: { used: false }
    },
    
    optionDisabled: [false, false, false, false],
    audienceResults: null,
    phoneAdvice: null,
    
    // Preguntas del juego
    questions: [
      {
        question: "¿Cuál es la capital de Francia?",
        options: ["Londres", "Berlín", "París", "Madrid"],
        correct: 2
      },
      {
        question: "¿En qué año llegó el hombre a la Luna?",
        options: ["1965", "1969", "1972", "1975"],
        correct: 1
      },
      {
        question: "¿Cuál es el océano más grande del mundo?",
        options: ["Atlántico", "Índico", "Ártico", "Pacífico"],
        correct: 3
      },
      {
        question: "¿Quién pintó la Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Miguel Ángel"],
        correct: 1
      },
      {
        question: "¿Cuál es el planeta más grande del Sistema Solar?",
        options: ["Saturno", "Júpiter", "Neptuno", "Urano"],
        correct: 1
      },
      {
        question: "¿En qué continente se encuentra Egipto?",
        options: ["Asia", "África", "Europa", "América"],
        correct: 1
      },
      {
        question: "¿Cuál es el río más largo del mundo?",
        options: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"],
        correct: 1
      },
      {
        question: "¿Quién escribió 'Don Quijote de la Mancha'?",
        options: ["Miguel de Cervantes", "Lope de Vega", "Gabriel García Márquez", "Federico García Lorca"],
        correct: 0
      },
      {
        question: "¿Cuál es el elemento químico con símbolo 'Au'?",
        options: ["Plata", "Aluminio", "Oro", "Hierro"],
        correct: 2
      },
      {
        question: "¿En qué año comenzó la Segunda Guerra Mundial?",
        options: ["1935", "1937", "1939", "1941"],
        correct: 2
      },
      {
        question: "¿Cuál es la montaña más alta del mundo?",
        options: ["K2", "Monte Everest", "Kangchenjunga", "Lhotse"],
        correct: 1
      },
      {
        question: "¿Quién fue el primer presidente de Estados Unidos?",
        options: ["Thomas Jefferson", "George Washington", "Benjamin Franklin", "John Adams"],
        correct: 1
      },
      {
        question: "¿Cuál es la velocidad de la luz?",
        options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "200,000 km/s"],
        correct: 0
      },
      {
        question: "¿Cuántos continentes hay en la Tierra?",
        options: ["5", "6", "7", "8"],
        correct: 2
      },
      {
        question: "¿Quién desarrolló la teoría de la relatividad?",
        options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Niels Bohr"],
        correct: 1
      }
    ],
    
    // Premios (de menor a mayor)
    prizes: [
      { amount: 1000000, safeHaven: false },
      { amount: 500000, safeHaven: false },
      { amount: 250000, safeHaven: false },
      { amount: 125000, safeHaven: false },
      { amount: 64000, safeHaven: false },
      { amount: 32000, safeHaven: true },
      { amount: 16000, safeHaven: false },
      { amount: 8000, safeHaven: false },
      { amount: 4000, safeHaven: false },
      { amount: 2000, safeHaven: false },
      { amount: 1000, safeHaven: true },
      { amount: 500, safeHaven: false },
      { amount: 300, safeHaven: false },
      { amount: 200, safeHaven: false },
      { amount: 100, safeHaven: false }
    ].reverse() // Invertimos para mostrar de menor a mayor
  }),
  
  getters: {
    currentQuestion: (state) => {
      return state.questions[state.currentQuestionIndex]
    },
    
    currentPrize: (state) => {
      return state.prizes[state.currentQuestionIndex]?.amount || 0
    },
    
    totalQuestions: (state) => {
      return state.questions.length
    },
    
    guaranteedPrize: (state) => {
      // Encuentra el último premio "safe haven" alcanzado
      for (let i = state.currentQuestionIndex - 1; i >= 0; i--) {
        if (state.prizes[i].safeHaven) {
          return state.prizes[i].amount
        }
      }
      return 0
    }
  },
  
  actions: {
    startGame() {
      this.gameState = 'playing'
      this.shuffleQuestions()
    },
    
    shuffleQuestions() {
      // Mezclar las preguntas para cada juego
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]]
      }
    },
    
    selectAnswer(index) {
      this.selectedAnswer = index
      this.answered = true
      
      // Limpiar resultados de comodines
      this.audienceResults = null
      this.phoneAdvice = null
      
      setTimeout(() => {
        if (index === this.currentQuestion.correct) {
          // Respuesta correcta
          if (this.currentQuestionIndex === this.questions.length - 1) {
            // ¡Ganó el juego!
            this.won = true
            this.finalPrize = this.currentPrize
            this.gameState = 'end'
          } else {
            // Siguiente pregunta
            this.nextQuestion()
          }
        } else {
          // Respuesta incorrecta
          this.won = false
          this.finalPrize = this.guaranteedPrize
          this.gameState = 'end'
        }
      }, 2000)
    },
    
    nextQuestion() {
      this.currentQuestionIndex++
      this.selectedAnswer = null
      this.answered = false
      this.optionDisabled = [false, false, false, false]
      this.audienceResults = null
      this.phoneAdvice = null
    },
    
    useFiftyFifty() {
      if (this.lifelines.fiftyFifty.used) return
      
      this.lifelines.fiftyFifty.used = true
      
      const correctIndex = this.currentQuestion.correct
      const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIndex)
      
      // Eliminar 2 respuestas incorrectas al azar
      const toRemove = []
      while (toRemove.length < 2) {
        const randomIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)]
        if (!toRemove.includes(randomIndex)) {
          toRemove.push(randomIndex)
        }
      }
      
      toRemove.forEach(index => {
        this.optionDisabled[index] = true
      })
    },
    
    useAudience() {
      if (this.lifelines.audience.used) return
      
      this.lifelines.audience.used = true
      
      const results = [0, 0, 0, 0]
      const correctIndex = this.currentQuestion.correct
      
      // El público tiene más probabilidad de acertar (70-90%)
      const correctPercentage = 70 + Math.floor(Math.random() * 20)
      results[correctIndex] = correctPercentage
      
      // Distribuir el resto entre las otras opciones
      let remaining = 100 - correctPercentage
      const otherIndices = [0, 1, 2, 3].filter(i => i !== correctIndex && !this.optionDisabled[i])
      
      otherIndices.forEach((index, i) => {
        if (i === otherIndices.length - 1) {
          results[index] = remaining
        } else {
          const percentage = Math.floor(Math.random() * remaining)
          results[index] = percentage
          remaining -= percentage
        }
      })
      
      this.audienceResults = results
    },
    
    usePhone() {
      if (this.lifelines.phone.used) return
      
      this.lifelines.phone.used = true
      
      const correctIndex = this.currentQuestion.correct
      const correctLetter = String.fromCharCode(65 + correctIndex)
      
      // El amigo tiene 80% de probabilidad de dar la respuesta correcta
      if (Math.random() < 0.8) {
        this.phoneAdvice = `Creo que la respuesta correcta es la ${correctLetter}, pero no estoy completamente seguro.`
      } else {
        // Dar una respuesta incorrecta
        const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIndex && !this.optionDisabled[i])
        const wrongIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)]
        const wrongLetter = String.fromCharCode(65 + wrongIndex)
        this.phoneAdvice = `Me parece que es la ${wrongLetter}, aunque no estoy muy seguro...`
      }
    },
    
    resetGame() {
      this.gameState = 'start'
      this.currentQuestionIndex = 0
      this.selectedAnswer = null
      this.answered = false
      this.won = false
      this.finalPrize = 0
      this.lifelines = {
        fiftyFifty: { used: false },
        audience: { used: false },
        phone: { used: false }
      }
      this.optionDisabled = [false, false, false, false]
      this.audienceResults = null
      this.phoneAdvice = null
    }
  }
})
