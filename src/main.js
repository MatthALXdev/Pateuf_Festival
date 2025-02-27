// @ts-nocheck
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/global.css'
import './assets/tailwind.css'
import { useFaqStore } from '@/stores/useFaqStore'
import { useNavigationStore } from '@/stores/useNavigationStore'
import { useAuthStore } from './stores/authStore'
import { useBorderStore } from '@/stores/useBorderStore'
import { useIconStore } from '@/stores/useIconStore'
import { useMapZoneStore } from '@/stores/useMapZoneStore'
import { useScheduleStore } from '@/stores/useScheduleStore'

const pinia = createPinia()
const app = createApp(App)

const authStore = useAuthStore(pinia)
authStore.restoreSession() // ✅ Récupère la session stockée en mémoire

// Précharger les données nécessaires pour les stores
async function preloadStores() {
  const navigationStore = useNavigationStore(pinia)
  const borderStore = useBorderStore(pinia)
  const faq = useFaqStore(pinia)
  const iconStore = useIconStore(pinia)
  const mapZoneStore = useMapZoneStore(pinia)
  const scheduleStore = useScheduleStore(pinia)
  await borderStore.fetchFestivalBorder()
  await faq.fetchFaq()
  await iconStore.fetchIconData()
  await mapZoneStore.fetchMapZone()
  await scheduleStore.fetchScheduleData()
}

// Préchargement avant le montage de l'application
preloadStores()
  .then(() => {
    app.use(pinia).use(router).mount('#app')
  })
  .catch(error => {
    console.error('Erreur lors du préchargement des stores:', error)
  })
