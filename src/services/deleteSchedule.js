import { client } from './sanityClient.js' // Assure-toi d'importer ton client Sanity
import dotenv from 'dotenv'
dotenv.config()

console.log('Sanity Token utilisé :', process.env.VITE_APP_SANITY_ACCESS_TOKEN)

const deleteAllSchedule = async () => {
  try {
    const ids = await client.fetch(`*[_type == "schedule"]{_id}`)

    console.log('Documents trouvés :', ids) // <-- TEST ICI

    if (ids.length === 0) {
      console.log('Aucun document à supprimer.')
      return
    }

    await Promise.all(ids.map(doc => client.delete(doc._id)))
    console.log(`${ids.length} documents 'schedule' supprimés !`)
  } catch (error) {
    console.error('Erreur de suppression :', error)
  }
}
const testConnection = async () => {
  try {
    const testFetch = await client.fetch(`*[]{_type, _id}`)
    console.log('Test connexion Sanity :', testFetch)
  } catch (error) {
    console.error('Erreur connexion Sanity :', error)
  }
}

testConnection()
deleteAllSchedule()
