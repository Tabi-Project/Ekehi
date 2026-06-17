import { createFileRoute } from '@tanstack/react-router'

import { ResourcesPage } from '#/features/resources/pages/resources-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/resources/')({
  component: ResourcesPage,
  head: () =>
    pageMeta({
      title: 'Resources',
      description:
        'Guides, training, and templates to help you grow with Ekehi.',
      path: '/resources',
    }),
})
