<template>
  <div class="p-4 bg-white shadow rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Gestion - {{ title }}</h2>
    <p class="text-gray-600">Contenu de l'édition en cours...</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: String,
})
</script>

<style scoped>
div {
  max-width: 600px;
  margin: 0 auto;
}
</style>
