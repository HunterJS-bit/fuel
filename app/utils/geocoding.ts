export interface GeocodeResult {
  lat: number
  lon: number
  displayName: string
}

export interface RouteResult {
  coordinates: [number, number][]
  distanceKm: number
  durationMin: number
}

export async function geocodeAddress(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return []
  try {
    const data = await $fetch<GeocodeResult[]>('/api/geocode', { 
      query: { q: query },
      timeout: 10000
    })
    return data || []
  } catch (error) {
    console.error('Geocoding error:', error)
    return []
  }
}

export async function fetchRoute(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): Promise<RouteResult | null> {
  try {
    return await $fetch<RouteResult>('/api/route', {
      query: {
        fromLat,
        fromLon,
        toLat,
        toLon
      }
    })
  } catch {
    return null
  }
}

export function getGoogleMapsDirectionsUrl(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLon}&destination=${toLat},${toLon}&travelmode=driving`
}

export function getCurrentPosition(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}
