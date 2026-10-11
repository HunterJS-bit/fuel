import express, { Request, Response } from 'express'
import { logger } from '../utils/logger.js'

const router = express.Router()

// GET /api/route - Get route between two points
router.get('/', async (req: Request, res: Response) => {
  try {
    const { fromLat, fromLon, toLat, toLon } = req.query as { fromLat: string, fromLon: string, toLat: string, toLon: string }

    const lat = parseFloat(fromLat)
    const lon = parseFloat(fromLon)
    const toLatNum = parseFloat(toLat)
    const toLonNum = parseFloat(toLon)

    if ([lat, lon, toLatNum, toLonNum].some(n => Number.isNaN(n))) {
      return res.status(400).json({ error: 'Invalid coordinates' })
    }

    const url = `https://router.project-osrm.org/route/v1/driving/${lon},${lat};${toLonNum},${toLatNum}?overview=full&geometries=geojson`

    const response = await fetch(url)
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Routing failed' })
    }

    const data = await response.json()
    const route = data.routes?.[0]

    if (!route) {
      return res.status(404).json({ error: 'No route found' })
    }

    const coordinates = route.geometry.coordinates.map(
      ([lon, lat]: [number, number]) => [lat, lon]
    )

    res.json({
      coordinates,
      distanceKm: route.distance / 1000,
      durationMin: route.duration / 60
    })
  } lagg(rerror) {r, { fromLat, fomLon, toLat, toLon }
    console.error('Routing error:', error)
    res.status(500).json({ error: 'Routing failed' })
  }
})

export default router
