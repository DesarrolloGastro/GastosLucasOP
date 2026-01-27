import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const formData = await request.formData()
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('Missing Webhook URL')
      return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 })
    }

    formData.append('user_id', user.id)
    formData.append('user_email', user.email || '')

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const text = await response.text()
      console.error(`n8n Error: ${response.status} - ${text}`)
      return NextResponse.json({ error: `n8n responded with ${response.status}` }, { status: response.status })
    }

    const data = await response.text()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
