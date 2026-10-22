import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export const useSponsorStore = defineStore('sponsor', {
  state: () => ({
    sponsors: [],
  }),
  actions: {
    async fetchSponsors() {
      try {
        const authStore = useAuthStore()
        const token = await authStore.getToken

        const query = `
          *[_type == "sponsor"]{
            name,
            url,
            ordre,
            logo{asset->{url}}
          }
        `

        const response = await fetch('/.netlify/functions/fetchSanityDoc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            dataset: 'pateuf_private',
            query,
          }),
        })

        if (!response.ok)
          throw new Error('Erreur lors du chargement des sponsors')

        const data = await response.json()
        this.sponsors = data.result.sort((a, b) => a.ordre - b.ordre)
      } catch (err) {
        console.error('❌ useSponsorStore - fetchSponsors() error:', err)
      }
    },
  },
})
