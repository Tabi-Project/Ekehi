import { createFileRoute } from '@tanstack/react-router'

import { TrainingPage } from '#/features/resources/pages/training-page'
import { trainingsListOptions } from '#/features/resources/resources.query'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/resources/trainings/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(trainingsListOptions()),
  component: TrainingPage,
  head: () =>
    pageMeta({
      title: 'Training',
      description: 'Training programs and learning paths from Ekehi.',
      path: '/resources/training',
    }),
})
