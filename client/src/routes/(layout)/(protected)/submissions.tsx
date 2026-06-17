import { createFileRoute } from '@tanstack/react-router'

import { SubmissionsPage } from '#/features/submissions/pages/submissions-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/(protected)/submissions')({
  component: SubmissionsPage,
  head: () =>
    pageMeta({
      title: 'Submissions',
      description: 'Submissions on Ekehi.',
      path: '/submissions',
      noIndex: true,
    }),
})
