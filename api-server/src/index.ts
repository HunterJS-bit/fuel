import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import stationsRouter from './routes/stations.js'
import fuelPricesRouter from './routes/fuel-prices.js'
import geocodeRouter from './routes/geocode.js'
import routeRouter from './routes/route.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002
// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/stations', stationsRouter)
app.use('/api/fuel-prices', fuelPricesRouter)
app.use('/api/geocode', geocodeRouter)
app.use('/api/route', routeRouter)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'FuelCalc API',
    version: '1.0.0',
    endpoints: [
      'GET /api/stations',
      'GET /api/stations/:id',
      'GET /api/stations/nearby',
      'GET /api/fuel-prices',
      'GET /api/fuel-prices/latest',
      'GET /api/fuel-prices/brand/:brand',
      'GET /api/geocode',
      'GET /api/route',
      'GET /health'
    ]
  })
})

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`FuelCalc API server running on port ${PORT}`)
  console.log(`Database: ${process.env.DATABASE_URL?.split('@')[1] || 'local'}`)
})
