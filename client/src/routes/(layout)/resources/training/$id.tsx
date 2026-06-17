import { createFileRoute } from '@tanstack/react-router'

import { TrainingDetailPage } from '#/features/resources/pages/training-detail-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/resources/training/$id')({
  component: RouteComponent,
  head: ({ params }) =>
    pageMeta({
      title: `Training ${params.id}`,
      description: 'A training program from Ekehi resources.',
      path: `/resources/training/${params.id}`,
      ogType: 'article',
    }),
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <TrainingDetailPage id={id} />
}
