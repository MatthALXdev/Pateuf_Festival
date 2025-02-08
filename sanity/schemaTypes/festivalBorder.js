// schemas/festivalBorderCoordinates.js
export default {
  name: 'festivalBorderCoordinates',
  title: 'Festival Border Coordinates',
  type: 'document',
  fields: [
    {
      name: 'coordinates',
      title: 'Coordinates',
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
  ],
}
