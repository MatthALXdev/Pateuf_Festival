export default {
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nom technique',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'title',
      title: 'Nom affiché',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Icône / logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'name',
      media: 'logo',
    },
  }
}
