import { createFileRoute } from '@tanstack/react-router'

import { GuideDetailPage } from '#/features/resources/pages/guide-detail-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/resources/guides/$id')({
  component: RouteComponent,
  head: ({ params }) =>
    pageMeta({
      title: `Guide ${params.id}`,
      description: 'A guide from Ekehi resources.',
      path: `/resources/guides/${params.id}`,
      ogType: 'article',
    }),
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <GuideDetailPage id={id} />
}
