<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Palette de Couleurs</h1>
    <div class="grid grid-cols-3 gap-6">
      <div
        v-for="color in colors"
        :key="color.name"
        class="bg-gray-100 p-4 rounded-lg shadow-md"
      >
        <div
          :style="{ backgroundColor: color.hex }"
          class="h-24 w-full rounded-lg mb-4"
        ></div>
        <h2 class="text-xl font-semibold">{{ color.name }}</h2>
        <p class="text-sm text-gray-700">{{ color.intensity }}</p>
        <p class="text-sm text-gray-500">{{ color.hex }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const colors = reactive([
  { name: '_beige01', intensity: 'Intensité 1', hex: '#CCB583' },
  { name: '_beige02', intensity: 'Intensité 2', hex: '#E5C992' },
  { name: '_beige03', intensity: 'Intensité 3', hex: '#F2D8A9' },
  { name: '_black01', intensity: 'Intensité 1', hex: '#0A0113' },
  { name: '_black02', intensity: 'Intensité 2', hex: '#404040' },
  { name: '_black03', intensity: 'Intensité 3', hex: '#666666' },
  { name: '_blue01', intensity: 'Intensité 1', hex: '#617D87' },
  { name: '_blue02', intensity: 'Intensité 2', hex: '#6A96A0' },
  { name: '_blue03', intensity: 'Intensité 3', hex: '#7AAFBA' },
  { name: '_green01', intensity: 'Intensité 1', hex: '#8A9F48' },
  { name: '_green02', intensity: 'Intensité 2', hex: '#99B84F' },
  { name: '_green03', intensity: 'Intensité 3', hex: '#AAC961' },
  { name: '_brown01', intensity: 'Intensité 1', hex: '#8D5734' },
  { name: '_brown02', intensity: 'Intensité 2', hex: '#A7643A' },
  { name: '_brown03', intensity: 'Intensité 3', hex: '#B3755A' },
  { name: '_white01', intensity: 'Intensité 1', hex: '#DBEFE3' },
  { name: '_white02', intensity: 'Intensité 2', hex: '#F5FDF4' },
  { name: '_white03', intensity: 'Intensité 3', hex: '#FFFFFF' },
  { name: '_darkBlue01', intensity: 'Intensité 1', hex: '#17102F' },
  { name: '_darkBlue02', intensity: 'Intensité 2', hex: '#422e85' },
  { name: '_darkBlue03', intensity: 'Intensité 3', hex: '#6e54c4' },
])
</script>

<style scoped>
/* Ajouter des styles personnalisés si nécessaire */
</style>
