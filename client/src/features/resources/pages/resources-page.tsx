import { useSuspenseQueries } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { cn } from '#/lib/utils'

import { GuideCard } from '../components/guide-card'
import { TemplateCard } from '../components/template-card'
import { TrainingCard } from '../components/training-card'
import {
  guidesListOptions,
  OVERVIEW_LIST_FILTERS,
  templatesListOptions,
  trainingsListOptions,
} from '../resources.query'

export function ResourcesPage() {
  const [trainings, guides, templates] = useSuspenseQueries({
    queries: [
      trainingsListOptions(OVERVIEW_LIST_FILTERS),
      guidesListOptions(OVERVIEW_LIST_FILTERS),
      templatesListOptions(OVERVIEW_LIST_FILTERS),
    ],
  })

  return (
    <div className={cn('content-grid space-y-10 py-6 md:py-12 lg:py-24')}>
      <header className="space-y-2 md:text-center">
        <h1 className="font-serif text-2xl font-medium tracking-[-2%] lg:text-[2.75rem]">
          Training & Resources Library
        </h1>
        <p className="mx-auto max-w-121 leading-[140%] text-balance text-neutral-700 max-md:text-sm">
          Explore high-quality training programmes, accelerators, and business
          workshops designed for women entrepreneurs.
        </p>
      </header>

      <ResourceSection
        title="Training and Events"
        href="trainings"
        viewAllLabel="View all Events"
        items={trainings.data}
        renderItem={(training, index) => (
          <TrainingCard key={training.id} training={training} index={index} />
        )}
      />

      <ResourceSection
        title="Guides"
        href="guides"
        viewAllLabel="View all Guides"
        items={guides.data}
        renderItem={(guide) => <GuideCard key={guide.id} guide={guide} />}
      />

      <ResourceSection
        title="Templates"
        href="templates"
        viewAllLabel="View all Templates"
        items={templates.data}
        renderItem={(template, index) => (
          <TemplateCard key={template.id} template={template} index={index} />
        )}
      />
    </div>
  )
}

function ResourceSection<T>({
  title,
  href,
  viewAllLabel,
  items,
  renderItem,
}: {
  title: string
  href: string
  viewAllLabel: string
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
}) {
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium text-neutral-900 lg:text-[1.75rem]">
          {title}
        </h2>
        <Link
          to={href}
          className="border border-neutral-300 px-4 py-3 font-medium text-neutral-500 max-md:text-sm"
        >
          {viewAllLabel}
        </Link>
      </header>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Nothing here yet. Check back soon.
        </p>
      ) : (
        <div className="no-scrollbar grid snap-x snap-mandatory auto-cols-[min(85%,20rem)] grid-flow-col gap-6 overflow-x-auto *:snap-start lg:snap-none lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible">
          {items.map((item, index) => renderItem(item, index))}
        </div>
      )}
    </section>
  )
}
