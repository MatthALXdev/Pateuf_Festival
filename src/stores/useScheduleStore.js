import { defineStore } from 'pinia'

export const useScheduleStore = defineStore('scheduleStore', {
  state: () => ({
    scheduleData: null, // Stocke les données de la programmation
    loading: false,
    error: null,
  }),

  getters: {
    getScheduleData: state => state.scheduleData,
  },

  actions: {
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
          _id,
          id,
          name,
          order,
          duration,
          preptime,
          zoneRef,
          date,
          day,
          start,
          end,
          description,
          image{asset->{url}},
          category->{
            _id,
            title,
            name,
            logo{asset->{url}}
          },
          zoneRef->{
            _id,
            _id,
            name,
            image{asset->{url}}
          },
          backGroundActivity
        }
      `,
          }),
        })

        if (!response.ok) {
          throw new Error('Échec du chargement des données de la programmation du festival')
        }

        const data = await response.json()
        if (!data.result || !Array.isArray(data.result)) {
          throw new Error('Aucune donnée valide trouvée dans la réponse.')
        }

        this.scheduleData = data.result.map(item => ({
          ...item,
          imageURL: item.image?.asset?.url || null,
          categoryLogoURL: item.category?.logo?.asset?.url || null,
          zoneImageURL: item.zoneRef?.image?.asset?.url || null,
          zoneName: item.zoneRef?.name || null,
        }))
      } catch (error) {
        console.error('Erreur lors du chargement de la programmation :', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async deleteScheduleItem(id) {
      try {
        const response = await fetch('/.netlify/functions/deleteSanityDoc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataset: 'pateuf_private', id })
        })
        if (!response.ok) throw new Error('Erreur lors de la suppression.')
        this.scheduleData = this.scheduleData.filter(item => item._id !== id)
      } catch (error) {
        console.error('Erreur de suppression :', error)
      }
    },

    async updateScheduleItem(data) {
      try {
        const fullDoc = { ...data, _type: 'schedule' }

        if (!fullDoc._id || !fullDoc._type) {
          console.warn('⛔ Données invalides pour update :', fullDoc)
          throw new Error("Le document à mettre à jour doit contenir _id et _type")
        }

        const response = await fetch('/.netlify/functions/updateSanityDoc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataset: 'pateuf_private',
            schema: 'schedule',
            id: fullDoc._id,
            data: fullDoc
          })
        })

        const resultText = await response.text()
        let updated
        try {
          updated = JSON.parse(resultText)
        } catch (jsonErr) {
          console.error("Réponse non JSON (update) :", resultText)
          throw new Error("La réponse de l'API n'est pas au format JSON")
        }

        if (!response.ok) {
          console.error("Erreur brute Sanity (update) :", updated)
          throw new Error("Erreur lors de la mise à jour")
        }

        console.log('✅ Document Sanity mis à jour :', updated)

        if (updated.result) {
          this.scheduleData = this.scheduleData.map(item =>
            item._id === updated.result._id ? { ...item, ...updated.result } : item
          )
        } else {
          console.warn('⚠️ Réponse sans .result, mise à jour directe appliquée')
          this.scheduleData = this.scheduleData.map(item =>
            item._id === updated._id ? { ...item, ...updated } : item
          )
        }
      } catch (error) {
        console.error("Erreur de mise à jour détaillée:", error)
        this.error = error.message || 'Erreur inconnue lors de la mise à jour'
      }
    },

    async createScheduleItem(data) {
      try {
        const response = await fetch('/.netlify/functions/createSanityDoc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataset: 'pateuf_private', doc: { ...data, _type: 'schedule' } })
        })
        if (!response.ok) throw new Error("Erreur lors de la création")

        const created = await response.json()
        this.scheduleData.push(created)
      } catch (error) {
        console.error("Erreur de création :", error)
      }
    }
  },
})
