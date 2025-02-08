// Fonction pour initialiser les sources et les couches sur la carte
export async function initializeMapSources(
  map,
  festivalBorder,
  mapZone,
  iconData,
) {
  // Ajout de la source des zones de carte
  map.addSource('festivalBorderSource', {
    type: 'geojson',
    data: festivalBorder,
  })

  // Ajout de la source des marqueurs
  map.addSource('iconSource', {
    type: 'geojson',
    data: iconData,
  })

  map.addSource('mapZoneSource', {
    type: 'geojson',
    data: mapZone,
  })

  // Ajout des couches
  if (!map.getLayer('festivalBorderLayer')) {
    map.addLayer({
      id: 'festivalBorderLayer',
      type: 'fill',
      source: 'festivalBorderSource',
      paint: {
        'fill-color': '#B3755A',
      },
    })
  }

  if (!map.getLayer('mapZoneLayer')) {
    map.addLayer({
      id: 'mapZoneLayer',
      type: 'fill',
      source: 'mapZoneSource',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#a7643a',
          ['boolean', ['feature-state', 'hover'], false],
          '#d6ac57',
          ['boolean', ['feature-state', 'invisible'], false],
          '#d3d3d3',
          '#e5c992',
        ],
      },
    })
  }

  if (!map.getLayer('iconLayer')) {
    map.addLayer({
      id: 'iconLayer',
      type: 'symbol',
      source: 'iconSource',
      layout: {
        'icon-image': ['get', 'icon'],
        'icon-size': ['get', 'iconSize'],
        'icon-anchor': 'center',
        'icon-allow-overlap': true,
      },
      paint: {
        'icon-opacity': [
          'case',
          ['boolean', ['feature-state', 'hidden'], false],
          0,
          1,
        ],
      },
    })
  }

  if (!map.getLayer('markerLayer')) {
    map.addLayer({
      id: 'markerLayer',
      type: 'circle',
      source: 'iconSource',
      filter: ['==', ['get', 'isMarker'], true],
      paint: {
        'circle-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          1,
          1,
        ],
        'circle-radius': 20,
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#99B84F',
          '#d6ac57',
        ],
        'circle-stroke-width': [
          'case',
          [
            'all',
            ['boolean', ['feature-state', 'selected'], false],
            ['boolean', ['feature-state', 'hover'], false],
          ],
          2,
          [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            2,
            ['boolean', ['feature-state', 'hover'], false],
            2,
            0,
          ],
        ],
      },
    })
  }
  map.moveLayer('iconLayer')
}
