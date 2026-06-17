import { z } from 'zod'

import { ENDPOINTS } from '#/config/endpoints'
import { env } from '#/config/env'
import { clearTokens, getRefreshToken, setTokens } from '#/lib/auth/token-store'

const refreshEnvelopeSchema = z.object({
  success: z.literal(true),
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_at: z.number().optional(),
  }),
})

let inflight: Promise<boolean> | null = null

export function refreshSession(): Promise<boolean> {
  if (inflight) return inflight
  inflight = doRefresh().finally(() => {
    inflight = null
  })
  return inflight
}

async function doRefresh(): Promise<boolean> {
  const refresh_token = getRefreshToken()
  if (!refresh_token) return false

  try {
    const response = await fetch(
      `${env.VITE_API_BASE_URL}${ENDPOINTS.auth.refresh}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
      },
    )

    if (!response.ok) {
      clearTokens()
      return false
    }

    const parsed = refreshEnvelopeSchema.safeParse(await response.json())
    if (!parsed.success) {
      clearTokens()
      return false
    }

    setTokens({
      access_token: parsed.data.data.access_token,
      refresh_token: parsed.data.data.refresh_token,
    })
    return true
  } catch {
    clearTokens()
    return false
  }
}
