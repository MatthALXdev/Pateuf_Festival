<template>
  <div class="pt-[120px] min-h-screen bg-gray-100 flex flex-col items-center p-6">
    <!-- Titre -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Gestion</h1>

    <!-- Vérification de l'authentification -->
    <div v-if="!authStore.isAuthenticated" class="text-red-500 font-semibold text-center">
      <p>Accès restreint. Veuillez vous connecter.</p>
      <button
        @click="handleLogin"
        :disabled="authLoading"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Se connecter
      </button>
      <p v-if="authLoading" class="mt-2 text-sm opacity-70">Initialisation d'Auth…</p>
    </div>

    <div v-else class="w-full max-w-5xl">
      <!-- Sélecteur de vue de gestion -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-6">
        <button
          v-for="section in sections"
          :key="section.key"
          @click="currentView = section.key"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-left"
          :class="{ 'ring-2 ring-gray-700': currentView === section.key }"
        >
          {{ section.icon }} {{ section.title }}
        </button>
      </div>

      <!-- Affichage du composant sélectionné -->
      <component :is="currentComponent" />

      <!-- Bouton de déconnexion -->
      <div class="flex justify-end">
        <button
          @click="handleLogout"
          class="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from '@/stores/authStore'
import EditFaq from '@/components/Gestion/EditFaq.vue'
import EditFestivalBorder from '@/components/Gestion/EditFestivalBorder.vue'
import EditInfo from '@/components/Gestion/EditInfo.vue'
import EditLocation from '@/components/Gestion/EditLocation.vue'
import EditSchedule from '@/components/Gestion/Schedule/EditSchedule.vue'

const router = useRouter()
const auth = useAuth0() // ✅ toujours dans setup()
const authStore = useAuthStore()

// Etat local
const currentView = ref(null)
const authLoading = computed(() => auth.isLoading?.value === true)

// Définition des sections de gestion
const sections = [
  { key: 'info', title: 'Informations Importantes', icon: '📜', component: EditInfo },
  { key: 'schedule', title: 'Programmation', icon: '🎤', component: EditSchedule },
  { key: 'faq', title: 'FAQ', icon: '❓', component: EditFaq },
  { key: 'border', title: 'Frontières', icon: '🗺️', component: EditFestivalBorder },
  { key: 'location', title: 'Lieux', icon: '📍', component: EditLocation },
]

// Composant courant
const currentComponent = computed(() => {
  const selected = sections.find(s => s.key === currentView.value)
  return selected ? selected.component : null
})

// Initialiser Auth0 (le store ne doit pas appeler useAuth0 lui-même)
onMounted(async () => {
  try {
    await authStore.init?.(auth)
    // Valeur par défaut si rien n'est choisi
    if (!currentView.value && authStore.isAuthenticated) {
      currentView.value = sections[0].key
    }
  } catch (e) {
    console.error('Erreur init authStore:', e)
  }
})

// Rediriger vers /adminAuth si l'utilisateur se déconnecte
watch(
  () => authStore.isAuthenticated,
  newVal => {
    if (!newVal) router.push('/adminAuth')
  },
)

// Actions
const handleLogin = async () => {
  try {
    if (typeof authStore.login === 'function') {
      await authStore.login(auth)
    } else {
      await auth.loginWithRedirect?.()
    }
  } catch (e) {
    console.error('Erreur login:', e)
  }
}

const handleLogout = async () => {
  try {
    if (typeof authStore.logout === 'function') {
      await authStore.logout(auth)
    } else {
      await auth.logout?.({ logoutParams: { returnTo: window.location.origin } })
    }
  } catch (e) {
    console.error('Erreur logout:', e)
  }
}
</script>
