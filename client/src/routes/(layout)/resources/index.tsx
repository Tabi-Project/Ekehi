import { createFileRoute } from '@tanstack/react-router'

import {
  GuideSkeleton,
  TemplateSkeleton,
  TrainingSkeleton,
} from '#/components/ui/skeleton'
import { ResourcesPage } from '#/features/resources/pages/resources-page'
import {
  guidesListOptions,
  OVERVIEW_LIST_FILTERS,
  templatesListOptions,
  trainingsListOptions,
} from '#/features/resources/resources.query'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/resources/')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(trainingsListOptions(OVERVIEW_LIST_FILTERS)),
      queryClient.ensureQueryData(guidesListOptions(OVERVIEW_LIST_FILTERS)),
      queryClient.ensureQueryData(templatesListOptions(OVERVIEW_LIST_FILTERS)),
    ]),
  component: ResourcesPage,
  pendingComponent: ResourcesPending,
  head: () =>
    pageMeta({
      title: 'Resources',
      description:
        'Guides, training, and templates to help you grow with Ekehi.',
      path: '/resources',
    }),
})

function ResourcesPending() {
  return (
    <div
      role="status"
      aria-label="Loading resources"
      className="content-grid space-y-10 py-6 md:py-12 lg:py-24"
    >
      {[TrainingSkeleton, GuideSkeleton, TemplateSkeleton].map(
        (SkeletonCard, section) => (
          <div
            key={section}
            className="no-scrollbar grid snap-x snap-mandatory auto-cols-[min(85%,20rem)] grid-flow-col gap-6 overflow-x-auto *:snap-start lg:snap-none lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ),
      )}
    </div>
  )
}
