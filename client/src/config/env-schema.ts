import { z } from 'zod'

export const envSchema = z.object({
  VITE_API_BASE_URL: z.url(),
  VITE_SITE_URL: z.url(),
})

type EnvKey = keyof z.infer<typeof envSchema>

const examples: Record<EnvKey, string> = {
  VITE_API_BASE_URL: 'http://localhost:3001/api/v1',
  VITE_SITE_URL: 'http://localhost:3000',
}

export function formatEnvError(error: z.ZodError): string {
  const issues = error.issues.map((issue) => {
    const name = String(issue.path[0])
    return `  - ${name} — ${issue.message}`
  })

  const required = (Object.keys(examples) as Array<EnvKey>).map(
    (key) => `  ${key}=${examples[key]}`,
  )

  return [
    '',
    '[env] Missing or invalid environment variables.',
    '',
    'The following variables in client/.env.local need attention:',
    '',
    ...issues,
    '',
    'Required format (add to client/.env.local):',
    '',
    ...required,
    '',
    'See client/.env.example for the full template.',
    '',
  ].join('\n')
}
