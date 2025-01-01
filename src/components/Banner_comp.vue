<template>
  <!-- Carrousel -->
  <div class="w-full h-20 overflow-hidden">
    <div
      class="absolute inset-0 flex transition-transform duration-1000"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
    >
      <!-- Compte à rebours -->
      <div
        class="flex justify-center space-x-8 text-center w-full flex-shrink-0"
      >
        <div>
          <p class="text-4xl font-bold">{{ days }}</p>
          <p class="text-lg">JOURS</p>
        </div>
        <div>
          <p class="text-4xl font-bold">{{ hours }}</p>
          <p class="text-lg">HEURES</p>
        </div>
        <div>
          <p class="text-4xl font-bold">{{ minutes }}</p>
          <p class="text-lg">MINUTES</p>
        </div>
        <div>
          <p class="text-4xl font-bold">{{ seconds }}</p>
          <p class="text-lg">SECONDES</p>
        </div>
      </div>
      <!-- Informations -->
      <div
        v-for="info in infos"
        :key="info.infoID"
        class="flex items-center justify-center w-full flex-shrink-0"
      >
        <p class="text-lg font-semibold text-center px-4">
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
      totalSlides.value = newData.length + 1 // Include countdown slide
    } else {
      dataLoaded.value = false
      totalSlides.value = 1
    }
  },
  { immediate: true },
)

const targetDate = new Date('2025-06-14T14:00:00+02:00')
const days = ref('XXX')
const hours = ref('XX')
const minutes = ref('XX')
const seconds = ref('XX')

const updateCountdown = () => {
  const now = new Date()
  const difference = targetDate - now

  if (difference > 0) {
    days.value = Math.floor(difference / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((difference / (1000 * 60 * 60)) % 24)
    minutes.value = Math.floor((difference / (1000 * 60)) % 60)
    seconds.value = Math.floor((difference / 1000) % 60)
  } else {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
  }
}

const startCarousel = () => {
  const interval = 12000 // 12 seconds per slide
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % totalSlides.value
  }, interval)
}

onMounted(() => {
  updateCountdown()
  setInterval(updateCountdown, 1000)
  startCarousel()
})
</script>
