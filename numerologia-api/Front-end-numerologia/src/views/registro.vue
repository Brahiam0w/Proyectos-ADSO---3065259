<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>

      <q-page class="register-page">

        <div class="register-wrapper row no-wrap full-height">

          <!-- LEFT PANEL -->
          <div class="col-12 col-md-6 left-panel flex flex-center">

            <div class="left-content text-center">

              <div class="mandala-glow"></div>

              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2d3OaXvmal_MQZNq_3I2lEOAbwwVQv8XhEEiwGEJB7eD2L4cqxftTVKp15EyG1nUFUErEMhktc6rW55QsYGPRp0QZObmvvmQUg3nF1b6ZNQH_OBij8P8Nt9jNHS2SZrtHXvLcr9bMwntXw5Ic9-mkBYSJ4CX3e4syBC8qOahaf0TlyoJZ6XYRMSVMBZQZ9g4G8L1PpBBnlGcrNc2YXG7tBC9MB_HegLEbtL-CADDTIckzuQgFRficoDlwrxPUS1aTKnarXKLTeOY"
                class="mandala-image"
              />

              <div class="left-text">
                <h2>Descubre tu propósito</h2>
                <p>La numerología revela los secretos escritos en tus estrellas.</p>
              </div>

            </div>

          </div>

          <!-- RIGHT PANEL -->
          <div class="col-12 col-md-6 right-panel flex flex-center">

            <q-card class="register-card">

              <q-card-section>

                <div class="tag">Registro Nuevo</div>

                <h1 class="title">Comienza tu viaje</h1>
                <p class="subtitle">
                  Ingresa tus datos para generar tu carta natal personalizada.
                </p>

              </q-card-section>

              <q-card-section>

                <q-form @submit.prevent="handleRegister" class="q-gutter-md">

                  <q-input v-model="form.fullname" label="Nombre completo" filled>
                    <template #prepend>
                      <q-icon name="person_outline" />
                    </template>
                  </q-input>

                  <!-- Fecha destacada -->
                  <div>
                    <label class="birth-label">
                      <q-icon name="stars" size="16px" />
                      Fecha de nacimiento
                    </label>

                    <q-input
                      v-model="form.birthdate"
                      type="date"
                      filled
                      class="birth-input"
                    />

                    <div class="birth-hint">
                      Este dato es esencial para tu lectura numerológica.
                    </div>
                  </div>

                  <q-input v-model="form.email" type="text" label="Correo electrónico" filled>
                    <template #prepend>
                      <q-icon name="alternate_email" />
                    </template>
                  </q-input>

                  <q-input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Contraseña"
                    filled
                  >
                    <template #prepend>
                      <q-icon name="lock_outline" />
                    </template>
                    <template #append>
                      <q-icon
                        :name="showPassword ? 'visibility' : 'visibility_off'"
                        class="cursor-pointer"
                        @click="showPassword = !showPassword"
                      />
                    </template>
                  </q-input>

                  <!-- Opcionales -->
                  <q-expansion-item
                    icon="tune"
                    label="Datos Opcionales (Mejora la precisión)"
                    dense
                    class="optional-box"
                  >
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-6">
                        <q-input v-model="form.birthtime" type="time" label="Hora de nacimiento" dense outlined />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input v-model="form.birthplace" label="Lugar de nacimiento" dense outlined />
                      </div>
                    </div>
                  </q-expansion-item>

                  <q-checkbox
                    v-model="form.terms"
                    label="Acepto los Términos del Servicio y la Política de Privacidad"
                  />

                  <q-btn
                    type="submit"
                    class="register-btn"
                    unelevated
                    no-caps
                    :loading="loading"
                    :disable="loading"
                  >
                    REGISTRARSE
                  </q-btn>

                </q-form>

                <div class="login-link text-center">
                  ¿Ya tienes una cuenta?
                  <a @click.prevent="irALogin" href="#" class="cursor-pointer">Inicia sesión</a>
                </div>

              </q-card-section>

            </q-card>

          </div>

        </div>

      </q-page>

    </q-page-container>

  </q-layout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const showPassword = ref(false)
const loading = ref(false)

const form = reactive({
  fullname: '',
  birthdate: '',
  email: '',
  password: '',
  birthtime: '',
  birthplace: '',
  terms: false
})

const handleRegister = async () => {
  // Regex para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.terms) {
    $q.notify({
      color: 'warning',
      message: 'Debes aceptar los términos y condiciones',
      icon: 'warning'
    })
    return
  }

  if (!form.fullname || !form.birthdate || !form.email || !form.password) {
    $q.notify({
      color: 'negative',
      message: 'Por favor, completa los campos obligatorios',
      icon: 'report_problem'
    })
    return
  }

  if (!emailRegex.test(form.email)) {
    $q.notify({
      progress: true,
      message: 'Email no válido',
      caption: 'Por favor, introduce un correo con formato correcto (ejemplo@mail.com)',
      icon: 'alternate_email',
      color: 'deep-purple-9',
      textColor: 'white',
      position: 'top',
      actions: [{ icon: 'close', color: 'white' }]
    })
    return
  }

  loading.value = true
  const res = await authStore.register({
    nombre: form.fullname,
    email: form.email,
    password: form.password,
    fecha_nacimiento: form.birthdate
  })
  loading.value = false

  if (res.success) {
    $q.notify({
      color: 'positive',
      message: `¡Registro exitoso! Bienvenido, ${authStore.user.nombre}.`,
      icon: 'check_circle'
    })
    router.push('/perfil')
  } else {
    $q.notify({
      color: 'negative',
      message: res.mensaje || 'Error al registrarse',
      icon: 'error'
    })
  }
}

const irALogin = () => {
  router.push('/') // Asumiendo que / es el login
}
</script>

<style scoped>

/* Fondo general */
.register-page {
  min-height: 100vh;
}

/* Layout wrapper */
.register-wrapper {
  min-height: 100vh;
}

/* LEFT */
.left-panel {
  background: linear-gradient(135deg, #191022 0%, #2d1b3e 50%, #4a192c 100%);
  position: relative;
  overflow: hidden;
}

.mandala-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(115,17,212,0.4);
  border-radius: 50%;
  filter: blur(120px);
  animation: pulse 4s infinite ease-in-out;
}

.mandala-image {
  width: 70%;
  max-width: 400px;
  position: relative;
  z-index: 2;
  mix-blend-mode: screen;
}

.left-text {
  margin-top: 40px;
  color: white;
}

.left-text h2 {
  font-size: 28px;
  font-weight: bold;
}

.left-text p {
  opacity: 0.7;
}

/* RIGHT */
.right-panel {
  background: #f7f6f8;
  padding: 40px;
}

.register-card {
  width: 100%;
  max-width: 480px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

/* Text */
.tag {
  background: rgba(115,17,212,0.1);
  color: #7311d4;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 16px;
}

.title {
  font-size: 32px;
  font-weight: 800;
}

.subtitle {
  color: #666;
  margin-bottom: 20px;
}

/* Fecha destacada */
.birth-label {
  font-weight: bold;
  color: #7311d4;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.birth-input {
  border: 2px solid rgba(115,17,212,0.3);
}

.birth-hint {
  font-size: 12px;
  color: #7311d4;
  margin-top: 4px;
  opacity: 0.7;
}

.optional-box {
  background: #f1edf7;
  border-radius: 12px;
}

/* Botón */
.register-btn {
  width: 100%;
  background: linear-gradient(to right, #D4AF37, #b8860b);
  color: white;
  font-weight: bold;
  padding: 14px;
  border-radius: 12px;
  margin-top: 10px;
  transition: 0.3s;
}

.register-btn:hover {
  transform: translateY(-2px);
}

.login-link {
  margin-top: 20px;
}

.login-link a {
  color: #7311d4;
  font-weight: bold;
  text-decoration: none;
}

/* Animación glow */
@keyframes pulse {
  0%,100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
}

</style>