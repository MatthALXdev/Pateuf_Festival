<template>
  <div class="h-full flex flex-col">
    <div class="flex-shrink-0">
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
    <div class="flex justify-between gap-4 overflow-y-hidden">
      <!-- Liste des activités filtrées -->
      <div
        class="overflow-y-auto text-sm pr-2 w-full md:w-1/2 lg:w-full h-full"
        :class="scrollbarClass"
      >
        <ul
          class="space-y-4 lg:space-y-0 mt-4 lg:flex lg:flex-wrap gap-4 justify-center md:h-max md:overflow-y-auto"
        >
          <li
            v-for="activity in filteredActivities"
            :key="activity.id"
            class="lg:w-1/5 lg:h-[20rem] border-2 border-_darkBlue01 rounded-lg px-4 lg:px-0 shadow hover:bg-_green03 hover:cursor-pointer bg-opacity-50 lg:flex lg:flex-col lg:justify-between"
            :class="{
              'bg-_green03':
                activeActivity && activeActivity.id === activity.id,
            }"
            @click="setActiveActivity(activity)"
          >
            <!-- Contenu principal -->
            <div class="flex items-center space-x-4">
              <!-- Image -->
              <img
                :src="activity.imageURL"
                alt="Activity Image"
                class="w-14 object-cover rounded"
              />
              <div class="flex flex-col flex-grow">
                <div class="flex justify-between">
                  <h3 class="text-sm font-bold">
                    {{ activity.name }}
                  </h3>
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

            <!-- Contenu étendu (petit écran) -->
            <div
              v-if="
                (activeActivity &&
                  activeActivity.id === activity.id &&
                  isSmallScreen) ||
                isLgScreen
              "
              class="flex lg:flex-col items-center space-x-4 mt-2 lg:justify-around flex-grow"
            >
              <img
                :src="activity.imageURL"
                alt="Activity Image"
                class="w-14 object-cover rounded"
              />
              <p class="text-sm text-gray-700 lg:self-center">
                {{ activity.description }}
              </p>
            </div>
          </li>
        </ul>
      </div>
      <!-- Contenu étendu (grand écran) -->
      <div
        v-if="!isSmallScreen && activeActivity"
        class="hidden md:flex lg:hidden w-1/2 justify-center h-[90%] self-center"
      >
        <div
          class="flex flex-col w-2/3 border-2 border-_black01 rounded-md gap-4 overflow-hidden relative z-0"
        >
          <!-- Image du groupe -->
          <div class="flex justify-center mx-auto overflow-hidden">
            <!-- Image floue en arrière-plan (agrandie) -->
            <div class="absolute blur-sm w-52 z-0">
              <img
                v-if="activeActivity.image?.asset?.url"
                :src="activeActivity.image?.asset?.url"
                alt="Activity Image"
                class="object-cover opacity-70 scale-150"
              />
            </div>
            <!-- Image nette au premier plan -->
            <img
              v-if="activeActivity.image?.asset?.url"
              :src="activeActivity.image?.asset?.url"
              alt="Activity Image"
              class="z-10 w-36 h-auto object-cover rounded-md mt-4"
            />
          </div>

          <!-- Informations supplémentaires -->
          <p
            class="text-sm text-_black02 bg-_beige03 px-4 overflow-y-auto h-1/2 z-10 text-center flex items-center justify-center"
            :class="scrollbarClass"
          >
            {{ activeActivity.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, inject } from 'vue'
import Selector_comp from './Selector_comp.vue'
import { useScheduleStore } from '@/stores/useScheduleStore'
import { useWindowSize } from '@/composables/useWindowSize'

const scheduleStore = useScheduleStore()
// ⚡️ On encapsule `scheduleStore.getScheduleData` dans un `computed` ⚡️
const scheduleData = computed(() => scheduleStore.getScheduleData)

const scrollbarClass = inject('scrollbarClass')
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

// Activité active
const activeActivity = ref(null)

// Détecte si l'écran est petit
const { isSmallScreen, isLgScreen } = useWindowSize()

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

  filteredActivities.value = scheduleData
  activeActivity.value = isSmallScreen.value
    ? null
    : filteredActivities.value[0] || null
}

// Définir une activité active
const setActiveActivity = activity => {
  // Si l'activité cliquée est déjà active, on la désactive
  if (activeActivity.value && activeActivity.value.id === activity.id) {
    activeActivity.value = null
  } else {
    activeActivity.value = activity
  }
  console.log('scheduleData:', scheduleData.value)
  console.log('filteredActivities:', filteredActivities.value)
  console.log('activeActivity:', activeActivity.value.id)
}

// Formate la date
const formatDate = date => {
  const day = date.slice(6, 8)
  return `${day} juin`
}

// 🕵️‍♂️ Watch réactif basé sur `scheduleData`
watch(
  scheduleData,
  newData => {
    if (newData && Array.isArray(newData) && newData.length > 0) {
      dataLoaded.value = true

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

      filteredActivities.value = newData
      activeActivity.value = isSmallScreen.value
        ? null
        : filteredActivities.value[0] || null
    } else {
      dataLoaded.value = false
    }
  },
  { immediate: true, deep: true }, // 👈 `deep: true` pour surveiller les changements internes du tableau
)

// 🕵️‍♂️ Watch pour filtrer les activités (basé sur `scheduleData`)
watch([selectedLocation, selectedLabel, selectedDate, selectedTime], () => {
  if (dataLoaded.value) {
    filteredActivities.value = scheduleData.value.filter(activity => {
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
