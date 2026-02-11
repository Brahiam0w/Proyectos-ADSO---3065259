<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container>
            <q-page>
                <div class="main-container">
                    <!-- Estrellas de fondo -->
                    <div v-for="n in 50" :key="n" class="sparkle" :style="{
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        animationDelay: Math.random() * 3 + 's'
                    }" />

                    <!-- Logo (aquí colocar tu imagen) -->
                    <div class="logo-container">
                        <img src="/logo.png" alt="Quién quiere ser millonario" class="logo-image" />

                    </div>
                    <div class="input-nombre">
                        <input type="text" placeholder="INGRESE SU NOMBRE!">
                    </div>

                    <!-- Botón de jugar -->
                    <div class="button-container">
                        

                        <q-btn class="play-button" rounded unelevated @click="IniciarJuego" no-caps>
                            Jugar
                        </q-btn>
                    </div>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'
const router = useRouter()

const $q = useQuasar();

const startGame = () => {
    $q.notify({
        message: '¡Iniciando juego! 🎮',
        color: 'positive',
        position: 'top',
        icon: 'play_circle',
        timeout: 2000
    });


};

function IniciarJuego() {
router.push('/juego')
}
</script>

<style scoped>
.main-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(135deg, #0a0e27 0%, #1a1f4d 50%, #2d3561 100%);
    overflow: hidden;
    padding: 0;
    margin: 0;
    gap: 10px;
}

.sparkle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: yellow;
    border-radius: 50%;
    animation: sparkle 3s infinite;
    z-index: 1;
}

@keyframes sparkle {

    0%,
    100% {
        opacity: 0;
        transform: scale(0);
    }

    50% {
        opacity: 1;
        transform: scale(1);
    }
}

.input-nombre{
    display: flex;
    height: 50px;
    width: 200px;
    justify-content: center;
    animation: fadeInUp 1s ease-out 0.5s backwards;
    
}

.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 60px;
    animation: fadeInScale 1.2s ease-out;
    z-index: 2;
}

.logo-image {
    max-width: 600px;
    max-height: 600px;
    width: auto;
    height: auto;
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.5));
    animation: float 3s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-15px);
    }
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.8);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.button-container {
    display: flex;
    animation: fadeInUp 1s ease-out 0.5s backwards;
    z-index: 2;
}

.play-button {
    font-size: 1.1rem !important;
    font-weight: 500 !important;
    padding: 12px 45px !important;
    letter-spacing: 1px !important;
    background: white !important;
    color: #0a0e27 !important;
    border: 2px solid white !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4) !important;
    transition: all 0.3s ease !important;
}

.play-button:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5) !important;
    background: rgba(255, 255, 255, 0.95) !important;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
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
    width: 100vw !important;
    height: 100vh !important;
}
</style>