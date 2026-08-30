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
    // Import the stations data from the JSON file
    const stationsData = await import('~/data/stations.json')
    
    // Add sample prices for now (in production, fetch from cenagoriva.rs)
    const stations: Station[] = stationsData.default.map((s: any, index: number) => ({
      id: s.id,
      name: s.name,
      brand: s.brand,
      address: s.address,
      city: s.city,
      hours: s.hours,
      latitude: s.latitude,
      longitude: s.longitude,
      fuels: s.fuels,
      // Add sample price based on fuel type
      price: s.fuels.includes('Euro Diesel') ? 195.0 : 
             s.fuels.includes('BMB 95') ? 186.0 : 
             s.fuels.includes('TNG/LPG') ? 89.0 : 190.0,
      // For compatibility with existing code
      type: s.brand.includes('NIS') ? 'NIS' : 
             s.brand.includes('OMV') ? 'OMV' : 
             s.brand.includes('MOL') ? 'MOL' : 'Eco',
      dist: Math.random() * 5 + 0.5 // Random distance for demo
    }))

    console.log(`Loaded ${stations.length} stations from JSON file`)
    return stations

  } catch (error) {
    console.error('Error loading stations:', error)
    return []
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
    phone: '011-123-456',
    latitude: 44.816,
    longitude: 20.461,
    fuels: ['EVRO PREMIJUM BMB-95', 'EVRO DIZEL', 'AUTOGAS TNG'],
    priceEuroDiesel: 195.0,
    priceBMB95: 186.0,
    priceLPG: 89.0,
  },
  {
    id: '2',
    name: 'NIS Petrol Novi Sad',
    brand: 'NIS Petrol',
    address: 'Bulevar Oslobodjenja 5',
    city: 'Novi Sad',
    phone: '021-456-789',
    latitude: 45.254,
    longitude: 19.842,
    fuels: ['EVRO PREMIJUM BMB-95', 'EVRO DIZEL'],
    priceEuroDiesel: 195.0,
    priceBMB95: 186.0,
  },
  {
    id: '3',
    name: 'Gazprom Petrol Niš',
    brand: 'Gazprom Petrol',
    address: 'Bulevar 12. Februar 15',
    city: 'Niš',
    phone: '018-123-456',
    latitude: 43.324,
    longitude: 21.895,
    fuels: ['EVRO PREMIJUM BMB-95', 'EVRO DIZEL', 'G-DRIVE DIZEL'],
    priceEuroDiesel: 199.0,
    priceBMB95: 188.0,
  },
  {
    id: '4',
    name: 'NIS Petrol Kragujevac',
    brand: 'NIS Petrol',
    address: 'Sumadijska 25',
    city: 'Kragujevac',
    phone: '034-123-456',
    latitude: 44.017,
    longitude: 20.917,
    fuels: ['EVRO PREMIJUM BMB-95', 'EVRO DIZEL'],
    priceEuroDiesel: 195.0,
    priceBMB95: 186.0,
  },
  {
    id: '5',
    name: 'NIS Petrol Subotica',
    brand: 'NIS Petrol',
    address: 'Futoski put 10',
    city: 'Subotica',
    phone: '024-123-456',
    latitude: 46.099,
    longitude: 19.667,
    fuels: ['EVRO PREMIJUM BMB-95', 'EVRO DIZEL', 'AUTOGAS TNG'],
    priceEuroDiesel: 195.0,
    priceBMB95: 186.0,
    priceLPG: 89.0,
  },
]
