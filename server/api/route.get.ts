export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const fromLat = parseFloat(query.fromLat as string)
  const fromLon = parseFloat(query.fromLon as string)
  const toLat = parseFloat(query.toLat as string)
  const toLon = parseFloat(query.toLon as string)

  if ([fromLat, fromLon, toLat, toLon].some((n) => Number.isNaN(n))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid coordinates' })
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson`

  const response = await fetch(url)
  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: 'Routing failed' })
  }

  const data = await response.json()
  const route = data.routes?.[0]

  if (!route) {
    throw createError({ statusCode: 404, statusMessage: 'No route found' })
  }

  const coordinates = route.geometry.coordinates.map(
    ([lon, lat]: [number, number]) => [lat, lon] as [number, number]
  )

  return {
    coordinates,
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60
  }
})
