import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'rgoopuri',
  dataset: 'pateuf_private',
  useCdn: false,
  apiVersion: '2022-03-07',
  token: import.meta.env.VITE_APP_SANITY_ACCESS_TOKEN, // Charge depuis .env
})
