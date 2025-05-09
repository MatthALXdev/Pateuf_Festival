import { defineStore } from 'pinia'

export const useSponsorStore = defineStore('sponsor', {
  state: () => ({
    sponsors: [],
  }),
  actions: {
    async fetchSponsors() {
      try {
        const query = `
          *[_type == "sponsor"]{
            name,
            url,
            ordre,
            logo{asset->{url}}
          }
        `

        const response = await fetch('/.netlify/functions/fetchSanityData', {
          method: 'POST',
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
