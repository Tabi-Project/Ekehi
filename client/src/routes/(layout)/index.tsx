import { createFileRoute } from '@tanstack/react-router'

import { LandingPage } from '#/features/site/pages/landing-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/')({
  component: LandingPage,
  head: () =>
    pageMeta({
      description:
        'Ekehi connects African creators with opportunities, resources, and a community of contributors.',
      path: '/',
    }),
})
