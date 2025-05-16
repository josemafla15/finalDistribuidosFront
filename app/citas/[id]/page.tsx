"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCita, cancelarCita } from "@/lib/api"
import type { Appointment } from "@/lib/types"
import { useAuth } from "@/components/providers/auth-provider"
import Link from "next/link"
import { formatDate, formatTime, formatPrice, getAppointmentStatus, getStatusColor } from "@/lib/utils"
import { Calendar, Clock, MapPin, Scissors, X } from "lucide-react"
import Image from "next/image"

export default function AppointmentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [cita, setCita] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelando, setCancelando] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentId = Number(id)
        const data = await getCita(appointmentId)
        setCita(data)
      } catch (err) {
        setError("Error al cargar los datos de la cita")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [id, user])

  const handleCancelar = async () => {
    if (!cita) return

    if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      return
    }

    setCancelando(true)
    setError(null)

    try {
      const citaActualizada = await cancelarCita(cita.id)
      setCita(citaActualizada)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cancelar la cita")
    } finally {
      setCancelando(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-bold">Acceso Restringido</h1>
          <p className="mb-6 text-gray-600">Debes iniciar sesión para ver los detalles de la cita.</p>
          <Link href="/login" className="inline-block rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !cita) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error || "No se encontró la cita"}</div>
        <div className="mt-4">
          <Link href="/citas" className="text-gray-900 hover:underline">
            ← Volver a mis citas
          </Link>
        </div>
      </div>
    )
  }

  const puedeSerCancelada = ["pending", "confirmed"].includes(cita.status)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/citas" className="text-gray-900 hover:underline">
          ← Volver a mis citas
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Detalles de la Cita</h1>
            <span className={`rounded-full px-4 py-1 text-sm font-medium ${getStatusColor(cita.status)}`}>
              {getAppointmentStatus(cita.status)}
            </span>
          </div>
        </div>

        <div className="p-6">
          {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="mb-4 text-lg font-semibold">Información de la Cita</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                    <span>Fecha: {formatDate(cita.date)}</span>
                  </div>

                  {cita.time_slot_details && (
                    <div className="flex items-center">
                      <Clock className="mr-3 h-5 w-5 text-gray-400" />
                      <span>
                        Hora: {formatTime(cita.time_slot_details.start_time)} -{" "}
                        {formatTime(cita.time_slot_details.end_time)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                    <span>Ubicación: Barbería Central</span>
                  </div>

                  <div className="flex items-center">
                    <Scissors className="mr-3 h-5 w-5 text-gray-400" />
                    <span>Servicio: {cita.service_details?.name}</span>
                  </div>
                </div>
              </div>

              {cita.barber_details && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Información del Barbero</h2>
                  <div className="flex items-center">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src={cita.barber_details.user.profile_picture || "/placeholder.svg?height=100&width=100"}
                        alt={`${cita.barber_details.user.first_name} ${cita.barber_details.user.last_name}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">
                        {cita.barber_details.user.first_name} {cita.barber_details.user.last_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {cita.barber_details.years_of_experience} años de experiencia
                      </p>
                      <Link
                        href={`/barberos/${cita.barber}`}
                        className="mt-1 inline-block text-sm text-gray-900 hover:underline"
                      >
                        Ver perfil
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {cita.notes && (
                <div>
                  <h2 className="mb-2 text-lg font-semibold">Notas</h2>
                  <p className="text-gray-600">{cita.notes}</p>
                </div>
              )}

              <div className="pt-4">
                {puedeSerCancelada ? (
                  <button
                    onClick={handleCancelar}
                    disabled={cancelando}
                    className="flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-70"
                  >
                    {cancelando ? (
                      "Cancelando..."
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Cancelar Cita
                      </>
                    )}
                  </button>
                ) : cita.status === "completed" && !cita.review ? (
                  <Link
                    href={`/barberos/${cita.barber}?review=true&appointment=${cita.id}`}
                    className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Dejar Reseña
                  </Link>
                ) : null}
              </div>
            </div>

            <div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h2 className="mb-4 text-lg font-semibold">Resumen</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Servicio</p>
                    <p className="font-medium">{cita.service_details?.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Precio</p>
                    <p className="font-medium">{formatPrice(cita.service_details?.price || 0)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Duración</p>
                    <p className="font-medium">{cita.service_details?.duration_minutes} minutos</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">Reservada el</p>
                    <p className="font-medium">{formatDate(cita.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
