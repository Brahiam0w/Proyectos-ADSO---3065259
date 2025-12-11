<template>
  <div>
    <video ref="video" autoplay playsinline width="350"></video>

    <div style="margin-top:10px;">
      <input v-model="nombre" placeholder="Nombre para registrar" />

      <button @click="registrar">Registrar rostro</button>
      <button @click="verificar">Verificar rostro</button>
    </div>

    <p>{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { faceapi, loadModels } from '../faceApi'

const video = ref(null)
const nombre = ref('')
const mensaje = ref('')

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true })
  video.value.srcObject = stream
}

async function capturarDescriptor() {
  const det = await faceapi
    .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (!det) throw new Error("No se detectó rostro")

  return det.descriptor
}

function guardarRostro(nombre, descriptor) {
  const arr = Array.from(descriptor)

  const db = JSON.parse(localStorage.getItem('facesDB') || '{}')
  db[nombre] = arr
  localStorage.setItem('facesDB', JSON.stringify(db))
}

function cargarRostros() {
  const db = JSON.parse(localStorage.getItem('facesDB') || '{}')
  return Object.entries(db).map(([name, arr]) => ({
    name,
    descriptor: new Float32Array(arr)
  }))
}

function distancia(a, b) {
  let s = 0
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i]
    s += d * d
  }
  return Math.sqrt(s)
}

async function registrar() {
  if (!nombre.value) {
    mensaje.value = "Pon un nombre"
    return
  }

  try {
    const descriptor = await capturarDescriptor()
    guardarRostro(nombre.value, descriptor)
    mensaje.value = "Rostro registrado correctamente"
  } catch (err) {
    mensaje.value = err.message
  }
}

async function verificar() {
  try {
    const actual = await capturarDescriptor()
    const rostros = cargarRostros()

    if (rostros.length === 0) {
      mensaje.value = "No hay rostros guardados"
      return
    }

    let mejor = null

    for (const r of rostros) {
      const d = distancia(actual, r.descriptor)
      if (!mejor || d < mejor.dist) {
        mejor = { name: r.name, dist: d }
      }
    }

    if (mejor.dist < 0.55) {
      mensaje.value = "Bienvenido " + mejor.name
    } else {
      mensaje.value = "No coincide con ningún rostro"
    }

  } catch (err) {
    mensaje.value = err.message
  }
}

onMounted(async () => {
  await loadModels()
  await startCamera()
})
</script>
