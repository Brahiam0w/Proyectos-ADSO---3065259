import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Importar Quasar y estilos
import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

// Importar solo los componentes que usas
import {
   QLayout,
  QHeader,
  QToolbar,
  QToolbarTitle,
  QPageContainer,
  QPage,
  QCard,
  QCardSection,
  QBtn,
  QBanner,
  QSeparator
} from 'quasar'

// Crear instancia de Vue (usa 'app' en minúscula)
const app = createApp(App)

app.use(Quasar, {
  plugins: { Notify },
  components: {
    QPage,
    QCard,
    QCardSection,
    QBtn,
    QBanner,
    QSeparator
  }
})

app.mount('#app')
