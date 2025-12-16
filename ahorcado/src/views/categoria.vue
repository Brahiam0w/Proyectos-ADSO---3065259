<template>
    <div class="contenedor">
        <q-btn 
            flat 
            round 
            icon="arrow_back" 
            color="white" 
            size="lg"
            @click="volver"
            class="btn-volver"
        />
        <div class="titulo">
            <h2>¡Elige tu aventura!</h2>
            <p>Selecciona una categoria para empezar</p>
        </div>
        <div class="contenedor-categoria">
            <router-link to="/nivel" class="no-decoration" @click="seleccionarCategoria('animales')">
                <q-card class="categoria bg-green-11">
                    <q-icon name="pets" size="25px"></q-icon>
                    <h4>Animales</h4>
                </q-card>
            </router-link>
            <router-link to="/nivel" class="no-decoration" @click="seleccionarCategoria('cultura')">
                <div class="categoria bg-purple-11">
                    <q-icon name="public" size="25px"></q-icon>
                    <h4>Cultura</h4>
                </div>
            </router-link>
            <router-link to="/nivel" class="no-decoration" @click="seleccionarCategoria('paises')">
                <div class="categoria bg-red-11">
                    <q-icon name="sports_soccer" size="25px"></q-icon>
                    <h4>Paises</h4>
                </div>
            </router-link>
            <router-link to="/nivel" class="no-decoration" @click="seleccionarCategoria('ciencia')">
                <div class="categoria bg-blue-11">
                    <q-icon name="science" size="25px"></q-icon>
                    <h4>Ciencia</h4>
                </div>
            </router-link>
            <router-link to="/nivel" class="no-decoration" @click="seleccionarCategoria('peliculas')">
                <div class="categoria bg-amber-11">
                    <q-icon name="movie" size="25px"></q-icon>
                    <h4>Peliculas</h4>
                </div>
            </router-link>
            <router-link to="/nivel" class="no-decoration" @click="seleccionarCategoria('musica')">
                <div class="categoria bg-yellow-11">
                    <q-icon name="headphones" size="25px"></q-icon>
                    <h4>Musica</h4>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>

import { useRouter } from 'vue-router'
const router = useRouter()
function seleccionarCategoria(categoria) {
    localStorage.setItem('categoria', categoria)
}

function volver() {
    router.push('/')
}
</script>

<style scoped>
.contenedor {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: #FFF5E1;
    height: 100vh;
    width: 100%;
}

.btn-volver {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color: #333 !important;
}

.titulo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin: 10px 0 20px;
}

.categoria {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    width: 200px;
    height: 200px;
}

.categoria:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.contenedor-categoria {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.no-decoration {
    text-decoration: none;
    color: inherit;
}
</style>