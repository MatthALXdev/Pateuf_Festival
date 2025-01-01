<template>
  <div class="mb-4">
    <div v-if="dataLoaded">
      <div
        v-for="(themeGroup, index) in groupedFaqData"
        :key="index"
        class="faq-theme relative"
        :style="{
          marginTop: isQuestionOpen(themeGroup.theme) ? '0rem' : '-0.5rem',
          marginBottom: isQuestionOpen(themeGroup.theme) ? '1rem' : '0rem',
        }"
      >
        <div class="faq-question">
          <!-- Question container with toggle functionality -->
          <div
            class="flex items-center justify-between cursor-pointer p-3 bg-_green03 rounded-2xl top-4 hover:bg-_green02 relative z-[calc(10-index)] shadow-[0_-5px_5px_2px_rgba(0,0,0,0.4)]"
            @click="toggleQuestion(themeGroup.theme)"
          >
            <!-- Display the question text -->
            <span>{{ themeGroup.questions[0].question }}</span>
            <!-- Chevron icon rotates based on the open state -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transform transition-transform"
              :class="{ 'rotate-180': isQuestionOpen(themeGroup.theme) }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <!-- Answer container with sliding transition -->
          <transition name="slide" mode="out-in">
            <div
              v-if="isQuestionOpen(themeGroup.theme)"
              class="overflow-hidden bg-_green02 rounded-b-2xl pt-5 px-2 pb-2"
            >
              <!-- Display the answer text -->
              <p>{{ themeGroup.questions[0].reponse }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-4">Loading FAQ data...</div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props to receive FAQ data
const props = defineProps({
  faqData: {
    type: Array,
    required: false,
    default: () => [],
  },
})

// Reactive state to track the currently open question
const openQuestion = ref(null)
const dataLoaded = ref(false)

// Watch for changes in faqData prop
watch(
  () => props.faqData,
  newData => {
    if (newData && Array.isArray(newData) && newData.length > 0) {
      dataLoaded.value = true
    } else {
      dataLoaded.value = false
    }
  },
  { immediate: true },
)

// Computed property to group questions by theme
const groupedFaqData = computed(() => {
  if (!dataLoaded.value) return []
  return props.faqData.reduce((acc, item) => {
    let group = acc.find(g => g.theme === item.theme)
    if (!group) {
      group = { theme: item.theme, questions: [] }
      acc.push(group)
    }
    group.questions.push(item)
    return acc
  }, [])
})

// Toggle the open state of a question
const toggleQuestion = theme => {
  if (openQuestion.value === theme) {
    openQuestion.value = null
  } else {
    openQuestion.value = theme
  }
}

// Check if a specific question is open
const isQuestionOpen = theme => {
  return openQuestion.value === theme
}
</script>

<style scoped>
.faq-theme {
  transition: margin-top 0.3s ease-in-out;
}

/* Transition styles for sliding effect only */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 150px; /* Adjust based on content */
}
</style>
