import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminAuthView from '../views/AdminAuthView.vue'
import GestionView from '../views/GestionView.vue'
import { useAuthStore } from '@/stores/authStore'

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
    { path: '/:pathMatch(.*)*', redirect: '/' }, // Redirection pour les routes inconnues
  ],
})

router.beforeEach((to, from, next) => {
  const store = useAuthStore()
  // Vérification si la route est protégée
  if (to.meta.requiresAuth && !store.isAuthenticated) {
    next('/adminAuth')
  } else {
    next()
  }
})

export default router
