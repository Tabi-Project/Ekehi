import { createFileRoute } from '@tanstack/react-router'

import { SubmissionsPage } from '#/features/submissions/pages/submissions-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/(protected)/submissions')({
  component: SubmissionsPage,
  head: () =>
    pageMeta({
      title: 'Submit an opportunity',
      description:
        'Submit a funding opportunity for women entrepreneurs to the Ekehi team for review.',
      path: '/submissions',
      noIndex: true,
    }),
})
