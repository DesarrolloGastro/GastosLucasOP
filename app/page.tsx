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
