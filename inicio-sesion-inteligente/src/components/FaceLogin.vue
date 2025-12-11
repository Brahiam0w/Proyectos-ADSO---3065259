<script setup>
import { onMounted, ref } from 'vue'
import * as faceapi from 'face-api.js'

const video = ref(null)

onMounted(async () => {
  // 1. Cargar modelos
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models/')
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models/')
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models/')

  console.log("Modelos cargados")

  // 2. Iniciar cámara
  const stream = await navigator.mediaDevices.getUserMedia({ video: true })
  video.value.srcObject = stream

  // 3. Esperar video
  video.value.onloadedmetadata = () => {
    video.value.play()
    detectar()
  }
})

async function detectar() {
  const deteccion = await faceapi
    .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()

  console.log("Resultado:", deteccion)
}
</script>

<template>
  <video ref="video" autoplay playsinline></video>
</template>
