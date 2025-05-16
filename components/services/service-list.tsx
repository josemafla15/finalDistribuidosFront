import type { Service } from "@/lib/types"
import ServiceCard from "./service-card"

interface ServiceListProps {
  servicios: Service[]
}

export default function ServiceList({ servicios }: ServiceListProps) {
  // Verificar que servicios sea un array
  if (!Array.isArray(servicios)) {
    console.error('servicios no es un array:', servicios)
    return <p className="text-center text-gray-600">No hay servicios disponibles.</p>
  }

  // Agrupar servicios por categorías (asumiendo que el nombre contiene la categoría)
  const categorias: Record<string, Service[]> = {}

  servicios.forEach((servicio) => {
    // Extraer categoría del nombre (esto es un ejemplo, ajustar según tus datos)
    const categoria = servicio.name.includes("Barba")
      ? "Barba"
      : servicio.name.includes("Cabello")
        ? "Cabello"
        : "Otros"

    if (!categorias[categoria]) {
      categorias[categoria] = []
    }

    categorias[categoria].push(servicio)
  })

  return (
    <div className="space-y-12">
      {Object.entries(categorias).map(([categoria, serviciosCategoria]) => (
        <div key={categoria}>
          <h2 className="mb-6 text-2xl font-semibold">{categoria}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviciosCategoria.map((servicio) => (
              <ServiceCard key={servicio.id} servicio={servicio} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}