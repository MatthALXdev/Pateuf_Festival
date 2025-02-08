import { defineStore } from 'pinia'
import { SANITY_ACCESS_TOKEN } from '@/config/constants'

export const useBorderStore = defineStore('borderStore', {
  state: () => ({
    festivalBorder: null, // Contiendra les données GeoJSON des bordures
  }),

  actions: {
    // Charger les données des bordures depuis Sanity et fusionner avec les données statiques
    async fetchFestivalBorder() {
      try {
        const SANITY_PROJECT_ID = 'rgoopuri' // Remplacez par votre ID de projet
        const SANITY_DATASET = 'pateuf_private' // Dataset utilisé

        // Construire l'URL de la requête Sanity
        const query = encodeURIComponent(
          `*[_type == "festivalBorderCoordinates"][0]`,
        )
        const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${SANITY_DATASET}?query=${query}`

        // Effectuer la requête avec fetch
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${SANITY_ACCESS_TOKEN}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch festival border data from Sanity')
        }

        const data = await response.json()

        if (!data.result || !data.result.coordinates) {
          throw new Error('No coordinates found in the response.')
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
                coordinates: [transformedCoordinates], // Les coordonnées seront remplacées dynamiquement
              },
              id: 13,
            },
          ],
        }

        // Assigner les données fusionnées au store
        this.festivalBorder = staticData

        // Log des données fusionnées
        // console.log('Données GeoJSON fusionnées :', this.festivalBorder)
      } catch (error) {
        console.error(
          'Erreur lors du chargement des données de bordure:',
          error,
        )
      }
    },
  },

  getters: {
    // Exemple de getter pour accéder aux données formatées
    formattedBorder(state) {
      return state.festivalBorder
    },
  },
})
