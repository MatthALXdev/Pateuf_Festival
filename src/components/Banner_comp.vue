<template>
  <div class="p-4 cursor-pointer max-w-xs mx-auto" ref="dropDown">
    <div
      class="p-4 border border-gray-800 rounded-lg mb-1.5"
      @click="isDropDownVisible = true"
    >
      {{ mappedSelectedOption }}
    </div>
    <div class="options-wrapper" v-if="isDropDownVisible">
      <div
        v-for="(option, index) in props.options"
        :key="index"
        class="p-4 border border-gray-800 hover:bg-gray-300 box-border first:rounded-t-lg last:rounded-b-lg"
        @click="toggleOptionSelect(option)"
      >
        {{ option.name || option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, defineEmits, onMounted, onBeforeUnmount } from 'vue'

const dropDown = ref(null)

const props = defineProps({
  options: {
    type: Array,
    recquired: true,
  },
  modelValue: {
    default: null,
  },
})

const mappedSelectedOption = computed(() => {
  return selectedOption.value?.name || selectedOption.value || 'Heure'
})

const selectedOption = ref(null)

const isDropDownVisible = ref(false)

const toggleOptionSelect = option => {
  selectedOption.value = option
  emit('update:modelValue', option)
  isDropDownVisible.value = false
}

const emit = defineEmits(['update:modelValue'])

const closeDropDown = element => {
  if (!dropDown.value.contains(element.target)) {
    isDropDownVisible.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', closeDropDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropDown)
})
</script>
