import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export const useBorderStore = defineStore('borderStore', {
  state: () => ({
    festivalBorder: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchFestivalBorder() {
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
            query: "*[_type == 'festivalBorderCoordinates'][0]",
          }),
        })

        if (!response.ok) {
          throw new Error(
            'Erreur lors de la récupération des données de bordure depuis Sanity',
          )
        }

        const data = await response.json()
        if (!data.result || !data.result.coordinates) {
          throw new Error('Aucune coordonnée trouvée dans la réponse.')
        }

        const transformedCoordinates = data.result.coordinates.map(coord => [
          coord.longitude,
          coord.latitude,
        ])

        const staticData = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'background' },
              geometry: {
                type: 'Polygon',
                coordinates: [transformedCoordinates],
              },
              id: 13,
            },
          ],
        }

        this.festivalBorder = staticData
      } catch (error) {
        console.error(
          'Erreur lors du chargement des données de bordure:',
          error,
        )
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    formattedBorder(state) {
      return state.festivalBorder
    },
  },
})
