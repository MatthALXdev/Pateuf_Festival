export default {
  name: 'category',
  type: 'document',
  title: 'Catégorie',
  fields: [
    {
      name: 'title',
      title: 'Nom de la catégorie',
      type: 'string',
    },
    {
      name: 'logo',
      title: 'Logo de la catégorie',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}
