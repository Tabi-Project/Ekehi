import { createFileRoute } from '@tanstack/react-router'

import { OpportunityDetailPage } from '#/features/opportunities/pages/opportunity-detail-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/opportunities/$id')({
  component: RouteComponent,
  head: ({ params }) =>
    pageMeta({
      title: `Opportunity ${params.id}`,
      description: 'Opportunity details on Ekehi.',
      path: `/opportunities/${params.id}`,
      ogType: 'article',
    }),
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <OpportunityDetailPage id={id} />
}
