import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

/**
 * Store Programmation (schedule)
 * - Lecture publique via /.netlify/functions/fetchSanityDoc (PAS de JWT)
 * - Mutations protégées (delete/update/create) via Netlify Functions avec JWT
 *   -> Le token peut être passé en argument ou récupéré depuis authStore.getToken
 */
export const useScheduleStore = defineStore('scheduleStore', {
  state: () => ({
    scheduleData: null,
    loading: false,
    error: null,
  }),

  getters: {
    getScheduleData: state => state.scheduleData,
  },

  actions: {
    /**
     * LECTURE PUBLIQUE — ne pas envoyer d'Authorization
     */
    async fetchScheduleData() {
      this.loading = true
      this.error = null
      try {
        const dataset = import.meta.env.VITE_SANITY_DATASET || 'pateuf_private'

        const query = `*[_type == 'schedule']{
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
            name,
            image{asset->{url}}
          },
          backGroundActivity
        } | order(order asc)`

        const response = await fetch('/.netlify/functions/fetchSanityDoc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }, // ✅ pas d'Authorization ici
          body: JSON.stringify({ dataset, query }),
        })

        if (!response.ok) {
          throw new Error('Échec du chargement des données de la programmation du festival')
        }

        const data = await response.json()
        const result = Array.isArray(data?.result) ? data.result : []

        this.scheduleData = result.map(item => ({
          ...item,
          imageURL: item?.image?.asset?.url || null,
          categoryLogoURL: item?.category?.logo?.asset?.url || null,
          zoneImageURL: item?.zoneRef?.image?.asset?.url || null,
          zoneName: item?.zoneRef?.name || null,
        }))
      } catch (error) {
        console.error('Erreur lors du chargement de la programmation :', error)
        this.error = error?.message || 'Erreur inconnue lors du chargement'
      } finally {
        this.loading = false
      }
    },

    /**
     * SUPPRESSION — JWT requis
     * @param {string} id
     * @param {string} [tokenOverride] - facultatif, token déjà rafraîchi depuis la vue
     */
    async deleteScheduleItem(id, tokenOverride) {
      try {
        const dataset = import.meta.env.VITE_SANITY_DATASET || 'pateuf_private'
        const authStore = useAuthStore()
        const token = tokenOverride || authStore.getToken
        if (!token) throw new Error('Non authentifié : token manquant')

        const response = await fetch('/.netlify/functions/deleteSanityDoc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dataset, id }),
        })

        const text = await response.text()
        if (!response.ok) {
          throw new Error(text || 'Erreur lors de la suppression')
        }

        // Mise à jour locale
        this.scheduleData = (this.scheduleData || []).filter(item => item._id !== id)
      } catch (error) {
        console.error('Erreur de suppression :', error)
        this.error = error?.message || 'Erreur inconnue lors de la suppression'
      }
    },

    /**
     * MISE À JOUR — JWT requis
     * @param {object} data - document partiel/entier à mettre à jour (doit contenir _id)
     * @param {string} [tokenOverride]
     */
    async updateScheduleItem(data, tokenOverride) {
      try {
        const dataset = import.meta.env.VITE_SANITY_DATASET || 'pateuf_private'
        const authStore = useAuthStore()
        const token = tokenOverride || authStore.getToken
        if (!token) throw new Error('Non authentifié : token manquant')

        const fullDoc = { ...data, _type: 'schedule' }
        if (!fullDoc._id || !fullDoc._type) {
          throw new Error("Le document à mettre à jour doit contenir _id et _type")
        }

        const response = await fetch('/.netlify/functions/updateSanityDoc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dataset,
            schema: 'schedule',
            id: fullDoc._id,
            data: fullDoc,
          }),
        })

        const resultText = await response.text()
        let payload
        try {
          payload = JSON.parse(resultText)
        } catch (_) {
          console.error('Réponse non JSON (update) :', resultText)
          throw new Error("La réponse de l'API n'est pas au format JSON")
        }

        if (!response.ok || payload?.error) {
          console.error('Erreur brute Sanity (update) :', payload)
          throw new Error(payload?.error || 'Erreur lors de la mise à jour')
        }

        // Compat : différentes formes de retour selon ta Netlify Function
        const updatedDoc =
          payload?.document || // { success, document }
          payload?.result || // { result }
          payload?.documents?.[0] || // { documents: [...] }
          payload?.results?.[0]?.document || // Sanity mutate proxy brut
          null

        if (!updatedDoc) {
          console.warn('⚠️ Réponse sans document exploitable, aucune mise à jour locale effectuée')
          return
        }

        this.scheduleData = (this.scheduleData || []).map(item =>
          item._id === updatedDoc._id ? { ...item, ...updatedDoc } : item,
        )
      } catch (error) {
        console.error('Erreur de mise à jour détaillée:', error)
        this.error = error?.message || 'Erreur inconnue lors de la mise à jour'
      }
    },

    /**
     * CRÉATION — JWT requis
     * @param {object} data - champs du document schedule (sans _id)
     * @param {string} [tokenOverride]
     */
    async createScheduleItem(data, tokenOverride) {
      try {
        const dataset = import.meta.env.VITE_SANITY_DATASET || 'pateuf_private'
        const authStore = useAuthStore()
        const token = tokenOverride || authStore.getToken
        if (!token) throw new Error('Non authentifié : token manquant')

        const response = await fetch('/.netlify/functions/createSanityDoc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dataset, doc: { ...data, _type: 'schedule' } }),
        })

        const resultText = await response.text()
        let payload
        try {
          payload = JSON.parse(resultText)
        } catch (_) {
          console.error('Réponse non JSON (create) :', resultText)
          throw new Error("La réponse de l'API n'est pas au format JSON")
        }

        if (!response.ok || payload?.error) {
          console.error('Erreur brute Sanity (create) :', payload)
          throw new Error(payload?.error || 'Erreur lors de la création')
        }

        const createdDoc = payload?.document || payload?.result || payload
        if (createdDoc) {
          this.scheduleData = [...(this.scheduleData || []), createdDoc]
        }
      } catch (error) {
        console.error('Erreur de création :', error)
        this.error = error?.message || 'Erreur inconnue lors de la création'
      }
    },
  },
})
