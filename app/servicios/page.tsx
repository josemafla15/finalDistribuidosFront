"use client"

import { useState, useEffect } from "react"
import { getServicios } from "@/lib/api"
import type { Service } from "@/lib/types"
import ServiceList from "@/components/services/service-list"

export default function ServicesPage() {
  const [servicios, setServicios] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getServicios()
      console.log('Servicios API response:', data) // Para depuración
      
      // Verificar y convertir la respuesta si es necesario
      if (data) {
        if (Array.isArray(data)) {
          setServicios(data)
        } else if (data.results && Array.isArray(data.results)) {
          // Si la API devuelve un objeto con una propiedad 'results'
          setServicios(data.results)
        } else if (typeof data === 'object') {
          // Si es un objeto, convertir a array
          setServicios(Object.values(data))
        } else {
          setServicios([])
        }
      } else {
        setServicios([])
      }
    } catch (err) {
      setError("Error al cargar los servicios")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Nuestros Servicios</h1>

      {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
        </div>
      ) : (
        <ServiceList servicios={servicios} />
      )}
    </div>
  )
}
