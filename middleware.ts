import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase-middleware'

const publicRoutes = ['/login', '/api/auth/callback']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const { supabase, response } = await createMiddlewareClient(request)

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/api/approve-expense') {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'gerencia') {
      return NextResponse.json(
        { error: 'No autorizado - Solo gerencia puede aprobar' },
        { status: 403 }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
