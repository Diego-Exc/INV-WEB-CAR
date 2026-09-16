import { getMakesForVehicleType, getModelsForMake } from './nhtsaVpic.js'
import { generateListing, generateCollectorListing } from './vehicleSimulation.js'
import { POPULAR_MAKES, COLLECTOR_VEHICLES } from '../data/fallbackVehicles.js'

function withCollectorVehicles(vehicles) {
  return [...vehicles, ...COLLECTOR_VEHICLES.map(generateCollectorListing)]
}

const LISTINGS_PER_MODEL = 2
const CATALOG_CACHE_KEY = 'escor.catalog.v3'
const CATALOG_CACHE_TTL = 1000 * 60 * 60 * 12

let inMemoryCatalog = null

function readLocalCache() {
  try {
    const raw = localStorage.getItem(CATALOG_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.timestamp > CATALOG_CACHE_TTL) return null
    return parsed.vehicles
  } catch {
    return null
  }
}

function writeLocalCache(vehicles) {
  try {
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), vehicles }))
  } catch {
    /* storage unavailable, ignore */
  }
}

async function buildCatalogFromNhtsa() {
  const makesResult = await getMakesForVehicleType('car')
  const availableMakeNames = new Set(makesResult.map((m) => m.makeName.toUpperCase()))

  const makesToUse = POPULAR_MAKES.filter((m) => availableMakeNames.has(m.makeName.toUpperCase()))
  const finalMakes = makesToUse.length ? makesToUse : POPULAR_MAKES

  const modelsByMake = await Promise.all(
    finalMakes.map(async (makeEntry) => {
      try {
        const nhtsaModels = await getModelsForMake(makeEntry.makeName)
        const modelNames = nhtsaModels.map((m) => m.modelName)
        const intersect = makeEntry.models.filter((mn) =>
          modelNames.some((n) => n.toLowerCase() === mn.toLowerCase()),
        )
        return intersect.length ? intersect : makeEntry.models.slice(0, 3)
      } catch {
        return makeEntry.models.slice(0, 3)
      }
    }),
  )

  const vehicles = []
  finalMakes.forEach((makeEntry, idx) => {
    for (const model of modelsByMake[idx]) {
      for (let i = 0; i < LISTINGS_PER_MODEL; i++) {
        vehicles.push(generateListing({ make: makeEntry.makeName, model, index: i }))
      }
    }
  })

  return vehicles
}

function buildCatalogFromFallback() {
  const vehicles = []
  for (const makeEntry of POPULAR_MAKES) {
    for (const model of makeEntry.models) {
      for (let i = 0; i < LISTINGS_PER_MODEL; i++) {
        vehicles.push(generateListing({ make: makeEntry.makeName, model, index: i }))
      }
    }
  }
  return vehicles
}

export async function getVehicleCatalog() {
  if (inMemoryCatalog) return inMemoryCatalog

  const cached = readLocalCache()
  if (cached) {
    inMemoryCatalog = cached
    return cached
  }

  let vehicles
  try {
    vehicles = await buildCatalogFromNhtsa()
    if (!vehicles.length) throw new Error('empty catalog from NHTSA')
  } catch {
    vehicles = buildCatalogFromFallback()
  }

  vehicles = withCollectorVehicles(vehicles)
  inMemoryCatalog = vehicles
  writeLocalCache(vehicles)
  return vehicles
}

/**
 * Renders instantly with the local catalog, then upgrades in the background
 * to NHTSA-sourced makes/models once that resolves, via onUpgrade.
 */
export function getVehicleCatalogProgressive(onUpgrade) {
  if (inMemoryCatalog) return inMemoryCatalog

  const cached = readLocalCache()
  if (cached) {
    inMemoryCatalog = cached
    return cached
  }

  const fallback = withCollectorVehicles(buildCatalogFromFallback())

  buildCatalogFromNhtsa()
    .then((vehicles) => {
      if (!vehicles.length) throw new Error('empty catalog from NHTSA')
      const upgraded = withCollectorVehicles(vehicles)
      inMemoryCatalog = upgraded
      writeLocalCache(upgraded)
      onUpgrade?.(upgraded)
    })
    .catch(() => {
      inMemoryCatalog = fallback
      writeLocalCache(fallback)
    })

  return fallback
}

export function filterVehicles(vehicles, filters = {}) {
  return vehicles.filter((v) => {
    if (filters.make && v.make.toLowerCase() !== filters.make.toLowerCase()) return false
    if (filters.model && v.model.toLowerCase() !== filters.model.toLowerCase()) return false
    if (filters.bodyType && v.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) return false
    if (filters.transmission && v.transmission.toLowerCase() !== filters.transmission.toLowerCase()) return false
    if (filters.maxBudget && v.price > filters.maxBudget) return false
    if (filters.minBudget && v.price < filters.minBudget) return false
    if (filters.minYear && v.year < filters.minYear) return false
    if (filters.maxYear && v.year > filters.maxYear) return false
    if (filters.fuelType && v.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) return false
    if (filters.collectorOnly && !v.isCollector) return false
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const haystack = `${v.make} ${v.model} ${v.bodyType} ${v.fuelType}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export function sortVehicles(vehicles, sortKey) {
  const sorted = [...vehicles]
  if (sortKey === 'price-desc') sorted.sort((a, b) => b.price - a.price)
  else if (sortKey === 'price-asc') sorted.sort((a, b) => a.price - b.price)
  else if (sortKey === 'year-desc') sorted.sort((a, b) => b.year - a.year)
  else if (sortKey === 'mileage-asc') sorted.sort((a, b) => a.mileage - b.mileage)
  return sorted
}

export function getMakeList(vehicles) {
  return [...new Set(vehicles.map((v) => v.make))].sort()
}

export function getModelsForSelectedMake(vehicles, make) {
  if (!make) return []
  return [...new Set(vehicles.filter((v) => v.make === make).map((v) => v.model))].sort()
}

export function getVehicleById(vehicles, id) {
  return vehicles.find((v) => v.id === id) ?? null
}
