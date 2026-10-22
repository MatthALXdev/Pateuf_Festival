import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export const useCategoryStore = defineStore('categoryStore', {
  state: () => ({
    categories: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchAllCategories() {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore()
        const token = await authStore.getToken

        const response = await fetch('/.netlify/functions/fetchSanityDoc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            dataset: 'pateuf_private',
            query: '*[_type == "category"]{ _id, name, title }'
          })
        })
        const result = await response.json()
        this.categories = result.result || []
        console.log('[STORE] catégories chargées :', this.categories)
      } catch (err) {
        this.error = err.message
        console.error('Erreur fetchAllCategories :', err)
      } finally {
        this.loading = false
      }
    }
  }
})
