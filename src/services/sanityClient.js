import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Charger les variables d'environnement depuis le fichier .env
dotenv.config()

export const client = createClient({
  projectId: 'rgoopuri', // ID du projet Sanity
  dataset: 'pateuf_private', // Dataset utilisé
  useCdn: false, // false pour éviter le cache lors des requêtes en développement
  apiVersion: '2022-03-07', // Version de l'API Sanity
  token: '', // Token d'accès sécurisé
})
