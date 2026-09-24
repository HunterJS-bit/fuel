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

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const GEOCODE_TTL = 60 * 60 * 1000 // 1 hour
const ROUTE_TTL = 30 * 60 * 1000 // 30 minutes

function getFromCache<T>(key: string): T | null {
  if (!process.client) return null
  
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null
    
    const entry: CacheEntry<T> = JSON.parse(cached)
    const now = Date.now()
    
    if (now - entry.timestamp > entry.ttl) {
      localStorage.removeItem(key)
      return null
    }
    
    return entry.data
  } catch {
    return null
  }
}

function setCache<T>(key: string, data: T, ttl: number): void {
  if (!process.client) return
  
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch (error) {
    console.warn('Failed to cache data:', error)
  }
}

export async function geocodeAddress(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return []
  
  const cacheKey = `geocode:${query.toLowerCase()}`
  const cached = getFromCache<GeocodeResult[]>(cacheKey)
  
  if (cached) {
    return cached
  }
  
  try {
    const data = await $fetch<GeocodeResult[]>('/api/geocode', { 
      query: { q: query },
      timeout: 10000
    })
    const results = data || []
    
    if (results.length > 0) {
      setCache(cacheKey, results, GEOCODE_TTL)
    }
    
    return results
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
  const cacheKey = `route:${fromLat.toFixed(4)},${fromLon.toFixed(4)}:${toLat.toFixed(4)},${toLon.toFixed(4)}`
  const cached = getFromCache<RouteResult>(cacheKey)
  
  if (cached) {
    return cached
  }
  
  try {
    const result = await $fetch<RouteResult>('/api/route', {
      query: {
        fromLat,
        fromLon,
        toLat,
        toLon
      }
    })
    
    if (result) {
      setCache(cacheKey, result, ROUTE_TTL)
    }
    
    return result
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
