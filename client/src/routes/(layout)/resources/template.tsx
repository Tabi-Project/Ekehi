import { createFileRoute } from '@tanstack/react-router'

import { ResourceTemplatePage } from '#/features/resources/pages/resource-template-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/resources/template')({
  component: ResourceTemplatePage,
  head: () =>
    pageMeta({
      title: 'Templates',
      description: 'Ready-to-use templates curated by Ekehi.',
      path: '/resources/template',
    }),
})
