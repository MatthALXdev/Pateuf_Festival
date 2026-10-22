import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export const useBrandingStore = defineStore('branding', {
  state: () => ({
    logoURL: null,
    backgroundURL: null,
    ticketImages: [],
  }),
  actions: {
    async fetchBranding() {
      try {
        const authStore = useAuthStore()
        const token = await authStore.getToken

        const query = `
          *[_type == "siteBranding"][0]{
            logo{asset->{url}},
            backgroundTop{asset->{url}},
            ticketImages[]{asset->{url}}
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
          throw new Error('Erreur lors du chargement des images branding')

        const data = await response.json()
        const item = data.result

        this.logoURL = item.logo?.asset?.url || null
        this.backgroundURL = item.backgroundTop?.asset?.url || null
        this.ticketImages = item.ticketImages?.map(img => img.asset.url) || []
      } catch (err) {
        console.error('❌ useBrandingStore - fetchBranding() error:', err)
      }
    },
  },
})
