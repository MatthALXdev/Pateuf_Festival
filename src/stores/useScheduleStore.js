import { defineStore } from 'pinia'
import { SANITY_ACCESS_TOKEN } from '@/config/constants'

export const useScheduleStore = defineStore('scheduleStore', {
  state: () => ({
    scheduleData: null, // Stocke les données de la programmation
  }),

  getters: {
    // Getter pour récupérer les données brutes
    getScheduleData: state => state.scheduleData,
  },

  actions: {
    // Charger les données de la programmation depuis Sanity
    async fetchScheduleData() {
      try {
        const SANITY_PROJECT_ID = 'rgoopuri' // Remplace par ton ID de projet
        const SANITY_DATASET = 'pateuf_private' // Dataset utilisé

        // Construire la requête Sanity pour récupérer les événements
        const query = encodeURIComponent(
          `*[_type == "schedule"]{
            id,
            name, 
            order, 
            duration, 
            preptime, 
            location, 
            date, 
            labels, 
            day, 
            start, 
            end, 
            description, 
            image, 
            logoURL, 
            backGroundActivity
          }`,
        )
        const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${SANITY_DATASET}?query=${query}`

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${SANITY_ACCESS_TOKEN}`,
          },
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

        // Log des données transformées
      } catch (error) {
        console.error('Erreur lors du chargement de la programmation :', error)
      }
    },
  },
})
