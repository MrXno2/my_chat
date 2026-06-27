import { apiUrl } from '../config.js'

const TOKEN_KEYS = {
  access: 'access_token',
  refresh: 'refresh_token'
}

/**
 * Tokens are managed by backend via HttpOnly cookies.
 * Frontend must NOT persist/overwrite cookies.
 */
function setTokens(_tokenResponse) {
  // no-op
}

function clearTokens() {
  return fetch(apiUrl('/api/auth/logout'), {
    method: 'POST',
    credentials: 'include'
  })
}

export async function apiGet(path) {
  return fetch(apiUrl(path), {
    method: 'GET',
    credentials: 'include'
  })
}

export async function apiPostJson(path, body) {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body ?? {})
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // ignore
  }

  return { res, data }
}

export { setTokens, clearTokens }
