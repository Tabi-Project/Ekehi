import { createFileRoute } from '@tanstack/react-router'

import { AdminPage } from '#/features/admin/pages/admin-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
  head: () =>
    pageMeta({
      title: 'Admin',
      path: '/admin',
      noIndex: true,
    }),
})
