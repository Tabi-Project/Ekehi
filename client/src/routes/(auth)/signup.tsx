import { createFileRoute } from '@tanstack/react-router'

import { SignupPage } from '#/features/auth/pages/signup-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(auth)/signup')({
  component: SignupPage,
  head: () =>
    pageMeta({
      title: 'Sign up',
      description:
        'Create an Ekehi account to submit work and join the community.',
      path: '/signup',
      noIndex: true,
    }),
})
