<template>
  <!-- Carrousel -->
  <div
    class="relative h-14 overflow-hidden w-full flex items-center justify-center"
  >
    <div
      class="absolute inset-0 flex transition-transform duration-1000"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
    >
      <!-- Informations -->
      <div
        v-for="info in infos"
        :key="info.infoID"
        class="flex items-center justify-center flex-shrink-0 w-full"
      >
        <p class="text-xs text-center px-2 line-clamp-3">
          {{ info.infoDescription }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const dataLoaded = ref(null)
const props = defineProps({
  infos: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const currentSlide = ref(0)
const totalSlides = ref(1) // Will update dynamically based on infos length

watch(
  () => props.infos,
  newData => {
    if (newData && Array.isArray(newData) && newData.length > 0) {
      dataLoaded.value = true
      totalSlides.value = newData.length
    } else {
      dataLoaded.value = false
      totalSlides.value = 1
    }
  },
  { immediate: true },
)

const startCarousel = () => {
  const interval = 3000 // 12 seconds per slide
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % totalSlides.value
  }, interval)
}

onMounted(() => {
  startCarousel()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
</style>
