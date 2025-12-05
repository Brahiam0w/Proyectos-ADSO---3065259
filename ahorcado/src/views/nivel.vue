<template>
    <div class="contenedor">
        <div class="titulo">
            <h2>¡Selecciona una Dificultad!</h2>
            <p>Con cada nivel es un nuevo desafio. !Escoge con sabiduría¡</p>
        </div>
        <div class="contenedor-2">
            <router-link to="/juego" class="no-decoration" @click="seleccionarNivel('facil')"> 
                <div class="dificultad bg-green-11">
                    <h2>Fácil</h2>
                    <p>Palabras cortas y comúnes para empezar.</p>
                </div>
            </router-link>
            <router-link to="/juego" class="no-decoration" @click="seleccionarNivel('medio')">
                <div class="dificultad bg-amber-11">
                    <h2>Medio</h2>
                    <p>Un reto equilibrado con palabras variadas.</p>
                </div>
            </router-link>
            <router-link to="/juego" class="no-decoration" @click="seleccionarNivel('dificil')">
                <div class="dificultad bg-red-11">
                    <h2>Difícil</h2>
                    <p>Palabras complejas solo para conocedores.</p>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
const palabras = {
  animales: {
    facil: ['GATO', 'PERRO', 'PATO', 'OSO', 'LEON'],
    medio: ['ELEFANTE', 'JIRAFA', 'TIGRE', 'CABALLO'],
    dificil: ['RINOCERONTE', 'ORNITORRINCO', 'MURCIELAGO']
  },
  cultura: {
    facil: ['ARTE', 'LIBRO', 'DANZA', 'CINE'],
    medio: ['PINTURA', 'ESCULTURA', 'TEATRO'],
    dificil: ['RENACIMIENTO', 'ARQUEOLOGIA']
  },
  paises: {
    facil: ['PERU', 'CHILE', 'CUBA', 'IRAN'],
    medio: ['COLOMBIA', 'ARGENTINA', 'ALEMANIA'],
    dificil: ['UZBEKISTAN', 'MADAGASCAR']
  },
  ciencia: {
    facil: ['ATOMO', 'CELULA', 'AGUA'],
    medio: ['ELECTRON', 'MOLECULA', 'GRAVEDAD'],
    dificil: ['TERMODINAMICA', 'BIOQUIMICA']
  },
  peliculas: {
    facil: ['TITANIC', 'AVATAR', 'ROCKY'],
    medio: ['GLADIADOR', 'INCEPTION', 'MATRIX'],
    dificil: ['RESPLANDOR', 'CASABLANCA']
  },
  musica: {
    facil: ['ROCK', 'JAZZ', 'SALSA'],
    medio: ['GUITARRA', 'BATERIA', 'MELODIA'],
    dificil: ['CONTRAPUNTO', 'ORQUESTACION']
  }
}

function seleccionarNivel(nivel) {
  const categoria = localStorage.getItem('categoria')
  
  if (!categoria) {
    alert('Primero selecciona una categoría')
    return
  }
  
  // Guardar nivel
  localStorage.setItem('dificultad', nivel)
  
  // Seleccionar palabra aleatoria
  const palabrasCategoria = palabras[categoria][nivel]
  const palabraAleatoria = palabrasCategoria[Math.floor(Math.random() * palabrasCategoria.length)]
  
  // Guardar palabra y resetear juego
  localStorage.setItem('palabraActual', palabraAleatoria)
  localStorage.setItem('letrasAdivinadas', JSON.stringify([]))
  localStorage.setItem('intentosIncorrectos', '0')
  localStorage.setItem('estadoJuego', 'jugando')
}
</script>

<style scoped>
.contenedor {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    gap: 50px;
}

.contenedor-2 {
    display: flex;
    gap: 20px;
}

.dificultad {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    padding: 10px;
    width: 400px;
    font-size: 17px;
    transition: all 0.2s ease-in-out;
}

.dificultad:hover{
    transform:  scale(1.05);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.no-decoration {
    text-decoration: none;
    color: inherit;
}

.titulo{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
}
</style>