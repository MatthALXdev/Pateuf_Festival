<template>
  <div class="overflow-hidden relative w-full">
    <div
      class="flex transition-transform duration-500 ease-in-out w-full"
      :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="flex-shrink-0 w-full"
      >
        <a :href="image.url"
          ><img :src="image.src" :alt="image.alt" class="h-80 w-auto mx-auto"
        /></a>
      </div>
    </div>

    <!-- Indicateurs de position du carrousel -->
    <div class="flex justify-center mt-4">
      <span
        v-for="(image, index) in images"
        :key="index"
        class="w-3 h-3 rounded-full mx-1"
        :class="index === currentImageIndex ? 'bg-black' : 'bg-gray-400'"
      ></span>
    </div>

    <!-- Boutons de navigation -->
    <div class="inset-0 flex items-center justify-between px-4">
      <button
        @click="previousImage"
        class="text-5xl font-bold text-_darkBlue01 px-4"
      >
        &#8656;
      </button>
      <button
        @click="nextImage"
        class="text-5xl font-bold text-_darkBlue01 px-4"
      >
        &#8658;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import pass1Day from './../assets/images/ticket/pass1Day.png'
import vip1Day from './../assets/images/ticket/vip1Day.png'
import pass2Day from './../assets/images/ticket/pass2Day.png'
import vip2Day from './../assets/images/ticket/vip2Day.png'

const images = [
  { src: pass1Day, alt: 'Pass 1 Day', url: '#' },
  { src: vip1Day, alt: 'VIP 1 Day', url: '#' },
  { src: pass2Day, alt: 'Pass 2 Days', url: '#' },
  { src: vip2Day, alt: 'VIP 2 Days', url: '#' },
]

const currentImageIndex = ref(0)

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length
}

const previousImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + images.length) % images.length
}
</script>

<style>
.flex {
  display: flex;
}
.overflow-hidden {
  overflow: hidden;
}
.transition-transform {
  transition: transform 0.5s ease-in-out;
}
</style>
