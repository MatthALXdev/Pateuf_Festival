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
                  @click="deleteFaq(item.questionId)"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <div v-if="editingItem && editingItem.questionId === item.questionId" class="mt-4">
              <label class="block mb-2 text-sm font-medium">Question</label>
              <textarea
                v-model="editingItem.question"
                class="w-full p-2 border rounded mb-2"
                rows="2"
              ></textarea>

              <label class="block mb-2 text-sm font-medium">Réponse</label>
              <textarea
                v-model="editingItem.reponse"
                class="w-full p-2 border rounded mb-2"
                rows="3"
              ></textarea>

              <div class="flex gap-2">
                <button
                  @click="saveEdit"
                  :disabled="loading"
                  class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                >
                  {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
                <button
                  @click="cancelEdit"
                  class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                >
                  Annuler
                </button>
              </div>

              <p v-if="error" class="text-red-500 mt-2">❌ {{ error }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFaqStore } from '@/stores/useFaqStore'
import { storeToRefs } from 'pinia'

const faqStore = useFaqStore()
const { faq } = storeToRefs(faqStore)

const themes = [
  'Sécurité et Secours',
  'Alimentation',
  'Moyens de Transport',
  'restauration',
  'Paiement et Réseaux',
]

const selectedTheme = ref(themes[0])
const editingItem = ref(null)
const loading = ref(false)
const error = ref(null)

const filteredFaq = computed(() => {
  return faq.value.filter(item => item.theme === selectedTheme.value)
})

const startEditing = item => {
  editingItem.value = { ...item }
}

const cancelEdit = () => {
  editingItem.value = null
  error.value = null
}

const saveEdit = async () => {
  if (!editingItem.value) return
  loading.value = true
  error.value = null

  try {
    await faqStore.updateFaqInSanity(editingItem.value._id, {
      question: editingItem.value.question,
      reponse: editingItem.value.reponse,
    })
    faqStore.updateFaqItem(editingItem.value)
    editingItem.value = null
  } catch (err) {
    error.value = err.message || 'Erreur inconnue lors de la mise à jour'
  } finally {
    loading.value = false
  }
}

const deleteFaq = id => {
  faqStore.removeFaqItem(id)
}
</script>
