// src/store/useFaqStore.js
import { defineStore } from 'pinia'
import { SANITY_ACCESS_TOKEN } from '@/config/constants'

export const useFaqStore = defineStore('faq', {
  state: () => ({
    faq: [],
  }),
  actions: {
    async fetchFaq() {
      try {
        const response = await fetch(
          "https://rgoopuri.api.sanity.io/v2022-03-07/data/query/pateuf_private?query=*[_type == 'faq']",
          {
            headers: {
              Authorization: `Bearer ${SANITY_ACCESS_TOKEN}`,
            },
          },
        )
        if (!response.ok) {
          throw new Error('Failed to fetch FAQ data from Sanity')
        }
        const data = await response.json()
        // Mapper les données pour qu'elles correspondent à la structure attendue
        this.faq = data.result.map(item => ({
          faq: item.faq,
          questionId: item.questionId,
          theme: item.theme,
          question: item.question,
          reponse: item.reponse,
        }))
      } catch (error) {
        console.error('Error loading FAQ:', error)
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
