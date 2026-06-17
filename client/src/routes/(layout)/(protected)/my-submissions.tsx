import { createFileRoute } from '@tanstack/react-router'

import { MySubmissionsPage } from '#/features/submissions/pages/my-submissions-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/(protected)/my-submissions')({
  component: MySubmissionsPage,
  head: () =>
    pageMeta({
      title: 'My submissions',
      description: 'Your Ekehi submissions.',
      path: '/my-submissions',
      noIndex: true,
    }),
})
