import { createFileRoute } from '@tanstack/react-router'

import { SubmitPage } from '#/features/submissions/pages/submit-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/(protected)/submit')({
  component: SubmitPage,
  head: () =>
    pageMeta({
      title: 'Submit',
      description: 'Submit your work to Ekehi.',
      path: '/submit',
      noIndex: true,
    }),
})
