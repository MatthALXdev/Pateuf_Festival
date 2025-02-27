<template>
  <div id="app">
    <!-- Bloque en mode portrait -->
    <div
      v-if="isPortraitBlocked"
      class="z-50 fixed h-screen inset-0 flex items-center justify-center bg-_black01 text-_beige03"
    >
      <p class="text-center px-8">
        Cette application est conçue pour être utilisée en mode portrait.<br />
        Veuillez pivoter votre appareil.
      </p>
    </div>

    <!-- Contenu principal -->
    <div v-else>
      <!-- Header -->
      <Header_comp />
      <!-- Navigation -->
      <Nav_bar />
      <!-- Contenu spécifique à la vue -->
      <router-view />
      <!-- Footer -->
      <Footer_comp />
    </div>
  </div>
</template>

<script setup>
import Header_comp from '@/components/Header_comp.vue'
import Nav_bar from '@/components/Nav_bar.vue'
import Footer_comp from '@/components/Footer_comp.vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNavigationStore } from '@/stores/useNavigationStore'

const isPortraitBlocked = ref(false)
const route = useRoute()
const router = useRouter()
const navigationStore = useNavigationStore()

// Fonction pour détecter le blocage en mode paysage sur téléphone
const updateOrientation = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const isPhone = width < 768 // Ajuste selon la largeur standard d'un téléphone
  isPortraitBlocked.value = isPhone && width > height
}

// Fonction pour scroller automatiquement vers la section ciblée
const scrollToSection = sectionId => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

// Observer les changements de section via le store
watch(
  () => navigationStore.currentSection,
  async sectionId => {
    if (!sectionId) return

    if (route.path !== '/') {
      await router.push({ path: '/', hash: sectionId })
    } else {
      scrollToSection(sectionId)
    }
    navigationStore.resetScrollState()
  },
)

// Observer les changements de route et scroller vers la section si nécessaire
watch(
  () => route.fullPath,
  newPath => {
    if (newPath.includes('#')) {
      const sectionId = newPath.split('#')[1] // Extrait la partie après le #
      scrollToSection(sectionId)
    }
  },
)

// Scroller à la section après le chargement initial (si un hash est présent)
onMounted(() => {
  updateOrientation() // Initialisation de l'orientation
  window.addEventListener('resize', updateOrientation)

  if (route.hash) {
    const sectionId = route.hash.replace('#', '')
    scrollToSection(sectionId)
  }
})

// Nettoyer les écouteurs d'événements
onUnmounted(() => {
  window.removeEventListener('resize', updateOrientation)
})
</script>
