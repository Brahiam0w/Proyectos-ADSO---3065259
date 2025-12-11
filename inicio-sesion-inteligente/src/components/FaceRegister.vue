<template>
  <div>
    <h2>Registrar rostro</h2>

    <FaceCamera @face-detected="onFaceDetected" />

    <button @click="saveData" :disabled="!descriptor || !blinkOk">
      Guardar rostro
    </button>

    <p v-if="saved">Rostro guardado ✔</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FaceCamera from './FaceCamera.vue'

const descriptor = ref(null)
const blinkOk = ref(false)
const saved = ref(false)

function onFaceDetected(data) {
  descriptor.value = data.descriptor
  blinkOk.value = data.blink
}

function saveData() {
  if (!descriptor.value || !blinkOk.value) return

  localStorage.setItem('faceUser', JSON.stringify(Array.from(descriptor.value)))
  saved.value = true
}
</script>
