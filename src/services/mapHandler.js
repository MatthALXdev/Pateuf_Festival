// Fonction pour initialiser les sources et les couches sur la carte
export function initializeMapSources(map, props) {
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
          0, // Opacité par défaut
        ],
        'circle-radius': 20, // Rayon des cercles
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#99B84F', // Couleur pour les fonctionnalités sélectionnées
          '#E5C992', // Couleur par défaut
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

// Initialisation des variables pour stocker l'état des fonctionnalités survolées et sélectionnées
let hoveredMapZoneId = null
let hoveredMarkerMapId = null
let selectedMapZoneId = null
let selectedMarkerMapId = null

// Fonction pour configurer les événements des couches
export function setupLayerEvents(map, selectFeature) {
  let isMarkerMapHovered = false

  // Gestion des événements pour 'markerMap'
  map.on('mousemove', 'markerMap', e => {
    isMarkerMapHovered = true
    resetMapZoneHover(map) // Réinitialiser le survol de mapZone
    handleMarkerMapHover(map, e) // Gérer le survol de markerMap
  })
  map.on('mouseleave', 'markerMap', () => {
    isMarkerMapHovered = false
    resetMarkerMapHover(map) // Réinitialiser le survol de markerMap
  })
  map.on('click', 'markerMap', e => {
    handleMarkerMapSelect(map, e, selectFeature) // Gérer la sélection de markerMap
  })

  // Gestion des événements pour 'mapZone'
  map.on('mousemove', 'mapZone', e => {
    if (!isMarkerMapHovered) {
      handleMapZoneHover(map, e) // Gérer le survol de mapZone
    }
  })
  map.on('mouseleave', 'mapZone', () => {
    if (!isMarkerMapHovered) {
      resetMapZoneHover(map) // Réinitialiser le survol de mapZone
    }
  })
  map.on('click', 'mapZone', e => {
    if (!isMarkerMapHovered) {
      handleMapZoneSelect(map, e, selectFeature) // Gérer la sélection de mapZone
    }
  })
}

// Fonction pour gérer le survol de 'mapZone'
function handleMapZoneHover(map, e) {
  if (!e.features || e.features.length === 0) {
    return
  }

  const feature = e.features[0]
  const sourceName = 'mapFile'
  const id = feature.id

  if (hoveredMapZoneId !== null && hoveredMapZoneId !== id) {
    map.setFeatureState(
      { source: sourceName, id: hoveredMapZoneId },
      { hover: false },
    )
  }

  hoveredMapZoneId = id

  map.setFeatureState(
    { source: sourceName, id: hoveredMapZoneId },
    { hover: true },
  )

  map.getCanvas().style.cursor = 'pointer'
}

// Fonction pour réinitialiser le survol de 'mapZone'
function resetMapZoneHover(map) {
  if (hoveredMapZoneId !== null) {
    map.setFeatureState(
      { source: 'mapFile', id: hoveredMapZoneId },
      { hover: false },
    )
    hoveredMapZoneId = null
  }
  map.getCanvas().style.cursor = ''
}

// Fonction pour gérer la sélection de 'mapZone'
function handleMapZoneSelect(map, e, selectFeature) {
  if (!e.features || e.features.length === 0) {
    return
  }

  const feature = e.features[0]
  const sourceName = 'mapFile'
  const id = feature.id

  if (selectedMapZoneId !== null && selectedMapZoneId !== id) {
    map.setFeatureState(
      { source: sourceName, id: selectedMapZoneId },
      { selected: false },
    )
  }

  selectedMapZoneId = id

  map.setFeatureState(
    { source: sourceName, id: selectedMapZoneId },
    { selected: true },
  )

  const geometry = feature.geometry

  // Appeler la fonction pour afficher les détails
  selectFeature({ ...feature, geometry })
}

// Fonction pour gérer le survol de 'markerMap'
function handleMarkerMapHover(map, e) {
  if (!e.features || e.features.length === 0) {
    return
  }

  const feature = e.features[0]
  const sourceName = 'markerFile'
  const id = feature.id

  if (hoveredMarkerMapId !== null && hoveredMarkerMapId !== id) {
    map.setFeatureState(
      { source: sourceName, id: hoveredMarkerMapId },
      { hover: false },
    )
  }

  hoveredMarkerMapId = id

  map.setFeatureState(
    { source: sourceName, id: hoveredMarkerMapId },
    { hover: true },
  )

  map.getCanvas().style.cursor = 'pointer'
}

// Fonction pour réinitialiser le survol de 'markerMap'
function resetMarkerMapHover(map) {
  if (hoveredMarkerMapId !== null) {
    map.setFeatureState(
      { source: 'markerFile', id: hoveredMarkerMapId },
      { hover: false },
    )
    hoveredMarkerMapId = null
  }
  map.getCanvas().style.cursor = ''
}

// Fonction pour gérer la sélection de 'markerMap'
function handleMarkerMapSelect(map, e, selectFeature) {
  if (!e.features || e.features.length === 0) {
    return
  }

  const feature = e.features[0]
  const sourceName = 'markerFile'
  const id = feature.id

  if (selectedMarkerMapId !== null && selectedMarkerMapId !== id) {
    map.setFeatureState(
      { source: sourceName, id: selectedMarkerMapId },
      { selected: false },
    )
  }

  selectedMarkerMapId = id

  map.setFeatureState(
    { source: sourceName, id: selectedMarkerMapId },
    { selected: true },
  )

  const geometry = feature.geometry

  // Appeler la fonction pour afficher les détails
  selectFeature({ ...feature, geometry })
}

// Fonction pour réinitialiser la carte à son état initial
export function resetMap(map) {
  // Réinitialiser la vue de la carte
  map.flyTo({
    center: [1.1451961205377867, 47.45770024379996],
    zoom: 14,
    essential: true,
  })

  // Réinitialiser tous les états 'hover' et 'selected'
  if (hoveredMapZoneId !== null) {
    map.setFeatureState(
      { source: 'mapFile', id: hoveredMapZoneId },
      { hover: false },
    )
    hoveredMapZoneId = null
  }
  if (hoveredMarkerMapId !== null) {
    map.setFeatureState(
      { source: 'markerFile', id: hoveredMarkerMapId },
      { hover: false },
    )
    hoveredMarkerMapId = null
  }
  if (selectedMapZoneId !== null) {
    map.setFeatureState(
      { source: 'mapFile', id: selectedMapZoneId },
      { selected: false },
    )

    selectedMapZoneId = null
  }
  if (selectedMarkerMapId !== null) {
    map.setFeatureState(
      { source: 'markerFile', id: selectedMarkerMapId },
      { selected: false },
    )
    selectedMarkerMapId = null
  } // Réinitialiser le style du curseur
  map.getCanvas().style.cursor = ''
}
