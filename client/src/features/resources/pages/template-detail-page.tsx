import { Link } from '@tanstack/react-router'

import { IMAGES } from '#/assets/images'
import { Button } from '#/components/ui/button'
import { TemplateSkeleton } from '#/components/ui/skeleton'
import { isApiError } from '#/lib/api'

import { useTemplateQuery } from '../resources.query'

// The `content` field comes back from the API as a JSON-encoded string
// shaped like: { "author": "...", "sections": [{ "heading": "...", "body": "..." }] }
// This mirrors how GuideDetailPage parses its own `content` field.
interface TemplateSection {
  heading: string | null
  body: string
}

interface ParsedTemplateContent {
  author?: string
  sections: Array<TemplateSection>
}

function parseTemplateContent(
  raw: string | null,
): ParsedTemplateContent | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.sections)) {
      return { author: parsed.author, sections: parsed.sections }
    }
    return null
  } catch {
    // If content isn't valid JSON, fall back to treating it as one plain section.
    return { sections: [{ heading: null, body: raw }] }
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  finance: { bg: '#26B3B5', text: '#033F25' },
  tax: { bg: '#e91e8c', text: '#341539' },
  export: { bg: '#4caf50', text: '#033F25' },
}
const DEFAULT_CATEGORY_COLOR = { bg: '#6366f1', text: '#1e1b4b' }

export function TemplateDetailPage({ id }: { id: string }) {
  const { data: template, isLoading, error } = useTemplateQuery(id)

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
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

  const parsedContent = parseTemplateContent(template.content)
  const colors = template.category
    ? (CATEGORY_COLORS[template.category] ?? DEFAULT_CATEGORY_COLOR)
    : DEFAULT_CATEGORY_COLOR

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <Link
        to="/resources/templates"
        className="text-content-secondary hover:text-content mb-6 inline-block text-sm font-medium"
      >
        ← Back to templates
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        {/* Left: main content */}
        <div className="flex flex-col gap-4">
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

          {/* Parsed, formatted sections — not the raw JSON string */}
          {parsedContent && parsedContent.sections.length > 0 && (
            <div className="mt-2 flex flex-col gap-6">
              {parsedContent.sections.map((section, index) => (
                <div key={index}>
                  {section.heading && (
                    <h2 className="text-content mb-2 text-base font-semibold">
                      {section.heading}
                    </h2>
                  )}
                  <p className="text-content-secondary text-sm leading-relaxed sm:text-base">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          )}

          {template.file_url && (
            <Button asChild variant="primary" size="md" className="mt-2 w-fit">
              <a
                href={template.file_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download template
              </a>
            </Button>
          )}
        </div>

        {/* Right: dynamic colour-coded card with cover image + author */}
        <aside className="h-fit">
          <div
            className="flex flex-col gap-4 rounded-2xl p-5"
            style={{ backgroundColor: colors.bg }}
          >
            <h3
              className="font-serif text-lg leading-snug"
              style={{ color: colors.text }}
            >
              {template.title}
            </h3>

            <img
              src={IMAGES.blackWomanWearingGlasses}
              alt={template.title}
              className="w-full rounded-xl object-cover"
            />

            {parsedContent?.author && (
              <span
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                with {parsedContent.author}
              </span>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
