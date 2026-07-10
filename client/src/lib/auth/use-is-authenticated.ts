import { useSyncExternalStore } from 'react'

import { getAccessToken, subscribeToTokens } from './token-store'

/**
 * Reactive auth flag: re-renders when tokens change in this tab or another.
 * Use this instead of reading getAccessToken() during render.
 */
export function useIsAuthenticated(): boolean {
  return useSyncExternalStore(
    subscribeToTokens,
    () => Boolean(getAccessToken()),
    () => false,
  )
}
