export type FuelFilter = 'all' | 'eurodiesel' | 'bmb95' | 'lpg'

export interface MapStation {
  id: string
  name: string
  brand: string
  address: string
  city: string
  hours?: string
  latitude: number
  longitude: number
  fuels: string[]
  price?: number
  type?: string
}

export function stationHasFuel(station: MapStation, filter: FuelFilter): boolean {
  if (filter === 'all') return true
  const fuels = station.fuels.map((f) => f.toLowerCase())

  switch (filter) {
    case 'eurodiesel':
      return fuels.some((f) => f.includes('diesel') || f.includes('dizel'))
    case 'bmb95':
      return fuels.some((f) => f.includes('bmb') || f.includes('95') || f.includes('benzin') || f.includes('euro super'))
    case 'lpg':
      return fuels.some((f) => f.includes('lpg') || f.includes('tng') || f.includes('autogas'))
    default:
      return true
  }
}

export function getSamplePrice(station: MapStation, filter: FuelFilter): number {
  const fuels = station.fuels.map((f) => f.toLowerCase())
  if (filter === 'lpg' || fuels.some((f) => f.includes('lpg') || f.includes('tng'))) {
    if (fuels.some((f) => f.includes('lpg') || f.includes('tng'))) return 85 + (station.id.length % 5)
  }
  if (filter === 'bmb95' || fuels.some((f) => f.includes('bmb') || f.includes('95'))) {
    if (fuels.some((f) => f.includes('bmb') || f.includes('95'))) return 186 + (station.id.length % 8)
  }
  return 194 + (station.id.length % 6)
}

export function getMaxMarkersForZoom(zoom: number): number {
  if (zoom <= 7) return 30
  if (zoom <= 9) return 80
  if (zoom <= 11) return 200
  if (zoom <= 13) return 500
  return 2000
}

interface BoundsLike {
  getNorth(): number
  getSouth(): number
  getEast(): number
  getWest(): number
  contains(latlng: [number, number]): boolean
}

/** Grid-sample stations so zoomed-out views stay fast while zoomed-in views show nearby detail. */
export function selectStationsForViewport(
  stations: MapStation[],
  bounds: BoundsLike,
  zoom: number
): MapStation[] {
  const inBounds = stations.filter((s) =>
    bounds.contains([s.latitude, s.longitude])
  )

  const max = getMaxMarkersForZoom(zoom)
  if (inBounds.length <= max) return inBounds

  const latSpan = bounds.getNorth() - bounds.getSouth()
  const lngSpan = bounds.getEast() - bounds.getWest()
  if (latSpan <= 0 || lngSpan <= 0) return inBounds.slice(0, max)

  const aspect = lngSpan / latSpan
  const gridCols = Math.max(1, Math.ceil(Math.sqrt(max * aspect)))
  const gridRows = Math.max(1, Math.ceil(max / gridCols))

  const cells = new Map<string, MapStation>()

  for (const station of inBounds) {
    const col = Math.min(
      gridCols - 1,
      Math.floor(((station.longitude - bounds.getWest()) / lngSpan) * gridCols)
    )
    const row = Math.min(
      gridRows - 1,
      Math.floor(((bounds.getNorth() - station.latitude) / latSpan) * gridRows)
    )
    const key = `${row}-${col}`
    if (!cells.has(key)) cells.set(key, station)
  }

  return Array.from(cells.values()).slice(0, max)
}

export function enrichStation(station: MapStation, fuelFilter: FuelFilter): MapStation {
  return {
    ...station,
    price: getSamplePrice(station, fuelFilter),
    type: station.brand?.includes('NIS') ? 'nis'
      : station.brand?.includes('OMV') ? 'omv'
      : station.brand?.includes('MOL') ? 'mol'
      : 'nis'
  }
}
