export const API_BASE_URL =
  // can override via Vite env: VITE_API_BASE_URL
  import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8080'

export const API_PREFIX =
  // backend router prefix is /api/auth etc, so usually keep empty here
  // kept for flexibility
  import.meta.env?.VITE_API_PREFIX || ''

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${API_PREFIX}${p}`
}
