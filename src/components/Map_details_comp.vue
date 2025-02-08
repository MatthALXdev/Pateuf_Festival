<template>
  <div
    class="w-full h-1/2 bg-[#99B84F] overflow-auto p-4 shadow"
    :class="scrollbarClass"
  >
    <div class="flex flex-row justify-between items-center mb-3">
      <div class="ml-3 font-semibold">
        {{ currentGroup?.location || 'Lieu inconnu' }}
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
        <div v-for="group in getCurrentLiveGroups(location)" :key="group.name">
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
        v-for="group in filteredGroups"
        :key="group.name"
        :group="group"
        :isCurrent="group.order === currentGroup.order"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { getTestDateTime } from '@/services/testHandler'
import GroupCard from '@/components/Group_card.vue'
import { useScheduleStore } from '@/stores/useScheduleStore'

defineProps({
  feature: Object,
  currentlyOnStage: Boolean,
})

const scheduleStore = useScheduleStore()
const scrollbarClass = inject('scrollbarClass')
console.log(scrollbarClass.value)

const currentGroup = ref({
  name: '',
  location: '',
  start: '',
  end: '',
  image: '',
  description: '',
  order: 0,
})
const currentScene = ref(scheduleStore.getsheduleData?.[0]?.location || '')
const pathImage = ref('pathImage vide')

const { testDate, testTime } = getTestDateTime()
const now = testTime
const today = testDate

const group = scheduleStore.getsheduleData?.find(groupe => {
  return (
    currentScene.value &&
    groupe.location === currentScene.value &&
    groupe.date === today &&
    groupe.start <= now &&
    groupe.end >= now
  )
})

console.log(group)

currentGroup.value = group || {
  name: 'Aucun groupe',
  location: 'Lieu inconnu',
  start: '',
  end: '',
  image: '',
  description: 'Aucun groupe ne joue actuellement',
  order: 0,
}
pathImage.value = currentGroup.value?.image || 'pathImage vide'

function getCurrentLiveGroups(location) {
  return (
    scheduleStore.getsheduleData?.filter(group => {
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
    scheduleStore.getScheduleData
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

const filteredGroups = computed(() => {
  return [
    currentGroup.value,
    ...getUpcomingGroups(currentGroup.value.location, currentGroup.value.order),
  ].filter(group => group && group.name)
})
</script>
