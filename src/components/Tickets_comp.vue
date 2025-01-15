<template>
  <div class="overflow-hidden relative w-full">
    <!-- Cette section affiche les 4 images côte à côte lorsque l'écran est en mode 'lg' ou plus large -->
    <div
      v-if="isLgScreen"
      class="flex flex-wrap gap-3 w-full justify-center h-fit"
    >
      <div v-for="(image, index) in images" :key="index">
        <a :href="image.url">
          <img :src="image.src" :alt="image.alt" class="h-80 mx-auto" />
        </a>
      </div>
    </div>
    <!-- Cette section gère le carrousel pour les petits écrans -->
    <div
      v-else
      class="flex transition-transform duration-500 ease-in-out w-full"
      :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
      @touchstart="startSwipe"
      @touchend="endSwipe"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="flex-shrink-0 w-full sm:w-1/2"
      >
        <a :href="image.url">
          <img :src="image.src" :alt="image.alt" class="h-80 w-auto mx-auto" />
        </a>
      </div>
    </div>

    <!-- Indicateurs de position du carrousel pour les petits écrans -->
    <div v-if="!isLgScreen" class="flex justify-center mt-4">
      <span
        v-for="index in panelsCount"
        :key="index"
        :class="index - 1 === currentImageIndex ? 'bg-black' : 'bg-gray-400'"
        class="w-2 h-2 rounded-full mx-1"
      ></span>
    </div>

    <!-- Boutons de navigation pour les petits écrans -->
    <div
      v-if="!isLgScreen && !isTouchDevice"
      class="flex items-center justify-between px-4"
    >
      <button
        @click="previousImage"
        :disabled="currentImageIndex === 0"
        class="text-5xl font-bold text-_darkBlue01 px-4"
      >
        &#8656;
      </button>
      <button
        @click="nextImage"
        :disabled="currentImageIndex === panelsCount - 1"
        class="text-5xl font-bold text-_darkBlue01 px-4"
      >
        &#8658;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import pass1Day from './../assets/images/ticket/pass1Day.png'
import vip1Day from './../assets/images/ticket/vip1Day.png'
import pass2Day from './../assets/images/ticket/pass2Day.png'
import vip2Day from './../assets/images/ticket/vip2Day.png'

/* Images affichées dans le carrousel */
const images = [
  { src: pass1Day, alt: 'Pass 1 Day', url: '#' },
  { src: vip1Day, alt: 'VIP 1 Day', url: '#' },
  { src: pass2Day, alt: 'Pass 2 Days', url: '#' },
  { src: vip2Day, alt: 'VIP 2 Days', url: '#' },
]

/* Indice de l'image actuellement affichée dans le carrousel */
const currentImageIndex = ref(0)

/* Position de départ pour un swipe tactile */
const startX = ref(0)

/* Détection si l'appareil est tactile */
const isTouchDevice = ref(false)

/* Largeur de la fenêtre pour gérer le comportement responsive */
const windowWidth = ref(window.innerWidth)

/* Met à jour la largeur de la fenêtre */
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

/* Calcul du nombre de panneaux nécessaires pour afficher les images */
const panelsCount = computed(() => {
  return Math.ceil(images.length / (windowWidth.value >= 640 ? 2 : 1))
})

/* Passe à l'image suivante dans le carrousel */
const nextImage = () => {
  if (currentImageIndex.value < panelsCount.value - 1) {
    currentImageIndex.value++
  }
}

/* Revient à l'image précédente dans le carrousel */
const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

/* Enregistre la position de départ pour un swipe */
const startSwipe = event => {
  startX.value = event.touches[0].clientX
}

/* Gère la fin d'un swipe pour naviguer dans le carrousel */
const endSwipe = event => {
  const endX = event.changedTouches[0].clientX
  const deltaX = endX - startX.value

  if (deltaX > 50) {
    previousImage()
  } else if (deltaX < -50) {
    nextImage()
  }
}

/* Vérifie si l'écran est en mode 'lg' ou plus large */
const isLgScreen = computed(() => windowWidth.value >= 1024)

/* Initialisation lors du montage du composant */
onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  window.addEventListener('resize', updateWindowWidth)
  updateWindowWidth()
})

/* Nettoyage lors du démontage du composant */
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style>
/* Styles de base pour le carrousel */
.flex {
  display: flex;
}
.overflow-hidden {
  overflow: hidden;
}
.transition-transform {
  transition: transform 0.5s ease-in-out;
}
button:disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
