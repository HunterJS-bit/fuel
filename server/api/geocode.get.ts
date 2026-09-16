export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const q = query.q as string

  if (!q?.trim()) return []

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '5')
  url.searchParams.set('countrycodes', 'rs')

  const response = await fetch(url.toString(), {
    headers: { 'User-Agent': 'FuelCalc/1.0 (fuel price app)' }
  })

  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: 'Geocoding failed' })
  }

  const results = await response.json()

  return results.map((item: { lat: string; lon: string; display_name: string }) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    displayName: item.display_name
  }))
})
