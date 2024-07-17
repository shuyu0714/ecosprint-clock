import { createRouter, createWebHashHistory } from "vue-router"
import Home from '../pages/Home.vue'
import Records from '../pages/Records.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/records',
    component: Records
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router