import { createClient } from '@sanity/client'
import { verifyAuth0Token } from './_utils/verifyAuth0JWT.js'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_ACCESS_ADMIN_TOKEN,
})

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
    }
  }

  // 🔐 Vérification JWT Auth0
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

  try {
    const { type, orderedItems } = JSON.parse(event.body)

    if (!Array.isArray(orderedItems)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Format invalide : tableau attendu' }),
      }
    }

    const transaction = client.transaction()
    orderedItems.forEach(({ _id, order }) => {
      transaction.patch(_id, { set: { order } })
    })

    await transaction.commit()

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    }
  } catch (error) {
    console.error('Erreur Sanity order update :', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
