import { defineStore } from 'pinia'
import { SANITY_ACCESS_TOKEN } from '@/config/constants'

export const useIconStore = defineStore('IconStore', {
  state: () => ({
    iconData: null, // Données combinées de Sanity et statiques
    staticData: [], // Données statiques pour compléter les données Sanity
  }),
  actions: {
    // Charger les données de Sanity et les fusionner avec les données statiques
    async fetchIconData() {
      try {
        // Récupération des données depuis Sanity
        const response = await fetch(
          "https://rgoopuri.api.sanity.io/v2022-03-07/data/query/pateuf_private?query=*[_type == 'iconFeature']",
          {
            headers: {
              Authorization: `Bearer ${SANITY_ACCESS_TOKEN}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error('Failed to fetch icon data from Sanity')
        }

        const data = await response.json()

        // Transformation des données Sanity en GeoJSON compatible avec Mapbox
        const sanityFeatures = data.result.map(item => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: item.geometry.coordinates,
          },
          properties: {
            ActivityGroupName: item.ActivityGroupName,
            iconSize: item.iconSize,
            icon: item.icon,
            isMarker: item.isMarker,
          },
          id: item.id,
        }))

        // Fusion avec les données statiques
        const combinedFeatures = [...this.staticData, ...sanityFeatures]

        // Construction de l'objet GeoJSON final
        this.iconData = {
          type: 'FeatureCollection',
          features: combinedFeatures,
        }
      } catch (error) {
        console.error('Error loading icon data:', error)
      }
    },

    // Charger les données statiques localement
    loadStaticData(staticData) {
      this.staticData = staticData
    },
  },
  getters: {
    // Getter pour récupérer les données combinées
    getIconData: state => state.iconData,

    // Extraire les groupes d'activités uniques
    ActivityGroupsArray: state => {
      if (!state.iconData || !state.iconData.features) return []
      return [
        ...new Set(
          state.iconData.features.map(
            feature => feature.properties.ActivityGroupName,
          ),
        ),
      ]
    },

    // Récupérer toutes les coordonnées des points
    CoordinatesArray: state => {
      if (!state.iconData || !state.iconData.features) return []
      return state.iconData.features.map(
        feature => feature.geometry.coordinates,
      )
    },
  },
})
