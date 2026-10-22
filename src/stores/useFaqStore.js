// src/store/useFaqStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export const useFaqStore = defineStore('faq', {
  state: () => ({
    faq: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchFaq() {
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
            query:
              "*[_type == 'faq']{_id, questionId, theme, question, reponse, pinned, order}",
          }),
        })

        if (!response.ok) {
          throw new Error(
            'Erreur lors de la récupération des données FAQ depuis Sanity',
          )
        }

        const data = await response.json()
        this.faq = data.result || []
      } catch (error) {
        console.error('Error loading FAQ:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    addFaqItem(item) {
      this.faq.push(item)
    },

    removeFaqItem(questionId) {
      this.faq = this.faq.filter(item => item.questionId !== questionId)
    },

    updateFaqItem(updatedItem) {
      const index = this.faq.findIndex(
        item => item.questionId === updatedItem.questionId,
      )
      if (index !== -1) {
        this.faq[index] = updatedItem
      }
    },

    async updateFaqInSanity(id, updatedFields) {
      try {
        const authStore = useAuthStore()
        const token = await authStore.getToken

        const payload = {
          schema: 'faq',
          id,
          data: updatedFields,
        }

        const response = await fetch('/.netlify/functions/updateSanityDoc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        const result = await response.json()

        if (!response.ok) {
          console.error('❌ Échec update Sanity:', result)
          throw new Error(result.error || 'Erreur update inconnue')
        }

        console.log('✅ Update réussi Sanity:', result)
      } catch (err) {
        console.error('🔥 Erreur updateFaqInSanity:', err)
      }
    },

    async submitNewQuestionToSanity(item) {
      try {
        const authStore = useAuthStore()
        const token = await authStore.getToken

        const timestamp = Date.now()
        const id = `faq-${timestamp}`
        const questionId = `q-${timestamp}`

        const payload = {
          schema: 'faq',
          id,
          data: {
            ...item,
            questionId,
            pinned: item.pinned || false,
          },
        }

        const response = await fetch('/.netlify/functions/createSanityDoc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        const result = await response.json()
        if (!response.ok) throw new Error(result.error)

        console.log('✅ Nouvelle question ajoutée à Sanity', result)
        await this.fetchFaq()
      } catch (err) {
        console.error('❌ Erreur ajout question FAQ :', err)
        this.error = err.message
      }
    },
  },

  getters: {
    getFaqByTheme: state => theme => {
      return state.faq.filter(item => item.theme === theme)
    },
    getFaqById: state => id => {
      return state.faq.find(item => item.questionId === id)
    },
    groupedFaq: state => {
      return state.faq.reduce((acc, item) => {
        let group = acc.find(g => g.theme === item.theme)
        if (!group) {
          group = { theme: item.theme, questions: [] }
          acc.push(group)
        }
        group.questions.push(item)
        return acc
      }, [])
    },
    pinnedFaq: state => {
      return state.faq.filter(item => item.pinned)
    },
    groupedPinnedFaq: state => {
      return state.faq.reduce((acc, item) => {
        if (!item.pinned) return acc
        let group = acc.find(g => g.theme === item.theme)
        if (!group) {
          group = { theme: item.theme, questions: [] }
          acc.push(group)
        }
        group.questions.push(item)
        return acc
      }, [])
    },
  },
})
