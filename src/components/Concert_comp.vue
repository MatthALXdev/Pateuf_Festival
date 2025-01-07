<template>
  <div class="max-w-96 max-h-96 m-6 flex flex-col">
    <!-- Titre de la scène -->
    <p class="text-xl font-semibold mb-2 h-8 flex flex-grow">
      <span class="flex-grow">SCENE</span>
      <span class="">{{ currentLocation }}</span>
    </p>

    <!-- Carrousel des scènes -->
    <div
      v-if="dataLoaded"
      class="flex-1 relative w-full overflow-hidden"
      @touchstart="startSwipe"
      @touchmove="swipe"
      @touchend="endSwipe"
    >
      <div
        class="flex transition-transform duration-500 ease-in-out w-full h-full"
        :style="{ transform: `translateX(-${currentSceneIndex * 100}%)` }"
        @transitionstart="hideScrollbars"
        @transitionend="endSwipe"
      >
        <!-- Listes des scènes -->
        <div
          v-for="(location, index) in [
            'La forge',
            'Le repaire du kraken',
            'Le Chaos Sonore',
          ]"
          :key="index"
          class="w-full flex-shrink-0 overflow-hidden border border-_beige02"
        >
          <div
            class="pr-2"
            :class="[
              'h-64',
              index === currentSceneIndex || isSwiping
                ? 'overflow-y-auto'
                : 'overflow-hidden',
              index === currentSceneIndex || isSwiping ? '' : 'invisible',
              scrollbarClass,
            ]"
          >
            <!-- Listes des groupes par scène -->
            <div
              v-for="(group, index) in getSortedGroupsForScene(location)"
              :key="index"
              class="border-2 border-_darkBlue01 p-2 rounded-lg mb-2 w-full flex items-center"
            >
              <img
                :src="group.image"
                alt="Logo de {{ group.name }}"
                class="w-12 h-12 rounded-md border border-black shadow-lg mr-4"
              />
              <div class="flex-1">
                <p class="text-sm font-medium font-title">{{ group.name }}</p>
                <p class="text-sm text-gray-600">
                  {{ group.start }}
                </p>
              </div>
              <div class="">
                <img
                  src="/src/assets/images/marker.svg"
                  alt="logo de marqueur"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Indicateurs de position du carrousel -->
    <div class="flex justify-center mt-2">
      <span
        v-for="(location, index) in [
          'La forge',
          'Le repaire du kraken',
          'Le Chaos Sonore',
        ]"
        :key="index"
        class="w-2 h-2 mx-1 rounded-full"
        :class="index === currentSceneIndex ? 'bg-_black01' : 'bg-gray-400'"
      >
      </span>
    </div>
    <!-- Boutons de défilement -->
    <div v-if="!isTouchDevice" class="flex justify-between h-8">
      <button
        @click="previousScene"
        class="text-_darkBlue01 text-5xl font-bold rounded-full"
      >
        &#8656;
      </button>

      <button
        @click="nextScene"
        class="text-_darkBlue01 text-5xl font-bold rounded-full"
      >
        &#8658;
      </button>
    </div>
  </div>
</template>

<script setup>
import { getTestDateTime } from '@/services/testHandler'
import { ref, watch, computed, inject, onMounted } from 'vue'

const scrollbarClass = inject('scrollbarClass')

const props = defineProps({
  planningData: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const currentSceneIndex = ref(0)
const dataLoaded = ref(false)
let startX = 0
let isSwiping = false
const isTouchDevice = ref(false)

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
})

watch(
  () => props.planningData,
  newData => {
    if (newData && Array.isArray(newData) && newData.length > 0) {
      dataLoaded.value = true
    } else {
      dataLoaded.value = false
    }
  },
)

const currentLocation = computed(
  () =>
    ['La forge', 'Le repaire du kraken', 'Le Chaos Sonore'][
      currentSceneIndex.value
    ],
)

const getSortedGroupsForScene = scene => {
  const { testDate, testTime } = getTestDateTime()
  return props.planningData
    .filter(group => group.location === scene)
    .sort((a, b) => parseInt(a.order) - parseInt(b.order))
    .filter(group => group.date + group.end >= testDate + testTime)
}

const nextScene = () => {
  if (!isSwiping && currentSceneIndex.value < 2) {
    isSwiping = true
    currentSceneIndex.value++
  }
}

const previousScene = () => {
  if (!isSwiping && currentSceneIndex.value > 0) {
    isSwiping = true
    currentSceneIndex.value--
  }
}

const startSwipe = event => {
  if (!isSwiping) {
    startX = event.touches[0].clientX
  }
}

const swipe = event => {
  if (!isSwiping) {
    const currentX = event.touches[0].clientX
    const difference = startX - currentX
    if (difference > 50) {
      nextScene()
      startX = currentX
    } else if (difference < -50) {
      previousScene()
      startX = currentX
    }
  }
}

const endSwipe = () => {
  isSwiping = false
  startX = 0
}
</script>
