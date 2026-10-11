import express, { Request, Response } from 'express'
import { getSql } from '../db.js'
import { logger } from '../utils/logger.js'

const router = express.Router()

// GET /api/stations - Get all stations with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const { fuel_type, brand, city, lat, lon, radius, limit = 100, offset = 0 } = req.query

    const sql = getSql()

    let whereConditions = ["(station_type = 'fuel' OR station_type IS NULL)"]
    let queryParams: (string | number)[] = []

    if (fuel_type) {
      whereConditions.push("fuel_type ILIKE $" + (queryParams.length + 1))
      queryParams.push(`%${fuel_type}%`)
    }

    if (brand) {
      whereConditions.push("brand ILIKE $" + (queryParams.length + 1))
      queryParams.push(`%${brand}%`)
    }

    if (city) {
      whereConditions.push("city ILIKE $" + (queryParams.length + 1))
      queryParams.push(`%${city}%`)
    }

    const numLimit = parseInt(limit as string) || 100
    const numOffset = parseInt(offset as string) || 0
    queryParams.push(numLimit, numOffset)

    const whereClause = whereConditions.join(' AND ')
    const queryString = `
      SELECT id, name, brand, address, city, hours, latitude, longitude, fuel_type, station_type
      FROM stations
      WHERE ${whereClause}
      ORDER BY city, name
      LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
    `

    const rows = await sql.unsafe(queryString, queryParams)

    const stations = rows.map(row => ({
      ...row,
      fuels: row.fuel_type ? row.fuel_type.split(',').map((f: string) => f.trim()) : []
    }))

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as count
      FROM stations
      WHERE ${whereClause}
    `
    const countResult = await sql.unsafe(countQuery, queryParams.slice(0, -2))
    const total = Number(countResult[0]?.count || 0)

    res.json({
      data: stations,
      total,
      page: Math.floor(numOffset / numLimit) + 1,
      limit: numLimit,
      hasMore: numOffset + numLimit < total
    })
  } catch (error) {
    logger.error('Error fetching stations', error)
    res.status(500).json({ error: 'Failed to fetch stations' })
  }
})

// GET /api/stations/:id - Get station by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const sql = getSql()

    const rows = await sql`
      SELECT id, name, brand, address, city, hours, latitude, longitude, fuel_type, station_type
      FROM stations
      WHERE id = ${id}
    `

    if (!rows[0]) {
      return res.status(404).json({ error: 'Station not found' })
    }

    res.json({
      ...rows[0],
      fuels: rows[0].fuel_type ? rows[0].fuel_type.split(',').map((f: string) => f.trim()) : []
    })
  } catch (error) {
    logger.error('Error fetching station', error, { id: req.params.id })
    res.status(500).json({ error: 'Failed to fetch station' })
  }
})

// GET /api/stations/nearby - Get nearby stations
router.get('/nearby', async (req: Request, res: Response) => {
  try {
    const { lat, lon, radius = 10, fuel_type } = req.query

    const numLat = parseFloat(lat as string)
    const numLon = parseFloat(lon as string)

    if (!lat || !lon || isNaN(numLat) || isNaN(numLon)) {
      return res.status(400).json({ error: 'Invalid coordinates' })
    }

    const sql = getSql()

    let whereConditions = ["(station_type = 'fuel' OR station_type IS NULL)"]
    let queryParams: (string | number)[] = []

    if (fuel_type) {
      whereConditions.push("fuel_type ILIKE $" + (queryParams.length + 1))
      queryParams.push(`%${fuel_type}%`)
    }

    whereConditions.push(`(
      6371 * acos(
        cos(radians($${queryParams.length + 1})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians($${queryParams.length + 2})) +
        sin(radians($${queryParams.length + 1})) * sin(radians(latitude))
      )
    ) <= $${queryParams.length + 3}`)
    queryParams.push(numLat, numLon, parseFloat(radius as string))

    const whereClause = whereConditions.join(' AND ')
    const queryString = `
      SELECT id, name, brand, address, city, hours, latitude, longitude, fuel_type, station_type,
        (
          6371 * acos(
            cos(radians(${numLat})) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(${numLon})) +
            sin(radians(${numLat})) * sin(radians(latitude))
          )
        ) as distance_km
      FROM stations
      WHERE ${whereClause}
      ORDER BY distance_km
      LIMIT 100
    `

    const rows = await sql.unsafe(queryString, queryParams)

    res.json(rows.map(row => ({
      ...row,
      fuels: row.fuel_type ? row.fuel_type.split(',').map((f: string) => f.trim()) : []
    })))
  } catch (error) {
    logger.error('Error fetching nearby stations', error, { lat: req.query.lat, lon: req.query.lon, radius: req.query.radius })
    res.status(500).json({ error: 'Failed to fetch nearby stations' })
  }
})

export default router
