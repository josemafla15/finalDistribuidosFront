"use client"

import { useState } from "react"
import type { Appointment } from "@/lib/types"
import AppointmentCard from "./appointment-card"

interface AppointmentListProps {
  citas: Appointment[]
  onCitasCambiadas: (citas: Appointment[]) => void
}

export default function AppointmentList({ citas, onCitasCambiadas }: AppointmentListProps) {
  const [filtro, setFiltro] = useState<string>("todas")

  // Filtrar citas según el estado seleccionado
  const citasFiltradas = filtro === "todas" ? citas : citas.filter((cita) => cita.status === filtro)

  // Ordenar citas por fecha (más recientes primero)
  const citasOrdenadas = [...citasFiltradas].sort((a, b) => {
    // Primero por fecha
    const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime()
    if (dateComparison !== 0) return dateComparison

    // Si la fecha es la misma, ordenar por hora
    if (a.time_slot_details && b.time_slot_details) {
      return a.time_slot_details.start_time.localeCompare(b.time_slot_details.start_time)
    }
    return 0
  })

  // Agrupar citas por estado
  const citasPendientes = citas.filter((cita) => cita.status === "pending").length
  const citasConfirmadas = citas.filter((cita) => cita.status === "confirmed").length
  const citasCompletadas = citas.filter((cita) => cita.status === "completed").length
  const citasCanceladas = citas.filter((cita) => cita.status === "cancelled").length

  // Manejar cancelación de cita
  const handleCitaCancelada = (citaActualizada: Appointment) => {
    const nuevasCitas = citas.map((cita) => (cita.id === citaActualizada.id ? citaActualizada : cita))
    onCitasCambiadas(nuevasCitas)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFiltro("todas")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filtro === "todas" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Todas ({citas.length})
        </button>
        <button
          onClick={() => setFiltro("pending")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filtro === "pending" ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          }`}
        >
          Pendientes ({citasPendientes})
        </button>
        <button
          onClick={() => setFiltro("confirmed")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filtro === "confirmed" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
        >
          Confirmadas ({citasConfirmadas})
        </button>
        <button
          onClick={() => setFiltro("completed")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filtro === "completed" ? "bg-green-500 text-white" : "bg-green-100 text-green-800 hover:bg-green-200"
          }`}
        >
          Completadas ({citasCompletadas})
        </button>
        <button
          onClick={() => setFiltro("cancelled")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filtro === "cancelled" ? "bg-red-500 text-white" : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          Canceladas ({citasCanceladas})
        </button>
      </div>

      <div className="space-y-4">
        {citasOrdenadas.length > 0 ? (
          citasOrdenadas.map((cita) => (
            <AppointmentCard key={cita.id} cita={cita} onCitaCancelada={handleCitaCancelada} />
          ))
        ) : (
          <p className="text-center text-gray-600">No hay citas que coincidan con el filtro seleccionado.</p>
        )}
      </div>
    </div>
  )
}
