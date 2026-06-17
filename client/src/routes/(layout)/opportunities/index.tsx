import { createFileRoute } from '@tanstack/react-router'

import { OpportunitiesPage } from '#/features/opportunities/pages/opportunities-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/opportunities/')({
  component: OpportunitiesPage,
  head: () =>
    pageMeta({
      title: 'Opportunities',
      description:
        'Discover open calls, programs, and opportunities curated for the Ekehi community.',
      path: '/opportunities',
    }),
})
