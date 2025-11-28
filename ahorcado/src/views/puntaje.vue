<template>
  <q-page padding>
    <h4>Resultado de {{ route.query.player }}</h4>

    <q-table
      :rows="rows"
      :columns="columns"
      row-key="player"
      flat bordered
    />

    <div class="text-center q-mt-lg">
      <q-btn color="primary" label="Volver al inicio" @click="router.push('/')" />
    </div>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const columns = [
  { name: "player", label: "Jugador", field: "player" },
  { name: "word", label: "Palabra", field: "word" },
  { name: "errors", label: "Errores", field: "errors" },
  { name: "result", label: "Resultado", field: "result" }
];

const rows = [
  {
    player: route.query.player,
    word: route.query.word,
    errors: route.query.errors,
    result: route.query.result
  }
];
</script>
