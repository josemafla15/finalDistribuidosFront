"use client"

import type React from "react"

import { useState } from "react"
import { Star, User } from "lucide-react"
import type { Review } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"
import { crearReseña } from "@/lib/api"

interface BarberReviewsProps {
  reseñas: Review[]
  barberoId: number
}

export default function BarberReviews({ reseñas, barberoId }: BarberReviewsProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError("Debes iniciar sesión para dejar una reseña")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await crearReseña({
        barber: barberoId,
        rating,
        comment,
      })
      setSuccess(true)
      setComment("")
      // Idealmente aquí recargaríamos las reseñas, pero para simplificar no lo hacemos
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar la reseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Reseñas y Calificaciones</h2>

      {user && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Deja tu opinión</h3>

          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">¡Gracias por tu reseña!</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Calificación</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setRating(value)} className="p-1">
                    <Star
                      className={`h-6 w-6 ${value <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="mb-1 block text-sm font-medium text-gray-700">
                Comentario
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                rows={4}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Reseña"}
            </button>
          </form>
        </div>
      )}

      {reseñas.length > 0 ? (
        <div className="space-y-6">
          {reseñas.map((reseña) => (
            <div key={reseña.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {reseña.customer_details?.first_name} {reseña.customer_details?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(reseña.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="ml-1 font-medium">{reseña.rating}</span>
                </div>
              </div>
              <p className="text-gray-600">{reseña.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Aún no hay reseñas para este barbero. ¡Sé el primero en dejar una!</p>
      )}
    </div>
  )
}
