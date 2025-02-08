<template>
  <div class="">
    <div v-if="faqStore.groupedFaq.length">
      <div
        v-for="(themeGroup, index) in faqStore.groupedFaq"
        :key="index"
        class="faq-theme relative"
        :style="{
          marginTop:
            index === 0
              ? '0rem'
              : isQuestionOpen(themeGroup.theme)
                ? '0.5rem'
                : '-0.5rem',
        }"
      >
        <div class="faq-question">
          <!-- Question container with toggle functionality -->
          <div
            class="flex items-center justify-between cursor-pointer p-3 bg-_green03 rounded-2xl top-4 hover:bg-_green02 relative z-[calc(10-index)] shadow-[0_-2px_5px_2px_rgba(0,0,0,0.2)]"
            @click="toggleQuestion(themeGroup.theme)"
          >
            <!-- Display the question text -->
            <span class="flex-grow">{{
              themeGroup.questions[0].question
            }}</span>
            <!-- Chevron icon rotates based on the open state -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="flex-shrink-0 h-6 w-6 transform transition-transform"
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
              class="overflow-hidden bg-_green02 rounded-b-2xl px-2"
            >
              <!-- Display the answer text -->
              <hr class="h-6" />
              <p>{{ themeGroup.questions[0].reponse }}</p>
              <hr class="h-2 border-_green02" />
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-4">Loading FAQ data...</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFaqStore } from '@/stores/useFaqStore'

const faqStore = useFaqStore()
const openQuestion = ref(null)

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

faqStore.fetchFaq()
</script>

<style scoped>
.faq-theme {
  transition: margin-top 0.5s ease-in-out;
}

/* Transition styles for sliding effect only */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.5s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 250px; /* Adjust based on content */
}
</style>
