import { defineStore } from 'pinia'

export const useBorderStore = defineStore('borderStore', {
  state: () => ({
    festivalBorder: null, // Contiendra les données GeoJSON des bordures
    loading: false,
    error: null,
  }),

  actions: {
    // Charger les données des bordures depuis Sanity et fusionner avec les données statiques
    async fetchFestivalBorder() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/.netlify/functions/fetchSanityData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

        // Transformer les coordonnées pour correspondre au format attendu par Mapbox
        const transformedCoordinates = data.result.coordinates.map(coord => [
          coord.longitude,
          coord.latitude,
        ])

        // Données statiques définies localement
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

        // Assigner les données fusionnées au store
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
