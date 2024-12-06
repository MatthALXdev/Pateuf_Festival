<template>
  <div class="flex flex-col h-full w-full">
    <!-- Conteneur de la carte -->
    <div
      :class="{
        'h-1/2': isExpanded,
        'h-full': !isExpanded,
      }"
      ref="mapContainer"
      class="relative w-full transition-all duration-300 ease-in-out overflow-hidden"
    >
      <!-- Groupe de filtres pour les icônes -->
      <nav
        class="absolute top-10 left-10 z-20 w-52 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
      >
        <details class="group">
          <summary
            class="cursor-pointer font-semibold text-gray-800 group-hover:text-blue-600 text-center flex items-center justify-between"
          >
            <span>Filtre</span>
            <svg
              class="w-5 h-5 transition-transform duration-300 ease-in-out group-open:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <button
            @click="toggleSelectHandler"
            class="text-blue-500 text-sm mt-2 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {{ allSelected ? 'Tout désélectionner' : 'Tout sélectionner' }}
          </button>
          <div v-for="group in groupFilterData" :key="group.name" class="mt-3">
            <input
              type="checkbox"
              :id="group.name"
              v-model="checkedGroups"
              :value="group.name"
              class="mr-2 focus:ring-blue-500 focus:outline-none"
            />
            <label :for="group.name" class="text-gray-700">
              {{ group.name }}
            </label>
          </div>
        </details>
      </nav>

      <!-- Bouton Actuellement -->
      <button
        @click="showOnStage"
        class="absolute bottom-5 right-5 z-20 w-20 h-10 bg-blue-600 text-white font-medium rounded-lg shadow-md p-2 transition-colors duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
      >
        Actuel
      </button>

      <!-- Overlay pour les interactions -->
      <div
        id="overlay"
        ref="overlay"
        class="absolute inset-0 w-full h-full bg-white bg-opacity-0 pointer-events-auto z-10 hidden"
      ></div>
    </div>

    <!-- Composant des détails de la carte -->
    <Map_details_comp
      v-if="selectedFeature || currentlyOnStage"
      :currentlyOnStage="currentlyOnStage"
      :feature="selectedFeature || {}"
      :planningData="planningData"
      @close="closeDetailsHandler"
      class="h-1/2"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import mapboxgl from 'mapbox-gl'
import { setupLayerEvents, selectFeature } from '@/services/layerHandler'
import { initializeMapSources } from '@/services/mapInit'
// import { showDetailsForSelectedLocations } from '@/services/mapEvent'
import {
  closeDetails,
  toggleSelectAllAndUpdateLayers,
  updateLayers,
  adjustCenterCoordinates,
} from '@/services/mapEvent'
import { MAPBOX_ACCESS_TOKEN } from '@/config/constants'
// import { getPolygonCenter } from '@/services/getPolygonCenter'
import Map_details_comp from './Map_details_comp.vue'
// Props du composant
const props = defineProps({
  mapData: Object,
  logoMapData: Object,
  mapStyleData: Object,
  planningData: Object,
  groupFilterData: Array,
})
const mapContainer = ref(null)
const overlay = ref(null)
const map = ref(null)
const isExpanded = ref(false)

const selectedFeature = ref(null)
const coordinates = ref([0, 0])
const checkedGroups = ref([])
const allSelected = ref(true)
const currentlyOnStage = ref(false)
// const selectedLocations = ref(false)

watch(isExpanded, async newVal => {
  if (newVal && map.value) {
    await nextTick()
    const adjustedCoordinates = selectedFeature.value
      ? adjustCenterCoordinates(
          {
            lng: coordinates.value[0],
            lat: coordinates.value[1],
          },
          map,
          mapContainer,
        )
      : [1.1451961205377867, 47.45770024379996]
    map.value.flyTo({ center: adjustedCoordinates, zoom: 15 })
  }
})

// Utiliser closeDetails avec les références appropriées
function closeDetailsHandler() {
  closeDetails(
    selectedFeature,
    isExpanded,
    map.value,
    overlay.value,
    currentlyOnStage,
  )
}

function toggleSelectHandler() {
  toggleSelectAllAndUpdateLayers(
    allSelected,
    checkedGroups,
    props.groupFilterData,
  )
}

function showOnStage() {
  currentlyOnStage.value = !currentlyOnStage.value

  if (currentlyOnStage.value) {
    // Mettre à jour isExpanded pour agrandir la vue
    isExpanded.value = true

    // Récentrez la carte sur le centre par défaut

    // Afficher l'overlay
    overlay.value.style.display = 'block'
  } else {
    // Réinitialiser isExpanded et masquer l'overlay
    isExpanded.value = false
    overlay.value.style.display = 'none'
  }
}

// showDetailsForSelectedLocations(selectedLocations, props, isExpanded)

// Initialiser la carte avec Mapbox et configurer les sources et couches
onMounted(() => {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
  if (map.value) {
    map.value.remove()
  }
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/devamalix/cm3r6hztm004l01s67dy67elp/draft',
    center: [1.1451961205377867, 47.45770024379996],
    zoom: 14,
    maxBounds: [
      [1.123468936041729, 47.44501907592129],
      [1.166923305033844, 47.47038141167863],
    ],
  })
  map.value.on('load', () => {
    initializeMapSources(map.value, props)
    map.value.once('idle', () => {
      checkedGroups.value = props.groupFilterData.map(group => group.name)
      setupLayerEvents(map.value, feature =>
        selectFeature(
          feature,
          selectedFeature,
          isExpanded,
          coordinates,
          overlay.value,
        ),
      )
    })
  })
})
// Observer les changements dans les groupes cochés
watch(checkedGroups, newCheckedGroups => {
  allSelected.value = newCheckedGroups.length === props.groupFilterData.length
  updateLayers(map.value, props.groupFilterData, checkedGroups.value)
})
</script>
