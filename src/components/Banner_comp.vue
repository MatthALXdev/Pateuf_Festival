<template>
  <!-- Carrousel -->
  <div class="w-fit h-14">
    <div
      class="absolute inset-0 flex transition-transform duration-1000"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
    >
      <!-- Informations -->
      <div
        v-for="info in infos"
        :key="info.infoID"
        class="flex items-center justify-center w-full flex-shrink-0"
      >
        <p class="text-sm text-center px-1">
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
  const interval = 12000 // 12 seconds per slide
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % totalSlides.value
  }, interval)
}

onMounted(() => {
  startCarousel()
})
</script>
