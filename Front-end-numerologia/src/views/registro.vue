<template>
  <q-layout view="lHh Lpr lFf" class="mystic-dark-layout">
    <q-page-container>
      <q-page class="main-content-dark flex flex-center">
        
        <!-- Ambient Glow -->
        <div class="ambient-glow">
          <div class="glow glow-top"></div>
          <div class="glow glow-bottom"></div>
        </div>

        <div class="register-container animate-fade">
          <q-card class="mystic-card-dark register-card shadow-24">
            
            <!-- Encabezado fijo -->
            <q-card-section class="text-center q-pt-lg q-pb-none">
              <div class="logo-circle">
                <q-icon name="auto_awesome" size="28px" color="amber-8" />
              </div>

              <h1 class="title-font text-h4 text-white q-mt-sm q-mb-xs">
                Comienza tu Viaje
              </h1>
              <p class="text-grey-5 text-subtitle2 q-mb-none">
                Revela tu destino estelar.
              </p>
            </q-card-section>

            <!-- Área de Formulario con scroll interno si es necesario -->
            <q-card-section class="q-px-lg q-pb-lg scroll-area">
              <q-form ref="registerForm" @submit.prevent="handleRegister" class="q-gutter-y-md q-mt-md">
                
                <q-input
                  v-model="form.fullname"
                  label="Nombre completo"
                  dark
                  filled
                  dense
                  label-color="amber-8"
                  :rules="[val => !!val || 'El nombre es obligatorio']"
                >
                  <template #prepend>
                    <q-icon name="person_outline" color="amber-8" size="20px" />
                  </template>
                </q-input>

                <div class="birth-container">
                  <div class="custom-label q-mb-xs flex items-center">
                    <q-icon name="event" size="12px" class="q-mr-xs" />
                    Fecha de Nacimiento
                  </div>
                  <q-input
                    v-model="form.birthdate"
                    mask="####/##/##"
                    dark
                    filled
                    dense
                    class="birth-input"
                    placeholder="AAAA/MM/DD"
                    hint="Debes ser mayor de 18 años"
                    hide-hint
                    :rules="[
                      val => !!val || 'La fecha es obligatoria',
                      val => {
                        const hoy = new Date();
                        const fechaNac = new Date(val);
                        if (fechaNac > hoy) return 'Fecha inválida';
                        const edadMinima = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
                        return fechaNac <= edadMinima || 'Mínimo 18 años';
                      }
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon name="calendar_month" class="cursor-pointer" color="amber-8">
                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                          <q-date 
                            v-model="form.birthdate" 
                            dark 
                            minimal
                            color="amber-9" 
                            text-color="black"
                            mask="YYYY/MM/DD"
                            :options="date => date <= hoyFormateado"
                            @update:model-value="() => $refs.qDateProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <q-input
                  v-model="form.email"
                  type="email"
                  label="Correo electrónico"
                  dark
                  filled
                  dense
                  label-color="amber-8"
                  :rules="[
                    val => !!val || 'El correo es obligatorio',
                    val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Formato de correo no válido'
                  ]"
                >
                  <template #prepend>
                    <q-icon name="alternate_email" color="amber-8" size="20px" />
                  </template>
                </q-input>

                <q-input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Contraseña"
                  dark
                  filled
                  dense
                  label-color="amber-8"
                  :rules="[
                    val => !!val || 'La contraseña es obligatoria',
                    val => val.length >= 6 || 'Mínimo 6 caracteres'
                  ]"
                >
                  <template #prepend>
                    <q-icon name="lock_outline" color="amber-8" size="20px" />
                  </template>
                  <template #append>
                    <q-icon
                      :name="showPassword ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer"
                      color="grey-5"
                      size="18px"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>

                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <q-select
                      v-model="form.genero"
                      :options="genderOptions"
                      label="Género"
                      dark
                      filled
                      dense
                      emit-value
                      map-options
                      label-color="amber-8"
                    >
                      <template #prepend>
                        <q-icon name="transgender" color="amber-8" size="20px" />
                      </template>
                    </q-select>
                  </div>
                  <div class="col-6">
                    <q-input
                      v-model="form.pais"
                      label="País"
                      dark
                      filled
                      dense
                      label-color="amber-8"
                    >
                      <template #prepend>
                        <q-icon name="public" color="amber-8" size="20px" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <q-checkbox
                  v-model="form.terms"
                  dark
                  dense
                  color="amber-8"
                  class="text-caption text-grey-4 terms-check"
                >
                  Acepto los <span class="text-amber-8">Términos</span> y la <span class="text-amber-8">Privacidad</span>
                </q-checkbox>

                <q-btn
                  type="submit"
                  class="register-btn full-width q-py-sm q-mt-sm"
                  unelevated
                  no-caps
                  :loading="loading"
                  :disable="loading"
                >
                  <q-icon name="auto_fix_high" class="q-mr-sm" />
                  REGISTRARSE
                </q-btn>

              </q-form>

              <div class="text-center q-mt-md">
                <span class="text-grey-5 text-caption">¿Ya tienes cuenta?</span>
                <a @click.prevent="irALogin" href="#" class="login-link q-ml-sm cursor-pointer text-caption">
                  Inicia sesión
                </a>
              </div>
            </q-card-section>

          </q-card>

          <div class="copyright text-center q-mt-md text-grey-8 text-caption">
            © 2026 Oráculo de Sabiduría.
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

const registerForm = ref(null)
const showPassword = ref(false)
const loading = ref(false)

const hoyFormateado = (() => {
  const now = new Date();
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
})();

const form = reactive({
  fullname: '',
  birthdate: '',
  email: '',
  password: '',
  genero: 'prefiero no decirlo',
  pais: '',
  terms: false
})

const genderOptions = [
  { label: 'Masculino', value: 'masculino' },
  { label: 'Femenino', value: 'femenino' },
  { label: 'Otro', value: 'otro' },
  { label: 'Prefiero no decirlo', value: 'prefiero no decirlo' }
]

const handleRegister = async () => {
  const isValid = await registerForm.value.validate()

  if (!isValid) {
    return
  }

  if (!form.terms) {
    $q.notify({
      color: 'warning',
      message: 'Debes aceptar los términos y condiciones',
      icon: 'warning',
      position: 'top'
    })
    return
  }

  loading.value = true
  const res = await authStore.register({
    nombre: form.fullname,
    email: form.email,
    password: form.password,
    fecha_nacimiento: form.birthdate,
    genero: form.genero,
    pais: form.pais
  })
  loading.value = false

  if (res.success) {
    $q.notify({
      color: 'positive',
      message: '¡Registro exitoso! Por favor, inicia sesión con tus credenciales.',
      icon: 'stars',
      position: 'top'
    })
    router.push('/')
  } else {
    $q.notify({
      color: 'negative',
      message: res.mensaje || 'Error al registrarse',
      icon: 'error',
      position: 'top'
    })
  }
}

const irALogin = () => {
  router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.title-font { font-family: 'Playfair Display', serif; }

/* Layout Base - ELIMINAR SCROLL */
.mystic-dark-layout { 
  background: #0a0612; 
  color: #e0e0e0; 
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.main-content-dark {
  height: 100vh;
  height: 100dvh;
  background-image: 
    radial-gradient(circle at 0% 0%, rgba(115, 17, 212, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.08) 0%, transparent 50%);
  position: relative;
  overflow: hidden;
  padding: 0 !important;
}

/* Ambient Glow */
.ambient-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.glow {
  position: absolute;
  width: 40vw;
  height: 40vw;
  background: rgba(115, 17, 212, 0.12);
  border-radius: 50%;
  filter: blur(120px);
  animation: float 10s infinite ease-in-out;
}

.glow-top { top: -10%; left: -10%; }
.glow-bottom { bottom: -10%; right: -10%; animation-delay: -5s; }

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(15px, 30px) scale(1.05); }
}

/* Container & Card */
.register-container {
  width: 100%;
  max-width: 440px;
  padding: 16px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.register-card {
  border-radius: 24px;
  background: rgba(22, 15, 36, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(212, 175, 55, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 85vh; /* Altura máxima para asegurar que quepa sin scroll de página */
}

.scroll-area {
  overflow-y: auto;
  flex: 1;
  /* Ocultar barra de scroll en Firefox */
  scrollbar-width: none; 
  /* Ocultar barra de scroll en IE/Edge */
  -ms-overflow-style: none; 
}

/* Ocultar barra de scroll en Chrome, Safari y Opera */
.scroll-area::-webkit-scrollbar { 
  display: none; 
}

.logo-circle {
  margin: 0 auto 8px auto;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(212, 175, 55, 0.3);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
}

/* Inputs & Form */
.custom-label {
  font-size: 10px;
  font-weight: 800;
  color: #d4af37;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.birth-input {
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
}

.terms-check {
  font-size: 11px !important;
}

/* Buttons */
.register-btn {
  background: linear-gradient(45deg, #d4af37, #b8860b);
  color: #0a0612;
  font-weight: 800;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
}

.login-link {
  color: #d4af37;
  font-weight: 700;
  text-decoration: none;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade {
  animation: fadeIn 0.8s ease-out forwards;
}

/* Mobile Optimizations */
@media (max-width: 600px) {
  .register-container { max-width: 100%; }
  .register-card { max-height: 90vh; }
  .q-px-lg { padding-left: 16px !important; padding-right: 16px !important; }
}
</style>