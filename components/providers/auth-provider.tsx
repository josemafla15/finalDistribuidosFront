"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User, LoginCredentials, RegisterData, AuthResponse } from "@/lib/types"
import { login as apiLogin, register as apiRegister, getProfile, logout as apiLogout } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un token en localStorage
    const token = localStorage.getItem("token")
    if (token) {
      getProfile(token)
        .then((userData) => {
          setUser(userData)
        })
        .catch((error) => {
          console.error("Error al obtener perfil:", error)
          localStorage.removeItem("token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    try {
      console.log("Enviando datos de login:", credentials)

      const { token, user } = await apiLogin(credentials)

      console.log("Login exitoso, token recibido:", token ? "Sí" : "No")

      localStorage.setItem("token", token)
      setUser(user)
      router.push("/")
    } catch (error) {
      console.error("Error en login (provider):", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    try {
      console.log("Registrando usuario con datos:", data)

      const response = await apiRegister(data)
      console.log("Respuesta del registro de usuario:", response)

      // Verificar si la respuesta incluye token y usuario
      if ("token" in response && "user" in response) {
        const authResponse = response as AuthResponse
        localStorage.setItem("token", authResponse.token)
        setUser(authResponse.user)
      }

      return { success: true }
    } catch (error) {
      console.error("Error en el registro:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error al registrar usuario",
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    apiLogout()
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
