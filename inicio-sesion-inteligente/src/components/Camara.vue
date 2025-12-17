<template>
  <div class="camera-container">
    <h1>🔐 Registro de Identidad</h1>

    <div class="video-wrapper">
      <video ref="videoRef" autoplay playsinline></video>
      <canvas ref="canvasRef"></canvas>
    </div>

    <div class="form-section">
      <input 
        v-model="userName" 
        type="text" 
        placeholder="Nombre completo"
        class="input-field"
      />
    </div>

    <div class="controls">
      <button @click="registerFace" class="btn-primary">
        📸 Registrar Usuario
      </button>
      <button @click="confirmFace" class="btn-success">
        ✓ Verificar Identidad
      </button>
    </div>

    <div v-if="faceGallery.length > 0" class="gallery-section">
      <h3>Usuarios Registrados</h3>
      <div class="gallery">
        <div v-for="(face, index) in faceGallery" :key="index" class="gallery-item">
          <img :src="face.image" :alt="face.name" />
          <p class="user-name">{{ face.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as faceapi from 'face-api.js';

// Referencias reactivas
const videoRef = ref(null);
const canvasRef = ref(null);
const userName = ref('');
const faceGallery = ref([]);

// Cargar datos del localStorage al iniciar
const loadFromStorage = () => {
  const stored = localStorage.getItem('faceGallery');
  if (stored) {
    faceGallery.value = JSON.parse(stored);
  }
};

// Guardar datos en localStorage
const saveToStorage = () => {
  localStorage.setItem('faceGallery', JSON.stringify(faceGallery.value));
};

// Cargar modelos de face-api.js
const loadModels = async () => {
  const MODEL_URL = '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
  ]);
};

// Iniciar la cámara
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: 640, 
        height: 480 
      } 
    });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
    }
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
    alert('❌ No se pudo acceder a la cámara. Verifica los permisos.');
  }
};

// Registrar rostro
const registerFace = async () => {
  if (!userName.value.trim()) {
    alert('❌ Por favor, ingresa un nombre.');
    return;
  }

  if (!videoRef.value) {
    alert('❌ Video no disponible.');
    return;
  }

  try {
    const detection = await faceapi
      .detectSingleFace(videoRef.value, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection || !detection.descriptor) {
      alert('❌ No se detectó ningún rostro válido. Asegúrate de estar frente a la cámara.');
      return;
    }

    // Capturar imagen del rostro
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.value.videoWidth;
    canvas.height = videoRef.value.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.value, 0, 0);

    faceGallery.value.push({
      name: userName.value,
      image: canvas.toDataURL('image/png'),
      descriptor: Array.from(detection.descriptor) // Convertir a array para localStorage
    });

    saveToStorage(); // Guardar en localStorage

    alert(`✅ Usuario "${userName.value}" registrado correctamente.`);
    
    // Limpiar campo
    userName.value = '';
  } catch (error) {
    console.error('Error al registrar rostro:', error);
    alert('❌ Error al registrar el rostro. Intenta nuevamente.');
  }
};

// Confirmar identidad
const confirmFace = async () => {
  if (!videoRef.value) {
    alert('❌ Video no disponible.');
    return;
  }

  try {
    const detection = await faceapi
      .detectSingleFace(videoRef.value, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection || !detection.descriptor) {
      alert('❌ No se detectó un rostro válido. Asegúrate de estar frente a la cámara.');
      return;
    }

    if (faceGallery.value.length === 0) {
      alert('❌ No hay usuarios registrados.');
      return;
    }

    let bestMatch = null;
    let bestDistance = 999;

    for (const item of faceGallery.value) {
      if (!item.descriptor || item.descriptor.length !== detection.descriptor.length) {
        continue;
      }

      // Convertir array a Float32Array si es necesario
      const storedDescriptor = new Float32Array(item.descriptor);
      const dist = faceapi.euclideanDistance(storedDescriptor, detection.descriptor);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestMatch = item;
      }
    }

    if (bestDistance < 0.45 && bestMatch) {
      alert(`✅ Identidad confirmada!\n\nUsuario: ${bestMatch.name}`);
    } else {
      alert('❌ Acceso denegado. Rostro no coincide con ningún usuario registrado.');
    }
  } catch (error) {
    console.error('Error al confirmar rostro:', error);
    alert('❌ Error al verificar la identidad. Intenta nuevamente.');
  }
};

// Lifecycle hooks
onMounted(async () => {
  try {
    loadFromStorage(); // Cargar datos guardados
    await loadModels();
    await startCamera();
  } catch (error) {
    console.error('Error en la inicialización:', error);
    alert('❌ Error al inicializar el sistema. Verifica que los modelos estén en /public/models/');
  }
});

onUnmounted(() => {
  // Detener la cámara al desmontar
  if (videoRef.value && videoRef.value.srcObject) {
    const tracks = videoRef.value.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.camera-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

h1 {
  color: white;
  margin: 0 0 25px 0;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
}

.video-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  background: #000;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

video {
  width: 100%;
  display: block;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.detection-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 59, 48, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.detection-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 59, 48, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.form-section {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-field {
  width: 100%;
  padding: 14px 18px;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  background: white;
  color: #333;
  outline: none;
  transition: all 0.3s;
}

.input-field:focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.input-field::placeholder {
  color: #999;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.controls button {
  flex: 1;
  min-width: 140px;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.btn-success {
  background: #2196F3;
  color: white;
}

.btn-success:hover {
  background: #0b7dda;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
}

.btn-secondary {
  background: white;
  color: #667eea;
}

.btn-secondary:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
}

.gallery-section {
  margin-top: 30px;
  padding-top: 25px;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.gallery-section h3 {
  color: white;
  font-size: 20px;
  margin: 0 0 20px 0;
  text-align: center;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
}

.gallery-item {
  background: white;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  transition: transform 0.3s;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.gallery-item img {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 8px;
}

.user-name {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>