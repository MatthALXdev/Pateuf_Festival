// services/getPolygonCenter.js

export function getPolygonCenter(coordinates) {
  let lngSum = 0
  let latSum = 0
  let count = 0

  // Si c'est un Polygon, les coordonnées sont sous forme de tableau imbriqué
  coordinates[0].forEach(coord => {
    lngSum += coord[0] // longitude
    latSum += coord[1] // latitude
    count++
  })

  // Calcul du centre en prenant la moyenne des coordonnées
  const centerLng = lngSum / count
  const centerLat = latSum / count

  return [centerLng, centerLat] // Retourner les coordonnées du centre
}
