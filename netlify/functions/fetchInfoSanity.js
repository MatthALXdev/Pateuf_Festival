/**
 * 🔐 Function Netlify sécurisée avec Auth0 JWT
 * Permet de récupérer les infos depuis Sanity uniquement si l'utilisateur est authentifié
 */

import { verifyAuth0Token } from './_utils/verifyAuth0JWT.js'

export const handler = async (event) => {
  // 🔐 Vérification du token JWT dans l'en-tête Authorization
  const authHeader = event.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized: missing or invalid token' }),
    }
  }

  const token = authHeader.split(' ')[1]

  try {
    await verifyAuth0Token(token)
  } catch (err) {
    console.error('JWT verification failed:', err.message)
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden: invalid token' }),
    }
  }

  console.log("🔍 Vérification des variables d'environnement Netlify")
  console.log('SANITY_PROJECT_ID:', process.env.SANITY_PROJECT_ID)
  console.log('SANITY_DATASET:', process.env.SANITY_DATASET)
  console.log(
    'SANITY_ACCESS_ADMIN_TOKEN:',
    process.env.SANITY_ACCESS_ADMIN_TOKEN ? '✅ OK' : '❌ Manquant',
  )

  if (
    !process.env.SANITY_PROJECT_ID ||
    !process.env.SANITY_DATASET ||
    !process.env.SANITY_ACCESS_ADMIN_TOKEN
  ) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "⚠️ Une ou plusieurs variables d'environnement Sanity sont manquantes.",
      }),
    }
  }

  try {
    const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID
    const SANITY_DATASET = process.env.SANITY_DATASET
    const query = encodeURIComponent(
      '*[_type == "info"]{infoID, logo{asset->{url}}, infoDescription}',
    )
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${SANITY_DATASET}?query=${query}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.SANITY_ACCESS_ADMIN_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      statusCode: 200,
      body: JSON.stringify({ result: data.result }),
    }
  } catch (error) {
    console.error('Error fetching data from Sanity:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
