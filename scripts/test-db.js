// scripts/test-db.js
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

if (!process.env.POSTGRES_URL) {
    console.error("❌ ERROR: POSTGRES_URL is missing from .env.local");
    process.exit(1);
}

console.log("Environment loaded. URL starts with:", process.env.POSTGRES_URL.substring(0, 15) + "...");
console.log("Testing connection...");

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase usually
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log("✅ SUCCESS: Connected to Supabase!");

        const res = await client.query('SELECT count(*) FROM gastos');
        console.log(`📊 Table 'gastos' has ${res.rows[0].count} rows.`);

        client.release();
        pool.end();
    } catch (err) {
        console.error("❌ CONNECTION FAILED:", err.message);
        console.error("Details:", err);
        pool.end();
    }
}

testConnection();
