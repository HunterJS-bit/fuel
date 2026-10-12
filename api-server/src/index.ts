import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { logger } from './utils/logger.js'
import stationsRouter from './routes/stations'
import fuelPricesRouter from './routes/fuel-prices'
import providersRouter from './routes/providers'
import geocodeRouter from './routes/geocode'
import routeRouter from './routes/route'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    })
  })
  
  next()
})

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/stations', stationsRouter)
app.use('/api/fuel-prices', fuelPricesRouter)
app.use('/api/providers', providersRouter)
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
      'GET /api/providers',
      'GET /api/geocode',
      'GET /api/route',
      'GET /health'
    ]
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`)
  res.status(404).json({ error: 'Route not found' })
})

// Global error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', err, {
    path: req.path,
    method: req.method,
    ip: req.ip
  })
  
  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production'
  
  res.status(500).json({
    error: 'Internal server error',
    ...(isDevelopment && { message: err.message, stack: err.stack })
  })
})

app.listen(PORT, () => {
  logger.info(`FuelCalc API server starting`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    database: process.env.DATABASE_URL?.split('@')[1] || 'local'
  })
})
