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
          <div v-for="symbol in symbols" :key="symbol" class="mt-2">
            <input
              type="checkbox"
              :id="symbol"
              v-model="checkedSymbols"
              :value="symbol"
              class="mr-2"
            />
            <label :for="symbol">{{ symbol }}</label>
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
})

const mapContainer = ref(null)
const overlay = ref(null)
const map = ref(null)
const isExpanded = ref(false)
const selectedFeature = ref(null)
const coordinates = ref([0, 0])
const checkedSymbols = ref([])
const symbols = ref([])

// Observer le changement de l'état d'expansion
// Sert à zoomer en mettant l'élément bien au centre quand il est cliqué,
//vue que le commposant détails modifie la taille de la carte au moment du clic.
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

// Ajuster les coordonnées centrales de la carte
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
    if (overlay.value) {
      overlay.value.style.display = 'block'
    }
  } else {
    console.error("Feature ou geometry n'est pas défini:", feature)
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

// Initialiser la carte avec Mapbox et configurer les sources et couches
onMounted(() => {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

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
      const sources = map.value.getStyle().sources
      const layers = map.value.getStyle().layers

      console.log('Sources:', sources)
      console.log('Layers:', layers)

      if (!sources.composite) {
        console.error("La source composite n'existe pas")
        return
      }

      const features = map.value.querySourceFeatures('composite', {
        sourceLayer: 'logoMap20241202-64xyb4',
      })
      console.log('Features:', features)

      if (features.length === 0) {
        console.error(
          'Aucune fonctionnalité trouvée dans le layer logoMap20241202-64xyb4',
        )
      } else {
        const uniqueSymbols = [
          ...new Set(features.map(feature => feature.properties.icon)),
        ]
        symbols.value = uniqueSymbols
        checkedSymbols.value = uniqueSymbols
        setupLayerEvents(map.value, selectFeature)
      }
    })
  })
})

// Observer les changements dans les symboles cochés
watch(checkedSymbols, newCheckedSymbols => {
  const validSymbols = newCheckedSymbols.filter(
    symbol => symbol !== undefined && symbol !== null,
  )

  let visibleIcons = []
  if (validSymbols.length > 0) {
    map.value.setFilter('logomap-20241128', ['in', 'icon', ...validSymbols])

    visibleIcons = map.value
      .queryRenderedFeatures({
        layers: ['logomap-20241128'],
        filter: ['in', 'icon', ...validSymbols],
      })
      .map(feature => ({
        id: feature.id,
        name: feature.properties.icon,
        uniqueId: `${feature.id}_${feature.properties.icon}`,
      }))
  } else {
    map.value.setFilter('logomap-20241128', ['in', 'icon', ''])
  }

  const validUniqueIds = visibleIcons.map(icon => icon.uniqueId)
  //Les layers mapZone et markerMap ne réapparaisent pas lorsqu'on recoche.
  //Seule un double clic ()
  if (validUniqueIds.length > 0) {
    map.value.setFilter('mapZone', ['in', 'ref-id', ...validUniqueIds])
    map.value.setFilter('markerMap', ['in', 'ref-id', ...validUniqueIds])
  } else {
    map.value.setFilter('mapZone', ['in', 'ref-id', ''])
    map.value.setFilter('markerMap', ['in', 'ref-id', ''])
  }

  console.log('Visible Icons:', visibleIcons)
})
</script>
