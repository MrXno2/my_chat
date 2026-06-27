import { apiUrl } from '../config.js'

const TOKEN_KEYS = {
  access: 'access_token',
  refresh: 'refresh_token'
}

function setCookie(name, value) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
}

function clearCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; path=/; Max-Age=0; SameSite=Lax`
}

function setTokens({ access_token, refresh_token }) {
  if (access_token) setCookie(TOKEN_KEYS.access, access_token)
  if (refresh_token) setCookie(TOKEN_KEYS.refresh, refresh_token)
}

function clearTokens() {
  clearCookie(TOKEN_KEYS.access)
  clearCookie(TOKEN_KEYS.refresh)
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
