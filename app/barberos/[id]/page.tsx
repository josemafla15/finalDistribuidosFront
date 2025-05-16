"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getBarbero, getReseñasBarbero } from "@/lib/api"
import type { BarberProfile, Review } from "@/lib/types"
import BarberDetail from "@/components/barbers/barber-detail"
import BarberReviews from "@/components/barbers/barber-reviews"
import Link from "next/link"

export default function BarberDetailPage() {
  const { id } = useParams()
  const [barbero, setBarbero] = useState<BarberProfile | null>(null)
  const [reseñas, setReseñas] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const barberId = Number(id)
        const [barberData, reviewsData] = await Promise.all([getBarbero(barberId), getReseñasBarbero(barberId)])
        setBarbero(barberData)
        setReseñas(reviewsData)
      } catch (err) {
        setError("Error al cargar los datos del barbero")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !barbero) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error || "No se encontró el barbero"}</div>
        <div className="mt-4">
          <Link href="/barberos" className="text-gray-900 hover:underline">
            ← Volver a la lista de barberos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/barberos" className="text-gray-900 hover:underline">
          ← Volver a la lista de barberos
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <BarberDetail barbero={barbero} />
        </div>
        <div>
          <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Reservar Cita</h2>
            <p className="mb-4 text-gray-600">
              Reserva una cita con {barbero.user.first_name} y disfruta de un servicio profesional.
            </p>
            <Link
              href={`/citas/nueva?barbero=${barbero.id}`}
              className="block w-full rounded-md bg-gray-900 px-4 py-2 text-center text-white hover:bg-gray-800"
            >
              Reservar Ahora
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <BarberReviews reseñas={reseñas} barberoId={barbero.id} />
      </div>
    </div>
  )
}
