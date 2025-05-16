import barberiaData from "../public/data/barberos.json"

export const { barberos, especialidades, servicios, diasTrabajo, slots } = barberiaData

// Función para obtener el nombre del día de la semana
export function getDayName(dayNumber: number): string {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  return days[(dayNumber - 1) % 7]
}

// Función para obtener los servicios de un barbero
export function getServiciosPorBarbero(barberoId: number) {
  return servicios.filter((servicio) => servicio.barbero_id === barberoId)
}

// Función para obtener los días de trabajo de un barbero
export function getDiasTrabajoporBarbero(barberoId: number) {
  return diasTrabajo.filter((dia) => dia.barbero_id === barberoId)
}

// Función para obtener los slots de un barbero
export function getSlotsPorBarbero(barberoId: number) {
  return slots.filter((slot) => slot.barbero_id === barberoId)
}

// Función para obtener las especialidades de un barbero
export function getEspecialidadesPorBarbero(barberoId: number) {
  const barbero = barberos.find((b) => b.id === barberoId)
  if (!barbero) return []

  return especialidades.filter((esp) => barbero.especialidades.includes(esp.id))
}

// Función para obtener slots disponibles para un barbero en una fecha específica
export function getSlotsDisponiblesPorFecha(barberoId: number, fecha: Date) {
  // Obtener el día de la semana (1-7, donde 1 es lunes)
  const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay()

  // Verificar si el barbero trabaja ese día
  const diaLaboral = diasTrabajo.find((dia) => dia.barbero_id === barberoId && dia.dia === diaSemana)

  if (!diaLaboral) return []

  // Obtener todos los slots del barbero
  const slotsDelBarbero = getSlotsPorBarbero(barberoId)

  // Filtrar slots que estén dentro del horario de trabajo de ese día
  return slotsDelBarbero.filter((slot) => {
    return slot.inicio >= diaLaboral.inicio && slot.fin <= diaLaboral.fin
  })
}

// Función para formatear precio
export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(precio)
}
