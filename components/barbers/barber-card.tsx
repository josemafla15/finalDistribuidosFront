import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import type { BarberProfile } from "@/lib/types"

interface BarberCardProps {
  barbero: BarberProfile
}

export default function BarberCard({ barbero }: BarberCardProps) {
  return (
    <Link href={`/barberos/${barbero.id}`}>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-transform hover:scale-[1.02]">
        <div className="relative h-64 w-full">
          <Image
            src={barbero.user.profile_picture || "/placeholder.svg?height=400&width=300&text=Barbero"}
            alt={`${barbero.user.first_name} ${barbero.user.last_name}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold">
            {barbero.user.first_name} {barbero.user.last_name}
          </h2>

          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="ml-1 font-medium">{barbero.average_rating.toFixed(1)}</span>
            </div>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{barbero.years_of_experience} años de experiencia</span>
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-medium text-gray-700">Especialidades:</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {barbero.specialties.map((specialty) => (
                <span key={specialty.id} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
                  {specialty.specialty.name}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-gray-600">{barbero.bio}</p>
        </div>
      </div>
    </Link>
  )
}
