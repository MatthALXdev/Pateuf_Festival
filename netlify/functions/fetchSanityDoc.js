// netlify/functions/fetchSanityDoc.js
// Proxy LECTURE-ONLY public vers Sanity (GROQ)
// - Pas d'auth côté client (JWT non requis)
// - Utilise un token Sanity READ-ONLY côté serveur
// - Garde-fous anti-mutation + limites

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  }
  
  export async function handler(event) {
    // Préflight CORS
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: CORS, body: '' }
    }
    // POST only
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Méthode non autorisée. Utilisez POST.' }) }
    }
  
    // Env
    const projectId = process.env.SANITY_PROJECT_ID
    const defaultDataset = process.env.SANITY_DATASET
    // 👉 Utiliser un token **lecture** dédié (évite d’exposer un admin token à des lectures publiques)
    const readToken =
      process.env.SANITY_ACCESS_READ_TOKEN ||
      process.env.SANITY_READ_TOKEN ||
      process.env.SANITY_ACCESS_TOKEN || // fallback si tu n’as pas encore créé le read-only token
      process.env.SANITY_ACCESS_ADMIN_TOKEN // à éviter, mais garde-fou temporaire
  
    if (!projectId || !readToken) {
      return {
        statusCode: 500,
        headers: CORS,
        body: JSON.stringify({ error: "⚠️ SANITY_PROJECT_ID ou token de lecture manquant(s)." }),
      }
    }
  
    // Parse body
    let body
    try {
      body = JSON.parse(event.body || '{}')
    } catch {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: '⛔ JSON invalide' }) }
    }
  
    const { query, params = null, dataset } = body || {}
    if (!query || typeof query !== 'string') {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: '⛔ "query" (string) est requis.' }) }
    }
  
    const ds = dataset || defaultDataset
    if (!ds) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: '⛔ "dataset" manquant (dans body ou env).' }) }
    }
  
    // Garde-fous lecture seule
    const forbidden = /\b(mut(ate|ation)|create|delete|patch|transaction)\b/i
    if (forbidden.test(query)) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'Requête refusée : opérations de mutation interdites via ce proxy.' }),
      }
    }
  
    // Limites de taille
    if (query.length > 8_192) {
      return { statusCode: 413, headers: CORS, body: JSON.stringify({ error: 'Requête trop volumineuse (query).' }) }
    }
    if (params && JSON.stringify(params).length > 16_384) {
      return { statusCode: 413, headers: CORS, body: JSON.stringify({ error: 'Requête trop volumineuse (params).' }) }
    }
  
    // (Optionnel) whitelist datasets en lecture
    const allowDatasets = (process.env.READ_DATASETS_ALLOW || '').split(',').map(s => s.trim()).filter(Boolean)
    if (allowDatasets.length && !allowDatasets.includes(ds)) {
      return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: 'Dataset non autorisé en lecture publique.' }) }
    }
  
    // Construire l’URL Sanity + $params
    let url = `https://${projectId}.api.sanity.io/v2022-03-07/data/query/${encodeURIComponent(ds)}?query=${encodeURIComponent(query)}`
    if (params && typeof params === 'object') {
      url += `&%24params=${encodeURIComponent(JSON.stringify(params))}`
    }
  
    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${readToken}` } })
      const text = await response.text()
      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.status} ${response.statusText} — ${text}`)
      }
      const data = JSON.parse(text)
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ result: data.result ?? null }) }
    } catch (e) {
      console.error('❌ fetchSanityDoc error:', e)
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Erreur lors de la récupération des données depuis Sanity' }) }
    }
  }
  