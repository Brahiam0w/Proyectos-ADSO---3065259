<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      
      <q-page class="login-page flex flex-center">

        <div class="ambient-glow">
          <div class="glow glow-top"></div>
          <div class="glow glow-bottom"></div>
        </div>

        <div class="login-container">

          <q-card class="login-card">

            <q-card-section class="text-center q-pt-xl q-pb-lg">
              <div class="logo-circle">
                <q-icon name="auto_awesome" size="32px" color="primary" />
              </div>

              <h1 class="title">
                Nueva Contraseña
              </h1>

              <p class="subtitle">
                Crea una llave nueva y segura para volver a entrar en tu universo numérico.
              </p>
            </q-card-section>

            <q-card-section class="q-px-xl q-pb-xl">
              <q-form @submit.prevent="onSubmit" class="q-gutter-md">

                <q-input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Nueva Contraseña"
                  filled
                  dense
                  lazy-rules
                  :rules="[val => !!val || 'La contraseña es requerida', val => val.length >= 6 || 'Mínimo 6 caracteres']"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_outline" />
                  </template>
                  <template v-slot:append>
                    <q-icon 
                      :name="showPassword ? 'visibility' : 'visibility_off'" 
                      class="cursor-pointer" 
                      @click="showPassword = !showPassword" 
                    />
                  </template>
                </q-input>

                <q-input
                  v-model="confirmarPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  label="Confirmar Contraseña"
                  filled
                  dense
                  lazy-rules
                  :rules="[
                    val => !!val || 'Confirma tu nueva contraseña',
                    val => val === password || 'Las contraseñas no coinciden'
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="verified_user" />
                  </template>
                  <template v-slot:append>
                    <q-icon 
                      :name="showConfirmPassword ? 'visibility' : 'visibility_off'" 
                      class="cursor-pointer" 
                      @click="showConfirmPassword = !showConfirmPassword" 
                    />
                  </template>
                </q-input>

                <q-btn
                  type="submit"
                  class="login-btn"
                  unelevated
                  no-caps
                  :loading="cargando"
                  :disable="cargando"
                >
                  <q-icon name="auto_fix_high" class="q-mr-sm" size="xs" />
                  Actualizar contraseña
                </q-btn>

              </q-form>

              <div class="text-center q-mt-lg">
                <a @click.prevent="volverAlLogin" href="#" class="register-link text-caption cursor-pointer">
                  <q-icon name="arrow_back" size="xs" class="q-mr-xs" />
                  Cancelar y volver al inicio
                </a>
              </div>
            </q-card-section>

            <div class="bottom-bar"></div>

          </q-card>

          <div class="copyright">
            © 2026 Numerología Mística. Todos los derechos reservados.
          </div>

        </div>

      </q-page>

    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from '../api/axios'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const password = ref('')
const confirmarPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const cargando = ref(false)

const onSubmit = async () => {
  const token = route.params.token
  if (!token) {
    $q.notify({ color: 'negative', message: 'Falta el token de seguridad.', position: 'top' })
    return
  }

  cargando.value = true
  try {
    const response = await axios.post(`/auth/restablecer-password/${token}`, {
      password: password.value
    })

    if (response.data.success) {
      $q.notify({
        color: 'positive',
        message: 'Tu contraseña ha sido renovada con éxito.',
        icon: 'check_circle',
        position: 'top',
        timeout: 5000
      })
      router.push('/')
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.response?.data?.mensaje || 'El enlace ha expirado o no es válido.',
      icon: 'error',
      position: 'top'
    })
  } finally {
    cargando.value = false
  }
}

const volverAlLogin = () => {
  router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.login-page {
  min-height: 100vh !important;
  width: 100%;
  overflow: hidden;
  position: relative;
  background-color: #191022;
  background-image:
    radial-gradient(circle at 100% 0%, #2e1065 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, #4c1d95 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237311d4' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/svg%3E");
}

.ambient-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.glow {
  position: absolute;
  width: 50%;
  height: 50%;
  background: rgba(115, 17, 212, 0.3);
  border-radius: 50%;
  filter: blur(120px);
}

.glow-top { top: -10%; left: -10%; }
.glow-bottom { bottom: -10%; right: -10%; }

.login-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  padding: 16px;
}

.login-card {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
  overflow: hidden;
}

@media (max-width: 600px) {
  .q-px-xl {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
  .q-pb-xl {
    padding-bottom: 32px !important;
  }
  .title {
    font-size: 24px;
  }
}

.logo-circle {
  margin: 0 auto 24px auto;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(115, 17, 212, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-family: "Playfair Display", serif;
  font-size: 28px;
  margin-top: 0;
  margin-bottom: 8px;
  line-height: 1.2;
  color: #111;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
}

.register-link {
  color: #7311d4;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  background: #7311d4;
  color: white;
  font-weight: 600;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(115, 17, 212, 0.4);
}

.bottom-bar {
  height: 6px;
  background: linear-gradient(to right, #7311d4, #a855f7, #6366f1);
}

.copyright {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}
</style>
