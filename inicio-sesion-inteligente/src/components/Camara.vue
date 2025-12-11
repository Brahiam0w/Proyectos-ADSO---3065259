<template>
  <div class="camera-container">
    <h2>🔐 Reconocimiento Facial con Parpadeo</h2>

    <div class="video-wrapper">
      <video ref="video" autoplay playsinline></video>
      <canvas ref="canvas"></canvas>
    </div>

    <div class="controls">
      <button @click="registerFace">Registrar Rostro</button>
      <button @click="confirmFace">Confirmar Rostro</button>
      <button @click="toggleDetection">
        {{ detecting ? 'Detener Detección' : 'Iniciar Detección' }}
      </button>
    </div>

    <h3>📸 Galería de Rostros Registrados</h3>
    <div class="gallery">
      <div v-for="(face, index) in faceGallery" :key="index" class="gallery-item">
        <img :src="face.image" />
      </div>
    </div>
  </div>
</template>

<script>
import * as faceapi from "face-api.js";

export default {
  name: "CameraFace",

  data() {
    return {
      detecting: false,
      faceDescriptor: null,
      faceGallery: []
    };
  },

  async mounted() {
    await this.loadModels();
    await this.startCamera();
  },

  methods: {
    async loadModels() {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    },

    async startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.$refs.video.srcObject = stream;
    },

    toggleDetection() {
      this.detecting = !this.detecting;
      if (this.detecting) this.detectLoop();
    },

    async detectLoop() {
      if (!this.detecting) return;

      const video = this.$refs.video;

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detection) {
        this.drawFace(detection);
      }

      requestAnimationFrame(this.detectLoop);
    },

    drawFace(det) {
      const canvas = this.$refs.canvas;
      const video = this.$refs.video;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      faceapi.draw.drawFaceLandmarks(canvas, det);
    },

    async registerFace() {
      const video = this.$refs.video;

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection || !detection.descriptor) {
        alert("No se detectó ningún rostro válido.");
        return;
      }

      this.faceDescriptor = detection.descriptor;

      // Guardar imagen en galería
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      this.faceGallery.push({
        image: canvas.toDataURL("image/png"),
        descriptor: detection.descriptor
      });

      alert("Rostro registrado correctamente.");
    },

    async confirmFace() {
      const video = this.$refs.video;

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection || !detection.descriptor) {
        alert("No se detectó un rostro válido.");
        return;
      }

      if (!this.faceGallery.length) {
        alert("No hay rostros registrados.");
        return;
      }

      let bestDistance = 999;

      for (const item of this.faceGallery) {
        if (!item.descriptor || item.descriptor.length !== detection.descriptor.length) {
          continue;
        }

        const dist = faceapi.euclideanDistance(item.descriptor, detection.descriptor);
        bestDistance = Math.min(bestDistance, dist);
      }

      if (bestDistance < 0.45) {
        alert("Identidad confirmada.");
      } else {
        alert("Acceso denegado. Rostro no coincide.");
      }
    }
  }
};
</script>

<style scoped>
.camera-container {
  max-width: 700px;
  margin: auto;
  text-align: center;
}

.video-wrapper {
  position: relative;
  display: inline-block;
}

video {
  width: 100%;
  border-radius: 14px;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.controls {
  margin-top: 20px;
}

.controls button {
  padding: 10px 18px;
  margin: 6px;
  font-size: 15px;
  background: #333;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.gallery {
  margin-top: 15px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.gallery-item img {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
