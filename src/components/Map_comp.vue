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
        v-if="!isExpanded"
        class="absolute top-10 left-10 z-20 w-52 max-h-96 bg-_white03 text-base rounded-lg shadow-lg px-4 pb-4 font-caesar overflow-y-auto"
        :class="scrollbarClass"
      >
        <details class="flex flex-col col group">
          <summary
            class="sticky top-0 bg-_white03 cursor-pointer font-semibold text-darkBlue01 group-hover:text-_blue01 text-center flex items-center justify-between pt-4 z-30"
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
          <div class="sticky top-9 bg-_white03 h-2"></div>
          <button
            @click="toggleSelectHandler"
            class="sticky top-11 bg-_white03 text-_blue01 text-sm z-30 w-full"
          >
            {{ allSelected ? 'Tout désélectionner' : 'Tout sélectionner' }}
          </button>

          <div>
            <div v-for="group in groupFilterData" :key="group.name" class="">
              <input
                type="checkbox"
                :id="group.name"
                v-model="checkedGroups"
                :value="group.name"
                class="focus:ring-blue-500 focus:outline-none hidden"
              />
              <label
                :for="group.name"
                class="block w-full text-_black01 cursor-pointer p-1 rounded-lg mr-2"
                :class="[
                  'mt-2',
                  checkedGroups.includes(group.name)
                    ? 'bg-_blue03'
                    : 'bg-_white03',
                ]"
              >
                {{ group.name }}
              </label>
            </div>
          </div>
        </details>
      </nav>

      <!-- Bouton Actuellement -->
      <button
        v-if="!isExpanded"
        @click="showOnStage"
        class="text-base absolute bottom-5 right-5 z-20 w-auto h-10 bg-_white02 text-_darkBlue02 font-medium rounded-md shadow-md p-2 transition-colors duration-200 ease-in-out hover:bg-_blue02 font-caesar animate-pulse hover:animate-none focus:animate-none"
      >
        En ce moment
      </button>

      <!-- Overlay pour les interactions -->
      <div
        id="overlay"
        ref="overlay"
        class="absolute inset-0 w-full h-full bg-_white02 bg-opacity-0 pointer-events-auto z-10 hidden"
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
import { onMounted, ref, watch, nextTick, inject, defineEmits } from 'vue'
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
const emit = defineEmits(['is-loaded'])
const mapContainer = ref(null)
const overlay = ref(null)
const map = ref(null)
const isExpanded = ref(false)
const scrollbarClass = inject('scrollbarClass')
const selectedFeature = ref(null)
const coordinates = ref([0, 0])
const checkedGroups = ref([])
const allSelected = ref(true)
const currentlyOnStage = ref(false)
const isLoaded = ref(false)
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

// Initialiser la carte avec Mapbox et configurer les sources et couches
onMounted(() => {
  // const startTime = performance.now()
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/devamalix/cm3r6hztm004l01s67dy67elp/draft',
    center: [1.1451961205377867, 47.45770024379996],
    zoom: 14,
  })
  map.value.on('load', async () => {
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
      // const endTime = performance.now()
      // console.log(
      //   `Temps total de chargement du composant et des couches : ${endTime - startTime} ms`,
      // )
      isLoaded.value = true
      emit('is-loaded', isLoaded.value)
    })
  })
})
// Observer les changements dans les groupes cochés
watch(checkedGroups, newCheckedGroups => {
  allSelected.value = newCheckedGroups.length === props.groupFilterData.length
  updateLayers(map.value, props.groupFilterData, checkedGroups.value)
})
</script>
