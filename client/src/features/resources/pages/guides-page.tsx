import { Link } from '@tanstack/react-router'

import { IMAGES } from '#/assets/images'
import { GuideSkeleton } from '#/components/ui/skeleton'
import { isApiError } from '#/lib/api'

import { useGuidesQuery } from '../resources.query'

export function GuidesPage() {
  const { data: guides, isLoading, isError, error } = useGuidesQuery()

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:py-16">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-2">
        <h1 className="text-content font-serif text-3xl font-medium md:text-4xl">
          Guides
        </h1>
        <p className="max-w-2xl text-base text-neutral-600">
          In-depth guides, step-by-step tutorials, and resources curated to help
          women entrepreneurs build, launch, and grow their businesses.
        </p>
      </header>

      {/* Main Content Area */}
      {isLoading ? (
        <div
          role="status"
          aria-label="Loading guides"
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <GuideSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="border-line bg-surface rounded-2xl border p-8 text-center">
          <h2 className="text-content mb-2 text-lg font-semibold">
            Couldn&apos;t load guides
          </h2>
          <p className="text-content-muted mb-4 text-sm">
            {isApiError(error)
              ? error.message
              : 'Please refresh the page and try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:text-primary-hover cursor-pointer text-sm font-medium underline"
          >
            Reload page
          </button>
        </div>
      ) : !guides || guides.length === 0 ? (
        <div className="border-line bg-surface rounded-2xl border p-8 text-center">
          <p className="text-content-muted text-sm">No guides found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              to="/resources/guides/$slug"
              params={{ slug: guide.slug }}
              className="group flex flex-col gap-3"
            >
              <figure className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100">
                <img
                  src={IMAGES.blackWomanWearingGlasses}
                  alt={guide.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </figure>
              <div className="flex flex-col gap-2">
                <h3 className="text-content group-hover:text-primary font-serif text-lg font-semibold transition-colors">
                  {guide.title}
                </h3>
                {guide.summary && (
                  <p className="text-content-secondary line-clamp-3 text-sm leading-relaxed">
                    {guide.summary}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
