<template>
  <div class="relative cursor-pointer w-fit max-w-xs ml-2" ref="dropDown">
    <div
      class="px-2 flex flex-wrap justify-between content-center items-center gap-2 border border-gray-800 rounded-full overflow-clip"
      :class="{ 'bg-_green03': selectedOptions.length > 0 }"
      @click="isDropDownVisible = !isDropDownVisible"
    >
      <div class="overflow-clip w-full max-h-full">
        {{ mappedSelectedOptions }}
      </div>
    </div>

    <div
      class="options-wrapper absolute top-full left-0 z-10 text-sm flex flex-col max-h-80 overflow-y-auto pr-1 mt-2"
      :style="{ minWidth: dropDownWidth + 'px' }"
      :class="scrollbarClass"
      v-if="isDropDownVisible"
    >
      <!-- Option pour réinitialiser la sélection -->
      <div
        class="bg-_white02 w-full p-1 border border-gray-800 hover:bg-_beige01 box-border first:rounded-t-lg"
        @click="clearSelection"
      >
        Tout afficher
      </div>
      <!-- Options dynamiques -->
      <div
        v-for="option in props.options"
        :key="option.id"
        :class="{
          'bg-_green03': isOptionSelected(option),
          'bg-_white02': !isOptionSelected(option),
        }"
        class="border border-gray-800 box-border p-1 last:rounded-b-lg hover:bg-_beige01"
        @click="toggleOptionSelect(option)"
      >
        {{ option.name || option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, inject } from 'vue'
const scrollbarClass = inject('scrollbarClass')

const dropDown = ref(null)
const dropDownWidth = ref(0)

const props = defineProps({
  options: {
    type: Array,
    required: true, // Assure que les options sont toujours fournies
  },
  modelValue: {
    type: Array, // Permet la sélection multiple
    default: () => [],
  },
  optionName: String,
})

const emit = defineEmits(['update:modelValue'])

// Utilise une copie réactive pour permettre les modifications
const selectedOptions = ref(
  Array.isArray(props.modelValue) ? [...props.modelValue] : [],
)
const isDropDownVisible = ref(false)

// Mapper les options sélectionnées
const mappedSelectedOptions = computed(() => {
  if (selectedOptions.value.length === 0) return props.optionName
  if (selectedOptions.value.length === 1) {
    return selectedOptions.value[0].name
  }
  return `${selectedOptions.value[0].name}, ...`
})

// Synchronise les options sélectionnées avec les props
watch(
  () => props.modelValue,
  newValue => {
    selectedOptions.value = Array.isArray(newValue) ? [...newValue] : []
  },
  { immediate: true },
)

// Vérifie si une option est sélectionnée
const isOptionSelected = option => {
  return selectedOptions.value.some(selected => selected.id === option.id)
}

// Gère la sélection/désélection des options
const toggleOptionSelect = option => {
  const index = selectedOptions.value.findIndex(
    selected => selected.id === option.id,
  )
  if (index === -1) {
    selectedOptions.value.push(option) // Ajoute l'option si elle n'est pas sélectionnée
  } else {
    selectedOptions.value.splice(index, 1) // Supprime l'option si elle est déjà sélectionnée
  }
  emit('update:modelValue', [...selectedOptions.value]) // Émet une copie mise à jour
}

// Réinitialise la sélection
const clearSelection = () => {
  selectedOptions.value = []
  emit('update:modelValue', []) // Réinitialise le modèle
  isDropDownVisible.value = false
}

// Expose une méthode pour réinitialiser depuis le parent
const resetSelection = () => {
  clearSelection()
}
defineExpose({
  resetSelection,
})

// Calcul de la largeur du conteneur principal pour appliquer à l'overlay
const updateDropDownWidth = () => {
  if (dropDown.value) {
    dropDownWidth.value = dropDown.value.offsetWidth
  }
}

// Ferme le menu déroulant si on clique ailleurs
const closeDropDown = element => {
  if (!dropDown.value.contains(element.target)) {
    isDropDownVisible.value = false
  }
}

onMounted(() => {
  updateDropDownWidth()
  window.addEventListener('click', closeDropDown)
  window.addEventListener('resize', updateDropDownWidth)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropDown)
  window.removeEventListener('resize', updateDropDownWidth)
})
</script>
