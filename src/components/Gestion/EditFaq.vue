<template>
  <div class="p-4 bg-white shadow rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Gestion de la FAQ</h2>

    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Menu des thèmes -->
      <div class="w-full lg:w-1/4">
        <div class="flex flex-col gap-2">
          <button
            v-for="theme in themes"
            :key="theme"
            @click="selectedTheme = theme"
            :class="[
              'px-4 py-2 text-left rounded',
              selectedTheme === theme ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            ]"
          >
            {{ theme }}
          </button>

          <!-- Ajout d'un thème -->
          <div class="mt-4">
            <button @click="showAddTheme = !showAddTheme" class="text-blue-600 underline">+ Ajouter un thème</button>
            <div v-if="showAddTheme" class="mt-2">
              <input v-model="newTheme" class="w-full p-2 border rounded mb-2" placeholder="Nom du thème" />
              <button @click="addTheme" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Valider</button>
            </div>
          </div>

          <!-- Classement des questions épinglées -->
          <div v-if="pinnedQuestions.length > 0" class="mt-6">
            <h3 class="text-sm font-semibold mb-2">Classement des questions épinglées</h3>
            <draggable
              v-model="pinnedQuestions"
              item-key="questionId"
              class="space-y-2"
              handle=".handle"
              @end="savePinnedOrder"
            >
              <template #item="{ element }">
                <div class="p-2 border rounded flex items-center justify-between">
                  <div class="handle cursor-move">↕</div>
                  <div class="text-sm">{{ element.question }}</div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>

      <!-- Liste des FAQ filtrées -->
      <div class="w-full lg:w-3/4">
        <ul class="space-y-4">
          <li
            v-for="(item, index) in filteredFaq"
            :key="item.questionId"
            class="p-4 border rounded-lg"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <p class="text-sm text-gray-500 mb-1">Thème : {{ item.theme }}</p>
                <p class="font-semibold mb-1">Q: {{ item.question }}</p>
                <p class="mb-2">R: {{ item.reponse }}</p>
              </div>
              <div class="flex flex-col gap-2 ml-4">
                <button
                  class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-700"
                  @click="startEditing(item)"
                >
                  Modifier
                </button>
                <button
                  class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-700"
                  @click="deleteFaq(item.questionId, item._id)"
                >
                  Supprimer
                </button>
                <button
                  class="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  @click="togglePin(item)"
                  :disabled="!item.pinned && pinnedCount >= 5"
                >
                  {{ item.pinned ? '📌 En accueil' : '📍 Ajouter à l\'accueil' }}
                </button>
              </div>
            </div>

            <!-- bloc d'édition -->
            <div v-if="editingItem && editingItem.questionId === item.questionId" class="mt-4">
              <input v-model="localCopy.question" class="w-full p-2 border rounded mb-2" placeholder="Question" />
              <textarea v-model="localCopy.reponse" class="w-full p-2 border rounded mb-2" placeholder="Réponse"></textarea>
              <div class="flex gap-2">
                <button @click="saveEdit" :disabled="!hasChanges" class="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-40">
                  Enregistrer
                </button>
                <button @click="cancelEdit" class="px-4 py-2 bg-gray-400 text-white rounded">Annuler</button>
              </div>
              <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
            </div>
          </li>
        </ul>

        <!-- Ajout d'une question -->
        <div class="mt-6">
          <h3 class="font-semibold mb-2">Ajouter une question dans "{{ selectedTheme }}"</h3>
          <input v-model="newQuestion" class="w-full p-2 border rounded mb-2" placeholder="Nouvelle question" />
          <input v-model="newAnswer" class="w-full p-2 border rounded mb-2" placeholder="Réponse associée" />
          <button @click="submitNewQuestion" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Ajouter</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, toRaw } from 'vue'
import { useFaqStore } from '@/stores/useFaqStore'
import { storeToRefs } from 'pinia'
import { useLocalEdit } from '@/composables/useLocalEdit'
import draggable from 'vuedraggable'
import { useSanitySync } from '@/composables/useSanitySync'

const faqStore = useFaqStore()
const { faq } = storeToRefs(faqStore)
const { notifySanityUpdate } = useSanitySync() 

const showAddTheme = ref(false)
const newTheme = ref('')
const selectedTheme = ref('')

const editingItem = ref(null)
const localCopy = ref(null)
const hasChanges = ref(false)
const error = ref(null)
const newQuestion = ref('')
const newAnswer = ref('')

const themes = computed(() => {
  const allThemes = faq.value.map(item => item.theme)
  const uniqueThemes = [...new Set(allThemes)].sort()
  if (!selectedTheme.value && uniqueThemes.length > 0) {
    selectedTheme.value = uniqueThemes[0]
  }
  return uniqueThemes
})

const filteredFaq = computed(() => faq.value.filter(item => item.theme === selectedTheme.value))
const pinnedCount = computed(() => faq.value.filter(item => item.pinned).length)
const pinnedQuestions = ref([])

function startEditing(item) {
  const raw = toRaw(item)
  editingItem.value = { ...raw }
  const { localCopy: lc, hasChanges: hc } = useLocalEdit(raw)
  localCopy.value = lc.value
  hasChanges.value = hc
}

function cancelEdit() {
  editingItem.value = null
  error.value = null
  localCopy.value = null
  hasChanges.value = false
}

async function saveEdit() {
  if (!editingItem.value || !localCopy.value) return
  try {
    await faqStore.updateFaqInSanity(editingItem.value._id, {
      question: localCopy.value.question,
      reponse: localCopy.value.reponse,
      pinned: localCopy.value.pinned || false,
    })
    faqStore.updateFaqItem({ ...editingItem.value, ...localCopy.value })
    notifySanityUpdate()
    cancelEdit()
  } catch (err) {
    error.value = err.message || 'Erreur inconnue lors de la mise à jour'
  }
}

async function deleteFaq(id, docId) {
  faqStore.removeFaqItem(id)
  try {
    const response = await fetch('/.netlify/functions/deleteSanityDoc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: docId }),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error)
  } catch (err) {
    error.value = err.message
  }
}

function togglePin(item) {
  if (!item.pinned && pinnedCount.value >= 5) return
  item.pinned = !item.pinned
  faqStore.updateFaqItem(item)
  faqStore.updateFaqInSanity(item._id, { pinned: item.pinned })
  notifySanityUpdate()
  updatePinnedList()
}

function updatePinnedList() {
  pinnedQuestions.value = faq.value
    .filter(i => i.pinned)
    .sort((a, b) => a.order - b.order || 0)
}

function addTheme() {
  if (!newTheme.value || themes.value.includes(newTheme.value)) return
  const newItem = {
    theme: newTheme.value,
    question: 'Nouvelle question pour thème',
    reponse: 'Réponse associée',
    pinned: false,
  }
  faqStore.submitNewQuestionToSanity(newItem)
  newTheme.value = ''
  showAddTheme.value = false
  notifySanityUpdate()      
}

async function submitNewQuestion() {
  if (!newQuestion.value || !newAnswer.value) return
  const newItem = {
    theme: selectedTheme.value,
    question: newQuestion.value,
    reponse: newAnswer.value,
    pinned: false,
  }
  await faqStore.submitNewQuestionToSanity(newItem)
  newQuestion.value = ''
  newAnswer.value = ''
  notifySanityUpdate()
}

async function savePinnedOrder() {
  try {
    console.log('💡 Drag terminé, enregistrement en cours...')

    // Met à jour l'ordre localement dans le store Pinia
    pinnedQuestions.value.forEach((item, index) => {
      faqStore.updateFaqItem({ ...item, order: index })
    })

    const fullPayload = faq.value.map(item => ({
      _id: item._id,
      order: item.pinned ? item.order ?? 0 : null,
    }))

    const response = await fetch('/.netlify/functions/updateOrderInSanity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'faq', orderedItems: fullPayload }),
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Erreur de mise à jour de l\'ordre')

    console.log('✅ Ordre mis à jour')
    notifySanityUpdate()
  } catch (err) {
    console.error('❌ Erreur lors de savePinnedOrder :', err)
  }
}

updatePinnedList()
</script>