export default {
  name: 'siteBranding',
  title: 'Identité visuelle',
  type: 'document',
  fields: [
    {
      name: 'logo',
      title: 'Logo principal',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'backgroundTop',
      title: 'Image de fond du haut de page',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'ticketImages',
      title: 'Images des types de ticket',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
        },
      ],
      validation: (Rule) => Rule.min(4).max(4).error('Il doit y avoir exactement 4 images'),
    },
  ],
}
