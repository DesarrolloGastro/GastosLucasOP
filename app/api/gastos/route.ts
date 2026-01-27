import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
    try {
        const client = await pool.connect()
        console.log("Connected to DB successfully")

        // Fetch all expenses, ordered by most recent first
        const result = await client.query(`
      SELECT 
        id, 
        fecha_servicio as "fechaServicio",
        proveedor,
        local,
        categoria,
        status as estado,
        detalle_servicio as concepto,
        false as eerr, -- Default values as they might not be in DB yet
        false as op    -- Default values
      FROM gastos
      ORDER BY created_at DESC
    `)

        console.log(`Fetched ${result.rows.length} rows from DB`)
        console.log("Sample row:", result.rows[0])

        client.release()

        // Map status from DB (UPPERCASE) to frontend (lowercase/kebab-case) if needed
        // Our DB has 'PENDING', 'APPROVED'. Frontend expects 'en-revision', 'aprobado'.
        const formattedData = result.rows.map(row => ({
            ...row,
            id: `G-${String(row.id).padStart(3, '0')}`, // Format ID strictly for display if desired, or keep real ID
            realId: row.id, // Keep real numeric ID for actions
            estado: mapStatus(row.estado),
            fechaServicio: new Date(row.fechaServicio).toISOString().split('T')[0] // Format date YYYY-MM-DD
        }))

        return NextResponse.json(formattedData)
    } catch (error) {
        console.error('Database Error:', error)
        return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
    }
}

function mapStatus(dbStatus: string) {
    switch (dbStatus?.toUpperCase()) {
        case 'PENDING': return 'en-revision'
        case 'APPROVED': return 'aprobado'
        case 'REJECTED': return 'desaprobado'
        case 'PAID': return 'pagado'
        default: return 'en-revision'
    }
}
