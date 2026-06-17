import { createFileRoute } from '@tanstack/react-router'

import { ContributorsPage } from '#/features/site/pages/contributors-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/contributors')({
  component: ContributorsPage,
  head: () =>
    pageMeta({
      title: 'Contributors',
      description:
        'Meet the contributors building and growing the Ekehi community.',
      path: '/contributors',
    }),
})
