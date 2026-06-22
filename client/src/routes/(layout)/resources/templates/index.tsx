import { createFileRoute } from '@tanstack/react-router'

import { TemplatePage } from '#/features/resources/pages/template-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/resources/templates/')({
  component: TemplatePage,
  head: () =>
    pageMeta({
      title: 'Templates',
      description: 'Ready-to-use templates curated by Ekehi.',
      path: '/resources/templates',
    }),
})
