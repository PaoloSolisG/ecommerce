import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tienda.css' // El CSS sí se queda aquí porque es global

createApp(App).use(router).mount('#app')