import { Link } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { TemplateSkeleton } from '#/components/ui/skeleton'
import { isApiError } from '#/lib/api'

import { useTemplateQuery } from '../resources.query'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function TemplateDetailPage({ id }: { id: string }) {
  const { data: template, isLoading, error } = useTemplateQuery(id)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <TemplateSkeleton />
      </div>
    )
  }

  if (error) {
    const notFound = isApiError(error) && error.status === 404

    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-20 text-center">
        <h1 className="text-content text-xl font-semibold">
          {notFound ? 'Template not found' : 'Something went wrong'}
        </h1>
        <p className="text-content-secondary">
          {notFound
            ? "We couldn't find the template you're looking for. It may have been removed or the link may be incorrect."
            : 'There was a problem loading this template. Please try again shortly.'}
        </p>
        <Link
          to="/resources/templates"
          className="text-primary hover:text-primary-hover text-sm font-medium"
        >
          ← Back to templates
        </Link>
      </div>
    )
  }

  if (!template) {
    return null
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
      <Link
        to="/resources/templates"
        className="text-content-secondary hover:text-content text-sm font-medium"
      >
        ← Back to templates
      </Link>

      <div className="flex flex-col gap-3">
        {template.category && (
          <span className="bg-surface-subtle text-content-secondary w-fit rounded-full px-3 py-1 text-xs font-medium">
            {template.category}
          </span>
        )}

        <h1 className="text-content font-serif text-3xl sm:text-4xl">
          {template.title}
        </h1>

        {template.description && (
          <p className="text-content-secondary text-base">
            {template.description}
          </p>
        )}

        <p className="text-content-muted text-xs">
          Added {formatDate(template.created_at)}
        </p>
      </div>

      {template.content && (
        <div className="text-content text-sm leading-relaxed whitespace-pre-wrap sm:text-base">
          {template.content}
        </div>
      )}

      {template.file_url && (
        <Button asChild variant="primary" size="md" className="w-fit">
          <a href={template.file_url} target="_blank" rel="noopener noreferrer">
            Download template
          </a>
        </Button>
      )}
    </div>
  )
}
