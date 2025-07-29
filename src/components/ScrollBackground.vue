<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hue = ref(0)

const updateHue = () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight
  const scrollPercent = Math.min(window.scrollY / maxScroll, 1)
  hue.value = Math.floor(scrollPercent * 360)
}

onMounted(() => window.addEventListener('scroll', updateHue))
onUnmounted(() => window.removeEventListener('scroll', updateHue))
</script>

<template>
  <div
    class="fixed inset-0 -z-10 transition-all duration-700"
    :style="`background: linear-gradient(to bottom, hsl(${hue}, 80%, 70%), hsl(${(hue + 100) % 360}, 10%, 70%))`"
  />
</template>
