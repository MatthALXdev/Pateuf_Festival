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
        const response = await fetch('/.netlify/functions/fetchSanityDoc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dataset: 'pateuf_private',
            query:
              '*[_type == "info"] | order(order asc){_id, infoID, logo{asset->{url}}, infoDescription, order}',
          }),
        })

        if (!response.ok) {
          throw new Error(
            'Erreur lors de la récupération des données depuis Sanity',
          )
        }

        const data = await response.json()
        this.newsData = data.result.map(item => ({
          _id: item._id,
          infoID: item.infoID,
          logoURL: item.logo?.asset?.url || null,
          infoDescription: item.infoDescription,
          order: item.order ?? 0,
        }))
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

    async updateNewsInSanity(infoID, updatedFields) {
      try {
        const payload = {
          schema: 'info',
          id: infoID,
          data: updatedFields,
        }

        const response = await fetch('/.netlify/functions/updateSanityDoc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const result = await response.json()

        if (!response.ok) {
          console.error('❌ Échec update Sanity:', result)
          throw new Error(result.error || 'Erreur update inconnue')
        }

        console.log('✅ Update réussi Sanity:', result)
      } catch (err) {
        console.error('🔥 Erreur updateNewsInSanity:', err)
      }
    },

    async submitNewInfoToSanity(item) {
      try {
        const timestamp = Date.now()
        const id = `info-${timestamp}`
        const payload = {
          schema: 'info',
          id,
          data: {
            ...item,
          },
        }

        const response = await fetch('/.netlify/functions/createSanityDoc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const result = await response.json()
        if (!response.ok) throw new Error(result.error)

        console.log('✅ Nouvelle info ajoutée à Sanity', result)
        await this.fetchNews()
      } catch (err) {
        console.error('❌ Erreur ajout info Sanity :', err)
        this.error = err.message
      }
    },
  },

  getters: {
    getNewsByID: state => id => {
      return state.newsData.find(item => item.infoID === id)
    },
  },
})
