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
        v-for="info in newsStore.newsData"
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
import { ref, onMounted } from 'vue'
import { useNewsStore } from '@/stores/useNewsStore'
const newsStore = useNewsStore()
const currentSlide = ref(0)

const startCarousel = () => {
  const interval = 3000 // 3 seconds per slide
  setInterval(() => {
    if (newsStore.newsData.length > 0) {
      currentSlide.value = (currentSlide.value + 1) % newsStore.newsData.length
    }
  }, interval)
}

onMounted(() => {
  if (newsStore.newsData.length === 0) {
    newsStore.fetchNews().then(() => {
      if (newsStore.newsData.length > 0) {
        startCarousel()
      }
    })
  } else {
    startCarousel()
  }
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
