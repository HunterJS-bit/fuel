import express, { Request, Response } from 'express'
import { getSql } from '../db.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

interface ProviderPrice {
  eurodiesel: number
  bmb95: number
  lpg: number
  bmb100: number
}

interface Provider {
  id: number
  name: string
  slug: string
  initials: string
  color: string
  stations: number
  prices: ProviderPrice
  isLowest?: boolean
  lowestFor?: string | null
}

interface ProviderMetadata {
  slug: string
  initials: string
  color: string
}

// Provider metadata configuration
const PROVIDER_METADATA: Record<string, ProviderMetadata> = {
  'nis petrol': { slug: 'nis', initials: 'NIS', color: '#0066cc' },
  'omv': { slug: 'omv', initials: 'OMV', color: '#003da5' },
  'eco': { slug: 'eco', initials: 'ECO', color: '#2ecc71' },
  'mol': { slug: 'mol', initials: 'MOL', color: '#00843d' },
  'lukoil': { slug: 'lukoil', initials: 'LK', color: '#e30613' },
  'petrol': { slug: 'petrol', initials: 'PT', color: '#ff6600' },
  'knez petrol': { slug: 'knez', initials: 'KP', color: '#ffb300' },
  'eko': { slug: 'eko', initials: 'EK', color: '#e5b80b' }
}

const FUEL_TYPE_LABELS: Record<string, string> = {
  eurodiesel: 'Euro Diesel',
  bmb95: 'BMB 95',
  lpg: 'LPG',
  bmb100: 'BMB 100'
}

// GET /api/providers - Get provider summary with latest prices
router.get('/', async (req: Request, res: Response) => {
  try {
    const sql = getSql()
    
    // Fetch prices and station counts in parallel for better performance
    const [prices, stations] = await Promise.all([
      sql`
        SELECT brand, fuel_type, price_rsd
        FROM fuel_prices
        WHERE valid_to IS NULL
        ORDER BY brand, fuel_type
      `,
      sql`
        SELECT brand, COUNT(*) as station_count
        FROM stations
        WHERE brand IS NOT NULL
        GROUP BY brand
        ORDER BY brand
      `
    ])
    
    // Build price map: brand -> fuel_type -> price
    const priceMap = new Map<string, Record<string, number>>()
    for (const row of prices) {
      const brand = row.brand.toLowerCase()
      const fuelType = row.fuel_type.toLowerCase()
      
      if (!priceMap.has(brand)) {
        priceMap.set(brand, {})
      }
      priceMap.get(brand)![fuelType] = parseFloat(row.price_rsd)
    }
    
    // Build station count map: brand -> count
    const stationMap = new Map<string, number>()
    for (const row of stations) {
      stationMap.set(row.brand.toLowerCase(), Number(row.station_count))
    }
    
    // Build provider list with metadata
    const providers: Provider[] = Object.entries(PROVIDER_METADATA).map(
      ([brand, metadata], index) => {
        const brandLower = brand.toLowerCase()
        const prices = priceMap.get(brandLower) || {}
        
        return {
          id: index + 1,
          name: brand,
          slug: metadata.slug,
          initials: metadata.initials,
          color: metadata.color,
          stations: stationMap.get(brandLower) || 0,
          prices: {
            eurodiesel: prices.eurodiesel || prices['euro diesel'] || 0,
            bmb95: prices.bmb95 || prices['bmb 95'] || 0,
            lpg: prices.lpg || 0,
            bmb100: prices.bmb100 || prices['bmb 100'] || 0
          }
        }
      }
    )
    
    // Calculate lowest prices for each fuel type
    const fuelTypes: (keyof ProviderPrice)[] = ['eurodiesel', 'bmb95', 'lpg']
    const lowestPrices: Partial<Record<keyof ProviderPrice, number>> = {}
    
    for (const fuel of fuelTypes) {
      const validPrices = providers
        .map(p => p.prices[fuel])
        .filter(price => price > 0)
      
      if (validPrices.length > 0) {
        lowestPrices[fuel] = Math.min(...validPrices)
      }
    }
    
    // Mark providers with lowest prices
    for (const provider of providers) {
      let foundLowest = false
      for (const fuel of fuelTypes) {
        if (provider.prices[fuel] === lowestPrices[fuel]) {
          provider.isLowest = true
          provider.lowestFor = FUEL_TYPE_LABELS[fuel]
          foundLowest = true
          break
        }
      }
      if (!foundLowest) {
        provider.isLowest = false
        provider.lowestFor = null
      }
    }
    
    res.json(providers)
  } catch (error) {
    logger.error('Error fetching providers', error)
    res.status(500).json({ error: 'Failed to fetch providers' })
  }
})

export default router
