import { createFileRoute } from '@tanstack/react-router'

import { SubmitOpportunityPage } from '#/features/submissions/pages/submit-opportunity-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/(protected)/submissions')({
  component: SubmitOpportunityPage,
  head: () =>
    pageMeta({
      title: 'Submit an opportunity',
      description:
        'Submit a funding opportunity for women entrepreneurs to the Ekehi team for review.',
      path: '/submissions',
      noIndex: true,
    }),
})
