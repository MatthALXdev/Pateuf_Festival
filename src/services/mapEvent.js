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
//Si tout séléctionné est clické alors maj du table checkgroupe à vide sinon
// checkgroup reprend la liste initiale à partir des données.
//Inverse allSelected
export function toggleSelectAllAndUpdateLayers(
  allSelected,
  checkedGroups,
  ActivityGroupsArray,
) {
  if (allSelected.value) {
    checkedGroups.value = []
  } else {
    checkedGroups.value = ActivityGroupsArray.map(group => group.name)
  }
  allSelected.value = !allSelected.value

  // Créer une nouvelle référence à checkedGroups pour déclencher le watch
  // A revoir lors d'intégration d'un état.
  checkedGroups.value = checkedGroups.value.slice()
}

export function updateLayers(map, ActivityGroupsArray, checkedGroups) {
  // Calculer les groupes non sélectionnés (uncheckedGroups)
  const uncheckedGroups = ActivityGroupsArray.map(group => group.name).filter(
    groupName => !checkedGroups.includes(groupName),
  )

  // Parcourir les fonctionnalités de mapZone pour mettre à jour leur état
  map
    .querySourceFeatures('mapZoneSource', { sourceLayer: 'mapZoneLayer' })
    .forEach(feature => {
      const groupName = feature.properties.ActivityGroupName

      // Vérifier si la fonctionnalité appartient aux groupes non sélectionnés
      const isInvisible = uncheckedGroups.includes(groupName)

      // Mettre à jour l'état `invisible`
      map.setFeatureState(
        { source: 'mapZoneSource', id: feature.id },
        { invisible: isInvisible },
      )
    })

  if (checkedGroups.length > 0) {
    map.setFilter('iconLayer', ['in', 'ActivityGroupName', ...checkedGroups])
    map.setFilter('markerLayer', [
      'all', // Combine plusieurs conditions
      ['==', 'isMarker', true], // Ne garder que les marqueurs
      ['in', 'ActivityGroupName', ...checkedGroups], // Appliquer le filtre de groupes cochés
    ])
  } else {
    // Si aucun groupe n'est coché, afficher uniquement les isMarker true
    map.setFilter('iconLayer', ['in', 'ActivityGroupName', ''])
    map.setFilter('markerLayer', ['in', 'ActivityGroupName', '']) // Ne plus écraser le filtre
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
