<template>
  <div class="p-4 bg-white shadow rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Gestion des Informations</h2>

    <button
      @click="showAddModal = true"
      class="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
    >
      Ajouter une information
    </button>

    <transition name="fade-fade">
      <div
        v-if="showOrderSaved"
        class="fixed bottom-6 right-6 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg z-50 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Ordre mis à jour</span>
      </div>
    </transition>

    <!-- Modale d'ajout -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Nouvelle information</h3>
        <textarea
          v-model="newInfoDescription"
          class="w-full p-2 border rounded mb-4"
          rows="3"
          placeholder="Saisir le contenu de l'information"
        ></textarea>
        <div class="flex justify-end gap-2">
          <button
            @click="showAddModal = false"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            @click="submitNewInfo"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    <draggable v-model="newsStore.newsData" item-key="_id" handle=".drag-handle" @end="handleDragEnd">
      <template #item="{ element, index }">
        <li class="flex flex-col p-2 border rounded">
          <div class="flex justify-between items-center">
            <div>
              <span class="font-bold text-gray-500 mr-2">{{ index + 1 }}</span>
              <span v-if="!editingInfo || editingInfo._id !== element._id">
                {{ element.infoDescription }}
              </span>
            </div>
            <div class="flex space-x-2 items-center">
              <div class="cursor-move drag-handle text-lg">☰</div>
              <button
                @click="startEditing(element)"
                class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Modifier
              </button>
              <button
                @click="deleteInfo(element.infoID, element._id)"
                class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>

          <div v-if="editingInfo && editingInfo._id === element._id" class="mt-2">
            <textarea
              v-model="localCopy.infoDescription"
              @input="console.log('✏️ input:', localCopy.infoDescription)"
              class="w-full p-2 border rounded"
              rows="3"
              placeholder="Modifier l'information"
            ></textarea>
            <div class="flex gap-2 mt-2">
              <button
                @click="saveEdit"
                :disabled="!hasChanges || loading"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 disabled:opacity-40"
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
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, toRaw, nextTick } from 'vue'
import { useNewsStore } from '@/stores/useNewsStore'
import { storeToRefs } from 'pinia'
import { useLocalEdit } from '@/composables/useLocalEdit'
import draggable from 'vuedraggable'

const newsStore = useNewsStore()
const { newsData } = storeToRefs(newsStore)

const editingInfo = ref(null)
const localCopy = ref(null)
const hasChanges = ref(false)
const loading = ref(false)
const error = ref(null)
const showOrderSaved = ref(false)

const showAddModal = ref(false)
const newInfoDescription = ref('')

const startEditing = async info => {
  console.log('🟦 START EDITING - original info:', info);
  const raw = toRaw(info)
  editingInfo.value = { ...raw }

  const { localCopy: lc, hasChanges: hc } = useLocalEdit(raw)
  localCopy.value = lc.value
  hasChanges.value = hc

  await nextTick()
  console.log('🟩 LOCAL COPY VALUE:', localCopy.value.infoDescription)
  console.log('🟨 editingInfo:', editingInfo.value)
}

const cancelEdit = () => {
  editingInfo.value = null
  error.value = null
  localCopy.value = null
  hasChanges.value = false
}

const saveEdit = async () => {
  if (!editingInfo.value || !localCopy.value) return
  loading.value = true
  error.value = null

  try {
    await newsStore.updateNewsInSanity(editingInfo.value._id, {
      infoDescription: localCopy.value.infoDescription,
    })

    newsStore.updateNewsItem({ ...editingInfo.value, ...localCopy.value })
    cancelEdit()
  } catch (err) {
    error.value = err.message || 'Erreur inconnue lors de la mise à jour'
  } finally {
    loading.value = false
  }
}

const submitNewInfo = async () => {
  if (!newInfoDescription.value.trim()) return
  const newItem = {
    infoID: newsData.value.length + 1,
    infoDescription: newInfoDescription.value.trim(),
    order: newsData.value.length,
  }
  await newsStore.submitNewInfoToSanity(newItem)
  newInfoDescription.value = ''
  showAddModal.value = false
}

const deleteInfo = async (infoID, docId) => {
  newsStore.removeNewsItem(infoID)
  try {
    const response = await fetch('/.netlify/functions/deleteSanityDoc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: docId }),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error)
    console.log('✅ Suppression réussie Sanity')
  } catch (err) {
    console.error('❌ Erreur suppression info:', err)
    error.value = err.message
  }
}

const handleDragEnd = async () => {
  for (let i = 0; i < newsData.value.length; i++) {
    if (newsData.value[i].order !== i) {
      newsData.value[i].order = i
      await newsStore.updateNewsInSanity(newsData.value[i]._id, { order: i })
    }
  }
  showOrderSaved.value = true
  setTimeout(() => (showOrderSaved.value = false), 2000)
}
</script>

<style scoped>
.fade-fade-enter-active,
.fade-fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-fade-enter-from,
.fade-fade-leave-to {
  opacity: 0;
}
.fade-fade-enter-to,
.fade-fade-leave-from {
  opacity: 1;
}
</style>
