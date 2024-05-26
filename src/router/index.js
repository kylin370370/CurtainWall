import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about/QuakeEngMuseum',
      name: 'QuakeEngMuseum',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('../views/Upload.vue')
    }
  ]
})

export default router
