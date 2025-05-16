import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import type { Service } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface ServiceCardProps {
  servicio: Service
}

export default function ServiceCard({ servicio }: ServiceCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {servicio.image && (
        <div className="relative h-48 w-full">
          <Image
            src={servicio.image || "/placeholder.svg?height=300&width=400&text=Servicio"}
            alt={servicio.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{servicio.name}</h3>
          <span className="font-medium text-gray-900">{formatPrice(servicio.price)}</span>
        </div>

        <div className="mb-3 flex items-center text-sm text-gray-600">
          <Clock className="mr-1 h-4 w-4" />
          <span>{servicio.duration_minutes} minutos</span>
        </div>

        <p className="mb-4 text-sm text-gray-600">{servicio.description}</p>

        <Link
          href={`/citas/nueva?servicio=${servicio.id}`}
          className="block w-full rounded-md bg-gray-900 px-4 py-2 text-center text-sm text-white hover:bg-gray-800"
        >
          Reservar
        </Link>
      </div>
    </div>
  )
}
