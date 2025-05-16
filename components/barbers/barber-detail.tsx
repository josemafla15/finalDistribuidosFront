import Image from "next/image"
import { Star, Instagram, Clock } from "lucide-react"
import type { BarberProfile } from "@/lib/types"

interface BarberDetailProps {
  barbero: BarberProfile
}

export default function BarberDetail({ barbero }: BarberDetailProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative h-64 w-full sm:h-80">
        <Image
          src={barbero.user.profile_picture || "/placeholder.svg?height=800&width=600&text=Barbero"}
          alt={`${barbero.user.first_name} ${barbero.user.last_name}`}
          fill
          className="rounded-t-lg object-cover"
        />
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {barbero.user.first_name} {barbero.user.last_name}
          </h1>

          <div className="flex items-center rounded-full bg-gray-100 px-3 py-1">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="ml-1 font-medium">{barbero.average_rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {barbero.specialties.map((specialty) => (
            <span key={specialty.id} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
              {specialty.specialty.name}
            </span>
          ))}
        </div>

        <div className="mb-6 space-y-3 text-gray-600">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-400" />
            <span>{barbero.years_of_experience} años de experiencia</span>
          </div>

          {barbero.instagram_profile && (
            <div className="flex items-center">
              <Instagram className="mr-2 h-5 w-5 text-gray-400" />
              <a
                href={`https://instagram.com/${barbero.instagram_profile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:underline"
              >
                @{barbero.instagram_profile}
              </a>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Acerca de</h2>
          <p className="text-gray-600">{barbero.bio}</p>
        </div>
      </div>
    </div>
  )
}
