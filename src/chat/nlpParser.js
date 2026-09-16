import { POPULAR_MAKES, BODY_TYPE_OPTIONS } from '../data/fallbackVehicles.js'

const BODY_SYNONYMS = {
  suv: 'SUV',
  camioneta: 'SUV',
  todoterreno: 'SUV',
  sedan: 'Sedan',
  sedán: 'Sedan',
  hatchback: 'Hatchback',
  compacto: 'Hatchback',
  pickup: 'Pickup',
  'pick-up': 'Pickup',
  cajon: 'Pickup',
  coupe: 'Coupe',
  cupé: 'Coupe',
  minivan: 'Minivan',
  furgoneta: 'Minivan',
  grande: 'SUV',
  amplio: 'SUV',
  amplia: 'SUV',
  espacioso: 'SUV',
  espaciosa: 'SUV',
  pequeño: 'Hatchback',
  pequeno: 'Hatchback',
  chico: 'Hatchback',
  chica: 'Hatchback',
  compacta: 'Hatchback',
  deportivo: 'Coupe',
  deportiva: 'Coupe',
}

const FUEL_SYNONYMS = {
  hibrido: 'Híbrido',
  híbrido: 'Híbrido',
  electrico: 'Eléctrico',
  eléctrico: 'Eléctrico',
  gasolina: 'Gasolina',
  diesel: 'Diésel',
  diésel: 'Diésel',
}

function normalize(text) {
  return text.toLowerCase().trim()
}

function extractBudget(text) {
  const under = text.match(/(?:bajo|menos de|por debajo de|hasta|max(?:imo)?\s*)\$?\s*([\d.,]+)\s*(k|mil)?/i)
  if (under) {
    let value = parseFloat(under[1].replace(/,/g, ''))
    if (under[2]) value *= 1000
    return { maxBudget: Math.round(value) }
  }
  const over = text.match(/(?:sobre|más de|mas de|desde)\s*\$?\s*([\d.,]+)\s*(k|mil)?/i)
  if (over) {
    let value = parseFloat(over[1].replace(/,/g, ''))
    if (over[2]) value *= 1000
    return { minBudget: Math.round(value) }
  }
  const between = text.match(/entre\s*\$?\s*([\d.,]+)\s*(k|mil)?\s*(?:y|a)\s*\$?\s*([\d.,]+)\s*(k|mil)?/i)
  if (between) {
    let min = parseFloat(between[1].replace(/,/g, ''))
    if (between[2]) min *= 1000
    let max = parseFloat(between[3].replace(/,/g, ''))
    if (between[4]) max *= 1000
    return { minBudget: Math.round(min), maxBudget: Math.round(max) }
  }
  const bare = text.match(/\$\s*([\d.,]+)\s*(k|mil)?/i)
  if (bare) {
    let value = parseFloat(bare[1].replace(/,/g, ''))
    if (bare[2]) value *= 1000
    return { maxBudget: Math.round(value) }
  }
  return {}
}

function extractYear(text) {
  const range = text.match(/(?:del|desde)\s*(\d{4})\s*(?:al|a|hasta)\s*(\d{4})/i)
  if (range) {
    return { minYear: parseInt(range[1], 10), maxYear: parseInt(range[2], 10) }
  }
  const after = text.match(/(?:después de|despues de|posterior a)\s*(\d{4})/i)
  if (after) return { minYear: parseInt(after[1], 10) }
  const before = text.match(/(?:antes de|anterior a)\s*(\d{4})/i)
  if (before) return { maxYear: parseInt(before[1], 10) }
  const single = text.match(/\b(19[89]\d|20[0-3]\d)\b/)
  if (single) return { minYear: parseInt(single[1], 10) }
  return {}
}

function extractBodyType(text) {
  for (const [syn, type] of Object.entries(BODY_SYNONYMS)) {
    if (text.includes(syn)) return type
  }
  for (const type of BODY_TYPE_OPTIONS) {
    if (text.includes(type.toLowerCase())) return type
  }
  return null
}

function extractFuelType(text) {
  for (const [syn, type] of Object.entries(FUEL_SYNONYMS)) {
    if (text.includes(syn)) return type
  }
  return null
}

function extractMake(text) {
  for (const entry of POPULAR_MAKES) {
    if (text.includes(entry.makeName.toLowerCase())) return entry.makeName
  }
  return null
}

function extractModel(text, make) {
  const entry = POPULAR_MAKES.find((m) => m.makeName === make)
  if (!entry) return null
  for (const model of entry.models) {
    if (text.includes(model.toLowerCase())) return model
  }
  return null
}

const FAMILY_HINT = /famil(?:ia|iar)/i
const RELIABLE_HINT = /confiabl|econ[oó]mic|ahorr/i

export function parseNaturalLanguage(rawText) {
  const text = normalize(rawText)
  const filters = {}

  const budget = extractBudget(text)
  Object.assign(filters, budget)

  const year = extractYear(text)
  Object.assign(filters, year)

  const bodyType = extractBodyType(text)
  if (bodyType) filters.bodyType = bodyType
  else if (FAMILY_HINT.test(text)) filters.bodyType = 'SUV'

  const fuelType = extractFuelType(text)
  if (fuelType) filters.fuelType = fuelType

  const make = extractMake(text)
  if (make) {
    filters.make = make
    const model = extractModel(text, make)
    if (model) filters.query = model
  }

  if (!make && RELIABLE_HINT.test(text) && !filters.maxBudget) {
    filters.maxBudget = 20000
  }

  const intent = detectIntent(text)

  return { filters, intent, rawText }
}

function detectIntent(text) {
  if (/legal|gravamen|gravámenes|\bvin\b|\bplaca\b/i.test(text)) return 'legal_info'
  if (/compar/i.test(text)) return 'compare'
  if (/pdf|ficha t[eé]cnica|documento|descargar|especificaciones/i.test(text)) return 'document'
  if (/hola|buenas|hey/i.test(text)) return 'greeting'
  if (/gracias/i.test(text)) return 'thanks'
  return 'search'
}
