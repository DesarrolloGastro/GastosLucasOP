'use client'

import { Bell, LogOut, User, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TopBarProps {
  onLogout: () => void
  userName: string
  userRole: 'registrador' | 'gerencia'
}

export function TopBar({ onLogout, userName, userRole }: TopBarProps) {
  const roleLabels = {
    registrador: 'Registrador',
    gerencia: 'Gerencia',
  }

  return (
    <header className="h-16 glass-strong flex items-center justify-between px-4 lg:px-6">
      <div className="lg:hidden w-10" />
      <h2 className="text-white/80 font-medium hidden lg:block">
        Panel de Administracion
      </h2>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
          <Shield className="h-3 w-3 text-purple-400" />
          <span className="text-xs text-purple-400 font-medium">
            {roleLabels[userRole]}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl px-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:inline font-medium max-w-[120px] truncate">
                {userName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-[#1e0f32]/95 backdrop-blur-xl border-white/20 text-white rounded-xl"
          >
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg">
              <User className="mr-2 h-4 w-4" />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={onLogout}
              className="focus:bg-white/10 focus:text-white cursor-pointer text-red-400 rounded-lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
