import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminAuthView from '../views/AdminAuthView.vue'
import GestionView from '../views/GestionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/adminAuth', component: AdminAuthView, name: 'admin' },
    {
      path: '/gestion',
      component: GestionView,
      name: 'gestion',
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !sessionStorage.getItem('authenticated')) {
    next('/adminAuth')
  } else {
    next()
  }
})
export default router
