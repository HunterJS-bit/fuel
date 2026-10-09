import fs from 'fs'
import path from 'path'
import { getSql } from './db.js'

async function seed() {
    const sql = getSql()

    console.log('Running migrations...')
    const migrationSql = fs.readFileSync(path.join(process.cwd(), 'src/db/migrations/01_create_tables.sql'), 'utf-8')
    await sql.unsafe(migrationSql)
    console.log('Migrations complete.')

    console.log('Seeding stations...')
    const stationsPath = path.resolve(process.cwd(), '../app/data/stations.json')

    if (!fs.existsSync(stationsPath)) {
        throw new Error(`Stations data not found at ${stationsPath}`)
    }

    const stationsData = JSON.parse(fs.readFileSync(stationsPath, 'utf-8'))

    // Clear existing
    await sql`TRUNCATE TABLE stations RESTART IDENTITY CASCADE`

    for (const st of stationsData) {
        const fuelTypeStr = (st.fuels || []).join(', ')
        await sql`
      INSERT INTO stations (name, brand, address, city, hours, latitude, longitude, fuel_type, station_type)
      VALUES (${st.name || ''}, ${st.brand || ''}, ${st.address || ''}, ${st.city || ''}, ${st.hours || null}, ${st.latitude || 0}, ${st.longitude || 0}, ${fuelTypeStr}, 'fuel')
    `
    }

    console.log(`Successfully seeded ${stationsData.length} stations!`)
}

seed().catch(console.error).finally(() => process.exit(0))
