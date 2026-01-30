'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface GastoData {
  id: string
  realId: number
  fechaServicio: string
  proveedor: string
  local: string
  categoria: string
  estado: 'en-revision' | 'aprobado' | 'desaprobado' | 'pagado'
  concepto: string
  eerr: boolean
  op: string | null
  fileDriveUrl: string | null
}

interface HistorialGastosProps {
  isGerencia: boolean
  userId: string
}

const statusConfig = {
  'en-revision': { label: 'En Revision', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  aprobado: { label: 'Aprobado', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  desaprobado: { label: 'Desaprobado', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  pagado: { label: 'Pagado', className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
}

export function HistorialGastos({ isGerencia, userId }: HistorialGastosProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<GastoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 5

  const [statusFilter, setStatusFilter] = useState('en-revision')

  useEffect(() => {
    fetchGastos()
  }, [])

  const fetchGastos = async () => {
    setIsLoading(true)
    try {
      console.log('Fetching gastos...')
      // RLS filtra automaticamente: gerencia ve todos, registrador solo los suyos
      const { data: dbData, error } = await supabase
        .from('gastos')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Gastos result:', { dbData, error })

      if (error) {
        console.error('Error fetching data:', error)
        alert('Error al cargar historial')
        return
      }

      if (dbData) {
        const formattedData: GastoData[] = dbData.map((row) => ({
          id: `G-${String(row.id).padStart(3, '0')}`,
          realId: row.id,
          estado: mapStatus(row.status),
          fechaServicio: row.fecha_servicio,
          proveedor: row.proveedor || '',
          local: row.local || '',
          categoria: row.categoria || '',
          concepto: row.detalle_servicio || '',
          eerr: row.eerr || false,
          op: row.op || null,
          fileDriveUrl: row.file_drive_url || null,
        }))
        setData(formattedData)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const mapStatus = (status: string): GastoData['estado'] => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'en-revision'
      case 'APPROVED': return 'aprobado'
      case 'REJECTED': return 'desaprobado'
      case 'PAID': return 'pagado'
      default: return 'en-revision'
    }
  }

  const handleApprove = async (realId: number) => {
    if (!isGerencia) {
      alert('Solo Gerencia puede aprobar gastos')
      return
    }

    if (!confirm('Confirmar aprobacion de este gasto?')) return

    try {
      const response = await fetch('/api/approve-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: realId }),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Gasto aprobado y notificado correctamente')
        fetchGastos()
      } else {
        throw new Error(result.error || 'Error al aprobar')
      }
    } catch (error) {
      console.error('Approval error:', error)
      alert(`Error al procesar la aprobacion: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  const toggleEerr = async (realId: number, currentValue: boolean) => {
    if (!isGerencia) {
      alert('Solo Gerencia puede modificar estos campos')
      return
    }

    try {
      const { error } = await supabase
        .from('gastos')
        .update({ eerr: !currentValue })
        .eq('id', realId)

      if (error) throw error

      setData((prev) =>
        prev.map((item) =>
          item.realId === realId ? { ...item, eerr: !currentValue } : item
        )
      )
    } catch (error) {
      console.error('Error updating:', error)
      alert('Error al actualizar')
    }
  }

  const updateOp = async (realId: number, value: string) => {
    if (!isGerencia) {
      alert('Solo Gerencia puede modificar estos campos')
      return
    }

    try {
      const { error } = await supabase
        .from('gastos')
        .update({ op: value || null })
        .eq('id', realId)

      if (error) throw error

      setData((prev) =>
        prev.map((item) =>
          item.realId === realId ? { ...item, op: value || null } : item
        )
      )
    } catch (error) {
      console.error('Error updating:', error)
      alert('Error al actualizar')
    }
  }

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || item.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (isLoading) {
    return (
      <div className="glass rounded-3xl p-6 lg:p-8">
        <div className="text-white/60 text-center py-8">Cargando gastos...</div>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Historial de Gastos</h1>
        <p className="text-white/60 mt-1">
          {isGerencia ? 'Todos los gastos registrados' : 'Tus gastos registrados'}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <Input
            type="text"
            placeholder="Buscar por proveedor, concepto o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl h-11 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white rounded-xl h-11 focus:ring-purple-500">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e0f32]/95 backdrop-blur-xl border-white/20 text-white rounded-xl">
            <SelectItem value="all" className="focus:bg-white/10 focus:text-white rounded-lg">
              Todos
            </SelectItem>
            <SelectItem value="en-revision" className="focus:bg-white/10 focus:text-white rounded-lg">
              En Revision
            </SelectItem>
            <SelectItem value="aprobado" className="focus:bg-white/10 focus:text-white rounded-lg">
              Aprobado
            </SelectItem>
            <SelectItem value="desaprobado" className="focus:bg-white/10 focus:text-white rounded-lg">
              Desaprobado
            </SelectItem>
            <SelectItem value="pagado" className="focus:bg-white/10 focus:text-white rounded-lg">
              Pagado
            </SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white rounded-xl h-11 focus:ring-purple-500">
            <SelectValue placeholder="Local" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e0f32]/95 backdrop-blur-xl border-white/20 text-white rounded-xl max-h-[300px]">
            <SelectItem value="all" className="focus:bg-white/10 focus:text-white rounded-lg">Todos</SelectItem>
            <SelectItem value="Costa 7070" className="focus:bg-white/10 focus:text-white rounded-lg">Costa 7070</SelectItem>
            <SelectItem value="Comedor" className="focus:bg-white/10 focus:text-white rounded-lg">Comedor</SelectItem>
            <SelectItem value="Kona" className="focus:bg-white/10 focus:text-white rounded-lg">Kona</SelectItem>
            <SelectItem value="La Mala" className="focus:bg-white/10 focus:text-white rounded-lg">La Mala</SelectItem>
            <SelectItem value="La Malita" className="focus:bg-white/10 focus:text-white rounded-lg">La Malita</SelectItem>
            <SelectItem value="Mil Vidas" className="focus:bg-white/10 focus:text-white rounded-lg">Mil Vidas</SelectItem>
            <SelectItem value="Cruza Polo" className="focus:bg-white/10 focus:text-white rounded-lg">Cruza Polo</SelectItem>
            <SelectItem value="Cruza Recoleta" className="focus:bg-white/10 focus:text-white rounded-lg">Cruza Recoleta</SelectItem>
            <SelectItem value="Conchinchina" className="focus:bg-white/10 focus:text-white rounded-lg">Conchinchina</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white rounded-xl h-11 focus:ring-purple-500">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e0f32]/95 backdrop-blur-xl border-white/20 text-white rounded-xl max-h-[300px]">
            <SelectItem value="all" className="focus:bg-white/10 focus:text-white rounded-lg">Todas</SelectItem>
            <SelectItem value="Comisiones por Venta" className="focus:bg-white/10 focus:text-white rounded-lg">Comisiones por Venta</SelectItem>
            <SelectItem value="CMV" className="focus:bg-white/10 focus:text-white rounded-lg">CMV</SelectItem>
            <SelectItem value="Costo de Ocupacion" className="focus:bg-white/10 focus:text-white rounded-lg">Costo de Ocupacion</SelectItem>
            <SelectItem value="Servicios Publicos" className="focus:bg-white/10 focus:text-white rounded-lg">Servicios Publicos</SelectItem>
            <SelectItem value="Gtos de operación" className="focus:bg-white/10 focus:text-white rounded-lg">Gtos de operación</SelectItem>
            <SelectItem value="Regalias" className="focus:bg-white/10 focus:text-white rounded-lg">Regalias</SelectItem>
            <SelectItem value="Costo Recaudacion (TC)" className="focus:bg-white/10 focus:text-white rounded-lg">Costo Recaudacion (TC)</SelectItem>
            <SelectItem value="Gtos de Mantenimiento" className="focus:bg-white/10 focus:text-white rounded-lg">Gtos de Mantenimiento</SelectItem>
            <SelectItem value="Honorarios" className="focus:bg-white/10 focus:text-white rounded-lg">Honorarios</SelectItem>
            <SelectItem value="Com Tarjetas y Gs Bancarios" className="focus:bg-white/10 focus:text-white rounded-lg">Com Tarjetas y Gs Bancarios</SelectItem>
            <SelectItem value="Impuestos" className="focus:bg-white/10 focus:text-white rounded-lg">Impuestos</SelectItem>
            <SelectItem value="Gtos Mkt y publicidad" className="focus:bg-white/10 focus:text-white rounded-lg">Gtos Mkt y publicidad</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl h-11"
        >
          <Filter className="h-4 w-4 mr-2" />
          Mas filtros
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left text-white/60 font-medium text-sm px-4 py-3">ID</th>
              <th className="text-left text-white/60 font-medium text-sm px-4 py-3">Fecha Servicio</th>
              <th className="text-left text-white/60 font-medium text-sm px-4 py-3">Proveedor</th>
              <th className="text-left text-white/60 font-medium text-sm px-4 py-3 hidden md:table-cell">Local</th>
              <th className="text-left text-white/60 font-medium text-sm px-4 py-3 hidden lg:table-cell">Categoria</th>
              <th className="text-left text-white/60 font-medium text-sm px-4 py-3">Estado</th>
              <th className="text-left text-white/60 font-medium text-sm px-4 py-3 hidden xl:table-cell">Concepto</th>
              <th className="text-center text-white/60 font-medium text-sm px-4 py-3">Comprobante</th>
              {isGerencia && (
                <th className="text-center text-white/60 font-medium text-sm px-4 py-3">Acciones</th>
              )}
              <th className="text-center text-white/60 font-medium text-sm px-4 py-3">EERR</th>
              <th className="text-center text-white/60 font-medium text-sm px-4 py-3">OP</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={isGerencia ? 10 : 9} className="text-center text-white/40 py-8">
                  No hay gastos para mostrar
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className={cn(
                    'border-b border-white/5 hover:bg-white/5 transition-colors',
                    index % 2 === 0 && 'bg-white/[0.02]',
                  )}
                >
                  <td className="text-white font-mono text-sm px-4 py-4">{item.id}</td>
                  <td className="text-white/80 text-sm px-4 py-4">{item.fechaServicio}</td>
                  <td className="text-white text-sm px-4 py-4 font-medium">{item.proveedor}</td>
                  <td className="text-white/80 text-sm px-4 py-4 hidden md:table-cell">{item.local}</td>
                  <td className="text-white/80 text-sm px-4 py-4 hidden lg:table-cell">{item.categoria}</td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        'inline-flex px-3 py-1 rounded-full text-xs font-medium border',
                        statusConfig[item.estado]?.className || 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                      )}
                    >
                      {statusConfig[item.estado]?.label || item.estado}
                    </span>
                  </td>
                  <td className="text-white/60 text-sm px-4 py-4 hidden xl:table-cell max-w-[150px] truncate">
                    {item.concepto}
                  </td>
                  <td className="text-center px-4 py-4">
                    {item.fileDriveUrl ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(item.fileDriveUrl!, '_blank')}
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-white/30">-</span>
                    )}
                  </td>
                  {isGerencia && (
                    <td className="text-center px-4 py-4">
                      {item.estado === 'en-revision' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(item.realId)}
                          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                        >
                          Aprobar
                        </Button>
                      )}
                    </td>
                  )}
                  <td className="text-center px-4 py-4">
                    {isGerencia ? (
                      <Select
                        value={item.eerr ? 'si' : 'no'}
                        onValueChange={(value) => toggleEerr(item.realId, value === 'no')}
                      >
                        <SelectTrigger className="w-[70px] h-8 bg-white/10 border-white/20 text-white text-xs rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e0f32]/95 backdrop-blur-xl border-white/20 text-white rounded-lg">
                          <SelectItem value="si" className="focus:bg-white/10 focus:text-white text-xs">Sí</SelectItem>
                          <SelectItem value="no" className="focus:bg-white/10 focus:text-white text-xs">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={cn(
                        'text-sm',
                        item.eerr ? 'text-emerald-400' : 'text-white/40'
                      )}>
                        {item.eerr ? 'Sí' : 'No'}
                      </span>
                    )}
                  </td>
                  <td className="text-center px-4 py-4">
                    {isGerencia ? (
                      <Input
                        type="text"
                        value={item.op || ''}
                        onChange={(e) => updateOp(item.realId, e.target.value)}
                        placeholder="-"
                        className="w-[80px] h-8 bg-white/10 border-white/20 text-white text-xs text-center rounded-lg focus:border-purple-500"
                      />
                    ) : (
                      <span className="text-white/60 text-sm">
                        {item.op || '-'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <p className="text-white/60 text-sm">
          Mostrando {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} a{' '}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} registros
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-9 w-9 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white disabled:opacity-30 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                'h-9 w-9 rounded-lg',
                currentPage === i + 1
                  ? 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white',
              )}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-9 w-9 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white disabled:opacity-30 rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
