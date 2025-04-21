import { client } from './sanityClient.js'
import dotenv from 'dotenv'

dotenv.config()

console.log('Sanity Token utilisé :', process.env.VITE_APP_SANITY_ACCESS_TOKEN)

const updateScheduleImages = async () => {
  try {
    // Récupérer les documents schedule existants
    const docs = await client.fetch(
      `*[_type == "schedule"]{_id, image, logoURL}`,
    )

    console.log('Documents trouvés :', docs) // Debugging

    if (docs.length === 0) {
      console.log('Aucun document à mettre à jour.')
      return
    }

    // Appliquer les mises à jour sur chaque document
    await Promise.all(
      docs.map(doc =>
        client.patch(doc._id).set({ image: null, logoURL: null }).commit(),
      ),
    )

    console.log(`${docs.length} documents 'schedule' mis à jour avec succès !`)
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour :', error)
  }
}

const testConnection = async () => {
  try {
    const testFetch = await client.fetch(`*[]{_type, _id}`)
    console.log('✅ Test connexion Sanity réussi :', testFetch)
  } catch (error) {
    console.error('❌ Erreur connexion Sanity :', error)
  }
}

testConnection()
updateScheduleImages()
