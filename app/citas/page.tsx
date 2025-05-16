"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { getCitas } from "@/lib/api"
import type { Appointment } from "@/lib/types"
import AppointmentList from "@/components/appointments/appointment-list"
import Link from "next/link"

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [citas, setCitas] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const data = await getCitas()
        // Verificar y convertir la respuesta si es necesario
        if (data) {
          if (Array.isArray(data)) {
            setCitas(data)
          } else if (data.results && Array.isArray(data.results)) {
            setCitas(data.results)
          } else if (typeof data === 'object') {
            setCitas(Object.values(data))
          } else {
            setCitas([])
          }
        } else {
          setCitas([])
        }
      } catch (err) {
        setError("Error al cargar las citas")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-bold">Acceso Restringido</h1>
          <p className="mb-6 text-gray-600">Debes iniciar sesión para ver tus citas.</p>
          <Link href="/login" className="inline-block rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Citas</h1>
        <Link href="/citas/nueva" className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
          Nueva Cita
        </Link>
      </div>

      {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
        </div>
      ) : citas.length > 0 ? (
        <AppointmentList citas={citas} onCitasCambiadas={setCitas} />
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-6 text-gray-600">No tienes citas programadas. ¡Reserva tu primera cita ahora!</p>
          <Link
            href="/citas/nueva"
            className="inline-block rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
          >
            Reservar Cita
          </Link>
        </div>
      )}
    </div>
  )
}