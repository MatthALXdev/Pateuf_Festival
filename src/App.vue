<template>
  <div
    class="flex flex-col items-center justify-center border-4 border-green-500 p-5 h-screen"
  >
    <!-- Conteneur principal centré avec une bordure verte -->
    <div class="border-4 border-red-500 p-5 h-full w-full">
      <!-- Composant Map_comp avec des props -->
      <Map_comp
        :mapData="mapData"
        :logoMapData="logoMapData"
        :planningData="planningData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Map_comp from './components/Map_comp.vue'

const mapData = ref(null)
const planningData = ref(null)
const logoMapData = ref(null)

// Récupération des données pour mapData
fetch('./src/data/map.json')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    // Gestion d'erreur en cas d'échec de la requête
    throw new Error('Impossible de récupérer les données de map')
  })
  .then(data => {
    // Assignation des données récupérées à la variable réactive mapData
    mapData.value = data
  })

// Récupération des données pour planningData
fetch('./src/data/planning.json')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    // Gestion d'erreur en cas d'échec de la requête
    throw new Error('Impossible de récupérer les données de planning')
  })
  .then(data => {
    // Assignation des données récupérées à la variable réactive planningData
    planningData.value = data
  })

// Récupération des données pour logoMapData
fetch('./src/data/logoMap.json')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    // Gestion d'erreur en cas d'échec de la requête
    throw new Error('Impossible de récupérer les données de logoMap')
  })
  .then(data => {
    // Assignation des données récupérées à la variable réactive logoMapData
    logoMapData.value = data
  })
</script>
