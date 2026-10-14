import type { MapStation } from '~/utils/mapStations'
import { getSamplePrice } from '~/utils/mapStations'

export interface Station extends MapStation {
  dist?: number
}

function mapRowToStation(row: Record<string, unknown>): Station | null {
  const id = row.id != null ? String(row.id) : ''
  const latitude = Number(row.latitude)
  const longitude = Number(row.longitude)

  if (!id || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  const fuelType = row.fuel_type != null ? String(row.fuel_type) : ''
  const fuels = fuelType
    ? fuelType.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const brand = row.brand != null ? String(row.brand) : 'Unknown'

  const station: Station = {
    id,
    name: row.name != null ? String(row.name) : 'Unknown Station',
    brand,
    address: row.address != null ? String(row.address) : '',
    city: row.city != null ? String(row.city) : '',
    hours: row.hours != null ? String(row.hours) : '',
    latitude,
    longitude,
    fuels,
    price: getSamplePrice({ id, fuels, brand } as MapStation, 'all'),
    type: brand.includes('NIS') ? 'NIS'
      : brand.includes('OMV') ? 'OMV'
        : brand.includes('MOL') ? 'MOL'
          : 'Eco',
  }

  return station
}

export async function fetchStations(): Promise<Station[]> {
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase as string
    
    const response = await $fetch<{ data: Record<string, unknown>[]; total: number }>(`${apiBase}/api/stations`)

    if (!response || !Array.isArray(response.data)) {
      throw new Error('Invalid stations response')
    }

    const stations = response.data
      .map(mapRowToStation)
      .filter((s): s is Station => s !== null)

    if (stations.length === 0) {
      console.warn('No stations returned from database, using fallback')
      return sampleStations
    }

    console.log(`Loaded ${stations.length} stations from API`)
    return stations
  } catch (error) {
    console.error('Error loading stations from API:', error)
    console.warn('Using fallback sample stations')
    return sampleStations
  }
}

export const sampleStations: Station[] = [
  {
    id: '1',
    name: 'NIS Petrol Beograd Centar',
    brand: 'NIS Petrol',
    address: 'Knez Mihailova 10',
    city: 'Beograd',
    hours: '00-24',
    latitude: 44.816,
    longitude: 20.461,
    fuels: ['EVRO PREMIJUM BMB-95', 'EVRO DIZEL', 'AUTOGAS TNG'],
    price: 195.0,
    type: 'NIS',
  },
  {
    id: '2',
    name: 'NIS Petrol Novi Sad',
    brand: 'NIS Petrol',
    address: 'Bulevar Oslobodjenja 5',
    city: 'Novi Sad',
    hours: '06-22',
    latitude: 45.254,
    longitude: 19.842,
    fuels: ['EVRO PREMIJUM BMB-95', 'EVRO DIZEL'],
    price: 195.0,
    type: 'NIS',
  },
  {
    id: '3',
    name: 'Gazprom Petrol Niš',
    brand: 'Gazprom Petrol',
    address: 'Bulevar 12. Februar 15',
    city: 'Niš',
    hours: '00-24',
    latitude: 43.324,
    longitude: 21.895,
    fuels: ['EVRO PREMIJUM BMB-95', 'EVRO DIZEL', 'G-DRIVE DIZEL'],
    price: 199.0,
    type: 'Eco',
  },
  {
    id: '4',
    name: 'NIS Petrol Kragujevac',
    brand: 'NIS Petrol',
    address: 'Sumadijska 25',
    city: 'Kragujevac',
    hours: '06-22',
    latitude: 44.017,
    longitude: 20.917,
    fuels: ['EVRO PREMIJUM BMB-95', 'EVRO DIZEL'],
    price: 195.0,
    type: 'NIS',
  },
  {
    id: '5',
    name: 'NIS Petrol Subotica',
    brand: 'NIS Petrol',
    address: 'Futoski put 10',
    city: 'Subotica',
    hours: '00-24',
    latitude: 46.099,
    longitude: 19.667,
    fuels: ['EVRO PREMIJUM BMB-95', 'EVRO DIZEL', 'AUTOGAS TNG'],
    price: 195.0,
    type: 'NIS',
  },
]
