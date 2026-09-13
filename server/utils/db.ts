import sqlite3 from 'sqlite3'
import { resolve } from 'path'
import { promisify } from 'util'

// Enable verbose mode for better error messages in development
const sqlite = sqlite3.verbose()

let dbInstance: sqlite3.Database | null = null

/**
 * Gets a singleton instance of the SQLite database connection
 */
export function getDb(): sqlite3.Database {
    if (!dbInstance) {
        const dbPath = resolve(process.cwd(), 'stations.db')
        dbInstance = new sqlite.Database(dbPath, (err) => {
            if (err) {
                console.error('Error connecting to the SQLite database:', err.message)
            } else {
                console.log('Connected to the SQLite database.')
            }
        })
    }
    return dbInstance
}

/**
 * Helper to run queries with promises (for async/await)
 */
export const dbQuery = {
    get: (sql: string, params: any[] = []) => {
        const db = getDb()
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err)
                else resolve(row)
            })
        })
    },
    all: (sql: string, params: any[] = []) => {
        const db = getDb()
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err)
                else resolve(rows)
            })
        })
    },
    run: (sql: string, params: any[] = []) => {
        const db = getDb()
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err)
                else resolve(this)
            })
        })
    }
}
