import { fetchApi } from "./utils"
import type { WorkDay, TimeSlot } from "./types"

// Función para obtener especialidades
export async function getEspecialidades() {
  try {
    // Intentar obtener especialidades del backend
    const response = await fetchApi("/barbers/specialties/")

    // Verificar el formato de la respuesta
    if (Array.isArray(response)) {
      return response
    } else if (response.results && Array.isArray(response.results)) {
      return response.results
    } else {
      console.warn("Formato de respuesta inesperado en getEspecialidades:", response)

      // Importar datos hardcodeados como fallback
      const { especialidades } = await import("./data")
      return especialidades
    }
  } catch (error) {
    console.error("Error al obtener especialidades:", error)

    // Importar datos hardcodeados como fallback
    const { especialidades } = await import("./data")
    return especialidades
  }
}

// Función para obtener servicios
export async function getServicios() {
  try {
    // Intentar obtener servicios del backend
    // Ajustamos la ruta para que coincida con la estructura del backend
    const response = await fetchApi("/services/")

    // Verificar el formato de la respuesta
    if (Array.isArray(response)) {
      return response
    } else if (response.results && Array.isArray(response.results)) {
      return response.results
    } else {
      console.warn("Formato de respuesta inesperado en getServicios:", response)

      // Importar datos hardcodeados como fallback
      const { servicios } = await import("./data")
      return servicios
    }
  } catch (error) {
    console.error("Error al obtener servicios:", error)

    // Importar datos hardcodeados como fallback
    const { servicios } = await import("./data")
    return servicios
  }
}

// Función para obtener barberos
export async function getBarberos(params = {}) {
  try {
    // Construir la URL con los parámetros
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    // Cambiado de /barbers/barbers/ a /barbers/profiles/
    const url = `/barbers/profiles/${queryString ? `?${queryString}` : ""}`

    console.log("Obteniendo barberos de:", url)

    // Hacer la petición a la API
    const response = await fetchApi(url)
    console.log("Respuesta de la API para barberos:", response)

    // Verificar el formato de la respuesta
    if (Array.isArray(response)) {
      return response
    } else if (response.results && Array.isArray(response.results)) {
      return response.results
    } else {
      console.warn("Formato de respuesta inesperado en getBarberos:", response)
      throw new Error("Formato de respuesta inesperado")
    }
  } catch (error) {
    console.error("Error al obtener barberos:", error)
    throw error
  }
}

// Función para obtener detalle de un barbero
export async function getBarberDetail(id: number) {
  try {
    // Cambiado de /barbers/barbers/ a /barbers/profiles/
    return await fetchApi(`/barbers/profiles/${id}/`)
  } catch (error) {
    console.error(`Error al obtener detalles del barbero ${id}:`, error)

    // Importar datos hardcodeados como fallback
    const { barberos } = await import("./data")
    return barberos.find((b) => b.id === id) || null
  }
}

// Función para obtener servicios de un barbero
export async function getServiciosPorBarbero(barberoId: number) {
  try {
    // Intentar obtener servicios del barbero del backend
    // Ajustamos la ruta para que coincida con la estructura del backend
    const url = `/services/?barber=${barberoId}`
    console.log("Obteniendo servicios de barbero de:", url)

    const response = await fetchApi(url)
    console.log("Respuesta de la API para servicios de barbero:", response)

    // Verificar el formato de la respuesta
    if (Array.isArray(response)) {
      return response
    } else if (response.results && Array.isArray(response.results)) {
      return response.results
    } else {
      console.warn(`Formato de respuesta inesperado en getServiciosPorBarbero para barbero ${barberoId}:`, response)
      throw new Error("Formato de respuesta inesperado")
    }
  } catch (error) {
    console.error(`Error al obtener servicios del barbero ${barberoId}:`, error)
    throw error
  }
}

// Función para obtener días de trabajo de un barbero
export async function getDiasTrabajoporBarbero(barberoId: number) {
  console.log(`Obteniendo días de trabajo para barbero ${barberoId}`)

  try {
    // Intentar varias rutas posibles
    const routes = [
      `/schedules/workdays/?barber=${barberoId}`,
      `/schedules/?barber=${barberoId}`,
      `/barbers/profiles/${barberoId}/schedules/`,
      `/barbers/profiles/${barberoId}/workdays/`,
    ]

    let response = null
    let successRoute = ""
    let error = null

    for (const route of routes) {
      try {
        console.log(`Intentando ruta: ${route}`)
        const result = await fetchApi(route)
        console.log(`Respuesta de ${route}:`, result)

        if (result && (Array.isArray(result) || (result.results && Array.isArray(result.results)))) {
          // Si encontramos una respuesta válida, la usamos
          response = result
          successRoute = route
          break
        }
      } catch (e) {
        error = e
        console.log(`Error en ruta ${route}:`, e)
      }
    }

    if (response) {
      console.log(`Éxito con la ruta: ${successRoute}`)
      // Verificar el formato de la respuesta
      if (Array.isArray(response)) {
        return response
      } else if (response.results && Array.isArray(response.results)) {
        return response.results
      }
    }

    // Si llegamos aquí, ninguna ruta funcionó
    console.warn(`No se pudieron obtener días de trabajo para barbero ${barberoId} de ninguna ruta`)
    throw new Error("No se pudieron obtener días de trabajo de la API")
  } catch (error) {
    console.error(`Error al obtener días de trabajo del barbero ${barberoId}:`, error)

    // Importar datos hardcodeados como fallback
    console.warn("Usando datos hardcodeados como fallback")
    const { getDiasTrabajoporBarbero } = await import("./data")
    return getDiasTrabajoporBarbero(barberoId)
  }
}

// Función para obtener slots de un barbero
export async function getSlotsPorBarbero(barberoId: number) {
  try {
    // Intentar obtener slots del barbero del backend
    // Ajustamos la ruta para que coincida con la estructura del backend
    const response = await fetchApi(`/schedules/timeslots/?barber=${barberoId}`)

    // Verificar el formato de la respuesta
    if (Array.isArray(response)) {
      return response
    } else if (response.results && Array.isArray(response.results)) {
      return response.results
    } else {
      console.warn(`Formato de respuesta inesperado en getSlotsPorBarbero para barbero ${barberoId}:`, response)

      // Importar datos hardcodeados como fallback
      const { getSlotsPorBarbero } = await import("./data")
      return getSlotsPorBarbero(barberoId)
    }
  } catch (error) {
    console.error(`Error al obtener slots del barbero ${barberoId}:`, error)

    // Importar datos hardcodeados como fallback
    const { getSlotsPorBarbero } = await import("./data")
    return getSlotsPorBarbero(barberoId)
  }
}

// Función para obtener especialidades de un barbero
export async function getEspecialidadesPorBarbero(barberoId: number) {
  try {
    // Cambiado de /barbers/barbers/ a /barbers/profiles/
    const response = await fetchApi(`/barbers/profiles/${barberoId}/specialties/`)

    // Verificar el formato de la respuesta
    if (Array.isArray(response)) {
      return response
    } else if (response.results && Array.isArray(response.results)) {
      return response.results
    } else {
      console.warn(
        `Formato de respuesta inesperado en getEspecialidadesPorBarbero para barbero ${barberoId}:`,
        response,
      )

      // Importar datos hardcodeados como fallback
      const { getEspecialidadesPorBarbero } = await import("./data")
      return getEspecialidadesPorBarbero(barberoId)
    }
  } catch (error) {
    console.error(`Error al obtener especialidades del barbero ${barberoId}:`, error)

    // Importar datos hardcodeados como fallback
    const { getEspecialidadesPorBarbero } = await import("./data")
    return getEspecialidadesPorBarbero(barberoId)
  }
}

// Función para obtener slots disponibles para un barbero en una fecha específica
export async function getSlotsDisponiblesPorFecha(barberoId: number, fecha: Date) {
  try {
    // Formatear la fecha para la API (YYYY-MM-DD)
    const fechaFormateada = fecha.toISOString().split("T")[0]

    // Cambiado de /barbers/barbers/ a /barbers/profiles/
    const response = await fetchApi(`/barbers/profiles/${barberoId}/available-slots/?date=${fechaFormateada}`)

    // Verificar el formato de la respuesta
    if (Array.isArray(response)) {
      return response
    } else if (response.results && Array.isArray(response.results)) {
      return response.results
    } else {
      console.warn(
        `Formato de respuesta inesperado en getSlotsDisponiblesPorFecha para barbero ${barberoId} y fecha ${fechaFormateada}:`,
        response,
      )

      // Importar datos hardcodeados como fallback
      const { getSlotsDisponiblesPorFecha } = await import("./data")
      return getSlotsDisponiblesPorFecha(barberoId, fecha)
    }
  } catch (error) {
    console.error(`Error al obtener slots disponibles para el barbero ${barberoId} en la fecha ${fecha}:`, error)

    // Importar datos hardcodeados como fallback
    const { getSlotsDisponiblesPorFecha } = await import("./data")
    return getSlotsDisponiblesPorFecha(barberoId, fecha)
  }
}

// FUNCIONES PARA CITAS

// Función para obtener horarios de un barbero (alias para getDiasTrabajoporBarbero)
export async function getHorariosBarbero(barberoId: number): Promise<WorkDay[]> {
  console.log(`Obteniendo horarios para barbero ${barberoId} (alias de getDiasTrabajoporBarbero)`)
  return getDiasTrabajoporBarbero(barberoId)
}

// Función para obtener slots disponibles
// Esta función ahora acepta un workDayId (para la página de citas) o un barberoId y fecha (para otras páginas)
export async function getSlotsDisponibles(workDayIdOrBarberoId: number, fecha?: Date): Promise<TimeSlot[]> {
  console.log(`Obteniendo slots disponibles con parámetro: ${workDayIdOrBarberoId}`)

  // Si se proporciona una fecha, asumimos que el primer parámetro es un barberoId
  if (fecha) {
    console.log(`Fecha proporcionada: ${fecha}, asumiendo que ${workDayIdOrBarberoId} es un barberoId`)
    return getSlotsDisponiblesPorFecha(workDayIdOrBarberoId, fecha)
  }

  // Si no se proporciona fecha, asumimos que el primer parámetro es un workDayId
  try {
    console.log(`No se proporcionó fecha, asumiendo que ${workDayIdOrBarberoId} es un workDayId`)
    const response = await fetchApi(`/schedules/timeslots/?work_day=${workDayIdOrBarberoId}`)

    // Verificar el formato de la respuesta
    if (Array.isArray(response)) {
      return response
    } else if (response.results && Array.isArray(response.results)) {
      return response.results
    } else {
      console.warn(
        `Formato de respuesta inesperado en getSlotsDisponibles para workDayId ${workDayIdOrBarberoId}:`,
        response,
      )
      return []
    }
  } catch (error) {
    console.error(`Error al obtener slots disponibles para workDayId ${workDayIdOrBarberoId}:`, error)
    return []
  }
}

// Función para crear una cita
export async function crearCita(citaData: any) {
  console.log("Creando cita con datos:", citaData)

  try {
    // Intentar crear la cita en el backend
    const response = await fetchApi("/appointments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(citaData),
    })

    console.log("Respuesta al crear cita:", response)
    return response
  } catch (error) {
    console.error("Error al crear cita:", error)
    throw error
  }
}

// Función para obtener todas las citas de un usuario
export async function getCitas() {
  try {
    // Intentar obtener citas del backend
    const response = await fetchApi("/appointments/")

    // Verificar el formato de la respuesta
    if (Array.isArray(response)) {
      return response
    } else if (response.results && Array.isArray(response.results)) {
      return response.results
    } else {
      console.warn("Formato de respuesta inesperado en getCitas:", response)
      return []
    }
  } catch (error) {
    console.error("Error al obtener citas:", error)
    return []
  }
}

// Función para obtener una cita específica por ID
export async function getCita(id: number) {
  try {
    // Intentar obtener la cita del backend
    const response = await fetchApi(`/appointments/${id}/`)
    return response
  } catch (error) {
    console.error(`Error al obtener la cita ${id}:`, error)
    throw error
  }
}

// Función para cancelar una cita
export async function cancelarCita(id: number) {
  try {
    // Intentar cancelar la cita en el backend
    // Normalmente esto sería un PATCH o PUT para cambiar el estado a "cancelled"
    const response = await fetchApi(`/appointments/${id}/cancel/`, {
      method: "POST",
    })

    return response
  } catch (error) {
    console.error(`Error al cancelar la cita ${id}:`, error)
    throw error
  }
}
