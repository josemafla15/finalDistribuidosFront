"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Datos básicos
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  })

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
    setSuccess(null)

    try {
      const result = await register(formData)

      if (result.success) {
        setSuccess("Tu cuenta ha sido creada exitosamente.")
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setError(result.error || "Hubo un problema con el registro")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al registrar usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Crear cuenta</h1>
        <p className="text-gray-600 text-center mb-6">Regístrate para comenzar a usar nuestros servicios</p>

        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono (opcional)
            </label>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>

          <div className="flex justify-between pt-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-block"
            >
              Ya tengo cuenta
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
