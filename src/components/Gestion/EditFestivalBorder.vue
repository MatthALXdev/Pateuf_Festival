<template>
  <div class="p-4 bg-white shadow rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Éditer la bordure du festival</h2>

    <div v-if="error" class="text-red-500 mb-4">Erreur : {{ error }}</div>
    <div v-if="loading" class="text-gray-500 mb-4">Chargement des données...</div>

    <div class="h-[500px] w-full mb-4" ref="mapContainer"></div>

    <div class="flex gap-4">
      <button
        @click="resetToSanityData"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
      >
        Réinitialiser
      </button>
      <button
        @click="saveToSanity"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
        :disabled="saving"
      >
        {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { useBorderStore } from '@/stores/useBorderStore'

const store = useBorderStore()
const mapContainer = ref(null)
const map = ref(null)
const draw = ref(null)
const error = ref(null)
const loading = ref(false)
const saving = ref(false)

// Initialiser la carte
onMounted(async () => {
  loading.value = true
  await store.fetchFestivalBorder()
  error.value = store.error
  loading.value = false

  if (store.festivalBorder && mapContainer.value) {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [1.145, 47.457],
      zoom: 14,
    })

    map.value.on('load', () => {
      draw.value = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      })
      map.value.addControl(draw.value)

      // Charger la bordure actuelle
      draw.value.add(store.festivalBorder.features[0])
    })
  }
})

// Réinitialiser les coordonnées
function resetToSanityData() {
  if (!map.value || !draw.value) return
  draw.value.deleteAll()
  draw.value.add(store.festivalBorder.features[0])
}

// Sauvegarder vers Sanity
async function saveToSanity() {
  if (!draw.value || draw.value.getAll().features.length === 0) return

  saving.value = true
  error.value = null

  const geojson = draw.value.getAll()
  const polygon = geojson.features[0]?.geometry?.coordinates[0] || []

  // Conversion en tableau de { longitude, latitude }
  const coordinates = polygon.map(([lng, lat]) => ({ longitude: lng, latitude: lat }))

  try {
    const response = await fetch('/.netlify/functions/updateSanityData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataset: 'pateuf_private',
        type: 'festivalBorderCoordinates',
        patch: { coordinates },
      }),
    })

    if (!response.ok) throw new Error('Erreur lors de l\'enregistrement')
    const result = await response.json()
    if (!result.success) throw new Error(result.message)
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.mapboxgl-canvas {
  border-radius: 0.5rem;
}
</style>
