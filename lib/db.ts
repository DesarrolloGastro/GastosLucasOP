import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
})

export default pool
