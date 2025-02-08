import fetch from 'node-fetch'

export const handler = async event => {
  const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID
  const SANITY_DATASET = process.env.SANITY_DATASET
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' }
  }

  // 🔒 Vérifier l'utilisateur via Netlify Identity
  const user = JSON.parse(event.headers['x-netlify-identity-context'] || '{}')
  if (!user || !user.app_metadata || user.app_metadata.role !== 'admin') {
    return { statusCode: 403, body: 'Accès refusé' }
  }

  // ✅ Si admin, exécuter la requête
  const { item } = JSON.parse(event.body)
  const response = await fetch(
    `https://rgoopuri.api.sanity.io/v2022-03-07/data/mutate/pateuf_private`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SANITY_ACCESS_ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mutations: [{ create: item }],
      }),
    },
  )

  return response.ok
    ? { statusCode: 200, body: JSON.stringify({ message: 'Ajout réussi' }) }
    : { statusCode: 500, body: "Erreur lors de l'ajout" }
}
