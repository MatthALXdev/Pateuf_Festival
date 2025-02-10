import { defineStore } from 'pinia'

export const useMapZoneStore = defineStore('mapZoneStore', {
  state: () => ({
    mapZone: null, // Contiendra les données GeoJSON des zones du festival
    loading: false,
    error: null,
  }),

  actions: {
    // Charger les données des zones depuis Sanity
    async fetchMapZone() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/.netlify/functions/fetchSanityData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataset: 'pateuf_private',
            query: "*[_type == 'zone']{name, ActivityGroupName, id, geometry}",
          }),
        })

        if (!response.ok) {
          throw new Error(
            'Échec du chargement des données des zones du festival',
          )
        }

        const data = await response.json()
        if (!data.result || !Array.isArray(data.result)) {
          throw new Error('Aucune donnée valide trouvée dans la réponse.')
        }

        // Transformer les données pour correspondre au format attendu par Mapbox
        const transformedFeatures = data.result.map(zone => ({
          type: 'Feature',
          id: zone.id,
          properties: {
            name: zone.name,
            ActivityGroupName: zone.ActivityGroupName,
          },
          geometry: {
            type: zone.geometry.type,
            coordinates: [
              zone.geometry.coordinates.map(coord => [
                coord.longitude,
                coord.latitude,
              ]),
            ],
          },
        }))

        // Assigner les données formatées au store
        this.mapZone = {
          type: 'FeatureCollection',
          features: transformedFeatures,
        }
      } catch (error) {
        console.error('Erreur lors du chargement des zones :', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    formattedMapZone(state) {
      return state.mapZone
    },
  },
})
