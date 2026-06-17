import { createFileRoute } from '@tanstack/react-router'

import { LoginPage } from '#/features/auth/pages/login-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
  head: () =>
    pageMeta({
      title: 'Log in',
      description:
        'Sign in to your Ekehi account to manage submissions and applications.',
      path: '/login',
      noIndex: true,
    }),
})
