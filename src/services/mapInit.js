// Fonction pour initialiser les sources et les couches sur la carte
export async function initializeMapSources(map, props) {
  // Ajout de la source des zones de carte

  map.addSource('mapFile', {
    type: 'geojson',
    data: props.mapData,
  })
  // Ajout de la source des marqueurs
  map.addSource('markerFile', {
    type: 'geojson',
    data: props.logoMapData,
  })

  // Ajout de la couche pour les zones de carte
  if (!map.getLayer('mapZone')) {
    map.addLayer({
      id: 'mapZone',
      type: 'fill',
      source: 'mapFile',
      paint: {
        // Définir les couleurs de remplissage en fonction de l'état des fonctionnalités
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#a7643a', // Couleur pour les fonctionnalités sélectionnées
          ['boolean', ['feature-state', 'hover'], false],
          '#d6ac57', // Couleur pour les fonctionnalités survolées
          '#e5c992', // Couleur par défaut
        ],
      },
    })
  }

  // Ajout de la couche pour les marqueurs
  if (!map.getLayer('markerMap')) {
    map.addLayer({
      id: 'markerMap',
      type: 'circle',
      source: 'markerFile',
      paint: {
        // Définir l'opacité des cercles en fonction de l'état des fonctionnalités
        'circle-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          1, // Opacité pour les fonctionnalités sélectionnées
          1, // Opacité par défaut
        ],
        'circle-radius': 20, // Rayon des cercles
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#99B84F', // Couleur pour les fonctionnalités sélectionnées
          '#d6ac57', // Couleur par défaut
        ],
        'circle-stroke-width': [
          'case',
          [
            'all',
            ['boolean', ['feature-state', 'selected'], false],
            ['boolean', ['feature-state', 'hover'], false],
          ],
          2, // Épaisseur du contour lorsque sélectionné et survolé
          [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            2, // Épaisseur du contour lorsque sélectionné
            ['boolean', ['feature-state', 'hover'], false],
            2, // Épaisseur du contour lorsque survolé
            0, // Épaisseur du contour par défaut
          ],
        ],
      },
    })
  }

  // Déplacer la couche du logo Mapbox Studio au-dessus des autres couches
  const logoMapLayerId = 'logomap-20241128'
  map.moveLayer(logoMapLayerId)
}
