import { createFileRoute } from '@tanstack/react-router'

import { ReviewPage } from '#/features/admin/pages/review-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/admin/review')({
  component: ReviewPage,
  head: () =>
    pageMeta({
      title: 'Admin · Review',
      path: '/admin/review',
      noIndex: true,
    }),
})
