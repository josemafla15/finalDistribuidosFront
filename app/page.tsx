import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Scissors, Calendar, Star } from "lucide-react"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-20 text-white">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image src="/images/hero.jpg" alt="Barbería" fill className="object-cover" priority />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
              Reserva tu cita con los mejores barberos
            </h1>
            <p className="mb-8 text-lg text-gray-300">
              Ofrecemos servicios de alta calidad con los mejores profesionales. Reserva tu cita ahora y luce tu mejor
              estilo.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
              <Link
                href="/citas/nueva"
                className="rounded-md bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
              >
                Reservar Ahora
              </Link>
              <Link
                href="/barberos"
                className="rounded-md border border-white px-8 py-3 text-base font-medium text-white hover:bg-white/10"
              >
                Ver Barberos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">¿Por qué elegirnos?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Scissors className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Barberos Profesionales</h3>
              <p className="text-gray-600">
                Nuestros barberos son profesionales con años de experiencia y formación continua.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Calendar className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Reservas Fáciles</h3>
              <p className="text-gray-600">
                Sistema de reservas online fácil de usar, disponible 24/7 para tu comodidad.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Star className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Servicio de Calidad</h3>
              <p className="text-gray-600">
                Nos comprometemos a ofrecer el mejor servicio y experiencia a todos nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold">¿Listo para un nuevo look?</h2>
            <p className="mb-8 text-lg text-gray-600">
              Reserva tu cita ahora y déjate atender por los mejores profesionales.
            </p>
            <Link
              href="/citas/nueva"
              className="inline-flex items-center rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800"
            >
              Reservar Cita <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Cómo Funciona</h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Elige un Barbero</h3>
              <p className="text-gray-600">
                Explora perfiles y encuentra el barbero que mejor se adapte a tus necesidades.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Selecciona un Servicio</h3>
              <p className="text-gray-600">Elige entre nuestra variedad de servicios de barbería y estética.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Escoge Fecha y Hora</h3>
              <p className="text-gray-600">Selecciona el día y la hora que mejor se adapte a tu agenda.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                4
              </div>
              <h3 className="mb-2 text-xl font-semibold">¡Listo!</h3>
              <p className="text-gray-600">Recibe confirmación de tu cita y prepárate para lucir increíble.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
