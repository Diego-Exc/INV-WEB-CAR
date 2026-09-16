import { estimatePriceRange } from './vehicleSimulation.js'

export function formatUSD(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getPriceEstimate(listing) {
  const { low, high } = estimatePriceRange(listing)
  return {
    low,
    high,
    display: `${formatUSD(low)} – ${formatUSD(high)}`,
  }
}

export function withinBudget(listing, maxBudget) {
  if (!maxBudget) return true
  return listing.price <= maxBudget
}
