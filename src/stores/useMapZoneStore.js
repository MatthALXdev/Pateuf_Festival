import { defineStore } from 'pinia'
import { SANITY_ACCESS_TOKEN } from '@/config/constants'

export const useMapZoneStore = defineStore('mapZoneStore', {
  state: () => ({
    mapZone: null, // Contiendra les données GeoJSON des zones du festival
  }),

  actions: {
    // Charger les données des zones depuis Sanity
    async fetchMapZone() {
      try {
        const SANITY_PROJECT_ID = 'rgoopuri' // Remplacez par votre ID de projet
        const SANITY_DATASET = 'pateuf_private' // Dataset utilisé

        // Construire l'URL de la requête Sanity
        const query = encodeURIComponent(
          `*[_type == "zone"]{name, ActivityGroupName, id, geometry}`,
        )
        const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${SANITY_DATASET}?query=${query}`

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${SANITY_ACCESS_TOKEN}`,
          },
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

        // Log des données transformées
        console.log('Données GeoJSON des zones :', this.mapZone)
      } catch (error) {
        console.error('Erreur lors du chargement des zones :', error)
      }
    },
  },

  getters: {
    formattedMapZone(state) {
      return state.mapZone
    },
  },
})
