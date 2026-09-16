const AGENTS = [
  { name: 'Mateo Rivas', phone: '+1 305 555 0142' },
  { name: 'Camila Soto', phone: '+1 786 555 0198' },
  { name: 'Andrés Vega', phone: '+1 213 555 0177' },
  { name: 'Valentina Cruz', phone: '+1 646 555 0163' },
  { name: 'Diego Fonseca', phone: '+1 415 555 0129' },
]

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export function getAssignedAgent(vehicle) {
  const idx = hash(vehicle.vin) % AGENTS.length
  return AGENTS[idx]
}

export function getUnitCode(vehicle) {
  return vehicle.vin.slice(-4)
}
