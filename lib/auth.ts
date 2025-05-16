// lib/auth.ts
import type { User, LoginCredentials, RegisterData, AuthResponse } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    console.log("Intentando iniciar sesión con:", JSON.stringify(credentials, null, 2))

    // Verificar que el endpoint es correcto según la documentación de tu API
    const endpoint = `${API_URL}/accounts/auth/token/`
    console.log("Endpoint de autenticación:", endpoint)

    // Intentar diferentes formatos de credenciales si es necesario
    const loginData = { ...credentials }

    // Si solo se proporciona email, añadir como username también
    if (loginData.email && !loginData.username) {
      loginData.username = loginData.email
    }

    console.log("Datos de login finales:", JSON.stringify(loginData, null, 2))

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })

    console.log("Respuesta del servidor:", response.status, response.statusText)

    const responseData = await response.json()
    console.log("Datos de respuesta:", JSON.stringify(responseData, null, 2))

    if (!response.ok) {
      // Mostrar información más detallada sobre el error
      if (responseData.non_field_errors) {
        throw new Error(responseData.non_field_errors[0])
      } else if (responseData.detail) {
        throw new Error(responseData.detail)
      } else {
        throw new Error("Error de autenticación: " + JSON.stringify(responseData))
      }
    }

    // Verificar que la respuesta contiene un token
    if (!responseData.token && !responseData.key) {
      throw new Error("La respuesta del servidor no contiene un token válido")
    }

    const token = responseData.token || responseData.key

    // Obtener los datos del usuario
    const userData = await getProfile(token)

    return { token, user: userData }
  } catch (error) {
    console.error("Error de inicio de sesión:", error)
    throw error
  }
}

export async function register(data: RegisterData): Promise<AuthResponse | { success: boolean; error?: string }> {
  try {
    // Usar el endpoint para registro normal de usuarios
    const endpoint = `${API_URL}/accounts/users/`

    console.log("Registrando usuario en endpoint:", endpoint)
    console.log("Datos a enviar:", data)

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    console.log("Respuesta del registro:", JSON.stringify(responseData, null, 2))

    if (!response.ok) {
      const errorData = responseData
      const errorMessage = Object.values(errorData).flat().join(", ")
      throw new Error(errorMessage || "Error al registrarse")
    }

    // Si la respuesta incluye un token, devolver un objeto AuthResponse
    if (responseData.token || responseData.key) {
      const token = responseData.token || responseData.key

      try {
        // Intentar obtener los datos del usuario
        const userData = await getProfile(token)
        return { token, user: userData }
      } catch (error) {
        console.error("Error al obtener perfil después del registro:", error)
        // Si hay un error al obtener el perfil, devolver solo el éxito
        return { success: true }
      }
    }

    // Si no hay token, devolver solo el éxito
    return { success: true }
  } catch (error) {
    console.error("Error de registro:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrarse",
    }
  }
}

export async function getProfile(tokenParam?: string): Promise<User> {
  const token = tokenParam || (typeof localStorage !== "undefined" ? localStorage.getItem("token") : null)

  if (!token) {
    throw new Error("No hay token de autenticación")
  }

  try {
    const response = await fetch(`${API_URL}/accounts/users/me/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener el perfil")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener el perfil:", error)
    throw error
  }
}

export function logout(): void {
  // Puedes implementar una llamada al backend para invalidar el token si es necesario
  // Por ahora, solo eliminamos el token del localStorage
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("token")
  }
}
