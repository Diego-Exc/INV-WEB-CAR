function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Coupe', 'Minivan']
const FUEL_TYPES = ['Gasolina', 'Híbrido', 'Diésel', 'Eléctrico']
const TRANSMISSIONS = ['Automática', 'Manual', 'CVT']
const COLORS = ['Blanco Perla', 'Negro Obsidiana', 'Gris Grafito', 'Plata Metálico', 'Azul Medianoche', 'Rojo Rubí']
const DRIVETRAINS = ['FWD', 'RWD', 'AWD', '4WD']

const BASE_PRICE_BY_BODY = {
  Sedan: 18000,
  SUV: 24000,
  Hatchback: 15000,
  Pickup: 26000,
  Coupe: 21000,
  Minivan: 22000,
}

const BASE_DIMENSIONS_BY_BODY = {
  Sedan: { length: 4650, width: 1800, height: 1450 },
  SUV: { length: 4700, width: 1850, height: 1650 },
  Hatchback: { length: 4200, width: 1750, height: 1480 },
  Pickup: { length: 5300, width: 1900, height: 1800 },
  Coupe: { length: 4550, width: 1800, height: 1380 },
  Minivan: { length: 4800, width: 1850, height: 1750 },
}

export function pickBodyType(seedStr) {
  const rng = mulberry32(hashSeed(seedStr + '::body'))
  return BODY_TYPES[Math.floor(rng() * BODY_TYPES.length)]
}

export function generateListing({ make, model, index = 0 }) {
  const seedStr = `${make}::${model}::${index}`
  const rng = mulberry32(hashSeed(seedStr))

  const currentYear = new Date().getFullYear()
  const year = currentYear - Math.floor(rng() * 9)
  const bodyType = BODY_TYPES[Math.floor(rng() * BODY_TYPES.length)]
  const fuelType = FUEL_TYPES[Math.floor(rng() * FUEL_TYPES.length)]
  const transmission = TRANSMISSIONS[Math.floor(rng() * TRANSMISSIONS.length)]
  const drivetrain = DRIVETRAINS[Math.floor(rng() * DRIVETRAINS.length)]
  const color = COLORS[Math.floor(rng() * COLORS.length)]

  const age = currentYear - year
  const mileage = Math.round((8000 + rng() * 9000) * age + rng() * 5000)

  const basePrice = BASE_PRICE_BY_BODY[bodyType] ?? 19000
  const depreciation = Math.pow(0.88, age)
  const trimFactor = 0.85 + rng() * 0.5
  const mileagePenalty = Math.max(0.65, 1 - mileage / 250000)
  const price = Math.round((basePrice * depreciation * trimFactor * mileagePenalty) / 50) * 50

  const engineSizes = ['1.6L I4', '2.0L I4', '2.5L I4', '3.0L V6', '3.5L V6', 'Motor Eléctrico 150kW']
  const engine = fuelType === 'Eléctrico' ? engineSizes[5] : engineSizes[Math.floor(rng() * 5)]
  const horsepower = fuelType === 'Eléctrico'
    ? Math.round(150 + rng() * 150)
    : Math.round(120 + rng() * 220)
  const mpg = fuelType === 'Eléctrico' ? null : Math.round(22 + rng() * 18)

  const doors = bodyType === 'Coupe' ? 2 : 4
  const seats = bodyType === 'Minivan' ? 7 : bodyType === 'Pickup' ? 5 : bodyType === 'Coupe' ? 4 : 5

  const vin = generateFakeVin(seedStr)
  const id = `sim-${hashSeed(seedStr)}`

  const dimBase = BASE_DIMENSIONS_BY_BODY[bodyType] ?? BASE_DIMENSIONS_BY_BODY.Sedan
  const dimVariance = () => 0.94 + rng() * 0.12
  const dimensions = {
    lengthMm: Math.round(dimBase.length * dimVariance()),
    widthMm: Math.round(dimBase.width * dimVariance()),
    heightMm: Math.round(dimBase.height * dimVariance()),
  }

  return {
    id,
    source: 'estimated',
    make,
    model,
    year,
    bodyType,
    fuelType,
    transmission,
    drivetrain,
    color,
    engine,
    horsepower,
    mpg,
    doors,
    seats,
    mileage,
    price,
    vin,
    dimensions,
    title: `${year} ${make} ${model}`,
    location: pickLocation(rng),
    condition: mileage < 15000 ? 'Como nuevo' : mileage < 60000 ? 'Excelente' : 'Buen estado',
  }
}

const LOCATIONS = [
  'San José, CR', 'Ciudad de México, MX', 'Bogotá, CO', 'Miami, FL', 'Houston, TX',
  'Los Ángeles, CA', 'Santiago, CL', 'Lima, PE', 'Buenos Aires, AR', 'Madrid, ES',
]

function pickLocation(rng) {
  return LOCATIONS[Math.floor(rng() * LOCATIONS.length)]
}

function generateFakeVin(seedStr) {
  const rng = mulberry32(hashSeed(seedStr + '::vin'))
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'
  let vin = ''
  for (let i = 0; i < 17; i++) {
    vin += chars[Math.floor(rng() * chars.length)]
  }
  return vin
}

export function generateCollectorListing({ make, model, year, basePrice, bodyType = 'Coupe' }) {
  const seedStr = `collector::${make}::${model}::${year}`
  const rng = mulberry32(hashSeed(seedStr))

  const mileage = Math.round(28000 + rng() * 40000)
  const price = Math.round((basePrice * (0.95 + rng() * 0.3)) / 100) * 100

  const dimBase = BASE_DIMENSIONS_BY_BODY[bodyType] ?? BASE_DIMENSIONS_BY_BODY.Coupe
  const dimensions = {
    lengthMm: Math.round(dimBase.length * (0.96 + rng() * 0.06)),
    widthMm: Math.round(dimBase.width * (0.96 + rng() * 0.06)),
    heightMm: Math.round(dimBase.height * (0.96 + rng() * 0.06)),
  }

  return {
    id: `collector-${hashSeed(seedStr)}`,
    source: 'estimated',
    isCollector: true,
    make,
    model,
    year,
    bodyType,
    fuelType: 'Gasolina',
    transmission: 'Manual',
    drivetrain: rng() > 0.5 ? 'RWD' : 'FWD',
    color: COLORS[Math.floor(rng() * COLORS.length)],
    engine: '5.0L V8 Clásico',
    horsepower: Math.round(180 + rng() * 120),
    mpg: Math.round(14 + rng() * 6),
    doors: 2,
    seats: 4,
    mileage,
    price,
    vin: generateFakeVin(seedStr),
    dimensions,
    title: `${year} ${make} ${model}`,
    location: pickLocation(rng),
    condition: 'Restaurado',
  }
}

export function estimatePriceRange(listing) {
  const low = Math.round(listing.price * 0.93 / 50) * 50
  const high = Math.round(listing.price * 1.07 / 50) * 50
  return { low, high }
}
