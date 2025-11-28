<template>
  <q-page padding class="text-center">

    <h4>{{ playerName }} jugando Ahorcado ({{ category }})</h4>

    <!-- Imagen ahorcado -->
    <q-img :src="stageImages[errors]" style="width:200px; margin:auto" />

    <!-- Pista -->
    <p><strong>Pista:</strong> {{ hint }}</p>

    <!-- Palabra a descubrir -->
    <div class="text-h5 q-mt-md">{{ displayWord }}</div>

    <!-- Teclado -->
    <div class="q-mt-lg">
      <q-btn
        v-for="letter in alphabet"
        :key="letter"
        :label="letter"
        class="q-mr-sm q-mb-sm"
        :disable="usedLetters.includes(letter) || hasWon || hasLost"
        color="primary"
        @click="selectLetter(letter)"
      />
    </div>

    <!-- Estado -->
    <p>Errores: {{ errors }} / {{ maxErrors }}</p>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const playerName = ref(route.query.player || "Jugador");
const category = ref(route.query.category);
const word = ref("");
const hint = ref("");
const usedLetters = ref([]);
const errors = ref(0);

const wordsData = {
  animales: [
    { word: "GATO", hint: "Maúlla" },
    { word: "PERRO", hint: "Mejor amigo del hombre" }
  ],
  frutas: [
    { word: "MANZANA", hint: "Cayó sobre Newton" },
    { word: "BANANO", hint: "Amarillo y curvo" }
  ],
  colores: [
    { word: "ROJO", hint: "Color de la sangre" },
    { word: "VERDE", hint: "Color de la naturaleza" }
  ]
};

const stageImages = [
  "/img/ahorcado0.png",
  "/img/ahorcado1.png",
  "/img/ahorcado2.png",
  "/img/ahorcado3.png",
  "/img/ahorcado4.png",
  "/img/ahorcado5.png",
  "/img/ahorcado6.png"
];

const maxErrors = stageImages.length - 1;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const displayWord = computed(() =>
  word.value.split("").map(l => usedLetters.value.includes(l) ? l : "_").join(" ")
);

const hasWon = computed(() => !displayWord.value.includes("_"));
const hasLost = computed(() => errors.value >= maxErrors);

function selectLetter(letter) {
  if (!usedLetters.value.includes(letter)) {
    usedLetters.value.push(letter);

    if (!word.value.includes(letter)) errors.value++;

    if (hasWon.value || hasLost.value) {
      setTimeout(() => {
        router.push({
          path: "/puntaje",
          query: {
            player: playerName.value,
            errors: errors.value,
            word: word.value,
            result: hasWon.value ? "GANÓ 🎉" : "PERDIÓ ☠️"
          }
        });
      }, 1200);
    }
  }
}

onMounted(() => {
  const random = wordsData[category.value]?.[Math.floor(Math.random() * wordsData[category.value].length)];
  word.value = random?.word || "ERROR";
  hint.value = random?.hint || "Sin pista";
});
</script>
