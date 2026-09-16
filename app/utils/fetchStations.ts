// Utility to fetch gas station data from local JSON file
export interface Station {
  id: string
  name: string
  brand: string
  address: string
  city: string
  hours: string
  latitude: number
  longitude: number
  fuels: string[]
  price?: number
  type?: string
  dist?: number
}

export async function fetchStations(): Promise<Station[]> {
  try {
    // Fetch stations from the backend API (SQLite DB)
    const response = await fetch('/api/stations')
    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.status}`)
    }
    const data = await response.json()
    // Map DB rows to Station interface
    const stations: Station[] = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      address: row.address,
      city: row.city,
      hours: row.hours,
      latitude: row.latitude,
      longitude: row.longitude,
      fuels: row.fuel_type ? row.fuel_type.split(',').map((s: string) => s.trim()) : [],
      price: row.price,
      type: row.station_type,
      dist: Math.random() * 5 + 0.5,
    }))
    console.log(`Loaded ${stations.length} stations from SQLite DB via API`)
    return stations
    const stationsData = await import('~/data/stations.json')

    if (!stationsData.default || !Array.isArray(stationsData.default)) {
      throw new Error('Invalid stations data format')
    }

    // Add sample prices for now (in production, fetch from cenagoriva.rs)
    const mappedStations = stationsData.default.map((s: any, index: number) => {
      if (!s.id || !s.latitude || !s.longitude) {
        console.warn(`Invalid station data at index ${index}:`, s)
        return null
      }

      return {
        id: s.id,
        name: s.name || 'Unknown Station',
        brand: s.brand || 'Unknown',
        address: s.address || '',
        city: s.city || '',
        hours: s.hours || '',
        latitude: s.latitude,
        longitude: s.longitude,
        fuels: Array.isArray(s.fuels) ? s.fuels : [],
        // Add sample price based on fuel type
        price: s.fuels?.includes('Euro Diesel') ? 195.0 :
          s.fuels?.includes('BMB 95') ? 186.0 :
            s.fuels?.includes('TNG/LPG') ? 89.0 : 190.0,
        // For compatibility with existing code
        type: s.brand?.includes('NIS') ? 'NIS' :
          s.brand?.includes('OMV') ? 'OMV' :
            s.brand?.includes('MOL') ? 'MOL' : 'Eco',
        dist: Math.random() * 5 + 0.5 // Random distance for demo
      }
    })

    const stations = mappedStations.filter((s): s is NonNullable<typeof mappedStations[number]> => s !== null)

    console.log(`Loaded ${stations.length} valid stations from JSON file`)
    return stations

  } catch (error) {
    console.error('Error loading stations:', error)
    // Return fallback data instead of empty array
    console.warn('Using fallback sample stations')
    return sampleStations
  }
}

// Fallback sample data if fetch fails
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
