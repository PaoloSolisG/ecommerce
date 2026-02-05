import { createRouter, createWebHistory } from 'vue-router'
import Tienda from '../views/Tienda.vue'
import Inicio from '../views/Inicio.vue' // <-- Vamos a crear este ahora

const routes = [
  { 
    path: '/', 
    name: 'Inicio', 
    component: Inicio 
  },
  { 
    path: '/tienda', 
    name: 'Tienda', 
    component: Tienda 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router