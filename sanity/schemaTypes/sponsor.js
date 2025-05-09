export default {
  name: 'sponsor',
  title: 'Sponsors',
  type: 'document',
  fields: [
    {name: 'name', type: 'string', title: 'Nom'},
    {name: 'url', type: 'url', title: 'Lien (facultatif)'},
    {
      name: 'logo',
      type: 'image',
      title: 'Logo',
      options: {hotspot: true},
    },
    {name: 'ordre', type: 'number', title: 'Ordre d’affichage'},
  ],
}
