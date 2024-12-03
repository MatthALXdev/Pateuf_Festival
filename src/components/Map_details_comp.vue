<template>
  <div class="w-full h-1/2 bg-white overflow-auto p-2 shadow">
    <!-- Bouton pour fermer la vue -->
    <button @click="$emit('close')" class="float-right">Fermer</button>

    <!-- Titre de la section -->
    <h3>Informations sur la fonctionnalité</h3>

    <!-- Affichage des informations du groupe de test 1 -->
    <pre>{{ currentGroupTest1.location }}</pre>
    <pre>On Air</pre>
    <pre>{{ currentGroupTest1.name }}</pre>
    <img :src="pathImage" alt="Feature Image" class="w-20 h-20" />
    <pre>De {{ currentGroupTest1.start }} à {{ currentGroupTest1.end }}</pre>
    <pre>{{ currentGroupTest1.description }}</pre>

    <!-- Affichage de l'identifiant de la fonctionnalité -->
    <div>{{ feature.id }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Définition des propriétés du composant
const props = defineProps({
  feature: Object,
  planningData: Object,
})

// Temps de test
const timeTest1 = ['20250614', '16:00']
const timeTest2 = ['20250615', '20:00']

// Références réactives pour stocker les groupes actuels de test et réel
const currentGroupTest1 = ref(null)
const currentGroupTest2 = ref(null)
const currentGroup = ref(null)
const currentScene = ref(props.feature.properties.name) // Nom de la scène actuelle
const pathImage = ref('pathImage vide')

// Fonction pour obtenir l'heure actuelle au format HH:mm
const now = getCurrentTime()
const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
function getCurrentTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// Recherche du groupe actuel en fonction des données de planning
const group = props.planningData.find(groupe => {
  return (
    groupe.location === currentScene.value &&
    groupe.date === today &&
    groupe.start <= now &&
    groupe.end >= now
  )
})

// Recherche du groupe de test 1 en fonction des scénarios de test
const groupTest1 = props.planningData.find(groupe => {
  return (
    groupe.location === currentScene.value &&
    groupe.date === timeTest1[0] &&
    groupe.start <= timeTest1[1] &&
    groupe.end >= timeTest1[1]
  )
})

// Recherche du groupe de test 2 en fonction des scénarios de test
const groupTest2 = props.planningData.find(groupe => {
  return (
    groupe.location === currentScene.value &&
    groupe.date === timeTest2[0] &&
    groupe.start <= timeTest2[1] &&
    groupe.end >= timeTest2[1]
  )
})

// Assignation des résultats de recherche aux variables réactives
currentGroup.value = group || 'Aucun groupe ne joue actuellement'
currentGroupTest1.value = groupTest1 || 'Aucun groupe ne joue actuellement'
currentGroupTest2.value = groupTest2 || 'Aucun groupe ne joue actuellement'

// Mise à jour du chemin de l'image basé sur le groupe de test 1
pathImage.value = currentGroupTest1.value.image

console.log(currentGroupTest1.value)
</script>
