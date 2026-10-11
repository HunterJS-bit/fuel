import express, { Request, Response } from 'express'
import { getSql } from '../db.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// GET /api/fuel-prices - Get all fuel prices
router.get('/', async (req: Request, res: Response) => {
  try {
    const sql = getSql()
    const rows = await sql`
      SELECT id, brand, fuel_type, price_rsd, valid_from, valid_to
      FROM fuel_prices
      ORDER BY valid_from DESC
    `
    res.json(rows)
  } catch (error) {
    logger.error('Error fetching fuel prices', error)
    res.status(500).json({ error: 'Failed to fetch fuel prices' })
  }
})

// GET /api/fuel-prices/latest - Get latest prices by brand
router.get('/latest', async (req: Request, res: Response) => {
  try {
    const sql = getSql()
    const rows = await sql`
      SELECT brand, fuel_type, price_rsd::text
      FROM fuel_prices
      WHERE valid_to IS NULL
      ORDER BY brand, fuel_type
    `

    const eurodiesel: Record<string, number> = {}
    const bmb95: Record<string, number> = {}
    const lpg: Record<string, number> = {}
    const bmb100: Record<string, number> = {}

    for (const row of rows) {
      const price = parseFloat(row.price_rsd)
      if (row.fuel_type === 'eurodiesel') eurodiesel[row.brand] = price
      else if (row.fuel_type === 'bmb95') bmb95[row.brand] = price
      else if (row.fuel_type === 'lpg') lpg[row.brand] = price
      else if (row.fuel_type === 'bmb100') bmb100[row.brand] = price
    }

    const dateRow = await sql`
      SELECT valid_from::text FROM fuel_prices 
      WHERE valid_to IS NULL 
      ORDER BY valid_from DESC 
      LIMIT 1
    `

    const average = (prices: number[]) => {
      if (prices.length === 0) return 0
      return Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100
    }

    res.json({
      eurodiesel,
      bmb95,
      lpg,
      bmb100,
      averages: {
        eurodiesel: average(Object.values(eurodiesel)),
        bmb95: average(Object.values(bmb95)),
        lpg: average(Object.values(lpg)),
        bmb100: average(Object.values(bmb100))
      },
      validFrom: dateRow[0]?.valid_from ?? null
    })
  } catch (error) {
    logger.error('Error fetching latest fuel prices', error)
    res.status(500).json({ error: 'Failed to fetch latest fuel prices' })
  }
})

// GET /api/fuel-prices/brand/:brand - Get prices by brand
router.get('/brand/:brand', async (req: Request, res: Response) => {
  try {
    const { brand } = req.params
    const sql = getSql()
    const rows = await sql`
      SELECT id, brand, fuel_type, price_rsd, valid_from, valid_to
      FROM fuel_prices
      WHERE brand ILIKE ${`%${brand}%`}
      ORDER BY valid_from DESC
    `
    res.json(rows)
  } catch (error) {
    logger.error('Error fetching fuel prices by brand', error, { brand: req.params.brand })
    res.status(500).json({ error: 'Failed to fetch fuel prices by brand' })
  }
})

export default router
