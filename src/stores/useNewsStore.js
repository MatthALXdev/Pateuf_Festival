import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsData: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchNews() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/.netlify/functions/fetchSanityData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataset: 'pateuf_private',
            query:
              '*[_type == "info"]{infoID, logo{asset->{url}}, infoDescription}',
          }),
        })

        if (!response.ok) {
          throw new Error(
            'Erreur lors de la récupération des données depuis Sanity',
          )
        }

        const data = await response.json()
        this.newsData = data.result || []
      } catch (error) {
        console.error('Error loading news from Sanity:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    addNewsItem(item) {
      this.newsData.push(item)
    },
    removeNewsItem(infoID) {
      this.newsData = this.newsData.filter(item => item.infoID !== infoID)
    },
    updateNewsItem(updatedItem) {
      const index = this.newsData.findIndex(
        item => item.infoID === updatedItem.infoID,
      )
      if (index !== -1) {
        this.newsData[index] = updatedItem
      } else {
        console.error(`Erreur : infoID ${updatedItem.infoID} non trouvé.`)
      }
    },
  },
  getters: {
    getNewsByID: state => id => {
      return state.newsData.find(item => item.infoID === id)
    },
  },
})
