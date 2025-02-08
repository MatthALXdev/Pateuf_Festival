// schemas/iconFeature.js
export default {
  name: 'iconFeature',
  title: 'Icon Feature',
  type: 'document',
  fields: [
    {
      name: 'isMarker',
      title: "C'est un marqueur ?",
      type: 'boolean',
    },
    {
      name: 'ActivityGroupName',
      title: 'Activity Group Name',
      type: 'string',
    },
    {
      name: 'iconSize',
      title: 'Icon Size',
      type: 'number',
    },
    {
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
    },
    {
      name: 'geometry',
      title: 'Geometry',
      type: 'object',
      fields: [
        {
          name: 'coordinates',
          title: 'Coordinates',
          type: 'array',
          of: [{type: 'number'}],
        },
        {
          name: 'type',
          title: 'Geometry Type',
          type: 'string',
          initialValue: 'Point',
          readOnly: true,
        },
      ],
    },
    {
      name: 'id',
      title: 'Feature ID',
      type: 'number',
    },
  ],
}
