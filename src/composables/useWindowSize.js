import { ref, onMounted, onUnmounted, computed } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)

  const updateWidth = () => (width.value = window.innerWidth)

  onMounted(() => window.addEventListener('resize', updateWidth))
  onUnmounted(() => window.removeEventListener('resize', updateWidth))

  const isSmallScreen = computed(() => width.value < 768)
  const isLgScreen = computed(() => width.value > 1024)

  return { width, isSmallScreen, isLgScreen }
}
