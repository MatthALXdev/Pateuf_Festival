<template>
  <!-- Composant Header -->
  <div
    v-if="isPortraitBlocked"
    class="z-50 fixed h-screen inset-0 flex items-center justify-center bg-_black01 text-_beige03"
  >
    <p class="text-center px-8">
      Cette application est conçue pour être utilisée en mode portrait.<br />
      Veuillez pivoter votre appareil.
    </p>
  </div>
  <div v-else>
    <div class="w-full">
      <Header_comp :infos="infos" />
    </div>
    <!-- Composant navBar -->
    <Nav_bar />

    <!-- main comp -->
    <div class="flex flex-wrap gap-3 justify-around items-center bg-_beige02">
      <!-- Composant bannière -->
      <div
        class="bg-_beige02 w-screen sticky top-[58px] z-30 overflow-hidden px-2 sm:hidden"
      >
        <Banner_comp :infos="infos" />
      </div>

      <!-- Composant concert -->

      <div class="flex justify-center w-[90%]">
        <Concert :planningData="planningData" />
      </div>
      <!--  Composant program-->
      <div class="bg-_beige02 w-[90%]">
        <h2 class="text-xl">Liste des activitées</h2>
        <div
          class="m-4 h-96 md:h-[26rem] lg:h-[34rem] xl:h-[48rem] mx-auto overflow-y-auto md:overflow-y-hidden"
          :class="scrollbarClass"
        >
          <Program_comp :planningData="planningData" />
        </div>
      </div>
      <!-- Composant map -->
      <div class="bg-_beige02 w-[90%] z-20">
        <h2 class="text-xl">Carte</h2>
        <div class="m-4 h-96 mx-auto lg:h-[34rem] xl:h-[40rem]">
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
            <Map_comp
              :mapData="mapData"
              :logoMapData="logoMapData"
              :planningData="planningData"
              :groupFilterData="groupFilterData"
              @is-loaded="onMapLoaded"
            />
          </div>
        </div>
      </div>
      <!-- Composant tickets -->
      <div class="bg-_beige02 w-screen xl:w-1/2 px-4">
        <h2 class="text-xl">Billeterie</h2>
        <div class="m-4 h-fit mx-auto">
          <Tickets_comp />
        </div>
      </div>
      <!-- Composant faq -->
      <div class="bg-_beige02 w-[90%] xl:w-[45%] self-start">
        <h2 class="text-xl">FAQ</h2>
        <div class="mx-auto h-fit">
          <Faq_comp :faqData="faqData" />
        </div>
      </div>
      <!-- Composant socialMedia -->
      <div class="bg-_beige02 w-screen lg:w-1/6">
        <Social_comp />
      </div>
      <!-- Composant partners -->
      <div class="bg-_beige02 w-screen lg:w-[80%]">
        <Partners_comp />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'

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

const isPortraitBlocked = ref(false)

const updateOrientation = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const isPhone = width < 768 // Adjust for standard phone widths
  isPortraitBlocked.value = isPhone && width > height
}

onMounted(() => {
  updateOrientation()
  window.addEventListener('resize', updateOrientation)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateOrientation)
})
const mapData = ref(null)
const planningData = ref(null)
const infos = ref(null)
const logoMapData = ref(null)
const faqData = ref(null)
const groupFilterData = ref(null)

const showOverlay = ref(true)

const isMapLoaded = ref(false)

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
