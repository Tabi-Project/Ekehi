import { createFileRoute } from '@tanstack/react-router'

import { GuideDetailPage } from '#/features/resources/pages/guide-detail-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/resources/guides/$slug')({
  component: RouteComponent,
  head: ({ params }) =>
    pageMeta({
      title: `Guide ${params.slug}`,
      description: 'A guide from Ekehi resources.',
      path: `/resources/guides/${params.slug}`,
      ogType: 'article',
    }),
})

function RouteComponent() {
  const { slug } = Route.useParams()
  return <GuideDetailPage idOrSlug={slug} />
}
