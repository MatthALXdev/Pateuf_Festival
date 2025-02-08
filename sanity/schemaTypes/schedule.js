export default {
  name: 'schedule',
  type: 'document',
  title: 'Programmation',
  fields: [
    {
      name: 'id',
      title: "Identifiant de l'événement",
      type: 'string',
    },
    {
      name: 'name',
      title: "Nom de l'événement",
      type: 'string',
    },
    {
      name: 'order',
      title: "Ordre d'apparition",
      type: 'number',
    },
    {
      name: 'duration',
      title: 'Durée (en minutes)',
      type: 'number',
    },
    {
      name: 'preptime',
      title: 'Temps de préparation (en minutes)',
      type: 'number',
    },
    {
      name: 'location',
      title: 'Lieu',
      type: 'string',
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'YYYYMMDD',
      },
    },
    {
      name: 'labels',
      title: 'Catégorie',
      type: 'string',
    },
    {
      name: 'day',
      title: 'Jour du festival',
      type: 'number',
    },
    {
      name: 'start',
      title: 'Heure de début',
      type: 'string',
      description: 'Format: HH:mm (Time Picker prévu dans le front-end)',
    },
    {
      name: 'end',
      title: 'Heure de fin',
      type: 'string',
      description: 'Format: HH:mm (Time Picker prévu dans le front-end)',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'logoURL',
      title: 'Logo de la catégorie',
      type: 'string',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'backGroundActivity',
      title: 'Activité de fond',
      type: 'boolean',
    },
  ],
}
