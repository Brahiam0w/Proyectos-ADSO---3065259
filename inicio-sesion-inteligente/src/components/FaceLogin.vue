<template>
  <div class="contenedor">

    <!-- Título -->
    <h2 class="titulo">Reconocimiento Facial</h2>

    <!-- Contenedor de cámara -->
    <div class="camara-container">
      <video ref="video" autoplay playsinline class="camara"></video>
      <canvas ref="canvas" class="canvas"></canvas>
    </div>

    <!-- BOTONES que faltaban -->
    <div class="botones">
      <button class="btn" @click="iniciarCamara">Iniciar cámara</button>
      <button class="btn" @click="registrarRostro">Registrar rostro</button>
      <button class="btn" @click="iniciarReconocimiento">Confirmar rostro</button>
    </div>

    <!-- Galería -->
    <h3 class="titulo-galeria">Rostros registrados</h3>
    <div class="galeria">
      <div 
        v-for="(rostro, index) in rostrosRegistrados" 
        :key="index" 
        class="rostro-item"
      >
        <img :src="rostro.img" class="rostro-img" />
        <p class="rostro-label">{{ rostro.label }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as faceapi from 'face-api.js'

const video = ref(null)
const canvas = ref(null)

const rostrosRegistrados = ref([])   // Galería en pantalla
let faceMatcher = null              // Para reconocer

// -------------------------------
// Cargar Modelos
// -------------------------------
onMounted(async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
  await faceapi.nets.faceExpressionNet.loadFromUri('/models')

  cargarRostrosDesdeLocalStorage()
})

// -------------------------------
// Iniciar cámara
// -------------------------------
async function iniciarCamara() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  })
  video.value.srcObject = stream
}

// -------------------------------
// Registrar rostro
// -------------------------------
async function registrarRostro() {
  const deteccion = await faceapi
    .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (!deteccion) {
    alert('No se detectó rostro para registrar')
    return
  }

  const label = `Persona ${rostrosRegistrados.value.length + 1}`

  // Guardar imagen miniatura
  const canvasTemp = document.createElement('canvas')
  canvasTemp.width = 150
  canvasTemp.height = 150
  const ctx = canvasTemp.getContext('2d')
  ctx.drawImage(video.value, 0, 0, 150, 150)

  const dataUrl = canvasTemp.toDataURL('image/png')

  const nuevo = {
    label,
    descriptor: Array.from(deteccion.descriptor),
    img: dataUrl
  }

  rostrosRegistrados.value.push(nuevo)
  guardarEnLocalStorage()
  actualizarFaceMatcher()

  alert('Rostro registrado correctamente')
}

// -------------------------------
// Confirmar rostro (reconocer)
// -------------------------------
async function iniciarReconocimiento() {
  if (!faceMatcher) {
    actualizarFaceMatcher()
  }

  const deteccion = await faceapi
    .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (!deteccion) {
    alert('No se detectó rostro')
    return
  }

  const resultado = faceMatcher.findBestMatch(deteccion.descriptor)
  alert('Resultado: ' + resultado.toString())
}

// -------------------------------
// Helpers
// -------------------------------
function actualizarFaceMatcher() {
  const labeled = rostrosRegistrados.value.map(r => {
    return new faceapi.LabeledFaceDescriptors(
      r.label,
      [new Float32Array(r.descriptor)]
    )
  })
  faceMatcher = new faceapi.FaceMatcher(labeled, 0.45)
}

function guardarEnLocalStorage() {
  localStorage.setItem("rostros", JSON.stringify(rostrosRegistrados.value))
}

function cargarRostrosDesdeLocalStorage() {
  const data = JSON.parse(localStorage.getItem("rostros") || "[]")
  rostrosRegistrados.value = data
  actualizarFaceMatcher()
}
</script>

<style scoped>
.contenedor {
  width: 800px;
  margin: auto;
  text-align: center;
  color: white;
}

.titulo {
  font-size: 24px;
  margin-bottom: 20px;
}

.camara-container {
  position: relative;
  width: 640px;
  height: 480px;
  margin: auto;
}

.camara {
  width: 640px;
  height: 480px;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.botones {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  background-color: #0aa2ff;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.titulo-galeria {
  margin-top: 25px;
  margin-bottom: 10px;
}

.galeria {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.rostro-item {
  text-align: center;
  width: 150px;
}

.rostro-img {
  width: 150px;
  height: 150px;
  border-radius: 8px;
}

.rostro-label {
  margin-top: 5px;
}
</style>
