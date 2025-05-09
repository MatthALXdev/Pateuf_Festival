<template>
  <div class="overflow-hidden relative w-full">
    <div
      v-if="isLgScreen"
      class="flex flex-wrap gap-3 w-full justify-center h-fit"
    >
      <div v-for="(src, index) in brandingStore.ticketImages" :key="index">
        <img
          :src="src"
          :alt="`Type de ticket ${index + 1}`"
          class="h-80 mx-auto"
        />
      </div>
    </div>

    <div
      v-else
      class="flex transition-transform duration-500 ease-in-out w-full"
      :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
      @touchstart="startSwipe"
      @touchend="endSwipe"
    >
      <div
        v-for="(src, index) in brandingStore.ticketImages"
        :key="index"
        class="flex-shrink-0 w-full sm:w-1/2"
      >
        <img
          :src="src"
          :alt="`Type de ticket ${index + 1}`"
          class="h-80 w-auto mx-auto"
        />
      </div>
    </div>

    <div v-if="!isLgScreen" class="flex justify-center mt-4">
      <span
        v-for="index in panelsCount"
        :key="index"
        :class="index - 1 === currentImageIndex ? 'bg-black' : 'bg-gray-400'"
        class="w-2 h-2 rounded-full mx-1"
      ></span>
    </div>

    <div
      v-if="!isLgScreen && !isTouchDevice"
      class="flex items-center justify-between px-4"
    >
      <button
        @click="previousImage"
        :disabled="currentImageIndex === 0"
        class="text-5xl font-bold text-_darkBlue01 px-4"
      >
        ⇐
      </button>
      <button
        @click="nextImage"
        :disabled="currentImageIndex === panelsCount - 1"
        class="text-5xl font-bold text-_darkBlue01 px-4"
      >
        ⇒
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBrandingStore } from '@/stores/useBrandingStore'

const brandingStore = useBrandingStore()
const currentImageIndex = ref(0)
const startX = ref(0)
const isTouchDevice = ref(false)
const windowWidth = ref(window.innerWidth)

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

const panelsCount = computed(() => {
  return Math.ceil(
    brandingStore.ticketImages.length / (windowWidth.value >= 640 ? 2 : 1),
  )
})

const nextImage = () => {
  if (currentImageIndex.value < panelsCount.value - 1) {
    currentImageIndex.value++
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const startSwipe = event => {
  startX.value = event.touches[0].clientX
}

const endSwipe = event => {
  const endX = event.changedTouches[0].clientX
  const deltaX = endX - startX.value
  if (deltaX > 50) previousImage()
  else if (deltaX < -50) nextImage()
}

const isLgScreen = computed(() => windowWidth.value >= 1024)

onMounted(async () => {
  if (!brandingStore.ticketImages.length) {
    brandingStore.fetchBranding()
  }
  window.addEventListener('resize', updateWindowWidth)
  updateWindowWidth()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
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
