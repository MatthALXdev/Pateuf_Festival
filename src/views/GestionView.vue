<template>
  <div
    class="pt-[120px] min-h-screen bg-gray-100 flex flex-col items-center p-6"
  >
    <!-- Titre -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6">
      Tableau de bord - Pateuf Festival
    </h1>

    <!-- Vérification de l'authentification -->
    <div v-if="!store.isAuthenticated" class="text-red-500 font-semibold">
      <p>Accès restreint. Veuillez vous connecter.</p>
      <button
        @click="store.login"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Se connecter
      </button>
    </div>

    <div v-else class="w-full max-w-5xl">
      <!-- Sélecteur de vue de gestion -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <button
          v-for="section in sections"
          :key="section.key"
          @click="currentView = section.key"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          {{ section.icon }} {{ section.title }}
        </button>
      </div>

      <!-- Affichage du composant sélectionné -->
      <component :is="currentComponent" />

      <!-- Bouton de déconnexion -->
      <button
        @click="store.logout"
        class="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
      >
        Se déconnecter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import EditFaq from '@/components/Gestion/EditFaq.vue'
import EditFestivalBorder from '@/components/Gestion/EditFestivalBorder.vue'
import EditInfo from '@/components/Gestion/EditInfo.vue'
import EditLocation from '@/components/Gestion/EditLocation.vue'
import EditSchedule from '@/components/Gestion/EditSchedule.vue'

// Récupération du store
const store = useAuthStore()

// Initialiser Netlify Identity lorsque la vue est montée (au besoin)
onMounted(() => {
  store.init()
})

// État local pour suivre la vue de gestion sélectionnée
const currentView = ref(null)

// Définition des sections de gestion
const sections = [
  {
    key: 'info',
    title: 'Informations Importantes',
    icon: '📜',
    component: EditInfo,
  },
  {
    key: 'schedule',
    title: 'Programmation',
    icon: '🎤',
    component: EditSchedule,
  },
  {
    key: 'location',
    title: 'Lieux du Festival',
    icon: '📍',
    component: EditLocation,
  },
  { key: 'faq', title: 'FAQ', icon: '❓', component: EditFaq },
  {
    key: 'festivalBorder',
    title: 'Bordure du festival',
    icon: '🗺️',
    component: EditFestivalBorder,
  },
]

// Calculer dynamiquement le composant de gestion à afficher
const currentComponent = computed(() => {
  const selected = sections.find(section => section.key === currentView.value)
  return selected ? selected.component : null
})
</script>
