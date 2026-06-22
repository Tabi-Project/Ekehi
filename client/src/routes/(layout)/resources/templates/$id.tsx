import { createFileRoute } from '@tanstack/react-router'

import { TemplateDetailPage } from '#/features/resources/pages/template-detail-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/resources/templates/$id')({
  component: RouteComponent,
  head: ({ params }) =>
    pageMeta({
      title: `Template ${params.id}`,
      description: 'A ready-to-use template from Ekehi resources.',
      path: `/resources/templates/${params.id}`,
      ogType: 'article',
    }),
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <TemplateDetailPage id={id} />
}
