<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="$emit('close')"
      >
        ✕
      </button>

      <h3 class="text-xl font-semibold mb-4">
        {{ isEditMode ? 'Modifier une activité' : 'Ajouter une activité' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Nom de l’activité</label>
          <input v-model="localCopy.name" type="text" class="w-full border rounded px-2 py-1" required />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea v-model="localCopy.description" class="w-full border rounded px-2 py-1" rows="3" placeholder="Ajouter une description..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Jour</label>
          <select v-model="localCopy.day" class="w-full border rounded px-2 py-1" required>
            <option value="1">Samedi</option>
            <option value="2">Dimanche</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Lieu</label>
          <select v-model="localCopy.zoneRef" class="w-full border rounded px-2 py-1" required>
            <option disabled value="">-- Choisir un lieu --</option>
            <option
              v-for="zone in mapZoneStore.zones"
              :key="zone._id || zone.name"
              :value="zone.name"
            >
              {{ zone.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Catégorie</label>
          <select v-model="localCopy.category" class="w-full border rounded px-2 py-1">
            <option disabled value="">-- Choisir une catégorie --</option>
            <option
              v-for="cat in categoryStore.categories"
              :key="cat._id"
              :value="cat.name"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Heure de début</label>
          <input v-model="localCopy.start" type="time" class="w-full border rounded px-2 py-1" required />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Heure de fin</label>
          <input v-model="localCopy.end" type="time" class="w-full border rounded px-2 py-1" required />
        </div>

        <div class="md:col-span-2 flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2">Annuler</button>
           <button type="submit" :disabled="!hasChanges" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-40">
            {{ isEditMode ? 'Enregistrer les modifications' : 'Ajouter l’activité' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useScheduleStore } from '@/stores/useScheduleStore'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useMapZoneStore } from '@/stores/useMapZoneStore'
import { useLocalEdit } from '@/composables/useLocalEdit'

const props = defineProps({ event: Object })
const emit = defineEmits(['close'])

const store = useScheduleStore()
const categoryStore = useCategoryStore()
const mapZoneStore = useMapZoneStore()

const isEditMode = computed(() => !!props.event)
const defaultEvent = {
  name: '',
  description: '',
  day: '1',
  zoneRef: '',
  category: '',
  start: '',
  end: ''
}

const initialData = computed(() => {
  if (!props.event) return defaultEvent
  return {
    name: props.event.name || '',
    description: props.event.description || '',
    day: String(props.event.day || '1'),
    zoneRef: props.event.zoneRef || '',
    category: props.event.category?.name || '',
    start: props.event.start || '',
    end: props.event.end || ''
  }
})

const { localCopy, hasChanges } = useLocalEdit(initialData.value)

onMounted(async () => {
  if (!categoryStore.categories.length) {
    await categoryStore.fetchAllCategories()
  }
})

async function handleSubmit() {
  try {
    const categoryRef = categoryStore.categories.find(cat => cat.name === localCopy.value.category)?._id || null
    const payload = {
      ...localCopy.value,
      category: categoryRef ? { _type: 'reference', _ref: categoryRef } : undefined,
    }

    if (isEditMode.value) {
      await store.updateScheduleItem({ ...payload, _id: props.event._id })
      emit('close', 'modifiée')
    } else {
      await store.createScheduleItem(payload)
      emit('close', 'ajoutée')
    }
  } catch (err) {
    console.error('Erreur lors de la soumission :', err)
    emit('close')
  }
}
</script>
