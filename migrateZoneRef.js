import createClient from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config() // Charge les variables d'environnement locales

const client = createClient({
  projectId: 'rgoopuri', // à adapter si différent
  dataset: 'pateuf_private',
  token: process.env.SANITY_ACCESS_ADMIN_TOKEN, // Doit être défini dans .env
  useCdn: false,
  apiVersion: '2023-05-01',
})

async function runMigration() {
  try {
    console.log('🔄 Récupération des zones...')
    const zones = await client.fetch(`*[_type == "zone"]{_id, name}`)
    const zoneMap = Object.fromEntries(zones.map(z => [z.name, z._id]))

    console.log('🔎 Récupération des schedules sans zoneRef...')
    const schedules = await client.fetch(
      `*[_type == "schedule" && !defined(zoneRef)]{_id, location}`,
    )

    console.log(`🔧 ${schedules.length} à traiter`)

    for (const schedule of schedules) {
      const zoneId = zoneMap[schedule.location]
      if (zoneId) {
        await client
          .patch(schedule._id)
          .set({ zoneRef: { _type: 'reference', _ref: zoneId } })
          .commit()

        console.log(`✅ ${schedule._id} mis à jour → zoneRef: ${zoneId}`)
      } else {
        console.warn(
          `❌ Aucun match pour ${schedule._id} (location: ${schedule.location})`,
        )
      }
    }

    console.log('🎉 Migration terminée.')
  } catch (err) {
    console.error('❌ Erreur pendant la migration :', err)
  }
}

runMigration()
