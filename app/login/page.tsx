'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/auth-provider'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    console.log('Intentando login con:', email)

    try {
      const { error } = await signIn(email, password)

      console.log('Resultado signIn:', error ? error.message : 'OK')

      if (error) {
        console.error('Error de login:', error)
        setError(`Error: ${error.message}`)
        setIsLoading(false)
        return
      }

      console.log('Login exitoso, redirigiendo...')
      const redirectTo = searchParams.get('redirectTo') || '/'
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      console.error('Error catch:', err)
      setError('Error al iniciar sesion. Intente nuevamente.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 mb-4">
            <span className="text-2xl font-bold text-white">G</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Gastros</h1>
          <p className="text-white/60 mt-2">Gestion de Gastos Gastronomicos</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">
              Contrasena
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingrese su contrasena"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold text-lg shadow-lg shadow-purple-500/30 disabled:opacity-50"
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Contacte al administrador si no tiene acceso
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
