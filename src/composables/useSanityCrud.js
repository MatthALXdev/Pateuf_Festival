import { ref } from 'vue'

export function useSanityCrud() {
  const loading = ref(false)
  const error = ref(null)

  const updateDoc = async (schema, id, data) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/.netlify/functions/updateSanityDoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema, id, data }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Erreur inconnue lors de la mise à jour')
      }

      return result
    } catch (err) {
      console.error('❌ Erreur Sanity CRUD (update):', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    updateDoc,
    loading,
    error,
  }
}
