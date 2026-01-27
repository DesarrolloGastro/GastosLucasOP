'use client'

import type { View } from '@/app/page'
import type { UserProfile, AuthUser } from '@/types/auth'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { HistorialGastos } from '@/components/historial-gastos'
import { NuevoGasto } from '@/components/nuevo-gasto'
import { Configuracion } from '@/components/configuracion'

interface DashboardProps {
  currentView: View
  setCurrentView: (view: View) => void
  onLogout: () => void
  user: AuthUser
  profile: UserProfile | null
}

export function Dashboard({
  currentView,
  setCurrentView,
  onLogout,
  user,
  profile,
}: DashboardProps) {
  const isGerencia = profile?.role === 'gerencia'

  return (
    <div className="min-h-screen flex">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <TopBar
          onLogout={onLogout}
          userName={profile?.full_name || user.email}
          userRole={profile?.role || 'registrador'}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {currentView === 'historial' && (
            <HistorialGastos isGerencia={isGerencia} userId={user.id} />
          )}
          {currentView === 'nuevo-gasto' && <NuevoGasto />}
          {currentView === 'configuracion' && <Configuracion />}
        </main>
      </div>
    </div>
  )
}
