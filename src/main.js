import { createApp } from 'vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router' // Importera routern
import App from './App.vue'


const app = createApp(App)
app.use(router) // Säg till Vue att använda routern
app.mount('#app')