"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { AppointmentFormData, BarberProfile, Service, WorkDay, TimeSlot } from "@/lib/types"
import { formatDate, formatTime, formatPrice, getDayName } from "@/lib/utils"

interface AppointmentFormProps {
  barberos: BarberProfile[] | any
  servicios: Service[] | any
  diasTrabajo: WorkDay[] | any
  slotsDisponibles: TimeSlot[] | any
  onBarberoChange: (barberoId: number) => void
  onDiaChange: (workDayId: number) => void
  onSubmit: (data: AppointmentFormData) => void
  submitting: boolean
  barberoIdInicial?: number
  servicioIdInicial?: number
}

export default function AppointmentForm({
  barberos,
  servicios,
  diasTrabajo,
  slotsDisponibles,
  onBarberoChange,
  onDiaChange,
  onSubmit,
  submitting,
  barberoIdInicial,
  servicioIdInicial,
}: AppointmentFormProps) {
  // Función segura para extraer arrays
  const safeArray = <T,>(data: any): T[] => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (data.results && Array.isArray(data.results)) return data.results
    return [data]
  }

  // Extraer los arrays de forma segura
  const barberosArray = safeArray<BarberProfile>(barberos)
  const serviciosArray = safeArray<Service>(servicios)
  const diasTrabajoArray = safeArray<WorkDay>(diasTrabajo)
  const slotsDisponiblesArray = safeArray<TimeSlot>(slotsDisponibles)

  // Log para depurar la estructura de los datos
  console.log("Datos de barberos recibidos:", JSON.stringify(barberosArray, null, 2))
  console.log("Datos de días de trabajo recibidos:", JSON.stringify(diasTrabajoArray, null, 2))
  console.log("Datos de slots disponibles recibidos:", JSON.stringify(slotsDisponiblesArray, null, 2))

  const [formData, setFormData] = useState<AppointmentFormData>({
    barber: barberoIdInicial || 0,
    service: servicioIdInicial || 0,
    date: "",
    time_slot: 0,
    notes: "",
  })

  const [selectedWorkDay, setSelectedWorkDay] = useState<number>(0)
  const [selectedDate, setSelectedDate] = useState<string>("")

  // Inicializar el barbero si viene en la URL
  useEffect(() => {
    if (barberoIdInicial && formData.barber === 0) {
      setFormData((prevData) => ({ ...prevData, barber: barberoIdInicial }))
      onBarberoChange(barberoIdInicial)
    }
  }, [barberoIdInicial, formData.barber, onBarberoChange])

  // Inicializar el servicio si viene en la URL
  useEffect(() => {
    if (servicioIdInicial && formData.service === 0) {
      setFormData((prevData) => ({ ...prevData, service: servicioIdInicial }))
    }
  }, [servicioIdInicial, formData.service])

  const handleBarberoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const barberoId = Number(e.target.value)
    setFormData((prevData) => ({
      ...prevData,
      barber: barberoId,
      date: "",
      time_slot: 0,
    }))
    setSelectedWorkDay(0)
    setSelectedDate("")
    onBarberoChange(barberoId)
  }

  const handleServicioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      service: Number(e.target.value),
    }))
  }

  const handleWorkDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const workDayId = Number(e.target.value)
    console.log("Día de trabajo seleccionado:", workDayId)
    setSelectedWorkDay(workDayId)

    // Encontrar el día de trabajo seleccionado de forma segura
    const workDay = diasTrabajoArray.find((day) => day && day.id === workDayId)
    console.log("Día de trabajo encontrado:", JSON.stringify(workDay, null, 2))

    // Calcular la fecha basada en el día de la semana
    if (workDay) {
      try {
        const today = new Date()
        // Convertir de 0-6 (Dom-Sáb) a 1-7 (Lun-Dom) para nuestros cálculos
        const currentDayOfWeek = today.getDay() === 0 ? 7 : today.getDay()

        // Acceder de forma segura a day_of_week o dia
        let dayOfWeek = 1 // Valor por defecto

        // Verificar si workDay existe y tiene las propiedades necesarias
        if (workDay && typeof workDay === "object") {
          // Imprimir todas las propiedades del objeto para depuración
          console.log("Propiedades de workDay:", Object.keys(workDay))

          // Intentar acceder a las propiedades de diferentes maneras
          if (workDay.day_of_week !== undefined) {
            // Convertir del formato del backend (0=Lunes, 6=Domingo) a nuestro formato (1-7)
            dayOfWeek = workDay.day_of_week + 1
            console.log("Usando day_of_week:", workDay.day_of_week, "convertido a:", dayOfWeek)
          } else if ((workDay as any).dia !== undefined) {
            dayOfWeek = (workDay as any).dia
            console.log("Usando dia:", dayOfWeek)
          } else {
            // Buscar cualquier propiedad que pueda contener el día de la semana
            const possibleDayProps = ["day", "dayOfWeek", "weekday", "day_number"]
            for (const prop of possibleDayProps) {
              if ((workDay as any)[prop] !== undefined) {
                dayOfWeek = (workDay as any)[prop]
                console.log(`Usando propiedad alternativa ${prop}:`, dayOfWeek)
                break
              }
            }
          }
        }

        console.log("Día de la semana extraído:", dayOfWeek)
        console.log("Día de la semana actual:", currentDayOfWeek)

        // Calcular días a añadir
        let daysToAdd = dayOfWeek - currentDayOfWeek
        if (daysToAdd <= 0) {
          daysToAdd += 7 // Añadir una semana si el día ya pasó
        }

        console.log("Días a añadir:", daysToAdd)

        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + daysToAdd)

        const formattedDate = targetDate.toISOString().split("T")[0]
        console.log("Fecha calculada:", formattedDate)
        setSelectedDate(formattedDate)
        setFormData((prevData) => ({
          ...prevData,
          date: formattedDate,
          time_slot: 0, // Resetear el time_slot
        }))
      } catch (error) {
        console.error("Error al calcular la fecha:", error)
      }
    }

    // Llamar a onDiaChange para cargar los slots disponibles
    console.log("Llamando a onDiaChange con workDayId:", workDayId)
    onDiaChange(workDayId)
  }

  const handleTimeSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      time_slot: Number(e.target.value),
    }))
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      notes: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulario enviado con datos:", formData)
    onSubmit(formData)
  }

  // Encontrar el servicio seleccionado de forma segura
  const selectedService = serviciosArray.find((s: Service) => s && s.id === formData.service)

  // Verificar si el botón debería estar habilitado
  const isButtonDisabled = submitting || !formData.barber || !formData.service || !formData.date || !formData.time_slot
  console.log("Estado del botón:", {
    submitting,
    barber: formData.barber,
    service: formData.service,
    date: formData.date,
    time_slot: formData.time_slot,
    isButtonDisabled,
  })

  // Función segura para renderizar opciones
  const renderOptions = <T extends { id: number }>(items: T[], labelFn: (item: T) => string) => {
    if (!Array.isArray(items) || items.length === 0) {
      console.log("No hay items para renderizar opciones")
      return null
    }

    try {
      console.log("Renderizando opciones con items:", items.length)
      return items
        .map((item, index) => {
          if (!item || typeof item !== "object" || !("id" in item)) {
            console.error("Item inválido en renderOptions:", item)
            return null
          }

          try {
            const label = labelFn(item)
            console.log(`Opción ${item.id}: ${label}`)
            return (
              <option key={`${item.id}-${index}`} value={item.id}>
                {label}
              </option>
            )
          } catch (error) {
            console.error(`Error al generar label para item ${item.id}:`, error)
            return null
          }
        })
        .filter(Boolean) // Filtrar elementos nulos
    } catch (error) {
      console.error("Error al renderizar opciones:", error)
      return null
    }
  }

  // Función para obtener el nombre del barbero
  const getNombreBarbero = (barbero: BarberProfile): string => {
    // Log detallado para depurar la estructura del barbero
    console.log("Estructura completa del barbero:", JSON.stringify(barbero, null, 2))

    // Intentar obtener el nombre del barbero
    let nombreBarbero = "Barbero sin nombre"

    try {
      // Si user es un objeto con first_name y last_name
      if (barbero.user && typeof barbero.user === "object") {
        console.log("Propiedades de user:", Object.keys(barbero.user))

        if (barbero.user.first_name && barbero.user.last_name) {
          nombreBarbero = `${barbero.user.first_name} ${barbero.user.last_name}`.trim()
          console.log("Nombre encontrado en user.first_name y user.last_name:", nombreBarbero)
        } else if (barbero.user.username) {
          nombreBarbero = barbero.user.username
          console.log("Nombre encontrado en user.username:", nombreBarbero)
        } else if (barbero.user.email) {
          // Usar el email sin el dominio como último recurso
          nombreBarbero = barbero.user.email.split("@")[0]
          console.log("Nombre extraído del email:", nombreBarbero)
        }
      } else if (typeof barbero === "object" && barbero !== null) {
        // Intentar encontrar cualquier propiedad que pueda contener el nombre
        const possibleNameProps = ["name", "full_name", "fullName", "username", "email", "nombre"]
        for (const prop of possibleNameProps) {
          if ((barbero as any)[prop]) {
            nombreBarbero = (barbero as any)[prop]
            console.log(`Nombre encontrado en ${prop}:`, nombreBarbero)
            break
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener el nombre del barbero:", error)
    }

    return nombreBarbero
  }

  // Función para obtener el nombre del día de la semana
  const getDiaTrabajoLabel = (dia: any): string => {
    console.log("Obteniendo label para día de trabajo:", JSON.stringify(dia, null, 2))

    if (!dia) {
      console.warn("Día de trabajo indefinido o nulo")
      return "Día desconocido"
    }

    try {
      // Verificar si dia existe y tiene las propiedades necesarias
      if (!dia || typeof dia !== "object") {
        return "Día desconocido"
      }

      // Imprimir todas las propiedades del objeto para depuración
      console.log("Propiedades de dia:", Object.keys(dia))

      // Determinar si es formato API o hardcoded
      let dayNumber = 0
      let startTime = "00:00"
      let endTime = "00:00"
      let dayName = ""

      // Usar day_name si está disponible
      if (dia.day_name) {
        dayName = dia.day_name
      } else {
        // Intentar diferentes propiedades para el día de la semana
        if (dia.day_of_week !== undefined) {
          dayNumber = dia.day_of_week
          dayName = getDayName(dayNumber)
        } else if ((dia as any).dia !== undefined) {
          dayNumber = (dia as any).dia
          dayName = getDayName(dayNumber)
        } else {
          // Buscar cualquier propiedad que pueda contener el día de la semana
          const possibleDayProps = ["day", "dayOfWeek", "weekday", "day_number"]
          for (const prop of possibleDayProps) {
            if ((dia as any)[prop] !== undefined) {
              dayNumber = (dia as any)[prop]
              dayName = getDayName(dayNumber)
              break
            }
          }
        }
      }

      // Intentar diferentes propiedades para la hora de inicio
      if (dia.start_time !== undefined) {
        startTime = dia.start_time
      } else if ((dia as any).inicio !== undefined) {
        startTime = (dia as any).inicio
      } else {
        // Buscar cualquier propiedad que pueda contener la hora de inicio
        const possibleStartProps = ["startTime", "start", "horaInicio", "hora_inicio"]
        for (const prop of possibleStartProps) {
          if ((dia as any)[prop] !== undefined) {
            startTime = (dia as any)[prop]
            break
          }
        }
      }

      // Intentar diferentes propiedades para la hora de fin
      if (dia.end_time !== undefined) {
        endTime = dia.end_time
      } else if ((dia as any).fin !== undefined) {
        endTime = (dia as any).fin
      } else {
        // Buscar cualquier propiedad que pueda contener la hora de fin
        const possibleEndProps = ["endTime", "end", "horaFin", "hora_fin"]
        for (const prop of possibleEndProps) {
          if ((dia as any)[prop] !== undefined) {
            endTime = (dia as any)[prop]
            break
          }
        }
      }

      console.log("Valores extraídos:", { dayNumber, dayName, startTime, endTime })

      return `${dayName} - ${startTime} a ${endTime}`
    } catch (error) {
      console.error("Error al generar etiqueta para día de trabajo:", error, dia)
      return "Día desconocido"
    }
  }

  // Función segura para filtrar días de trabajo
  const getDiasTrabajoFiltrados = () => {
    if (!Array.isArray(diasTrabajoArray) || diasTrabajoArray.length === 0) {
      return []
    }

    try {
      return diasTrabajoArray.filter((day) => day && day.is_working !== false)
    } catch (error) {
      console.error("Error al filtrar días de trabajo:", error)
      return []
    }
  }

  // Función para obtener el label de un slot de tiempo
  const getSlotLabel = (slot: any): string => {
    console.log("Obteniendo label para slot:", JSON.stringify(slot, null, 2))

    if (!slot) {
      console.warn("Slot indefinido o nulo")
      return "Hora desconocida"
    }

    try {
      // Verificar si slot existe y tiene las propiedades necesarias
      if (!slot || typeof slot !== "object") {
        return "Hora desconocida"
      }

      // Imprimir todas las propiedades del objeto para depuración
      console.log("Propiedades de slot:", Object.keys(slot))

      // Intentar diferentes propiedades para la hora de inicio
      let startTime = "00:00"
      let endTime = "00:00"

      if (slot.start_time !== undefined) {
        startTime = slot.start_time
      } else if (slot.inicio !== undefined) {
        startTime = slot.inicio
      } else {
        // Buscar cualquier propiedad que pueda contener la hora de inicio
        const possibleStartProps = ["startTime", "start", "horaInicio", "hora_inicio"]
        for (const prop of possibleStartProps) {
          if ((slot as any)[prop] !== undefined) {
            startTime = (slot as any)[prop]
            break
          }
        }
      }

      // Intentar diferentes propiedades para la hora de fin
      if (slot.end_time !== undefined) {
        endTime = slot.end_time
      } else if (slot.fin !== undefined) {
        endTime = slot.fin
      } else {
        // Buscar cualquier propiedad que pueda contener la hora de fin
        const possibleEndProps = ["endTime", "end", "horaFin", "hora_fin"]
        for (const prop of possibleEndProps) {
          if ((slot as any)[prop] !== undefined) {
            endTime = (slot as any)[prop]
            break
          }
        }
      }

      console.log("Valores extraídos:", { startTime, endTime })

      return `${formatTime(startTime)} - ${formatTime(endTime)}`
    } catch (error) {
      console.error("Error al generar etiqueta para slot:", error, slot)
      return "Hora desconocida"
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <form
        onSubmit={handleSubmit}
        onInvalid={(e) => {
          console.log("Formulario inválido:", e)
        }}
      >
        <div className="mb-6">
          <label htmlFor="barber" className="mb-2 block text-sm font-medium text-gray-700">
            Selecciona un Barbero
          </label>
          <select
            id="barber"
            value={formData.barber || ""}
            onChange={handleBarberoChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            required
          >
            <option value="">Selecciona un barbero</option>
            {renderOptions(barberosArray, getNombreBarbero)}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="service" className="mb-2 block text-sm font-medium text-gray-700">
            Selecciona un Servicio
          </label>
          <select
            id="service"
            value={formData.service || ""}
            onChange={handleServicioChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            required
          >
            <option value="">Selecciona un servicio</option>
            {renderOptions(
              serviciosArray,
              (servicio) => `${servicio.name || "Servicio"} - ${formatPrice(servicio.price || 0)}`,
            )}
          </select>

          {selectedService && (
            <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
              <p>
                <strong>Duración:</strong> {selectedService.duration_minutes || 0} minutos
              </p>
              <p>
                <strong>Descripción:</strong> {selectedService.description || "Sin descripción"}
              </p>
            </div>
          )}
        </div>

        {formData.barber > 0 && (
          <div className="mb-6">
            <label htmlFor="workday" className="mb-2 block text-sm font-medium text-gray-700">
              Selecciona un Día
            </label>
            <select
              id="workday"
              value={selectedWorkDay || ""}
              onChange={handleWorkDayChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
              required
            >
              <option value="">Selecciona un día</option>
              {renderOptions(getDiasTrabajoFiltrados(), getDiaTrabajoLabel)}
            </select>

            {selectedDate && (
              <p className="mt-2 text-sm text-gray-600">Fecha seleccionada: {formatDate(selectedDate)}</p>
            )}
          </div>
        )}

        {selectedWorkDay > 0 && (
          <div className="mb-6">
            <label htmlFor="time_slot" className="mb-2 block text-sm font-medium text-gray-700">
              Selecciona una Hora
            </label>
            <select
              id="time_slot"
              value={formData.time_slot || ""}
              onChange={handleTimeSlotChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
              required
            >
              <option value="">Selecciona una hora</option>
              {renderOptions(slotsDisponiblesArray, getSlotLabel)}
            </select>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-700">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={handleNotesChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            rows={3}
            placeholder="Añade cualquier información adicional que el barbero deba saber"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-70"
          disabled={isButtonDisabled}
          onClick={() => console.log("Botón de reserva clickeado")}
        >
          {submitting ? "Reservando..." : "Reservar Cita"}
        </button>

        <div className="mt-4">
          <button
            type="button"
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white"
            onClick={() => {
              console.log("Botón de prueba clickeado")
              onSubmit(formData)
            }}
          >
            Botón de prueba (Reservar sin validación)
          </button>
        </div>
      </form>
    </div>
  )
}
