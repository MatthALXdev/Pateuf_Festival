<template>
  <div class="w-full h-1/2 bg-[#99B84F] overflow-auto p-4 shadow">
    <!-- Bouton pour fermer la vue -->
    <button
      @click="$emit('close')"
      class="float-right text-white bg-[#0A0113] px-4 py-2 rounded"
    >
      Fermer
    </button>
    <div v-if="currentlyOnStage">
      <!-- Affichage des informations de currentlyOnStage -->
      <h3 class="text-lg font-semibold mb-4">Actuellement en live</h3>
      <div
        v-for="location in [
          'La forge',
          'Le repaire du kraken',
          'Le Chaos Sonore',
        ]"
        :key="location"
        class="bg-[#E5C992] p-4 mb-4 border border-[#0A0113] rounded-lg"
      >
        <h4 class="text-md font-bold mb-2">{{ location }}</h4>
        <div
          v-for="group in getCurrentLiveGroups(location)"
          :key="group.name"
          class="mb-4"
        >
          <p class="font-semibold">{{ group.name }}</p>
          <p>
            {{ group.start
            }}<span class="text-xl font-extrabold"> &#8658; </span
            >{{ group.end }}
          </p>
          <img :src="group.image" alt="Feature Image" class="w-20 h-20 mt-2" />
          <p class="mt-2">{{ group.description }}</p>
        </div>
        <div v-if="!getCurrentLiveGroups(location).length">
          <p>Aucun groupe en cours actuellement</p>
        </div>
      </div>
    </div>

    <div
      v-if="feature && feature.properties && !currentlyOnStage"
      class="bg-[#E5C992] p-4 mb-4 border border-[#0A0113] rounded-lg"
    >
      <!-- Affichage des informations du groupe actuel -->
      <p class="font-semibold">{{ currentGroup.location }}</p>
      <p>On Air</p>
      <p>{{ currentGroup.name }}</p>
      <img
        :src="currentGroup.image"
        alt="Feature Image"
        class="w-20 h-20 mt-2"
      />
      <p>De {{ currentGroup.start }} à {{ currentGroup.end }}</p>
      <p>{{ currentGroup.description }}</p>

      <!-- Affichage de l'identifiant de la fonctionnalité -->
      <div class="mt-4">{{ feature.id }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { getCurrentTime, getCurrentDay } from '@/services/timeHandler'
import { getTestDateTime } from '@/services/testHandler'

// Définition des propriétés du composant
const props = defineProps({
  feature: Object,
  planningData: Object,
  currentlyOnStage: Boolean,
})

// Références réactives pour stocker les groupes actuels et réels
const currentGroup = ref(null)
const currentScene = ref(props.feature?.properties?.name || '') // Nom de la scène actuelle
const pathImage = ref('pathImage vide')

// Utilisation des fonctions importées pour obtenir l'heure et la date actuelles
// const now = getCurrentTime()
// const today = getCurrentDay()

//Emulation d'une date pendant le festival
const { testDate, testTime } = getTestDateTime()
const now = testTime
const today = testDate

// Recherche du groupe actuel en fonction des données de planning
const group = props.planningData?.find(groupe => {
  return (
    currentScene.value &&
    groupe.location === currentScene.value &&
    groupe.date === today &&
    groupe.start <= now &&
    groupe.end >= now
  )
})

// Assignation des résultats de recherche aux variables réactives
currentGroup.value = group || 'Aucun groupe ne joue actuellement'

// Mise à jour du chemin de l'image basé sur le groupe actuel
pathImage.value = currentGroup.value?.image || 'pathImage vide'

// Fonction pour obtenir les groupes actuellement en live sur une scène donnée
function getCurrentLiveGroups(location) {
  return (
    props.planningData?.filter(group => {
      return (
        group.location === location &&
        group.date === today &&
        group.start <= now &&
        group.end >= now
      )
    }) || []
  )
}
</script>
