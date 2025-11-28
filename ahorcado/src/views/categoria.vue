<template>
  <q-page padding>
    <h4>Hola {{ playerName }}, selecciona una categoría</h4>
    <div class="q-gutter-md">
      <q-btn color="teal" v-for="cat in categories" :key="cat" :label="cat"
             @click="selectCategory(cat)" />
    </div>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const playerName = route.query.player;

const categories = ["animales", "frutas", "colores"];

function selectCategory(category) {
  router.push({
    path: "/juego",
    query: {
      player: playerName,
      category
    }
  });
}
</script>
