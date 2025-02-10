export async function handler(event) {
  // Vérification des variables d'environnement
  console.log("🔍 Vérification des variables d'environnement Netlify")
  console.log('SANITY_PROJECT_ID:', process.env.SANITY_PROJECT_ID)
  console.log(
    'SANITY_ACCESS_TOKEN:',
    process.env.SANITY_ACCESS_TOKEN ? '✅ OK' : '❌ Manquant',
  )

  // Récupération du type de données depuis la requête
  const { dataset, query } = JSON.parse(event.body || '{}')

  if (!query || !dataset) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Requête invalide : dataset et query requis',
      }),
    }
  }

  // Vérification des variables d'environnement requises
  if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_ACCESS_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "⚠️ Une ou plusieurs variables d'environnement Sanity sont manquantes.",
      }),
    }
  }

  const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID
  const SANITY_ACCESS_TOKEN = process.env.SANITY_ACCESS_TOKEN

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${dataset}?query=${encodeURIComponent(query)}`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${SANITY_ACCESS_TOKEN}`,
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
      body: JSON.stringify({
        error: 'Erreur lors de la récupération des données depuis Sanity',
      }),
    }
  }
}
