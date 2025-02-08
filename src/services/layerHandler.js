import { getPolygonCenter } from '@/services/getPolygonCenter'

// Initialisation des variables pour stocker l'état des fonctionnalités survolées et sélectionnées
let hoveredMapZoneId = null
let hoveredMarkerMapId = null
let selectedMapZoneId = null
let selectedMarkerMapId = null

// Fonction pour sélectionner une entité sur la carte
export function selectFeature(
  feature,
  selectedFeature,
  isExpanded,
  coordinates,
  overlay,
) {
  if (feature && feature.geometry) {
    selectedFeature.value = feature
    isExpanded.value = true
    const geometry = feature.geometry
    coordinates.value =
      geometry.type === 'Point'
        ? geometry.coordinates
        : getPolygonCenter(geometry.coordinates)
    overlay.style.display = 'block'
  }
}
// Fonction pour configurer les événements des couches
export function setupLayerEvents(map, selectFeature) {
  let isMarkerMapHovered = false

  // Gestion des événements pour 'markerLayer'
  map.on('mousemove', 'markerLayer', e => {
    isMarkerMapHovered = true
    resetMapZoneHover(map) // Réinitialiser le survol de mapZone
    handleMarkerMapHover(map, e) // Gérer le survol de markerLayer
  })
  map.on('mouseleave', 'markerLayer', () => {
    isMarkerMapHovered = false
    resetMarkerMapHover(map) // Réinitialiser le survol de markerLayer
  })
  map.on('click', 'markerLayer', e => {
    handleMarkerMapSelect(map, e, selectFeature) // Gérer la sélection de markerLayer
  })

  // Gestion des événements pour 'mapZoneLayer'
  map.on('mousemove', 'mapZoneLayer', e => {
    if (!isMarkerMapHovered) {
      handleMapZoneHover(map, e) // Gérer le survol de mapZone
    }
  })
  map.on('mouseleave', 'mapZoneLayer', () => {
    if (!isMarkerMapHovered) {
      resetMapZoneHover(map) // Réinitialiser le survol de mapZone
    }
  })
  map.on('click', 'mapZoneLayer', e => {
    if (!isMarkerMapHovered) {
      handleMapZoneSelect(map, e, selectFeature) // Gérer la sélection de mapZone
    }
  })
}

// Fonction pour gérer le survol de 'mapZoneLayer'
function handleMapZoneHover(map, e) {
  if (!e.features || e.features.length === 0) {
    return
  }

  const feature = e.features[0]
  const sourceName = 'mapZoneSource'
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

// Fonction pour réinitialiser le survol de 'mapZoneLayer'
function resetMapZoneHover(map) {
  if (hoveredMapZoneId !== null) {
    map.setFeatureState(
      { source: 'mapZoneSource', id: hoveredMapZoneId },
      { hover: false },
    )
    hoveredMapZoneId = null
  }
  map.getCanvas().style.cursor = ''
}

// Fonction pour gérer la sélection de 'mapZoneLayer'
function handleMapZoneSelect(map, e, selectFeature) {
  if (!e.features || e.features.length === 0) {
    return
  }

  const feature = e.features[0]
  const sourceName = 'mapZoneSource'
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

// Fonction pour gérer le survol de 'markerLayer'
function handleMarkerMapHover(map, e) {
  if (!e.features || e.features.length === 0) {
    return
  }

  const feature = e.features[0]
  const sourceName = 'iconSource'
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

// Fonction pour réinitialiser le survol de 'markerLayer'
function resetMarkerMapHover(map) {
  if (hoveredMarkerMapId !== null) {
    map.setFeatureState(
      { source: 'iconSource', id: hoveredMarkerMapId },
      { hover: false },
    )
    hoveredMarkerMapId = null
  }
  map.getCanvas().style.cursor = ''
}

// Fonction pour gérer la sélection de 'markerLayer'
function handleMarkerMapSelect(map, e, selectFeature) {
  if (!e.features || e.features.length === 0) {
    return
  }

  const feature = e.features[0]
  const sourceName = 'iconSource'
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
export function resetLayerAndMap(map) {
  // Réinitialiser la vue de la carte
  map.flyTo({
    center: [1.1451961205377867, 47.45770024379996],
    zoom: 14.7,
    essential: true,
  })

  // Réinitialiser tous les états 'hover' et 'selected'
  if (hoveredMapZoneId !== null) {
    map.setFeatureState(
      { source: 'mapZoneSource', id: hoveredMapZoneId },
      { hover: false },
    )
    hoveredMapZoneId = null
  }
  if (hoveredMarkerMapId !== null) {
    map.setFeatureState(
      { source: 'iconSource', id: hoveredMarkerMapId },
      { hover: false },
    )
    hoveredMarkerMapId = null
  }
  if (selectedMapZoneId !== null) {
    map.setFeatureState(
      { source: 'mapZoneSource', id: selectedMapZoneId },
      { selected: false },
    )

    selectedMapZoneId = null
  }
  if (selectedMarkerMapId !== null) {
    map.setFeatureState(
      { source: 'iconSource', id: selectedMarkerMapId },
      { selected: false },
    )
    selectedMarkerMapId = null
  } // Réinitialiser le style du curseur
  map.getCanvas().style.cursor = ''
}

// Dans services/mapHandler.js
