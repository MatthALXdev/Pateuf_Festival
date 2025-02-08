export default {
  name: 'zone',
  type: 'document',
  title: 'Zone du festival',
  fields: [
    {
      name: 'name',
      title: 'Nom de la zone',
      type: 'string',
    },
    {
      name: 'ActivityGroupName',
      title: "Type de de point d'interêt",
      type: 'string',
    },
    {
      name: 'geometry',
      title: 'Coordonnées',
      type: 'object',
      fields: [
        {
          name: 'coordinates',
          title: 'Tableau de coordonnées',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'longitude',
                  title: 'Longitude',
                  type: 'number',
                },
                {
                  name: 'latitude',
                  title: 'Latitude',
                  type: 'number',
                },
              ],
            },
          ],
        },
        {
          name: 'type',
          title: 'Type de géometrie',
          type: 'string',
          initialValue: 'Polygon',
          readOnly: true,
        },
      ],
    },
    {
      name: 'id',
      title: 'Identifiant de la zone',
      type: 'number',
    },
  ],
}
