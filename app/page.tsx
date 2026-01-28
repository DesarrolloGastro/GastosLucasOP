'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Dashboard } from '@/components/dashboard'

export type View = 'historial' | 'nuevo-gasto' | 'configuracion'

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('historial')
  const { user, profile, isLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  // Timeout de seguridad - si tarda más de 3 segundos, redirigir al login
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Auth timeout - redirecting to login')
        router.push('/login')
      }
    }, 3000)

    return () => clearTimeout(timeout)
  }, [isLoading, router])

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Dashboard
      currentView={currentView}
      setCurrentView={setCurrentView}
      onLogout={handleLogout}
      user={user}
      profile={profile}
    />
  )
}
