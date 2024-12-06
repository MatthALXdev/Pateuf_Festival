import { resetLayerAndMap } from './layerHandler'

export function closeDetails(
  selectedFeature,
  isExpanded,
  map,
  overlay,
  currentlyOnStage,
) {
  selectedFeature.value = null
  isExpanded.value = false

  if (currentlyOnStage) {
    currentlyOnStage.value = false
  }

  if (map) {
    resetLayerAndMap(map)
  }
  if (overlay) {
    overlay.style.display = 'none'
  }
}

export function toggleSelectAllAndUpdateLayers(
  allSelected,
  checkedGroups,
  groupFilterData,
) {
  if (allSelected.value) {
    checkedGroups.value = []
  } else {
    checkedGroups.value = groupFilterData.map(group => group.name)
  }
  allSelected.value = !allSelected.value

  // Créer une nouvelle référence à checkedGroups pour déclencher le watch
  checkedGroups.value = checkedGroups.value.slice()
}

// Dans services/mapEvent.js

export function updateLayers(map, groupFilterData, checkedGroups) {
  // Récupérer les icônes et ref-ids des groupes cochés
  const selectedIcons = []
  const selectedRefIds = []

  groupFilterData.forEach(group => {
    if (checkedGroups.includes(group.name)) {
      selectedIcons.push(...group.icons)
      if (group.name === 'Scènes') {
        group.refIds.forEach((refId, index) => {
          const icon = index < 3 ? 'music' : 'scene'
          selectedRefIds.push(`${refId}_${icon}`)
        })
      } else {
        group.refIds.forEach((refId, index) => {
          const icon = group.icons[index] || group.icons[group.icons.length - 1]
          selectedRefIds.push(`${refId}_${icon}`)
        })
      }
    }
  })

  // Appliquer le filtre aux couches en utilisant les icônes et ref-ids sélectionnés
  if (selectedIcons.length > 0) {
    map.setFilter('logomap-20241128', ['in', 'icon', ...selectedIcons])
  } else {
    map.setFilter('logomap-20241128', ['in', 'icon', ''])
  }

  if (selectedRefIds.length > 0) {
    map.setFilter('mapZone', ['in', 'ref-id', ...selectedRefIds])
    map.setFilter('markerMap', ['in', 'ref-id', ...selectedRefIds])
  } else {
    map.setFilter('mapZone', ['in', 'ref-id', ''])
    map.setFilter('markerMap', ['in', 'ref-id', ''])
  }
}

export function adjustCenterCoordinates(center, map, mapContainer) {
  if (map.value) {
    const centerOffsetY =
      map.value.unproject([
        mapContainer.value.offsetWidth / 2,
        mapContainer.value.offsetHeight / 2,
      ]).lat -
      map.value.unproject([
        mapContainer.value.offsetWidth / 2,
        mapContainer.value.offsetHeight / 4,
      ]).lat
    return { lng: center.lng, lat: center.lat + centerOffsetY }
  }
  return center
}
