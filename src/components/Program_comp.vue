<template>
  <div class="h-full flex flex-col">
    <div class="filtre flex-shrink-0">
      <div class="flex flex-wrap gap-2">
        <!-- Filtre Localisation -->
        <Selector_comp
          ref="locationSelector"
          optionName="Localisation"
          :options="locationOptions"
          v-model="selectedLocation"
        />
        <!-- Filtre Type d'activité -->
        <Selector_comp
          ref="labelSelector"
          optionName="Activité"
          :options="labelOptions"
          v-model="selectedLabel"
        />
        <!-- Filtre Date -->
        <Selector_comp
          ref="dateSelector"
          optionName="Jour"
          :options="dateOptions"
          v-model="selectedDate"
        />
        <!-- Filtre Heure -->
        <Selector_comp
          ref="timeSelector"
          optionName="Horaire"
          :options="timeOptions"
          v-model="selectedTime"
        />
      </div>

      <!-- Bouton pour réinitialiser les filtres -->
      <div class="ml-4">
        <button
          class="text-sm text-_black03 hover:text-_darkBlue02 underline mt-3"
          @click="resetFilters"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>

    <!-- Liste des activités filtrées -->
    <div
      class="liste flex-grow overflow-y-auto text-sm pr-2"
      :class="scrollbarClass"
    >
      <ul class="space-y-4 mt-4">
        <li
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="border-2 border-_darkBlue01 rounded-lg px-4 py-2 shadow space-y-2 hover:bg-_green01 hover:cursor-pointer hover:bg-opacity-50"
          @click="toggleExpand(activity.id)"
        >
          <!-- Contenu principal -->
          <div class="flex items-center space-x-4">
            <!-- Image -->
            <img
              :src="activity.logoURL"
              alt="Activity Logo"
              class="w-8 h-8 object-cover"
            />
            <div class="flex flex-col flex-grow">
              <div class="flex justify-between">
                <h3 class="text-sm font-bold">
                  {{ activity.name }}
                </h3>
                <!-- Bouton Ajouter -->
                <button
                  class="text-_black01 self-end text-3xl px-2 rounded transition-transform duration-300"
                  :class="{
                    'rotate-90': expandedActivities.includes(activity.id),
                    'rotate-[270deg]': !expandedActivities.includes(
                      activity.id,
                    ),
                  }"
                  @click="toggleExpand(activity.id)"
                >
                  <span
                    v-if="expandedActivities.includes(activity.id)"
                    class="inline-block transition-opacity duration-500 opacity-100"
                    >&gt;</span
                  >
                  <span
                    v-else
                    class="inline-block transition-opacity duration-500 opacity-100"
                    >&gt;</span
                  >
                </button>
              </div>
              <div class="flex flex-row justify-between">
                <!-- Infos -->
                <div class="flex flex-col self-start">
                  <p class="text-xs text-_black02">
                    {{ formatDate(activity.date) }}
                  </p>
                  <p class="text-xs text-_black02">
                    {{ activity.start }} | {{ activity.end }}
                  </p>
                </div>
                <!-- Localisation -->
                <div class="flex self-end">
                  <img
                    src="/src/assets/images/marker.svg"
                    alt="Map Marker"
                    class="w-4 h-4 inline-block shadow-3xl"
                  />
                  <p class="text-sm text-_black02 self-start">
                    {{ activity.location }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contenu étendu -->
          <div
            v-if="expandedActivities.includes(activity.id)"
            class="flex items-start space-x-4 mt-2"
          >
            <img
              :src="activity.image"
              alt="Activity Image"
              class="w-14 h-14 object-cover rounded self-center"
            />
            <p class="text-sm text-gray-700">
              {{ activity.description }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue'
import Selector_comp from './Selector_comp.vue'
const scrollbarClass = inject('scrollbarClass')
// Props
const props = defineProps({
  planningData: {
    type: Array,
    required: true, // Marque la prop comme obligatoire
  },
})

// Filtres réactifs
const selectedLocation = ref([])
const selectedLabel = ref([])
const selectedDate = ref([])
const selectedTime = ref([])

// Options dynamiques pour les filtres
const locationOptions = ref([])
const labelOptions = ref([])
const dateOptions = ref([])
const timeOptions = ref([])

// Activités filtrées
const filteredActivities = ref([])

// Indique si les données sont chargées
const dataLoaded = ref(false)

// Références des composants Selector_comp
const locationSelector = ref(null)
const labelSelector = ref(null)
const dateSelector = ref(null)
const timeSelector = ref(null)

// Réinitialise tous les filtres en appelant les méthodes des composants Selector_comp
const resetFilters = () => {
  if (locationSelector.value) locationSelector.value.resetSelection()
  if (labelSelector.value) labelSelector.value.resetSelection()
  if (dateSelector.value) dateSelector.value.resetSelection()
  if (timeSelector.value) timeSelector.value.resetSelection()

  filteredActivities.value = props.planningData
}

// Gère l'expansion des activités
const expandedActivities = ref([])
const toggleExpand = id => {
  const index = expandedActivities.value.indexOf(id)
  if (index === -1) {
    expandedActivities.value.push(id)
  } else {
    expandedActivities.value.splice(index, 1)
  }
}

// Formate la date
const formatDate = date => {
  // const month = date.slice(4, 6)
  const day = date.slice(6, 8)
  return `${day} juin`
}

// Surveille planningData et met à jour dataLoaded
watch(
  () => props.planningData,
  newData => {
    if (newData && Array.isArray(newData) && newData.length > 0) {
      dataLoaded.value = true

      // Mise à jour des options des filtres
      locationOptions.value = [...new Set(newData.map(a => a.location))].map(
        (location, index) => ({
          id: `location-${index}`,
          name: location,
          value: location,
        }),
      )
      labelOptions.value = [...new Set(newData.map(a => a.labels))].map(
        (label, index) => ({ id: `label-${index}`, name: label, value: label }),
      )
      dateOptions.value = [...new Set(newData.map(a => a.date))].map(
        (date, index) => ({ id: `date-${index}`, name: date, value: date }),
      )
      timeOptions.value = [...new Set(newData.map(a => a.start))].map(
        (time, index) => ({ id: `time-${index}`, name: time, value: time }),
      )

      // Mise à jour des activités filtrées
      filteredActivities.value = newData
    } else {
      dataLoaded.value = false
    }
  },
  { immediate: true }, // Vérifie immédiatement si les données sont prêtes
)

// Filtrage des activités en fonction des sélections
watch([selectedLocation, selectedLabel, selectedDate, selectedTime], () => {
  if (dataLoaded.value) {
    filteredActivities.value = props.planningData.filter(activity => {
      const matchesLocation =
        selectedLocation.value.length === 0 ||
        selectedLocation.value.some(loc => loc.value === activity.location)
      const matchesLabel =
        selectedLabel.value.length === 0 ||
        selectedLabel.value.some(label => label.value === activity.labels)
      const matchesDate =
        selectedDate.value.length === 0 ||
        selectedDate.value.some(date => date.value === activity.date)
      const matchesTime =
        selectedTime.value.length === 0 ||
        selectedTime.value.some(
          time => activity.start <= time.value && activity.end >= time.value,
        )

      return matchesLocation && matchesLabel && matchesDate && matchesTime
    })
  }
})
</script>
