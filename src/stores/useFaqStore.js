// src/store/useFaqStore.js
import { defineStore } from 'pinia'

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
        const response = await fetch('/.netlify/functions/fetchSanityData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataset: 'pateuf_private',
            query:
              "*[_type == 'faq']{faq, questionId, theme, question, reponse}",
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
  },
})
