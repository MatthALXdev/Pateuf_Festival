<template>
  <div class="p-4">
    <div class="flex flex-wrap gap-4 mb-4">
      <!-- Filtre par Localisation -->
      <label class="flex flex-col">
        <select v-model="selectedLocation" class="border p-2 rounded">
          <option value="">Localisation</option>
          <option
            v-for="location in uniqueLocations"
            :key="location"
            :value="location"
          >
            {{ location }}
          </option>
        </select>
      </label>

      <!-- Filtre par Type d'activité -->
      <label class="flex flex-col">
        Type d'activité:
        <select v-model="selectedLabel" class="border p-2 rounded">
          <option value="">Tous</option>
          <option v-for="label in uniqueLabels" :key="label" :value="label">
            {{ label }}
          </option>
        </select>
      </label>

      <!-- Filtre par Date -->
      <label class="flex flex-col">
        Date:
        <select v-model="selectedDate" class="border p-2 rounded">
          <option value="">Toutes</option>
          <option v-for="date in uniqueDates" :key="date" :value="date">
            {{ formatDate(date) }}
          </option>
        </select>
      </label>

      <!-- Filtre par Heure -->
      <label class="flex flex-col relative">
        Heure (HH:MM):
        <select
          v-model="selectedTime"
          class="custom-select border rounded w-full"
          size="4"
        >
          <option value="">Toutes</option>
          <option v-for="time in availableTimes" :key="time" :value="time">
            {{ time }}
          </option>
        </select>
      </label>
    </div>

    <!-- Liste des activités filtrées -->
    <ul class="space-y-4">
      <li
        v-for="activity in filteredActivities"
        :key="activity.name"
        class="border rounded p-4 shadow"
      >
        <div class="flex items-center gap-4">
          <img
            :src="activity.image || '/default-logo.png'"
            alt="logo"
            class="w-16 h-16 object-cover rounded"
          />
          <div class="flex-grow">
            <h3 class="text-lg font-bold">{{ activity.name }}</h3>
            <p class="text-sm text-gray-500">
              {{
                isToday(activity.date)
                  ? `Commence à ${activity.start}`
                  : `${formatDate(activity.date)} à ${activity.start}`
              }}
            </p>
          </div>
          <button
            @click="goToLocation(activity.location)"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            S'y rendre
          </button>
          <button
            @click="toggleDescription(activity)"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {{ activity.showDescription ? 'Réduire' : 'Détail' }}
          </button>
        </div>
        <div v-if="activity.showDescription" class="mt-4 text-gray-700">
          <p>{{ activity.description }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getTestDateTime } from '@/services/testHandler'

const props = defineProps({
  planningData: {
    type: Array,
    required: false,
    default: () => [],
  },
})

// Fonction utilitaire pour formater les dates
const formatDate = date => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('fr-FR', options)
}

// Obtenir la date et l'heure actuelles pour le test
const { testDate, testTime } = getTestDateTime()

// Filtres réactifs
const selectedLocation = ref('')
const selectedLabel = ref('')
const selectedDate = ref('')
const selectedTime = ref('')

// Fonction pour générer des créneaux horaires
const generateTimeSlots = startTime => {
  const times = []
  let [hour, minute] = startTime.split(':').map(Number)
  for (let i = 0; i < 48; i++) {
    times.push(
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    )
    minute += 30
    if (minute === 60) {
      minute = 0
      hour += 1
    }
    if (hour === 24) break
  }
  return times
}

// Création des plages horaires disponibles
const startSlot = `${testTime.split(':')[0].padStart(2, '0')}:00`
const allTimes = generateTimeSlots('00:00')
const availableTimes = computed(() =>
  allTimes.slice(allTimes.indexOf(startSlot)),
)

// Valeurs uniques pour les filtres
const uniqueLocations = computed(() => [
  ...new Set(props.planningData.map(a => a.location)),
])
const uniqueLabels = computed(() => [
  ...new Set(props.planningData.map(a => a.labels)),
])
const uniqueDates = computed(() => [
  ...new Set(props.planningData.map(a => a.date)),
])

// Logique des activités filtrées
const filteredActivities = computed(() => {
  return props.planningData.filter(activity => {
    const matchesLocation =
      !selectedLocation.value || activity.location === selectedLocation.value
    const matchesLabel =
      !selectedLabel.value || activity.labels === selectedLabel.value
    const matchesDate =
      !selectedDate.value || activity.date === selectedDate.value
    const matchesTime =
      !selectedTime.value || activity.start >= selectedTime.value
    return matchesLocation && matchesLabel && matchesDate && matchesTime
  })
})

// Fonctions utilitaires
const isToday = date => date === testDate
const goToLocation = location => console.log(`S'y rendre: ${location}`)
const toggleDescription = activity => {
  activity.showDescription = !activity.showDescription
}
</script>
