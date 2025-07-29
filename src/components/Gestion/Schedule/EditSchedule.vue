<script setup>
import { ref, computed, onMounted } from 'vue'
import VueTimepicker from 'vue3-timepicker'
import 'vue3-timepicker/dist/VueTimepicker.css'
import { useScheduleStore } from '@/stores/useScheduleStore'
import cancelIcon from '@/assets/images/cancel.svg'
import ScheduleForm from './ScheduleForm.vue'

const store = useScheduleStore()
const reloadData = async () => {
  await store.fetchScheduleData()
}

onMounted(() => {
  if (!store.scheduleData?.length) reloadData()
})

const filters = ref({
  day: '',
  zoneRef: '',
  category: '',
  time: ''
})

const sortOption = ref('chrono')
const showModal = ref(false)
const currentEvent = ref(null)
const showNotification = ref(false)
const notificationText = ref('')

const zoneRefs = computed(() => {
  const all = store.scheduleData.map(e => e.zoneRef).filter(Boolean)
  return [...new Set(all)]
})

const categories = computed(() => {
  const all = store.scheduleData.map(e => e.category?.title).filter(Boolean)
  return [...new Set(all)]
})

const filteredEvents = computed(() => {
  let events = [...store.scheduleData]

  if (filters.value.day) {
    events = events.filter(e => String(e.day) === String(filters.value.day))
  }
  if (filters.value.zoneRef) {
    events = events.filter(e => e.zoneRef === filters.value.zoneRef)
  }
  if (filters.value.category) {
    events = events.filter(e => e.category?.title === filters.value.category)
  }
  if (filters.value.time) {
    const [h, m] = filters.value.time.split(':')
    const filterTime = parseFloat(h) + parseFloat(m) / 60
    events = events.filter(e => {
      const [sh, sm] = e.start.split(':')
      const eventTime = parseFloat(sh) + parseFloat(sm) / 60
      return eventTime >= filterTime
    })
  }

  switch (sortOption.value) {
    case 'alpha':
      events.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'alpha-desc':
      events.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'chrono':
      events.sort((a, b) => a.start.localeCompare(b.start))
      break
    case 'chrono-desc':
      events.sort((a, b) => b.start.localeCompare(a.start))
      break
  }

  return events
})

function formatDay(d) {
  return d === 1 || d === '1' ? 'Jour 1 - Samedi' : 'Jour 2 - Dimanche'
}

async function deleteEvent(eventId) {
  await store.deleteScheduleItem(eventId)
  notificationText.value = 'Activité supprimée'
  showNotification.value = true
  await reloadData()
  setTimeout(() => {
    showNotification.value = false
  }, 2000)
}

function openModal(event = null) {
  currentEvent.value = event
  showModal.value = true
}

async function closeModal(action = 'modifié') {
  currentEvent.value = null
  showModal.value = false
  notificationText.value = `Activité ${action}`
  showNotification.value = true
  await reloadData()
  setTimeout(() => {
    showNotification.value = false
  }, 2000)
}
</script>

<template>
  <div class="p-4">
    <transition name="fade-fade">
      <div
        v-if="showNotification"
        class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50"
      >
        {{ notificationText }}
      </div>
    </transition>

    <h2 class="text-xl font-semibold mb-4">Planning des activités</h2>

    <!-- Bouton ajout -->
    <div class="mb-4">
      <button
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        @click="openModal()"
      >
        + Ajouter une activité
      </button>
    </div>

    <!-- Barre de filtres -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium mb-1">Jour</label>
        <select v-model="filters.day" class="w-full border rounded px-2 py-1">
          <option value="">Tous</option>
          <option value="1">Jour 1</option>
          <option value="2">Jour 2</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Lieu</label>
        <select v-model="filters.zoneRef" class="w-full border rounded px-2 py-1">
          <option value="">Tous</option>
          <option v-for="loc in zoneRefs" :key="loc" :value="loc">{{ loc }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Catégorie</label>
        <select v-model="filters.category" class="w-full border rounded px-2 py-1">
          <option value="">Toutes</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Après l'heure</label>
        <VueTimepicker
          v-model="filters.time"
          format="HH:mm"
          :is24="true"
          :minute-step="15"
          class="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Tri</label>
        <select v-model="sortOption" class="w-full border rounded px-2 py-1">
          <option value="alpha">Alphabétique A → Z</option>
          <option value="alpha-desc">Alphabétique Z → A</option>
          <option value="chrono">Chronologique ↑</option>
          <option value="chrono-desc">Chronologique ↓</option>
        </select>
      </div>
    </div>

    <!-- Liste filtrée -->
    <div class="space-y-2">
      <div
        v-for="event in filteredEvents"
        :key="event._id"
        class="relative group p-4 bg-white border rounded shadow-sm cursor-pointer hover:bg-gray-50 transition"
        @click="openModal(event)"
      >
        <button
          @click.stop="deleteEvent(event._id)"
          class="absolute top-2 right-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Supprimer"
        >
          <img :src="cancelIcon" alt="Supprimer" class="w-full h-full" />
        </button>
        <div class="font-semibold text-lg">{{ event.name }}</div>
        <div class="text-sm text-gray-600">
          {{ formatDay(event.day) }} · {{ event.start }} - {{ event.end }} · {{ event.zoneRef }} · {{ event.category?.title }}
        </div>
      </div>
    </div>

    <!-- Modal formulaire -->
    <ScheduleForm v-if="showModal" :event="currentEvent" @close="closeModal" />
  </div>
</template>

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
