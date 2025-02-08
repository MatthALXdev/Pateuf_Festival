import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsData: [],
  }),
  actions: {
    async fetchNews() {
      try {
        const response = await fetch('/.netlify/functions/fetchInfoSanity') // ✅ Correction de l'URL (sans .js)
        if (!response.ok) {
          throw new Error('Failed to fetch news data from Sanity')
        }
        const data = await response.json()

        // Mapper les données pour qu'elles correspondent à la structure attendue
        this.newsData = data.result.map(item => ({
          infoID: item.infoID,
          logoURL: item.logo ? item.logo.asset.url : null, // URL complète de l'image
          infoDescription: item.infoDescription,
        }))
      } catch (error) {
        console.error('Error loading news from Sanity:', error)
      }
    },
    addNewsItem(item) {
      this.news.push(item)
    },
    removeNewsItem(infoID) {
      this.news = this.news.filter(item => item.infoID !== infoID)
    },
    updateNewsItem(updatedItem) {
      if (!this.newsData || this.newsData.length === 0) {
        console.error('Erreur : newsData est vide ou non initialisé.')
        return
      }

      const index = this.newsData.findIndex(
        item => item.infoID === updatedItem.infoID,
      )
      if (index === -1) {
        console.error(`Erreur : infoID ${updatedItem.infoID} non trouvé.`)
        return
      }

      this.newsData[index] = updatedItem
    },
  },
  getters: {
    getNewsByID: state => id => {
      return state.news.find(item => item.infoID === id)
    },
  },
})
