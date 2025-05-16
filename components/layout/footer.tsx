import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">Barbería</h3>
            <p className="text-gray-400">
              Ofrecemos servicios de barbería de alta calidad con los mejores profesionales.
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/barberos" className="text-gray-400 hover:text-white">
                  Barberos
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-400 hover:text-white">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/citas/nueva" className="text-gray-400 hover:text-white">
                  Reservar Cita
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/servicios" className="text-gray-400 hover:text-white">
                  Corte de Cabello
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-400 hover:text-white">
                  Afeitado
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-400 hover:text-white">
                  Arreglo de Barba
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-400 hover:text-white">
                  Tratamientos Capilares
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Contacto</h3>
            <address className="not-italic text-gray-400">
              <p>Calle Principal 123</p>
              <p>Ciudad, CP 12345</p>
              <p className="mt-2">
                <a href="tel:+123456789" className="hover:text-white">
                  +1 234 567 89
                </a>
              </p>
              <p>
                <a href="mailto:info@barberia.com" className="hover:text-white">
                  info@barberia.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Barbería. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
