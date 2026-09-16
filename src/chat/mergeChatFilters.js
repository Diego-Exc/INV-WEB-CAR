export function mergeChatFilters(currentFilters, newFilters) {
  const merged = { ...currentFilters }
  for (const [key, value] of Object.entries(newFilters)) {
    if (value !== null && value !== undefined && value !== '') {
      merged[key] = value
    }
  }
  return merged
}
