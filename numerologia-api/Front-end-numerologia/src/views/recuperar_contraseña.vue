<template>
  <div class="fullscreen flex flex-center mystical-gradient font-display q-pa-md">
    
    <q-card class="auth-card w-full rounded-xl shadow-xl overflow-hidden bg-white border-light z-top" style="max-width: 480px;">
      
      <div class="relative-position h-48 bg-primary-5 flex flex-center overflow-hidden">
        <div class="absolute-full opacity-20 safe-pattern-bg"></div>
        
        <div class="relative-position z-top column items-center">
          <div class="size-16 rounded-full bg-primary-10 flex flex-center text-primary">
            <q-icon name="lock_reset" size="xl" />
          </div>
        </div>
        
        <div class="absolute blur-circle top-right"></div>
        <div class="absolute blur-circle bottom-left"></div>
      </div>

      <q-card-section class="q-pa-xl">
        <div class="q-mb-lg">
          <h1 class="text-h5 text-weight-bold text-grey-9 q-my-none tracking-tight">Recuperar Contraseña</h1>
          <p class="text-body1 text-grey-6 text-weight-regular q-mt-sm q-mb-none leading-relaxed">
            Ingresa el correo electrónico asociado a tu cuenta para recibir las instrucciones de recuperación.
          </p>
        </div>

        <q-form @submit.prevent="onSubmit">
          <div class="q-mb-xl">
            <label class="block text-caption text-weight-bolder text-grey-7 uppercase tracking-wider q-mb-sm">
              Correo electrónico
            </label>
            <q-input 
              v-model="email" 
              outlined 
              type="email"
              placeholder="ejemplo@correo.com"
              bg-color="grey-1"
              color="primary"
              :rules="reglasEmail"
              lazy-rules
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="mail" color="grey-5" class="q-pl-sm" />
              </template>
            </q-input>
          </div>

          <q-btn 
            type="submit" 
            color="primary" 
            label="Enviar enlace de recuperación" 
            class="full-width rounded-lg text-weight-bold tracking-wide shadow-primary custom-btn h-14 q-mb-md"
            no-caps
            :loading="cargando"
          />
        </q-form>

        <div class="q-pt-md border-top-light text-center">
          <a href="#" class="inline-flex flex-center q-gutter-x-sm text-primary text-weight-bold text-subtitle2 link-hover">
            <q-icon name="arrow_back" size="sm" />
            <span>Volver al inicio de sesión</span>
          </a>
        </div>
      </q-card-section>
    </q-card>

    <div class="absolute-bottom text-center text-grey-6 q-pb-lg z-top pointer-events-none">
      <div class="row justify-center q-gutter-x-md q-mb-sm opacity-50">
      </div>
      <p class="text-caption q-my-none">© 2024 Numerología Mística. Todos los derechos reservados.</p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const cargando = ref(false)

const reglasEmail = [
  val => !!val || 'El correo es requerido',
  val => /.+@.+\..+/.test(val) || 'Ingresa un correo válido'
]

const onSubmit = () => {
  cargando.value = true
  
  setTimeout(() => {
    cargando.value = false
    email.value = ''
  }, 1500)
}
</script>

<style scoped>
:root {
  --q-primary: #7311d4;
}
.font-display { font-family: 'Inter', sans-serif; }
.text-primary { color: #7311d4 !important; }
.bg-primary { background-color: #7311d4 !important; }

/* Tallas y Posiciones */
.h-48 { height: 12rem; }
.h-14 { height: 3.5rem; }
.size-8 { width: 2rem; height: 2rem; }
.size-16 { width: 4rem; height: 4rem; }
.absolute-full { position: absolute; top: 0; right: 0; bottom: 0; left: 0; }
.z-top { z-index: 10; }
.pointer-events-none { pointer-events: none; }

/* Bordes y Sombras */
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.border-light { border: 1px solid rgba(115, 17, 212, 0.05); }
.border-top-light { border-top: 1px solid #f1f5f9; }
.shadow-primary { box-shadow: 0 10px 15px -3px rgba(115, 17, 212, 0.2); }

/* Fondos y Opacidades */
.bg-primary-5 { background-color: rgba(115, 17, 212, 0.05) !important; }
.bg-primary-10 { background-color: rgba(115, 17, 212, 0.1) !important; }
.opacity-50 { opacity: 0.5; }

/* Textos */
.tracking-tight { letter-spacing: -0.015em; }
.tracking-wider { letter-spacing: 0.05em; }
.leading-relaxed { line-height: 1.625; }

/* ===== EFECTOS MÍSTICOS ===== */
.mystical-gradient {
  background-color: #f7f6f8;
  background-image: 
    radial-gradient(circle at top right, rgba(115, 17, 212, 0.08), transparent 40%),
    radial-gradient(circle at bottom left, rgba(115, 17, 212, 0.05), transparent 40%);
}

.safe-pattern-bg {
  background-image: radial-gradient(rgba(115, 17, 212, 0.3) 1px, transparent 1px);
  background-size: 20px 20px;
}

.blur-circle {
  width: 10rem;
  height: 10rem;
  background-color: rgba(115, 17, 212, 0.1);
  border-radius: 9999px;
  filter: blur(24px);
}
.top-right { top: -2.5rem; right: -2.5rem; }
.bottom-left { bottom: -2.5rem; left: -2.5rem; }

/* Botones y Links */
.custom-btn { transition: all 0.2s ease; }
.custom-btn:hover { background-color: rgba(115, 17, 212, 0.9) !important; }
.custom-btn:active { transform: scale(0.98); }

.link-hover { text-decoration: none; transition: all 0.2s ease; text-underline-offset: 4px; text-decoration-thickness: 2px; }
.link-hover:hover { text-decoration: underline; }
</style>