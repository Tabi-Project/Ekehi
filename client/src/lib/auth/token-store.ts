const ACCESS_KEY = 'ekehi_access_token'
const REFRESH_KEY = 'ekehi_refresh_token'

const isBrowser = () => typeof window !== 'undefined'

export function getAccessToken(): string | null {
  if (!isBrowser()) return null
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens(tokens: {
  access_token: string
  refresh_token: string
}) {
  if (!isBrowser()) return
  localStorage.setItem(ACCESS_KEY, tokens.access_token)
  localStorage.setItem(REFRESH_KEY, tokens.refresh_token)
}

export function clearTokens() {
  if (!isBrowser()) return
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}
