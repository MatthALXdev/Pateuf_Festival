// netlify/functions/createSanityDoc.js

import { verifyAuth0Token } from './_utils/verifyAuth0JWT.js'

export const handler = async (event) => {
  // 🔐 Vérification du token JWT
  const authHeader = event.headers.authorization
  const jwt = authHeader?.split(' ')[1]

  if (!jwt) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized: JWT manquant' }),
    }
  }

  try {
    await verifyAuth0Token(jwt)
  } catch (err) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden: JWT invalide' }),
    }
  }

  // 🔐 Vérification des variables d'environnement Sanity
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET
  const token = process.env.SANITY_ACCESS_ADMIN_TOKEN

  if (!projectId || !dataset || !token) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: '⛔️ Variables d’environnement Sanity manquantes.',
      }),
    }
  }

  // 🔎 Analyse du corps de la requête
  let parsedBody
  try {
    parsedBody = JSON.parse(event.body || '{}')
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '⛔️ JSON invalide dans la requête.' }),
    }
  }

  const { schema, id, data } = parsedBody

  if (!schema || !id || !data || typeof data !== 'object') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: '⛔️ Requête invalide : schema, id et data sont requis.',
      }),
    }
  }

  const mutation = {
    createOrReplace: {
      _id: id,
      _type: schema,
      ...data,
    },
  }

  const url = `https://${projectId}.api.sanity.io/v2022-03-07/data/mutate/${dataset}`

  try {
    console.log('🌟 Mutation envoyée à Sanity :', JSON.stringify(mutation))

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations: [mutation] }),
    })

    let result
    try {
      result = await response.json()
    } catch (jsonError) {
      const text = await response.text()
      throw new Error(`Réponse non JSON : ${text}`)
    }

    if (!response.ok || result.error) {
      console.error('❌ Sanity API error:', result)
      throw new Error(result.error?.message || 'Erreur inconnue Sanity')
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result }),
    }
  } catch (error) {
    console.error('❌ Erreur createSanityDoc.js:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Erreur serveur interne',
        stack: error.stack,
      }),
    }
  }
}
