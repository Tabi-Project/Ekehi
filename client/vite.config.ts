import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { FontaineTransform } from 'fontaine'
import { defineConfig, loadEnv } from 'vite'

import { envSchema, formatEnvError } from './src/config/env-schema'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const parsed = envSchema.safeParse(env)

  if (!parsed.success) {
    throw new Error(formatEnvError(parsed.error))
  }

  return {
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
    resolve: { tsconfigPaths: true },
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackRouter({ target: 'react', autoCodeSplitting: true }),
      viteReact(),
      // Generates fallback @font-face metric overrides (size-adjust,
      // ascent-override) so system fonts occupy the same space as the web
      // fonts — eliminates layout shift on font swap.
      FontaineTransform.vite({
        fallbacks: ['system-ui', 'Georgia', 'serif'],
      }),
    ],
  }
})
