import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  const currentSection = ref(null) // Section active
  const shouldScroll = ref(false) // Si on doit scroller automatiquement

  // Met à jour la section actuelle
  const navigateToSection = sectionId => {
    currentSection.value = sectionId
    shouldScroll.value = true
  }

  // Réinitialise l'état de scroll après le défilement
  const resetScrollState = () => {
    shouldScroll.value = false
  }

  return {
    currentSection,
    shouldScroll,
    navigateToSection,
    resetScrollState,
  }
})
