import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/about',
      name: 'about',
      component: HomeView
    },
    {
      path: '/about/QuakeEngMuseum',
      name: 'QuakeEngMuseum',
      component: () => import('../views/QuakeEngMuseum.vue')
    },
    {
      path: '/about/Composite',
      name: 'Composite',
      component: () => import('../views/Composite.vue')
    },
    {
      path: '/about/Library',
      name: 'Library',
      component: () => import('../views/Library.vue')
    },
    {
      path: '/about/Office',
      name: 'Office',
      component: () => import('../views/Office.vue')
    },
    {
      path: '/damage',
      name: 'Damage',
      component: () => import('../views/Damage.vue')
    }
  ]
})

export default router
