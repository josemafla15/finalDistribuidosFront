"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { getBarberos, getServicios, getHorariosBarbero, getSlotsDisponibles, crearCita } from "@/lib/api"
import type { BarberProfile, Service, WorkDay, TimeSlot, AppointmentFormData } from "@/lib/types"
import AppointmentForm from "@/components/appointments/appointment-form"
import Link from "next/link"

export default function NewAppointmentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [barberos, setBarberos] = useState<BarberProfile[]>([])
  const [servicios, setServicios] = useState<Service[]>([])
  const [diasTrabajo, setDiasTrabajo] = useState<WorkDay[]>([])
  const [slotsDisponibles, setSlotsDisponibles] = useState<TimeSlot[]>([])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener parámetros de la URL
  const barberoIdParam = searchParams.get("barbero")
  const servicioIdParam = searchParams.get("servicio")

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!user) {
      console.log("Usuario no autenticado")
      setError("Debes iniciar sesión para reservar una cita")
      setLoading(false)
      // Opcional: redirigir al usuario a la página de inicio de sesión
      // router.push("/login");
      return // Salir temprano si no hay usuario autenticado
    } else {
      console.log("Usuario autenticado:", user.username)
    }

    const fetchInitialData = async () => {
      try {
        console.log("Iniciando carga de datos iniciales")
        setLoading(true)

        // Obtener barberos directamente de la API
        const barberData = await getBarberos()
        console.log("Datos de barberos recibidos:", barberData)

        // Obtener servicios directamente de la API
        const serviceData = await getServicios()
        console.log("Datos de servicios recibidos:", serviceData)

        setBarberos(barberData)
        setServicios(serviceData)

        // Si hay un barbero en la URL, cargar sus días de trabajo
        if (barberoIdParam) {
          const barberId = Number(barberoIdParam)
          console.log("Cargando días de trabajo para el barbero:", barberId)
          const workDays = await getHorariosBarbero(barberId)
          console.log("Días de trabajo recibidos:", workDays)
          setDiasTrabajo(workDays)
        }
      } catch (err) {
        console.error("Error al cargar los datos iniciales:", err)
        setError("Error al cargar los datos iniciales")
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [barberoIdParam, user]) // Añadido user como dependencia

  const handleBarberoChange = async (barberoId: number) => {
    try {
      setDiasTrabajo([])
      setSlotsDisponibles([])

      const workDays = await getHorariosBarbero(barberoId)
      setDiasTrabajo(workDays)
    } catch (err) {
      setError("Error al cargar los horarios del barbero")
      console.error(err)
    }
  }

  const handleDiaChange = async (workDayId: number) => {
    try {
      console.log("Manejando cambio de día, workDayId:", workDayId)
      setSlotsDisponibles([])

      console.log("Solicitando slots disponibles...")
      const slots = await getSlotsDisponibles(workDayId)
      console.log("Slots disponibles recibidos:", slots)

      if (!slots || slots.length === 0) {
        console.log("No hay slots disponibles para este día")
        setError("No hay horarios disponibles para este día. Por favor, selecciona otro día.")
      } else {
        setError(null)
        setSlotsDisponibles(slots)
      }
    } catch (err) {
      console.error("Error al cargar los slots disponibles:", err)
      setError("Error al cargar los horarios disponibles")
    }
  }

  // Modifica la función handleSubmit para capturar mejor los errores
  const handleSubmit = async (data: AppointmentFormData) => {
    if (!user) {
      router.push("/login")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      console.log("Enviando datos a la API:", data)

      // Asegúrate de que todos los campos requeridos estén presentes y sean válidos
      if (!data.barber || !data.service || !data.date || !data.time_slot) {
        throw new Error("Todos los campos son obligatorios")
      }

      const cita = await crearCita(data)
      console.log("Respuesta de la API:", cita)
      router.push(`/citas/${cita.id}`)
    } catch (err) {
      console.error("Error al crear la cita:", err)
      setError(err instanceof Error ? err.message : "Error al crear la cita")
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-bold">Acceso Restringido</h1>
          <p className="mb-6 text-gray-600">Debes iniciar sesión para reservar una cita.</p>
          <Link
            href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname + window.location.search : "")}`}
            className="inline-block rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/citas" className="text-gray-900 hover:underline">
          ← Volver a mis citas
        </Link>
      </div>

      <h1 className="mb-8 text-center text-3xl font-bold">Reservar Nueva Cita</h1>

      {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
        </div>
      ) : (
        <AppointmentForm
          barberos={barberos}
          servicios={servicios}
          diasTrabajo={diasTrabajo}
          slotsDisponibles={slotsDisponibles}
          onBarberoChange={handleBarberoChange}
          onDiaChange={handleDiaChange}
          onSubmit={handleSubmit}
          submitting={submitting}
          barberoIdInicial={barberoIdParam ? Number(barberoIdParam) : undefined}
          servicioIdInicial={servicioIdParam ? Number(servicioIdParam) : undefined}
        />
      )}
    </div>
  )
}
