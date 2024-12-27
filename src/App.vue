<template>
  <!-- Composant ColorsComp.vue -->
  <div class="absolute">
    <button
      @click="toggleColorsComp"
      class="bg-_blue01 hover:bg-_blue02 rotate-90 text-white font-bold py-1 px-2 rounded-t-full text-xs"
    >
      O
    </button>
  </div>
  <div c>
    <ColorsComp v-if="showColorsComp" @close="toggleColorsComp" />
  </div>
  <!-- main comp -->
  <div
    class="flex flex-wrap gap-3 justify-around items-center bg-_beige02 w-screen h-screen overflow-scroll"
  >
    <!-- Composant test dropdown -->
    <div class="m-4 border-4 h-96 w-96">
      <h1>Selected option: {{ parentSelectedOption }}</h1>
      <Banner_comp :options="options" v-model="parentSelectedOption" />
    </div>
    <!-- Composant concert -->
    <div class="m-4 border-4 h-96 w-96">
      Concert_comp
      <!-- <Concert :planningData="planningData" /> -->
    </div>
    <!--  Composant program-->
    <div class="m-4 border-4 h-96 w-96 overflow-scroll">
      Program comp
      <Program_comp :planningData="planningData" />
    </div>

    <!-- Composant map -->
    <div class="h-96 w-96 border-4">
      <!-- Conteneur principal centré avec une bordure verte -->
      <div
        class="border-4 border-_darkBlue02 h-full w-full relative rounded-md"
      >
        <!-- Overlay blanc opaque -->
        <div
          v-if="showOverlay"
          class="absolute inset-0 bg-_beige02 z-50 flex items-center justify-center"
        >
          <p class="text-xl font-bold">Chargement de la carte en cours</p>
        </div>
        <!-- Composant Map_comp avec des props -->
        <!-- <Map_comp
          :mapData="mapData"
          :logoMapData="logoMapData"
          :planningData="planningData"
          :groupFilterData="groupFilterData"
          @is-loaded="onMapLoaded"
        /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import ColorsComp from './components/colors_comp.vue'
// import Map_comp from './components/Map_comp.vue'
import Concert from './components/Concert_comp.vue'
import Program_comp from './components/Program_comp.vue'
import Banner_comp from './components/Banner_comp.vue'

const mapData = ref(null)
const planningData = ref(null)
const logoMapData = ref(null)
const groupFilterData = ref(null)
const showColorsComp = ref(false)
const showOverlay = ref(true)

const parentSelectedOption = ref(null)

const options = ref([
  { name: 'One', value: 1 },
  { name: 'Two', value: 2 },
  { name: 'Three', value: 3 },
])
// const isMapLoaded = ref(false)

function toggleColorsComp() {
  showColorsComp.value = !showColorsComp.value
}

// function onMapLoaded(loaded) {
//   isMapLoaded.value = loaded
//   showOverlay.value = false
// }

const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')
const scrollbarClass = computed(() => {
  return isFirefox ? 'custom-firefox-scrollbar' : 'custom-webkit-scrollbar'
})
provide('scrollbarClass', scrollbarClass)

// Récupération des données pour mapData
fetch('./src/data/map.json')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Impossible de récupérer les données de map')
  })
  .then(data => {
    mapData.value = data
  })

// Récupération des données pour planningData
fetch('./src/data/planning.json')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Impossible de récupérer les données de planning')
  })
  .then(data => {
    planningData.value = data
  })

// Récupération des données pour logoMapData
fetch('./src/data/logoMap.json')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Impossible de récupérer les données de logoMap')
  })
  .then(data => {
    logoMapData.value = data
  })

// Récupération des données pour groupFilterData
fetch('./src/data/filter.json')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Impossible de récupérer les données de filter')
  })
  .then(data => {
    groupFilterData.value = data
  })
</script>
