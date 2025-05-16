"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loginMethod, setLoginMethod] = useState<"username" | "email">("username")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const toggleLoginMethod = () => {
    setLoginMethod((prev) => (prev === "username" ? "email" : "username"))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Verificar que las credenciales no estén vacías
      if (!formData.username.trim() || !formData.password.trim()) {
        throw new Error("Por favor ingresa tu nombre de usuario y contraseña")
      }

      // Preparar los datos de login según el método seleccionado
      const loginData =
        loginMethod === "username"
          ? { username: formData.username, password: formData.password }
          : { email: formData.username, password: formData.password }

      console.log("Intentando iniciar sesión con método:", loginMethod)
      console.log("Datos de login:", loginData)

      await login(loginData)

      // El login exitoso redirige automáticamente en el AuthProvider
    } catch (err) {
      console.error("Error en inicio de sesión:", err)
      setError(err instanceof Error ? err.message : "Error al iniciar sesión. Por favor verifica tus credenciales.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
              {loginMethod === "username" ? "Nombre de usuario" : "Correo electrónico"}
            </label>
            <input
              type={loginMethod === "email" ? "email" : "text"}
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
              required
              placeholder={loginMethod === "username" ? "Nombre de usuario" : "correo@ejemplo.com"}
            />
            <button type="button" onClick={toggleLoginMethod} className="mt-1 text-xs text-blue-600 hover:underline">
              Usar {loginMethod === "username" ? "correo electrónico" : "nombre de usuario"} en su lugar
            </button>
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

          <div className="flex justify-between pt-4">
            <Link
              href="/auth/registro"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-block"
            >
              Crear cuenta
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-medium mb-2">¿Problemas para iniciar sesión?</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Si acabas de registrarte, asegúrate de usar exactamente las mismas credenciales que usaste durante el
              registro.
            </p>
            <p className="text-sm text-gray-600">Prueba estas opciones:</p>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>Verifica que no haya espacios antes o después de tu nombre de usuario o correo</li>
              <li>Asegúrate de que las mayúsculas y minúsculas sean correctas</li>
              <li>Intenta con el método alternativo (correo electrónico en lugar de nombre de usuario o viceversa)</li>
              <li>Si olvidaste tu contraseña, contacta al administrador</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
