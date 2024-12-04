<template>
  <div class="flex flex-col h-full w-full">
    <!-- Conteneur de la carte -->
    <div
      :class="{ 'h-1/2': isExpanded, 'h-full': !isExpanded }"
      ref="mapContainer"
      class="relative w-full transition-height duration-300 ease-in-out overflow-hidden object-contain"
    >
      <!-- Groupe de filtres pour les icônes -->
      <nav
        class="absolute top-10 right-10 z-10 w-48 bg-white rounded shadow-lg p-2"
      >
        <details>
          <summary class="cursor-pointer">Filtrer par icônes</summary>
          <button
            @click="toggleSelectAllAndUpdateLayers"
            class="text-blue-500 text-sm mt-2"
          >
            {{ allSelected ? 'Tout désélectionner' : 'Tout sélectionner' }}
          </button>
          <div v-for="group in groupFilterData" :key="group.name" class="mt-2">
            <input
              type="checkbox"
              :id="group.name"
              v-model="checkedGroups"
              :value="group.name"
              class="mr-2"
            />
            <label :for="group.name">{{ group.name }}</label>
          </div>
        </details>
      </nav>
      <!-- Overlay pour les interactions -->
      <div
        id="overlay"
        ref="overlay"
        class="absolute inset-0 w-full h-full bg-white bg-opacity-0 pointer-events-auto z-10 hidden"
      ></div>
    </div>

    <!-- Composant des détails de la carte -->
    <Map_details_comp
      v-if="selectedFeature"
      :feature="selectedFeature"
      :planningData="planningData"
      @close="closeDetails"
      class="h-1/2"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import mapboxgl from 'mapbox-gl'
import {
  initializeMapSources,
  setupLayerEvents,
  resetMap,
} from '@/services/mapHandler'
import { MAPBOX_ACCESS_TOKEN } from '@/config/constants'
import { getPolygonCenter } from '@/services/getPolygonCenter'
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

watch(isExpanded, async newVal => {
  if (newVal && map.value) {
    await nextTick()
    const adjustedCoordinates = adjustCenterCoordinates({
      lng: coordinates.value[0],
      lat: coordinates.value[1],
    })
    map.value.flyTo({ center: adjustedCoordinates, zoom: 15 })
  }
})

function adjustCenterCoordinates(center) {
  if (map.value) {
    const centerOffsetY =
      map.value.unproject([
        mapContainer.value.offsetWidth / 2,
        mapContainer.value.offsetHeight / 2,
      ]).lat -
      map.value.unproject([
        mapContainer.value.offsetWidth / 2,
        mapContainer.value.offsetHeight / 4,
      ]).lat

    return {
      lng: center.lng,
      lat: center.lat + centerOffsetY,
    }
  }
  return center
}

// Sélectionner une fonctionnalité sur la carte
function selectFeature(feature) {
  if (feature && feature.geometry) {
    selectedFeature.value = feature
    isExpanded.value = true
    const geometry = feature.geometry
    coordinates.value =
      geometry.type === 'Point'
        ? geometry.coordinates
        : getPolygonCenter(geometry.coordinates)

    overlay.value.style.display = 'block'
  }
}

// Fermer les détails de la fonctionnalité
function closeDetails() {
  selectedFeature.value = null
  isExpanded.value = false
  if (map.value) {
    resetMap(map.value)
  }
  if (overlay.value) {
    overlay.value.style.display = 'none'
  }
}
// Désélectionner ou sélectionner tous les groupes et mettre à jour les couches
function toggleSelectAllAndUpdateLayers() {
  if (allSelected.value) {
    checkedGroups.value = []
  } else {
    checkedGroups.value = props.groupFilterData.map(group => group.name)
  }
  allSelected.value = !allSelected.value

  // Créer une nouvelle référence à checkedGroups pour déclencher le watch
  checkedGroups.value = checkedGroups.value.slice()
}

// Mise à jour des couches en fonction des groupes cochés
function updateLayers() {
  // Récupérer les icônes et ref-ids des groupes cochés
  const selectedIcons = []
  const selectedRefIds = []

  props.groupFilterData.forEach(group => {
    if (checkedGroups.value.includes(group.name)) {
      selectedIcons.push(...group.icons)
      if (group.name === 'Scènes') {
        group.refIds.forEach((refId, index) => {
          const icon = index < 3 ? 'music' : 'scene'
          selectedRefIds.push(`${refId}_${icon}`)
        })
      } else {
        group.refIds.forEach((refId, index) => {
          const icon = group.icons[index] || group.icons[group.icons.length - 1]
          selectedRefIds.push(`${refId}_${icon}`)
        })
      }
    }
  })

  // Appliquer le filtre aux couches en utilisant les icônes et ref-ids sélectionnés
  if (selectedIcons.length > 0) {
    map.value.setFilter('logomap-20241128', ['in', 'icon', ...selectedIcons])
  } else {
    map.value.setFilter('logomap-20241128', null) // Affiche tout par défaut
  }

  if (selectedRefIds.length > 0) {
    map.value.setFilter('mapZone', ['in', 'ref-id', ...selectedRefIds])
    map.value.setFilter('markerMap', ['in', 'ref-id', ...selectedRefIds])
  } else {
    map.value.setFilter('mapZone', null) // Affiche tout par défaut
    map.value.setFilter('markerMap', null) // Affiche tout par défaut
  }
}

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
      setupLayerEvents(map.value, selectFeature)
    })
  })
})

// Observer les changements dans les groupes cochés
watch(checkedGroups, newCheckedGroups => {
  allSelected.value = newCheckedGroups.length === props.groupFilterData.length
  updateLayers()
})
</script>
