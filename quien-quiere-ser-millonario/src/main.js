import { createApp } from 'vue'
import { Quasar } from 'quasar'
import './style.css'
import App from './App.vue'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import {router} from "./routes/routes.js"


const app = createApp(App)

app.use(Quasar, {
    plugins: {},
})

app.use(router)
app.mount('#app')