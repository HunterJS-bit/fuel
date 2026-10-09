import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || 'postgresql://fuelcalc:fuelcalc@localhost:5432/fuelcalc'

let sql: postgres.Sql<{}> | null = null

export function getSql() {
  if (!sql) {
    sql = postgres(connectionString, {
      ssl: connectionString.includes('sslmode=require') || connectionString.includes('neon.tech')
        ? 'require'
        : false,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  }
  return sql
}

export default getSql
