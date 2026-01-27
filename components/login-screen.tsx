"use client"

import type React from "react"

import { useState } from "react"
import { User, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 mb-4">
            <span className="text-2xl font-bold text-white">G</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Gastros</h1>
          <p className="text-white/60 mt-2">Gestión de Gastos Gastronómicos</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white/80">
              Usuario
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                id="username"
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 focus:border-purple-500 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold text-lg shadow-lg shadow-purple-500/30"
          >
            Ingresar
          </Button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          ¿Olvidaste tu contraseña?{" "}
          <button className="text-purple-400 hover:text-purple-300 underline">Recuperar</button>
        </p>
      </div>
    </div>
  )
}
