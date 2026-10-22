/**
 * 🔐 Fonction Netlify publique avec protection bas niveau (pas Auth0)
 * - Mise en cache en mémoire (TTL)
 * - Limitation de requêtes (rate limiting par IP)
 * - Retourne le token Mapbox pour le frontend (lecture seule)
 */

import { RateLimiterMemory } from 'rate-limiter-flexible'

// 🚀 Mise en cache en mémoire locale (dans le runtime Netlify)
let cachedToken = null
let lastFetched = 0
const cacheTTL = 5 * 60 * 1000 // 5 minutes

// ⚡️ Rate limiter : max 20 requêtes / 5 minutes / IP
const limiter = new RateLimiterMemory({
  points: 20,
  duration: 300,
})

export async function handler(event) {
  const ip = event.headers['x-forwarded-for'] || 'global'
  console.log('🔍 [Netlify] Requête IP :', ip)

  try {
    await limiter.consume(ip)
  } catch {
    console.warn('⚠️ Trop de requêtes Mapbox pour cette IP')
    return {
      statusCode: 429,
      body: JSON.stringify({ error: 'Trop de requêtes, veuillez réessayer plus tard.' }),
    }
  }

  const now = Date.now()
  if (cachedToken && now - lastFetched < cacheTTL) {
    console.log('✅ Token Mapbox retourné depuis le cache')
    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken: cachedToken }),
    }
  }

  const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN
  if (!MAPBOX_ACCESS_TOKEN) {
    console.error('❌ Token Mapbox manquant !')
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Token Mapbox manquant.' }),
    }
  }

  cachedToken = MAPBOX_ACCESS_TOKEN
  lastFetched = now
  console.log('✅ Token Mapbox récupéré depuis l’env')

  return {
    statusCode: 200,
    body: JSON.stringify({ accessToken: MAPBOX_ACCESS_TOKEN }),
  }
}