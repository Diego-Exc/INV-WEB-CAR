import { estimatePriceRange } from './vehicleSimulation.js'

const MAKE_NOTES = {
  Toyota: 'Toyota es reconocida por su bajísima tasa de fallas mecánicas.',
  Honda: 'Honda destaca por la durabilidad de motor y transmisión.',
  Ford: 'Ford ofrece buena disponibilidad de repuestos en la región.',
  Chevrolet: 'Chevrolet mantiene costos de mantenimiento accesibles.',
  Nissan: 'Nissan suele tener buena relación equipamiento-precio.',
  Hyundai: 'Hyundai destaca por su garantía de fábrica extendida.',
  Kia: 'Kia ofrece un excelente respaldo de garantía.',
  Mazda: 'Mazda es valorada por su manejo y calidad de interiores.',
  Volkswagen: 'Volkswagen ofrece buen comportamiento en carretera.',
  Subaru: 'Subaru destaca por su tracción integral de serie.',
}

export function generateInsight(vehicle) {
  const tips = []
  const { low, high } = estimatePriceRange(vehicle)

  if (vehicle.price <= low) {
    tips.push('Precio por debajo del rango de mercado estimado: buena oportunidad de negociación.')
  } else if (vehicle.price >= high) {
    tips.push('Precio en el extremo alto del rango estimado para este modelo y año.')
  } else {
    tips.push('Precio alineado con el rango de mercado estimado para este modelo.')
  }

  const age = Math.max(1, new Date().getFullYear() - vehicle.year)
  const kmPerYear = vehicle.mileage / age
  if (kmPerYear < 12000) {
    tips.push('Kilometraje anual bajo para su antigüedad: indicio de buen uso.')
  } else if (kmPerYear > 20000) {
    tips.push('Kilometraje anual alto: consulte el historial de mantenimiento.')
  } else if (MAKE_NOTES[vehicle.make]) {
    tips.push(MAKE_NOTES[vehicle.make])
  }

  return tips.slice(0, 2)
}

export function generateDescription(vehicle) {
  const conditionLine = {
    'Como nuevo': 'Unidad con kilometraje excepcionalmente bajo y mantenimiento al día.',
    Excelente: 'Historial de mantenimiento completo y verificado, lista para transferir.',
    'Buen estado': 'Mecánica revisada y verificada, ideal para uso diario sin sorpresas.',
    Restaurado: 'Restauración documentada, piezas originales conservadas donde fue posible.',
  }[vehicle.condition] || 'Vehículo inspeccionado y verificado por nuestro equipo técnico.'

  const traction = vehicle.drivetrain === 'AWD' || vehicle.drivetrain === '4WD'
    ? 'tracción integral para mayor estabilidad en cualquier terreno'
    : `tracción ${vehicle.drivetrain}`

  return `${vehicle.title} equipado con ${vehicle.engine}, ${vehicle.transmission.toLowerCase()} y ${traction}. ` +
    `${conditionLine} Disponible para inspección y transferencia inmediata en ${vehicle.location}.`
}
