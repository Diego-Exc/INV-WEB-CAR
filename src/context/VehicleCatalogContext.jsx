import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getVehicleCatalogProgressive,
  filterVehicles,
  getMakeList,
} from '../services/vehicleCatalogService.js'

const VehicleCatalogContext = createContext(null)

export function VehicleCatalogProvider({ children }) {
  const [allVehicles, setAllVehicles] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [compareIds, setCompareIds] = useState([])

  useEffect(() => {
    let cancelled = false
    const initial = getVehicleCatalogProgressive((upgraded) => {
      if (!cancelled) setAllVehicles(upgraded)
    })
    setAllVehicles(initial)
    setLoading(false)
    return () => {
      cancelled = true
    }
  }, [])

  const vehicles = useMemo(() => filterVehicles(allVehicles, filters), [allVehicles, filters])
  const makes = useMemo(() => getMakeList(allVehicles), [allVehicles])

  const onApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  const clearFilters = useCallback(() => setFilters({}), [])

  const toggleCompare = useCallback((vehicleId) => {
    setCompareIds((prev) => {
      if (prev.includes(vehicleId)) return prev.filter((id) => id !== vehicleId)
      if (prev.length >= 2) return [prev[1], vehicleId]
      return [...prev, vehicleId]
    })
  }, [])

  const clearCompare = useCallback(() => setCompareIds([]), [])

  const value = {
    vehicles,
    allVehicles,
    makes,
    filters,
    setFilters: onApplyFilters,
    onApplyFilters,
    clearFilters,
    loading,
    error,
    compareIds,
    toggleCompare,
    clearCompare,
    resultsCount: vehicles.length,
  }

  return <VehicleCatalogContext.Provider value={value}>{children}</VehicleCatalogContext.Provider>
}

export function useVehicleCatalog() {
  const ctx = useContext(VehicleCatalogContext)
  if (!ctx) throw new Error('useVehicleCatalog must be used within VehicleCatalogProvider')
  return ctx
}
