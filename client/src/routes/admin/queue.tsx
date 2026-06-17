import { createFileRoute } from '@tanstack/react-router'

import { QueuePage } from '#/features/admin/pages/queue-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/admin/queue')({
  component: QueuePage,
  head: () =>
    pageMeta({
      title: 'Admin · Queue',
      path: '/admin/queue',
      noIndex: true,
    }),
})
