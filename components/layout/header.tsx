"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Barbería
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  href="/"
                  className={`text-sm font-medium ${
                    isActive("/") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/barberos"
                  className={`text-sm font-medium ${
                    isActive("/barberos") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Barberos
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className={`text-sm font-medium ${
                    isActive("/servicios") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Servicios
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      href="/citas"
                      className={`text-sm font-medium ${
                        isActive("/citas") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Mis Citas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/perfil"
                      className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      <User className="mr-1 h-4 w-4" />
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      <LogOut className="mr-1 h-4 w-4" />
                      Salir
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/registro"
                      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="border-b border-gray-200 bg-white md:hidden">
          <ul className="container mx-auto space-y-4 px-4 py-4">
            <li>
              <Link
                href="/"
                className={`block py-2 text-sm font-medium ${
                  isActive("/") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/barberos"
                className={`block py-2 text-sm font-medium ${
                  isActive("/barberos") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={closeMenu}
              >
                Barberos
              </Link>
            </li>
            <li>
              <Link
                href="/servicios"
                className={`block py-2 text-sm font-medium ${
                  isActive("/servicios") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={closeMenu}
              >
                Servicios
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    href="/citas"
                    className={`block py-2 text-sm font-medium ${
                      isActive("/citas") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={closeMenu}
                  >
                    Mis Citas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/perfil"
                    className="flex items-center py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    onClick={closeMenu}
                  >
                    <User className="mr-1 h-4 w-4" />
                    Perfil
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout()
                      closeMenu()
                    }}
                    className="flex w-full items-center py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="block rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link
                    href="/registro"
                    className="block rounded-md bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                    onClick={closeMenu}
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
