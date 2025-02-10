export const handler = async () => {
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
