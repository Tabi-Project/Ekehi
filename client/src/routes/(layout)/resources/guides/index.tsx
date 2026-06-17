import { createFileRoute } from '@tanstack/react-router'

import { GuidesPage } from '#/features/resources/pages/guides-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/resources/guides/')({
  component: GuidesPage,
  head: () =>
    pageMeta({
      title: 'Guides',
      description: 'In-depth guides to help you ship great work with Ekehi.',
      path: '/resources/guides',
    }),
})
