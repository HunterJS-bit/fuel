import express, { Request, Response } from 'express'
import { logger } from '../utils/logger.js'

const router = express.Router()

// GET /api/geocode - Geocode address
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string

    if (!q?.trim()) {
      return res.json([])
    }

    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', q)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', '5')
    url.searchParams.set('countrycodes', 'rs')

    const response = await fetch(url.toString(), {
      headers: { 'User-Agent': 'FuelCalc/1.0 (fuel price app)' }
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Geocoding failed' })
    }

    const results = await response.json()

    res.json(results.map((item: any) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      displayName: item.display_name
    })))
  } catch (error) {
    logger.error('Geocoding error', error, { query: req.query.q })
    res.status(500).json({ error: 'Geocoding failed' })
  }
})

export default router
