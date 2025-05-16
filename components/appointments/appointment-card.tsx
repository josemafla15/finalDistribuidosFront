"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, X } from "lucide-react"
import type { Appointment } from "@/lib/types"
import { formatDate, formatTime, formatPrice, getAppointmentStatus, getStatusColor } from "@/lib/utils"
import { cancelarCita } from "@/lib/api"

interface AppointmentCardProps {
  cita: Appointment
  onCitaCancelada: (cita: Appointment) => void
}

export default function AppointmentCard({ cita, onCitaCancelada }: AppointmentCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCancelar = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const citaActualizada = await cancelarCita(cita.id)
      onCitaCancelada(citaActualizada)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cancelar la cita")
    } finally {
      setLoading(false)
    }
  }

  const puedeSerCancelada = ["pending", "confirmed"].includes(cita.status)

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(cita.status)}`}>
            {getAppointmentStatus(cita.status)}
          </span>
          <span className="text-sm text-gray-500">Reservada el {formatDate(cita.created_at)}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{cita.service_details?.name}</h3>
              <p className="text-gray-600">{cita.service_details?.description}</p>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                <span>{formatDate(cita.date)}</span>
              </div>

              {cita.time_slot_details && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-400" />
                  <span>
                    {formatTime(cita.time_slot_details.start_time)} - {formatTime(cita.time_slot_details.end_time)}
                  </span>
                </div>
              )}

              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-gray-400" />
                <span>Barbería Central</span>
              </div>
            </div>

            {cita.notes && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700">Notas:</h4>
                <p className="text-sm text-gray-600">{cita.notes}</p>
              </div>
            )}

            {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="flex space-x-3">
              <Link
                href={`/citas/${cita.id}`}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Ver Detalles
              </Link>

              {puedeSerCancelada && (
                <button
                  onClick={handleCancelar}
                  disabled={loading}
                  className="flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-70"
                >
                  {loading ? (
                    "Cancelando..."
                  ) : (
                    <>
                      <X className="mr-1 h-4 w-4" />
                      Cancelar Cita
                    </>
                  )}
                </button>
              )}

              {cita.status === "completed" && !cita.review && (
                <Link
                  href={`/barberos/${cita.barber}?review=true&appointment=${cita.id}`}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Dejar Reseña
                </Link>
              )}
            </div>
          </div>

          <div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h4 className="mb-3 text-sm font-medium text-gray-700">Barbero</h4>

              {cita.barber_details && (
                <div className="flex items-center">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={cita.barber_details.user.profile_picture || "/placeholder.svg?height=100&width=100"}
                      alt={`${cita.barber_details.user.first_name} ${cita.barber_details.user.last_name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {cita.barber_details.user.first_name} {cita.barber_details.user.last_name}
                    </p>
                    <Link href={`/barberos/${cita.barber}`} className="text-sm text-gray-900 hover:underline">
                      Ver perfil
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">Resumen</h4>
                <div className="flex justify-between">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-medium">{formatPrice(cita.service_details?.price || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
