import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { logger } from './utils/logger.js'
import { initializeDatabase, closeDatabase } from './db.js'
import stationsRouter from './routes/stations.js'
import fuelPricesRouter from './routes/fuel-prices.js'
import providersRouter from './routes/providers.js'
import geocodeRouter from './routes/geocode.js'
import routeRouter from './routes/route.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

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

async function startServer() {
  // Initialize database connection
  logger.info('Initializing database connection...')
  try {
    await initializeDatabase()
    logger.info('Database connection successful')
  } catch (error) {
    logger.error('Failed to connect to database. Please check DATABASE_URL environment variable.')
    logger.error(`DATABASE_URL: ${process.env.DATABASE_URL ? '***SET***' : 'NOT SET'}`)
    process.exit(1)
  }

  const server = app.listen(PORT, () => {
    logger.info(`FuelCalc API server starting`, {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      database: process.env.DATABASE_URL?.split('@')[1] || 'local'
    })
  })

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down server...')
    server.close(() => {
      closeDatabase()
      logger.info('Server shutdown complete')
      process.exit(0)
    })
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

startServer().catch((error) => {
  logger.error('Failed to start server', error)
  process.exit(1)
})
