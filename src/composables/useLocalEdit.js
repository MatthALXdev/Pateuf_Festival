// src/composables/useLocalEdit.js
import { ref, watch } from 'vue'

export function useLocalEdit(originalItem) {
  const localCopy = ref(structuredClone(originalItem))
  const hasChanges = ref(false)

  watch(
    localCopy,
    (newVal) => {
      hasChanges.value = JSON.stringify(newVal) !== JSON.stringify(originalItem)
    },
    { deep: true }
  )

  function resetLocalCopy() {
    localCopy.value = structuredClone(originalItem)
    hasChanges.value = false
  }

  return {
    localCopy,
    hasChanges,
    resetLocalCopy
  }
}
