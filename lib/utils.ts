import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// import { format } from "date-fns"
// import { es } from "date-fns/locale"

// Función fetchApi mejorada con mejor manejo de errores y logging
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...options.headers,
  }

  try {
    console.log(`Realizando petición a: ${API_URL}${endpoint}`)
    console.log("Opciones:", JSON.stringify(options, null, 2))

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    console.log(`Respuesta recibida con status: ${response.status}`)

    // Intentar obtener el cuerpo de la respuesta como JSON
    let data
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // Log de la respuesta para depuración
    console.log(`Respuesta (${response.status}):`, typeof data === "object" ? JSON.stringify(data, null, 2) : data)

    if (!response.ok) {
      // Manejar diferentes formatos de error
      let errorMessage = "Error en la solicitud"

      if (typeof data === "object" && data !== null) {
        if (data.detail) {
          errorMessage = data.detail
        } else if (data.message) {
          errorMessage = data.message
        } else {
          // Si hay errores en formato de objeto, convertirlos a string
          const errorDetails = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join("; ")

          if (errorDetails) {
            errorMessage = errorDetails
          }
        }
      } else if (typeof data === "string" && data) {
        errorMessage = data
      }

      throw new Error(`${errorMessage} (${response.status})`)
    }

    return data
  } catch (error) {
    console.error("Error en fetchApi:", error)
    throw error
  }
}

// Reemplazar las importaciones de date-fns con una implementación nativa

// Formatear fecha
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error al formatear fecha:", error)
    return dateString
  }
}

// Formatear hora
export function formatTime(timeString: string): string {
  if (!timeString) return ""

  try {
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  } catch (error) {
    console.error("Error al formatear hora:", error)
    return timeString
  }
}

// Formatear precio
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

// Obtener nombre del día de la semana
export function getDayName(dayNumber: number | string | undefined): string {
  console.log("Obteniendo nombre del día para número:", dayNumber)

  // Si dayNumber es undefined, usar un valor por defecto
  if (dayNumber === undefined) {
    console.warn("Número de día indefinido, usando valor por defecto")
    return "Día desconocido"
  }

  // Asegurarse de que dayNumber es un número
  const day = typeof dayNumber === "string" ? Number.parseInt(dayNumber, 10) : Number(dayNumber)

  // Validar que el número está en el rango correcto (0-6 para el formato del backend)
  if (isNaN(day)) {
    console.warn(`Número de día inválido: ${dayNumber}, usando valor por defecto`)
    return "Día desconocido"
  }

  // Manejar el sistema del backend donde 0 = Lunes, 6 = Domingo
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

  // Si el día está en el rango 0-6, usarlo directamente
  if (day >= 0 && day <= 6) {
    return days[day]
  }

  // Si el día está en el rango 1-7, restar 1 para obtener el índice correcto
  if (day >= 1 && day <= 7) {
    return days[day - 1]
  }

  console.warn(`Número de día fuera de rango: ${dayNumber}, usando valor por defecto`)
  return "Día desconocido"
}

// Obtener estado de la cita en español
export function getAppointmentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    completed: "Completada",
    cancelled: "Cancelada",
  }
  return statusMap[status] || status
}

// Obtener color según el estado de la cita
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }
  return colorMap[status] || "bg-gray-100 text-gray-800"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
