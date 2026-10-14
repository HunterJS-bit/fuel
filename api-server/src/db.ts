import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || 'postgresql://fuelcalc:fuelcalc@localhost:5432/fuelcalc'

let sql: postgres.Sql<{}> | null = null

export async function initializeDatabase(): Promise<void> {
  if (sql) {
    return // Already initialized
  }

  sql = postgres(connectionString, {
    ssl: connectionString.includes('sslmode=require') || connectionString.includes('neon.tech')
      ? 'require'
      : false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })

  // Test the connection
  try {
    await sql`SELECT 1`
  } catch (error) {
    sql = null
    throw error
  }
}

export function getSql(): postgres.Sql<{}> {
  if (!sql) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return sql
}

export function closeDatabase(): void {
  if (sql) {
    sql.end()
    sql = null
  }
}

export default getSql
