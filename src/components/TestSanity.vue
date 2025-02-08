<script setup>
import { ref, onMounted } from 'vue'
import { client } from '@/services/sanityClient'

const documents = ref([])

const fetchDocuments = async () => {
  try {
    documents.value = await client.fetch(`*[_type == "schedule"]{_id, title}`)
    console.log('📌 Documents trouvés :', documents.value)
  } catch (error) {
    console.error('🚨 Erreur lors de la récupération des documents :', error)
  }
}

const deleteAllSchedules = async () => {
  try {
    for (const doc of documents.value) {
      await client.delete(doc._id)
      console.log(`✅ Document supprimé : ${doc._id}`)
      await new Promise(resolve => setTimeout(resolve, 200)) // ⏳ Attendre 200ms entre chaque suppression
    }
    console.log("✅ Tous les documents 'schedule' ont été supprimés !")
    fetchDocuments() // Rafraîchir la liste après suppression
  } catch (error) {
    console.error('🚨 Erreur lors de la suppression :', error)
  }
}

onMounted(fetchDocuments)
</script>

<template>
  <div>
    <h2>Test Sanity</h2>
    <ul>
      <li v-for="doc in documents" :key="doc._id">
        {{ doc._id }} - {{ doc.title || 'Sans titre' }}
      </li>
    </ul>
    <button @click="deleteAllSchedules">Supprimer tous les documents</button>
  </div>
</template>
