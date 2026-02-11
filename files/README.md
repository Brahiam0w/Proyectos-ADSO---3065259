# ¿Quién Quiere Ser Millonario? 🎮💰

Juego interactivo creado con Vue 3, Quasar Framework y Pinia.

## Características 🌟

- **15 preguntas** con dificultad progresiva
- **3 comodines** clásicos del programa:
  - 50/50: Elimina dos respuestas incorrectas
  - Pregunta al público: Muestra estadísticas de votación
  - Llamada a un amigo: Recibe un consejo
- **Premios progresivos** con puntos de garantía
- **Interfaz atractiva** con animaciones y efectos
- **Totalmente responsive** para móviles y tablets

## Instalación 📦

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Estructura del Proyecto 📁

```
millonario-game/
├── src/
│   ├── stores/
│   │   └── gameStore.js       # Store de Pinia con toda la lógica
│   ├── App.vue                # Componente principal
│   ├── main.js                # Punto de entrada
│   └── quasar-variables.sass  # Variables de Quasar
├── index.html
├── package.json
└── vite.config.js
```

## Tecnologías Utilizadas 🛠️

- **Vue 3** - Framework progresivo de JavaScript
- **Quasar Framework** - Framework de componentes UI
- **Pinia** - State management oficial de Vue
- **Vite** - Build tool ultrarrápido

## Cómo Jugar 🎯

1. Presiona "Comenzar Juego"
2. Lee cada pregunta cuidadosamente
3. Selecciona una de las 4 opciones
4. Usa los comodines estratégicamente
5. ¡Intenta llegar al millón!

### Premios Garantizados 🏆

- $1,000 (Pregunta 5)
- $32,000 (Pregunta 10)

Si fallas después de alcanzar un premio garantizado, te llevas ese monto.

## Personalización 🎨

### Agregar más preguntas

Edita el array `questions` en `src/stores/gameStore.js`:

```javascript
questions: [
  {
    question: "Tu pregunta aquí",
    options: ["Opción A", "Opción B", "Opción C", "Opción D"],
    correct: 0 // índice de la respuesta correcta (0-3)
  },
  // ... más preguntas
]
```

### Modificar premios

Edita el array `prizes` en el store para cambiar los montos o puntos de garantía.

### Cambiar colores

Modifica `src/quasar-variables.sass` para personalizar la paleta de colores.

## Mejoras Futuras 🚀

- [ ] Sonidos y música
- [ ] Diferentes niveles de dificultad
- [ ] Tabla de puntuaciones
- [ ] Multijugador
- [ ] Temporizador por pregunta
- [ ] Categorías de preguntas
- [ ] Modo practice

## Licencia 📄

MIT License - Siéntete libre de usar y modificar este proyecto.

## Autor ✨

Creado con ❤️ usando Vue 3, Quasar y Pinia

---

¡Disfruta del juego y buena suerte llegando al millón! 💎
