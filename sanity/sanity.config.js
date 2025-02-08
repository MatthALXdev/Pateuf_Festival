import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Pateuf CMS',

  projectId: 'rgoopuri',
  dataset: 'pateuf_private',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
