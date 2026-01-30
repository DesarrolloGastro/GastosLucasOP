"use client"

import { useState, useRef } from "react"
import type React from "react"
import { Upload, Search, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NuevoGasto() {
  const [formData, setFormData] = useState({
    local: "",
    proveedor: "",
    fechaServicio: "",
    fechaPago: "",
    detalleServicio: "",
    detallePago: "",
    moneda: "",
    monto: "",
    categoria: "",
    evento: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })
      if (file) {
        data.append("comprobante", file)
      }

      // Use local API route to proxy the request and avoid CORS
      const webhookUrl = "/api/submit-expense"

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: data,
      })

      if (response.ok) {
        alert("Gasto registrado correctamente") // Using alert for simplicity as toast is not fully set up in context
        // Reset form
        setFormData({
          local: "",
          proveedor: "",
          fechaServicio: "",
          fechaPago: "",
          detalleServicio: "",
          detallePago: "",
          moneda: "",
          monto: "",
          categoria: "",
          evento: "",
        })
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || "Error desconocido en el servidor"
        throw new Error(errorMessage)
      }
    } catch (error: any) {
      console.error("Error submitting form:", error)
      alert(`Error al registrar: ${error.message || "Intente nuevamente"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass rounded-3xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Registro de Gastos</h1>
        <p className="text-white/60 mt-1">Complete los campos para registrar un nuevo gasto</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Local */}
          <div className="space-y-2">
            <Label className="text-white/80">Local</Label>
            <Select value={formData.local} onValueChange={(value) => setFormData({ ...formData, local: value })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl h-12 focus:ring-purple-500">
                <SelectValue placeholder="Seleccionar local" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e0f32]/95 backdrop-blur-xl border-white/20 text-white rounded-xl">
                <SelectItem value="Costa 7070" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Costa 7070
                </SelectItem>
                <SelectItem value="Comedor" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Comedor
                </SelectItem>
                <SelectItem value="Kona" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Kona
                </SelectItem>
                <SelectItem value="La Mala" className="focus:bg-white/10 focus:text-white rounded-lg">
                  La Mala
                </SelectItem>
                <SelectItem value="La Malita" className="focus:bg-white/10 focus:text-white rounded-lg">
                  La Malita
                </SelectItem>
                <SelectItem value="Mil Vidas" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Mil Vidas
                </SelectItem>
                <SelectItem value="Cruza Polo" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Cruza Polo
                </SelectItem>
                <SelectItem value="Cruza Recoleta" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Cruza Recoleta
                </SelectItem>
                <SelectItem value="Conchinchina" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Conchinchina
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Proveedor */}
          <div className="space-y-2">
            <Label className="text-white/80">Proveedor</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                type="text"
                placeholder="Buscar proveedor..."
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Fecha de Servicio */}
          <div className="space-y-2">
            <Label className="text-white/80">Fecha de Servicio</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                type="date"
                value={formData.fechaServicio}
                onChange={(e) => setFormData({ ...formData, fechaServicio: e.target.value })}
                className="pl-10 bg-white/10 border-white/20 text-white rounded-xl h-12 focus:border-purple-500 focus:ring-purple-500 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Fecha de Pago */}
          <div className="space-y-2">
            <Label className="text-white/80">Fecha de Pago</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                type="date"
                value={formData.fechaPago}
                onChange={(e) => setFormData({ ...formData, fechaPago: e.target.value })}
                className="pl-10 bg-white/10 border-white/20 text-white rounded-xl h-12 focus:border-purple-500 focus:ring-purple-500 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Detalle del Servicio */}
          <div className="space-y-2">
            <Label className="text-white/80">Detalle del Servicio</Label>
            <Textarea
              placeholder="Describa el servicio recibido..."
              value={formData.detalleServicio}
              onChange={(e) => setFormData({ ...formData, detalleServicio: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl min-h-[100px] focus:border-purple-500 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Detalle del Pago */}
          <div className="space-y-2">
            <Label className="text-white/80">Detalle del Pago</Label>
            <Textarea
              placeholder="Describa los detalles del pago..."
              value={formData.detallePago}
              onChange={(e) => setFormData({ ...formData, detallePago: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl min-h-[100px] focus:border-purple-500 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Moneda */}
          <div className="space-y-2">
            <Label className="text-white/80">Moneda</Label>
            <Select value={formData.moneda} onValueChange={(value) => setFormData({ ...formData, moneda: value })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl h-12 focus:ring-purple-500">
                <SelectValue placeholder="Seleccionar moneda" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e0f32]/95 backdrop-blur-xl border-white/20 text-white rounded-xl">
                <SelectItem value="peso" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Peso Argentino (ARS)
                </SelectItem>
                <SelectItem value="usd" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Dólar (USD)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <Label className="text-white/80">Monto</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label className="text-white/80">Categoría</Label>
            <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl h-12 focus:ring-purple-500">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e0f32]/95 backdrop-blur-xl border-white/20 text-white rounded-xl max-h-[300px]">
                <SelectItem value="Comisiones por Venta" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Comisiones por Venta
                </SelectItem>
                <SelectItem value="CMV" className="focus:bg-white/10 focus:text-white rounded-lg">
                  CMV
                </SelectItem>
                <SelectItem value="Costo de Ocupacion" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Costo de Ocupacion
                </SelectItem>
                <SelectItem value="Servicios Publicos" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Servicios Publicos
                </SelectItem>
                <SelectItem value="Gtos de operación" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Gtos de operación
                </SelectItem>
                <SelectItem value="Regalias" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Regalias
                </SelectItem>
                <SelectItem value="Costo Recaudacion (TC)" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Costo Recaudacion (TC)
                </SelectItem>
                <SelectItem value="Gtos de Mantenimiento" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Gtos de Mantenimiento
                </SelectItem>
                <SelectItem value="Honorarios" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Honorarios
                </SelectItem>
                <SelectItem value="Com Tarjetas y Gs Bancarios" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Com Tarjetas y Gs Bancarios
                </SelectItem>
                <SelectItem value="Impuestos" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Impuestos
                </SelectItem>
                <SelectItem value="Gtos Mkt y publicidad" className="focus:bg-white/10 focus:text-white rounded-lg">
                  Gtos Mkt y publicidad
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Evento */}
          <div className="space-y-2">
            <Label className="text-white/80">Evento</Label>
            <Input
              type="text"
              placeholder="Escriba el evento (opcional)..."
              value={formData.evento}
              onChange={(e) => setFormData({ ...formData, evento: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Upload Area */}
        <div className="space-y-2">
          <Label className="text-white/80">Adjuntar Imagen/PDF</Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer bg-white/5"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <Upload className="h-10 w-10 text-white/40 mx-auto mb-3" />
            <p className="text-white/60 mb-1">{file ? file.name : "Arrastra y suelta archivos aquí"}</p>
            <p className="text-white/40 text-sm">{file ? "Click para cambiar archivo" : "o haz clic para seleccionar"}</p>
            <p className="text-white/30 text-xs mt-2">PNG, JPG, PDF (máx. 10MB)</p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold text-lg shadow-lg shadow-purple-500/30 disabled:opacity-50"
        >
          {isLoading ? "Enviando..." : "Enviar Revisión"}
        </Button>
      </form>
    </div>
  )
}
