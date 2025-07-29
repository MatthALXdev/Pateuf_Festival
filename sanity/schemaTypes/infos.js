export default {
  name: 'info',
  type: 'document',
  title: 'Info',
  fields: [
    {
      name: 'infoID',
      type: 'string',
      title: 'Info ID',
      description: "Identifiant unique pour l'info",
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      type: 'image',
      title: 'Logo',
      description: 'Image associée à cette info',
      options: {
        hotspot: true, // Permet de définir une zone focus sur l'image
      },
    },
    {
      name: 'infoDescription',
      type: 'text',
      title: 'Description',
      description: "Texte descriptif de l'information",
      validation: (Rule) => Rule.required().min(10).max(200),
    },{
  name: 'order',
  type: 'number',
  title: 'Ordre d’apparition',
  description: 'Plus petit = affiché en premier',
  validation: Rule => Rule.required().min(0),
  initialValue: 0,
},
  ],
}
