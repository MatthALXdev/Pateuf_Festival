<template>
  <div
    class="w-full h-1/2 bg-[#99B84F] overflow-auto p-4 shadow"
    :class="scrollbarClass"
  >
    <div class="flex flex-row justify-between items-center mb-3">
      <div class="ml-3 font-semibold">
        {{ currentGroup.location }}
      </div>
      <div v-if="currentlyOnStage" class="font-semibold">
        Actuellement en live
      </div>

      <!-- Bouton pour fermer la vue -->
      <button
        @click="$emit('close')"
        class="float-right text-_white03 bg-_black03 hover:bg-_black02 focus:bg-_black01 px-4 py-2 rounded-lg shadow-lg"
      >
        Fermer
      </button>
    </div>
    <div v-if="currentlyOnStage">
      <!-- Affichage des informations de currentlyOnStage -->

      <div
        v-for="location in [
          'La forge',
          'Le repaire du kraken',
          'Le Chaos Sonore',
        ]"
        :key="location"
        class="bg-_beige02 p-4 mb-4 border border-_black02 rounded-lg"
      >
        <div
          v-for="group in getCurrentLiveGroups(location)"
          :key="group.name"
          class=""
        >
          <GroupCard :group="group" :isCurrent="false" />
        </div>
        <div v-if="!getCurrentLiveGroups(location).length">
          <p>Aucun groupe en cours actuellement</p>
        </div>
      </div>
    </div>
    <div
      v-if="feature && feature.properties && !currentlyOnStage"
      class="flex flex-col gap-4 justify-around"
    >
      <!-- Affichage des groupes (actuel et suivants) -->
      <GroupCard
        v-for="group in [
          currentGroup,
          ...getUpcomingGroups(currentGroup.location, currentGroup.order),
        ]"
        :key="group.name"
        :group="group"
        :isCurrent="group.order === currentGroup.order"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { getTestDateTime } from '@/services/testHandler'
import GroupCard from '@/components/Group_card.vue'

const scrollbarClass = inject('scrollbarClass')
console.log(scrollbarClass.value)

const props = defineProps({
  feature: Object,
  planningData: Object,
  currentlyOnStage: Boolean,
})

const currentGroup = ref(null)
const currentScene = ref(props.feature?.properties?.name || '')
const pathImage = ref('pathImage vide')

const { testDate, testTime } = getTestDateTime()
const now = testTime
const today = testDate

const group = props.planningData?.find(groupe => {
  return (
    currentScene.value &&
    groupe.location === currentScene.value &&
    groupe.date === today &&
    groupe.start <= now &&
    groupe.end >= now
  )
})

currentGroup.value = group || 'Aucun groupe ne joue actuellement'
pathImage.value = currentGroup.value?.image || 'pathImage vide'

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

function getUpcomingGroups(location, currentOrder) {
  return (
    props.planningData
      ?.filter(group => {
        return (
          group.location === location &&
          group.date === today &&
          group.order > currentOrder
        )
      })
      .sort((a, b) => a.order - b.order) || []
  )
}
</script>
