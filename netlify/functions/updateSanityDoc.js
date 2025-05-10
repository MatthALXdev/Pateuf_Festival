export const handler = async (event) => {
  // 🔐 Vérification des variables d'environnement
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET
  const token = process.env.SANITY_ACCESS_ADMIN_TOKEN

  if (!projectId || !dataset || !token) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: '⛔ Variables d’environnement Sanity manquantes.',
      }),
    }
  }

  // 🔎 Extraction des données de la requête
  const { schema, id, data } = JSON.parse(event.body || '{}')

  if (!schema || !id || !data || typeof data !== 'object') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: '⛔ Requête invalide : schema, id et data sont requis.',
      }),
    }
  }

  // 🔧 Construction de la mutation
  const mutation = {
    patch: {
      id,
      set: data,
      // optional: if you want to auto-create if it doesn't exist
      // ifMissing: 'create'
    },
  }

  const url = `https://${projectId}.api.sanity.io/v2022-03-07/data/mutate/${dataset}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations: [mutation] }),
    })

    const result = await response.json()

    if (!response.ok || result.error) {
      throw new Error(result.error?.message || 'Erreur inconnue Sanity')
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result }),
    }
  } catch (error) {
    console.error('❌ Erreur updateSanityDoc.js:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
