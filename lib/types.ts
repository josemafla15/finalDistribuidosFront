// Definiciones de tipos para la aplicación

// Tipos para usuarios y autenticación
export interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  role?: string
  phone_number?: string
  profile_picture?: string | null
  is_barber?: boolean
}

// Actualizar la interfaz LoginCredentials para incluir email
export interface LoginCredentials {
  username: string
  password: string
  email?: string // Añadido email como propiedad opcional
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password2?: string
  first_name?: string
  last_name?: string
  phone_number?: string
  is_barber?: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

// Tipos para barberos y servicios
export interface BarberProfile {
  id: number
  user?: User
  bio?: string
  biography?: string
  years_of_experience?: number
  instagram_profile?: string
  specialties?: BarberSpecialty[]
  average_rating?: number
  phone_number?: string
}

export interface BarberSpecialty {
  id: number
  specialty: Specialty
}

export interface Specialty {
  id: number
  name: string
  description?: string
}

export interface Service {
  id: number
  name: string
  description?: string
  price: number
  duration_minutes: number
  barber?: number
  barber_name?: string
}

// Tipos para horarios y citas
export interface WorkDay {
  id: number
  barber: number | BarberProfile
  day_of_week: number
  start_time: string
  end_time: string
  is_working: boolean
  // Propiedades adicionales para el formato hardcoded
  dia?: number
  inicio?: string
  fin?: string
}

export interface TimeSlot {
  id: number
  barber?: number | BarberProfile
  work_day?: number | WorkDay
  start_time: string
  end_time: string
  is_available: boolean
  // Propiedades adicionales para el formato hardcoded
  inicio?: string
  fin?: string
  barbero_id?: number
}

export interface AppointmentFormData {
  barber: number
  service: number
  date: string
  time_slot: number
  notes?: string
}

export interface Appointment {
  id: number
  customer: number | User
  barber: number | BarberProfile
  service: number | Service
  appointment_date: string
  appointment_time: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}
