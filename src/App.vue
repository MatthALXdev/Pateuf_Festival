<template>
  <!-- Composant ColorsComp.vue -->
  <div class="fixed z-50">
    <button
      @click="toggleColorsComp"
      class="bg-_blue01 hover:bg-_blue02 rotate-90 text-white font-bold py-1 px-2 rounded-t-full text-xs"
    >
      O
    </button>
  </div>
  <div>
    <ColorsComp v-if="showColorsComp" @close="toggleColorsComp" />
  </div>

  <!-- <div
    class="bg-_beige02 w-screen h-screen flex flex-col justify-center items-center"
  >
    <img src="./../assets/images/Logo.svg" alt="" srcset="" class="w-80 h-80" />
    <h1 class="text-3xl">PATEUF</h1>
    <p class="h-auto px-2 text-center bg-_black01 text-_white03 rounded-full">
      14 & 15 JUIN 2025
    </p>
  </div> -->
  <!-- Composant Header -->
  <div class="w-screen">
    <Header_comp :infos="infos" />
  </div>
  <!-- main comp -->

  <div class="flex flex-wrap gap-3 justify-around items-center bg-_beige02">
    <!-- Composant bannière -->
    <div
      class="bg-_beige02 w-screen sticky top-[58px] z-50 overflow-hidden px-2 md:hidden"
    >
      <Banner_comp :infos="infos" />
    </div>

    <!-- Composant concert -->
    <div class="bg-_beige02 w-screen max-w-96">
      <h2 class="text-xl">Les concerts</h2>
      <div class="h-96">
        <Concert :planningData="planningData" />
      </div>
    </div>
    <!--  Composant program-->
    <div class="bg-_beige02 w-screen px-4 max-w-96">
      <h2 class="text-xl">Liste des activitées</h2>
      <div class="m-4 h-96 mx-auto overflow-hidden">
        <Program_comp :planningData="planningData" />
      </div>
    </div>
    <!-- Composant tickets -->
    <div class="bg-_beige02 w-screen px-4 max-w-96">
      <h2 class="text-xl">Billeterie</h2>
      <div class="m-4 h-96 mx-auto">
        <Tickets_comp />
      </div>
    </div>
    <!-- Composant map -->
    <div class="bg-_beige02 w-screen px-4 max-w-96">
      <h2 class="text-xl">Carte</h2>
      <div class="m-4 h-96 mx-auto">
        <!-- Conteneur principal centré avec une bordure verte -->
        <div
          class="border-4 border-_darkBlue02 h-full w-full relative rounded-md"
        >
          <!-- Overlay blanc opaque -->
          <div
            v-if="showOverlay"
            class="absolute inset-0 bg-_beige02 z-40 flex items-center justify-center"
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
    <!-- Composant faq -->
    <div class="bg-_beige02 w-screen px-4 max-w-96">
      <h2 class="text-xl">FAQ</h2>
      <div class="mx-auto h-fit">
        <Faq_comp :faqData="faqData" />
      </div>
    </div>
    <!-- Composant partners -->
    <div class="bg-_beige02 w-screen">
      <Partners_comp />
    </div>
    <!-- Composant socialMedia -->
    <div class="bg-_beige02 w-screen">
      <Social_comp />
    </div>
    <!-- Composant navBar -->
    <div class="bg-_beige02 w-screen sticky bottom-0 z-50">
      <Nav_bar />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import ColorsComp from './components/colors_comp.vue'
import Map_comp from './components/Map_comp.vue'
import Concert from './components/Concert_comp.vue'
import Tickets_comp from './components/Tickets_comp.vue'
import Program_comp from './components/Program_comp.vue'
import Header_comp from './components/Header_comp.vue'
import Banner_comp from './components/Banner_comp.vue'
import Faq_comp from './components/Faq_comp.vue'
import Partners_comp from './components/Partners_comp.vue'
import Social_comp from './components/social_comp.vue'
import Nav_bar from './components/Nav_bar.vue'

const mapData = ref(null)
const planningData = ref(null)
const infos = ref(null)
const logoMapData = ref(null)
const faqData = ref(null)
const groupFilterData = ref(null)
const showColorsComp = ref(false)
const showOverlay = ref(true)

const isMapLoaded = ref(false)

function toggleColorsComp() {
  showColorsComp.value = !showColorsComp.value
}

function onMapLoaded(loaded) {
  isMapLoaded.value = loaded
  showOverlay.value = false
}

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

// Récupération des données infos
fetch('./src/data/infos.json')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Impossible de récupérer les données de filter')
  })
  .then(data => {
    infos.value = data
  })
// Récupération des données faq
fetch('./src/data/faq.json')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Impossible de récupérer les données de filter')
  })
  .then(data => {
    faqData.value = data
  })
</script>
