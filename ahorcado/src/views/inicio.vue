<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="min-width: 350px;">
      <q-card-section>
        <h4 class="text-center">🎮 Ahorcado</h4>
        <q-input v-model="name" label="Ingresa tu nombre" filled />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn color="primary" label="Iniciar" @click="goToCategory" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const name = ref("");
const router = useRouter();

function goToCategory() {
  if (name.value.trim()) {
    router.push({ path: "/categoria", query: { player: name.value } });
  }
}
</script>
