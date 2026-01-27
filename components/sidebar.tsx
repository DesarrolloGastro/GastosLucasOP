"use client"

import type React from "react"

import type { View } from "@/app/page"
import { History, PlusCircle, Settings, X, Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentView: View
  setCurrentView: (view: View) => void
}

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "historial", label: "Historial de Gastos", icon: History },
  { id: "nuevo-gasto", label: "Nuevo Gasto", icon: PlusCircle },
  { id: "configuracion", label: "Configuración", icon: Settings },
]

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden text-white hover:bg-white/10"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 glass-strong z-50 transform transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Close button (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 lg:hidden text-white hover:bg-white/10"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <span className="text-lg font-bold text-white">G</span>
            </div>
            <span className="text-xl font-bold text-white">Gastros</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id)
                    setMobileOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                    isActive
                      ? "bg-gradient-to-r from-purple-600/80 to-violet-600/80 text-white shadow-lg shadow-purple-500/20"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs text-center">© 2026 Gastros v1.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
