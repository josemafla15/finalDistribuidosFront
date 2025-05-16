"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { updateProfile } from "@/lib/auth"
import Link from "next/link"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await updateProfile(formData)
      setSuccess(true)

      // Recargar la página para actualizar los datos del usuario
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el perfil")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-bold">Acceso Restringido</h1>
          <p className="mb-6 text-gray-600">Debes iniciar sesión para ver tu perfil.</p>
          <Link href="/login" className="inline-block rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Mi Perfil</h1>

      <div className="mx-auto max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
              Perfil actualizado correctamente.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="first_name" className="mb-1 block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="last_name" className="mb-1 block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="phone_number" className="mb-1 block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar Perfil"}
              </button>

              <Link
                href="/citas"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
              >
                Mis Citas
              </Link>

              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-red-300 bg-white px-4 py-2 text-red-700 hover:bg-red-50"
              >
                Cerrar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
