import { defineStore } from 'pinia'

export const useScheduleStore = defineStore('scheduleStore', {
  state: () => ({
    scheduleData: null, // Stocke les données de la programmation
    loading: false,
    error: null,
  }),

  getters: {
    // Getter pour récupérer les données brutes
    getScheduleData: state => state.scheduleData,
  },

  actions: {
    // Charger les données de la programmation depuis Sanity
    async fetchScheduleData() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/.netlify/functions/fetchSanityData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataset: 'pateuf_private',
            query: `
        *[_type == 'schedule']{
          id, 
          name, 
          order, 
          duration, 
          preptime, 
          location, 
          date, 
          day, 
          start, 
          end, 
          description, 
          image{asset->{url}}, 
          category->{
            title, 
            logo{asset->{url}}
          }, 
          backGroundActivity
        }
      `,
          }),
        })

        if (!response.ok) {
          throw new Error(
            'Échec du chargement des données de la programmation du festival',
          )
        }

        const data = await response.json()
        if (!data.result || !Array.isArray(data.result)) {
          throw new Error('Aucune donnée valide trouvée dans la réponse.')
        }

        // Assigner les données récupérées au store
        this.scheduleData = data.result
      } catch (error) {
        console.error('Erreur lors du chargement de la programmation :', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  },
})
