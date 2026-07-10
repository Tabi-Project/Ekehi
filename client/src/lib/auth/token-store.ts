const ACCESS_KEY = 'ekehi_access_token'
const REFRESH_KEY = 'ekehi_refresh_token'

const isBrowser = () => typeof window !== 'undefined'

type Listener = () => void

const listeners = new Set<Listener>()

function emitChange() {
  for (const listener of listeners) listener()
}

/**
 * Notifies on same-tab writes (setTokens/clearTokens) and cross-tab writes
 * (storage event). Returns an unsubscribe function; shaped for
 * useSyncExternalStore.
 */
export function subscribeToTokens(listener: Listener): () => void {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

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
  emitChange()
}

export function clearTokens() {
  if (!isBrowser()) return
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  emitChange()
}
