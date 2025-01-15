<template>
  <div :class="class">
    <!-- Carrousel des scènes -->
    <div
      class="flex relative overflow-hidden"
      @touchstart="startSwipe"
      @touchmove="swipe"
      @touchend="endSwipe"
    >
      <div
        class="flex transition-transform duration-500 ease-in-out w-full"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(location, index) in scenes"
          :key="index"
          class="w-full flex-shrink-0 overflow-hidden border border-_beige02"
        >
          <p class="text-xl font-semibold mb-2 h-8 flex flex-grow">
            <span class="flex-grow">SCENE</span>
            <span class="text-lg mr-4">{{ location }}</span>
          </p>
          <GroupList
            :groups="groups.filter(group => group.location === location)"
          />
        </div>
      </div>
    </div>
    <!-- Indicateurs -->
    <div class="flex justify-center mt-2">
      <span
        v-for="(location, index) in scenes"
        :key="index"
        class="w-2 h-2 mx-1 rounded-full"
        :class="index === currentIndex ? 'bg-_black01' : 'bg-gray-400'"
      ></span>
    </div>
    <!-- Boutons -->
    <div v-if="!isTouchDevice" class="flex justify-between h-8">
      <button
        @click="goToPrevious"
        class="text-_darkBlue01 text-5xl font-bold rounded-full"
      >
        &#8656;
      </button>
      <button
        @click="goToNext"
        class="text-_darkBlue01 text-5xl font-bold rounded-full"
      >
        &#8658;
      </button>
    </div>
  </div>
</template>

<script setup>
import GroupList from './GroupList.vue'

const props = defineProps({
  scenes: {
    type: Array,
    required: true,
  },
  currentIndex: {
    type: Number,
    required: true,
  },
  groups: {
    type: Array,
    required: true,
  },
  isTouchDevice: {
    type: Boolean,
    required: true,
  },
  class: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['next', 'previous', 'update-index'])

let startX = 0

const startSwipe = event => {
  startX = event.touches[0].clientX
}

const swipe = event => {
  const currentX = event.touches[0].clientX
  const difference = startX - currentX
  if (difference > 50) {
    emit('next')
    startX = currentX
  } else if (difference < -50) {
    emit('previous')
    startX = currentX
  }
}

const endSwipe = () => {
  startX = 0
}

const goToNext = () => {
  emit('next')
}

const goToPrevious = () => {
  emit('previous')
}
</script>
