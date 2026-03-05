<template>
    <div>
        <h1>soy ventas</h1>
        <button @click="generalStore.incrementar">Incrementar</button>
    </div>
</template>

<script setup>

import { useGeneralStore } from '../stores/general';
const generalStore = useGeneralStore();

</script>