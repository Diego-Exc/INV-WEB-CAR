const BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles'

const cache = new Map()

async function fetchJson(url, timeoutMs = 4000) {
  if (cache.has(url)) return cache.get(url)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`NHTSA vPIC error ${res.status} on ${url}`)
    const json = await res.json()
    const data = json.Results ?? []
    cache.set(url, data)
    return data
  } finally {
    clearTimeout(timer)
  }
}

export async function getMakesForVehicleType(type = 'car') {
  const url = `${BASE_URL}/GetMakesForVehicleType/${encodeURIComponent(type)}?format=json`
  const results = await fetchJson(url)
  return results.map((r) => ({
    makeId: r.MakeId,
    makeName: r.MakeName,
  }))
}

export async function getModelsForMake(makeName, year) {
  const url = year
    ? `${BASE_URL}/GetModelsForMakeYear/make/${encodeURIComponent(makeName)}/modelyear/${year}?format=json`
    : `${BASE_URL}/GetModelsForMake/${encodeURIComponent(makeName)}?format=json`
  const results = await fetchJson(url)
  return results.map((r) => ({
    makeId: r.Make_ID,
    makeName: r.Make_Name,
    modelId: r.Model_ID,
    modelName: r.Model_Name,
  }))
}

export async function decodeVin(vin) {
  const url = `${BASE_URL}/DecodeVinValues/${encodeURIComponent(vin)}?format=json`
  const results = await fetchJson(url)
  return results[0] ?? null
}

export async function getVehicleTypesForMake(makeName) {
  const url = `${BASE_URL}/GetVehicleTypesForMake/${encodeURIComponent(makeName)}?format=json`
  const results = await fetchJson(url)
  return results.map((r) => r.VehicleTypeName)
}
