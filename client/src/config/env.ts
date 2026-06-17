import { envSchema, formatEnvError } from './env-schema'

const parsed = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
})

if (!parsed.success) {
  throw new Error(formatEnvError(parsed.error))
}

export const env = parsed.data
