<template>
  <div class="p-4 bg-white shadow rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Gestion des Informations</h2>

    <button
      @click="addInfo"
      class="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
    >
      Ajouter une information
    </button>

    <ul class="space-y-2">
      <li
        v-for="(info, index) in newsStore.newsData"
        :key="info.infoID"
        class="flex flex-col p-2 border rounded"
      >
        <div class="flex justify-between items-center">
          <div>
            <span class="font-bold">{{ info.infoID }}. </span>
            <span v-if="!editingInfo || editingInfo.infoID !== info.infoID">{{
              info.infoDescription
            }}</span>
          </div>
          <div class="space-x-2">
            <button
              @click="moveUp(info.infoID)"
              :disabled="index === 0"
              class="px-2 py-1 bg-gray-300 rounded"
            >
              ⬆
            </button>
            <button
              @click="moveDown(info.infoID)"
              :disabled="index === newsStore.newsData.length - 1"
              class="px-2 py-1 bg-gray-300 rounded"
            >
              ⬇
            </button>
            <button
              @click="startEditing(info)"
              class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Modifier
            </button>
            <button
              @click="deleteInfo(info.infoID)"
              class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
        <div
          v-if="editingInfo && editingInfo.infoID === info.infoID"
          class="mt-2"
        >
          <textarea
            v-model="editingInfo.infoDescription"
            class="w-full p-2 border rounded"
          ></textarea>
          <button
            @click="saveEdit"
            class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Enregistrer
          </button>
          <button
            @click="cancelEdit"
            class="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Annuler
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNewsStore } from '@/stores/useNewsStore'
import { storeToRefs } from 'pinia'

const newsStore = useNewsStore()
const { newsData } = storeToRefs(newsStore)
const editingInfo = ref(null)

const addInfo = () => {
  newsStore.addNewsItem({
    infoID: newsData.value.length + 1,
    infoDescription: 'Nouvelle information',
  })
}

const deleteInfo = id => {
  newsStore.removeNewsItem(id)
}

const startEditing = info => {
  editingInfo.value = { ...info }
}

const saveEdit = () => {
  if (!editingInfo.value) return

  console.log('Mise à jour de', editingInfo.value)
  newsStore.updateNewsItem(editingInfo.value)
  editingInfo.value = null
}

const cancelEdit = () => {
  editingInfo.value = null
}

const moveUp = infoID => {
  const index = newsData.value.findIndex(item => item.infoID === infoID)
  if (index > 0) {
    ;[newsData.value[index], newsData.value[index - 1]] = [
      newsData.value[index - 1],
      newsData.value[index],
    ]
  }
}

const moveDown = infoID => {
  const index = newsData.value.findIndex(item => item.infoID === infoID)
  if (index < newsData.value.length - 1) {
    ;[newsData.value[index], newsData.value[index + 1]] = [
      newsData.value[index + 1],
      newsData.value[index],
    ]
  }
}
</script>
