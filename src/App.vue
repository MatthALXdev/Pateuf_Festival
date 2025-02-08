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
import { ref, onMounted, onUnmounted } from 'vue'

const isPortraitBlocked = ref(false)

const updateOrientation = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const isPhone = width < 768 // Adjust for standard phone widths
  isPortraitBlocked.value = isPhone && width > height
}
onMounted(() => {
  // Initialisation de l'orientation
  updateOrientation()
  window.addEventListener('resize', updateOrientation)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateOrientation)
})
</script>
