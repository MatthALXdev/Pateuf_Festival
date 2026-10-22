// @ts-nocheck
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'
import './assets/global.css'
import './assets/tailwind.css'
import './assets/css/mapbox.css'

// Stores (préchargement lecture publique)
import { useFaqStore } from '@/stores/useFaqStore'
import { useNavigationStore } from '@/stores/useNavigationStore'
import { useAuthStore } from './stores/authStore'
import { useBorderStore } from '@/stores/useBorderStore'
import { useIconStore } from '@/stores/useIconStore'
import { useMapZoneStore } from '@/stores/useMapZoneStore'
import { useScheduleStore } from '@/stores/useScheduleStore'
import { useBrandingStore } from '@/stores/useBrandingStore'
import { useSponsorStore } from '@/stores/useSponsorStore'

// Création app + pinia
const app = createApp(App)
const pinia = createPinia()

// ⚙️ Installation des plugins AVANT tout (évite les erreurs d'injection $auth0)
app.use(pinia)
app.use(router)
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
      // 🎯 nécessaire pour obtenir un access_token API lorsque tu feras des mutations Sanity
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    },
    onRedirectCallback: (appState) => {
      router.push(appState?.target || '/homeView')
    },
    cacheLocation: 'localstorage', // pratique en dev
    useRefreshTokens: true,
  }),
)

// Instancie le store d'auth si besoin d'un état global (pas d'appel à useAuth0 ici)
const authStore = useAuthStore(pinia)
// authStore.restoreSession?.() // si tu as cette méthode

// Précharger les données nécessaires (LECTURE publique uniquement)
async function preloadStores() {
  const navigationStore = useNavigationStore(pinia)
  const borderStore = useBorderStore(pinia)
  const faq = useFaqStore(pinia)
  const iconStore = useIconStore(pinia)
  const mapZoneStore = useMapZoneStore(pinia)
  const scheduleStore = useScheduleStore(pinia)
  const brandingStore = useBrandingStore(pinia)
  const sponsorStore = useSponsorStore(pinia)

  await borderStore.fetchFestivalBorder()
  await faq.fetchFaq()
  await iconStore.fetchIconData()
  await mapZoneStore.fetchMapZone()
  await scheduleStore.fetchScheduleData()
  await brandingStore.fetchBranding()
  await sponsorStore.fetchSponsors()
}

// ⏳ On précharge puis on monte (on monte aussi en cas d'échec pour ne pas bloquer l'UI)
;(async () => {
  try {
    await preloadStores()
  } catch (error) {
    console.error('Erreur lors du préchargement des stores:', error)
  } finally {
    app.mount('#app')
    console.log('Montage app')
  }
})()