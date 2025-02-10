export async function handler(event) {
  console.log('🔍 [Netlify] Requête reçue avec event.body :', event.body)

  try {
    const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error('❌ Token Mapbox manquant !')
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Token Mapbox manquant.' }),
      }
    }
    console.log('✅ Token Mapbox récupéré avec succès')

    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken: MAPBOX_ACCESS_TOKEN }),
    }
  } catch (error) {
    console.error('❌ Erreur inattendue dans fetchMapboxData :', error)
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) }
  }
}
