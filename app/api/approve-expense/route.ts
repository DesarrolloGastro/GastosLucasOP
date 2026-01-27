import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    console.log('Approve expense - Starting...')
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Auth result:', { user: user?.email, authError })

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'gerencia') {
      return NextResponse.json(
        { error: 'No autorizado - Solo gerencia puede aprobar gastos' },
        { status: 403 }
      )
    }

    const { id } = await request.json()
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_APPROVE_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('Missing Approval Webhook URL')
      return NextResponse.json({ error: 'Approval Webhook URL not configured' }, { status: 500 })
    }

    // Enviar a n8n - n8n se encarga de actualizar el estado en Supabase
    console.log('Sending to n8n:', { webhookUrl, id, approvedBy: user.email })
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approvedBy: user.email }),
    })

    const responseText = await response.text()
    console.log('n8n response:', { status: response.status, body: responseText })

    if (!response.ok) {
      console.error(`n8n Approval Error: ${response.status} - ${responseText}`)
      return NextResponse.json({ error: 'Error en el flujo de aprobacion' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Approval Proxy error:', error)
    return NextResponse.json({ error: 'Failed to process approval request' }, { status: 500 })
  }
}
