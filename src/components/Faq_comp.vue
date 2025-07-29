// PublicComp : Affichage des questions épinglées de la FAQ côté visiteur
// Ce composant :
// - Affiche les questions épinglées, sans regroupement thématique
// - Trie les questions par ordre (order) défini par l'admin
// - Implémente useSanitySync pour écouter les modifications Sanity et recharger automatiquement les données sans perdre le scroll

<template>
  <div class="">
    <div v-if="sortedPinnedFaq.length">
      <div
        v-for="question in sortedPinnedFaq"
        :key="`${question._id}-${question.order}`"
        class="faq-question"
      >
        <transition name="slide" mode="out-in">
          <div>
            <div
              class="flex items-center justify-between cursor-pointer p-3 bg-_green03 hover:bg-_green02 shadow-[0_-2px_5px_2px_rgba(0,0,0,0.2)]"
              :class="isQuestionOpen(question.questionId) ? 'rounded-t-2xl' : 'rounded-2xl'"
              @click="toggleQuestion(question.questionId)"
            >
              <span class="flex-grow">{{ question.theme + ' | ' + question.question }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="flex-shrink-0 h-6 w-6 transform transition-transform"
                :class="{ 'rotate-180': isQuestionOpen(question.questionId) }"
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

            <div
              v-if="isQuestionOpen(question.questionId)"
              class="overflow-hidden bg-_green02 rounded-b-2xl px-2"
            >
              <p class="pt-6">{{ question.reponse }}</p>
              <hr class="h-2 border-_green02" />
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div v-else class="text-center py-4">Loading FAQ data...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFaqStore } from '@/stores/useFaqStore'
import { storeToRefs } from 'pinia'
import { useSanitySync } from '@/composables/useSanitySync'

const faqStore = useFaqStore()
const { faq } = storeToRefs(faqStore)
const openQuestion = ref(null)

useSanitySync(() => {
  return faqStore.fetchFaq().then(() => {
    console.log('✅ FAQ mise à jour automatiquement via SanitySync')
  })
})

const sortedPinnedFaq = computed(() => {
  return faq.value
    .filter(item => item.pinned && typeof item.order === 'number')
    .sort((a, b) => a.order - b.order)
})

const toggleQuestion = id => {
  openQuestion.value = openQuestion.value === id ? null : id
}

const isQuestionOpen = id => openQuestion.value === id

onMounted(() => {
  faqStore.fetchFaq().then(() => {
    const pinnedSorted = faq.value
      .filter(item => item.pinned && typeof item.order === 'number')
      .sort((a, b) => a.order - b.order)

    console.log(
      '📋 Ordre FAQ au montage :',
      pinnedSorted.map(q => `ID:${q.questionId} → Order:${q.order}`)
    )
  })
})
</script>

<style scoped>
.faq-theme {
  transition: margin-top 0.5s ease-in-out;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
