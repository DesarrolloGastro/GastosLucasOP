"use client"

import { useState } from "react"
import { Save, User, Bell, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function Configuracion() {
  const [settings, setSettings] = useState({
    nombre: "Admin",
    email: "admin@gastros.com",
    notificaciones: true,
    emailNotificaciones: true,
    twoFactor: false,
  })

  const handleSave = () => {
    console.log("Settings saved:", settings)
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="glass rounded-3xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Perfil de Usuario</h2>
            <p className="text-white/60 text-sm">Administra tu información personal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-white/80">Nombre</Label>
            <Input
              type="text"
              value={settings.nombre}
              onChange={(e) => setSettings({ ...settings, nombre: e.target.value })}
              className="bg-white/10 border-white/20 text-white rounded-xl h-12 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Email</Label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="bg-white/10 border-white/20 text-white rounded-xl h-12 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass rounded-3xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Notificaciones</h2>
            <p className="text-white/60 text-sm">Configura cómo recibir alertas</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-white font-medium">Notificaciones en app</p>
              <p className="text-white/60 text-sm">Recibe alertas dentro de la aplicación</p>
            </div>
            <Switch
              checked={settings.notificaciones}
              onCheckedChange={(checked) => setSettings({ ...settings, notificaciones: checked })}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-white font-medium">Notificaciones por email</p>
              <p className="text-white/60 text-sm">Recibe actualizaciones en tu correo</p>
            </div>
            <Switch
              checked={settings.emailNotificaciones}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotificaciones: checked })}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="glass rounded-3xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Seguridad</h2>
            <p className="text-white/60 text-sm">Protege tu cuenta</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-white font-medium">Autenticación de dos factores</p>
              <p className="text-white/60 text-sm">Añade una capa extra de seguridad</p>
            </div>
            <Switch
              checked={settings.twoFactor}
              onCheckedChange={(checked) => setSettings({ ...settings, twoFactor: checked })}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl"
          >
            Cambiar contraseña
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold text-lg shadow-lg shadow-purple-500/30"
      >
        <Save className="h-5 w-5 mr-2" />
        Guardar Cambios
      </Button>
    </div>
  )
}
