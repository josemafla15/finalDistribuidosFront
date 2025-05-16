"use client"

import { useState, useEffect } from "react"
import { getBarberos, getEspecialidades } from "@/lib/api"
import type { BarberProfile, Specialty } from "@/lib/types"
import BarberCard from "@/components/barbers/barber-card"

export default function BarbersPage() {
  const [barberos, setBarberos] = useState<BarberProfile[]>([])
  const [especialidades, setEspecialidades] = useState<Specialty[]>([])
  const [filtroEspecialidad, setFiltroEspecialidad] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Iniciando fetch de datos...")

        // Obtener especialidades primero
        const specialtyData = await getEspecialidades()
        console.log("Datos de especialidades recibidos:", specialtyData)

        // Procesar datos de especialidades
        let processEspecialidades = []
        if (Array.isArray(specialtyData)) {
          processEspecialidades = specialtyData
        } else if (specialtyData && specialtyData.results && Array.isArray(specialtyData.results)) {
          processEspecialidades = specialtyData.results
        } else if (specialtyData) {
          processEspecialidades = Object.values(specialtyData)
        }

        console.log("Especialidades procesadas:", processEspecialidades)
        setEspecialidades(processEspecialidades)

        // Obtener barberos (sin filtro inicialmente)
        const barberData = await getBarberos()
        console.log("Datos de barberos recibidos:", barberData)

        // Procesar datos de barberos
        let processBarberos = []
        if (Array.isArray(barberData)) {
          processBarberos = barberData
        } else if (barberData && barberData.results && Array.isArray(barberData.results)) {
          processBarberos = barberData.results
        } else if (barberData) {
          processBarberos = [barberData]
        }

        console.log("Barberos procesados:", processBarberos)
        setBarberos(processBarberos)
      } catch (err) {
        console.error("Error al cargar los datos:", err)
        setError("Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Función para obtener barberos filtrados por especialidad
  const fetchFilteredBarbers = async (specialtyId: number | null) => {
    try {
      setLoading(true)

      let endpoint = "/barbers/profiles/"
      if (specialtyId) {
        endpoint += `?specialties__specialty=${specialtyId}`
      }

      console.log("Obteniendo barberos filtrados con endpoint:", endpoint)
      const data = await fetchApi(endpoint)
      console.log("Datos de barberos filtrados recibidos:", data)

      // Procesar datos
      let processBarberos = []
      if (Array.isArray(data)) {
        processBarberos = data
      } else if (data && data.results && Array.isArray(data.results)) {
        processBarberos = data.results
      } else if (data) {
        processBarberos = [data]
      }

      setBarberos(processBarberos)
    } catch (err) {
      console.error("Error al filtrar barberos:", err)
      setError("Error al filtrar barberos")
    } finally {
      setLoading(false)
    }
  }

  // Función para manejar el cambio de filtro
  const handleFilterChange = (specialtyId: number | null) => {
    setFiltroEspecialidad(specialtyId)
    fetchFilteredBarbers(specialtyId)
  }

  // Función para verificar si un barbero tiene una especialidad específica
  const barberoTieneEspecialidad = (barbero: BarberProfile, specialtyId: number): boolean => {
    if (!barbero.specialties || !Array.isArray(barbero.specialties)) {
      return false
    }

    return barbero.specialties.some((s) => {
      // Verificar diferentes estructuras posibles
      if (s.specialty && s.specialty.id === specialtyId) {
        return true
      }
      // if (s.specialty_id === specialtyId) {
      //   return true
      // }
      if (s.id === specialtyId) {
        return true
      }
      return false
    })
  }

  // Filtrar barberos en el cliente (como respaldo)
  const barberosFiltrados = filtroEspecialidad
    ? barberos.filter((barbero) => barberoTieneEspecialidad(barbero, filtroEspecialidad))
    : barberos

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Nuestros Barberos</h1>

      {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="mb-8">
        <label htmlFor="specialty" className="mb-2 block text-sm font-medium text-gray-700">
          Filtrar por especialidad
        </label>
        <select
          id="specialty"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none sm:max-w-xs"
          value={filtroEspecialidad || ""}
          onChange={(e) => {
            const value = e.target.value ? Number(e.target.value) : null
            console.log("Cambiando filtro a:", value)
            handleFilterChange(value)
          }}
        >
          <option value="">Todas las especialidades</option>
          {especialidades.map((especialidad) => (
            <option key={especialidad.id} value={especialidad.id}>
              {especialidad.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
        </div>
      ) : barberosFiltrados.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {barberosFiltrados.map((barbero) => (
            <BarberCard key={barbero.id} barbero={barbero} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No se encontraron barberos con los filtros seleccionados.</p>
      )}
    </div>
  )
}

// Función auxiliar para realizar peticiones a la API
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  // Obtener token de autenticación
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || "Ha ocurrido un error")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en fetchApi:", error)
    throw error
  }
}
