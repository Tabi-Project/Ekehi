'use client'

import {
  ChevronRight,
  Languages,
  LucideCalendarClock,
  Speech,
  VideoIcon,
} from 'lucide-react'

import { IMAGES } from '#/assets/images'
import { Button } from '#/components/ui/button'
import { TrainingSkeleton } from '#/components/ui/skeleton'
import { daysUntil, formatDate, formatLabel, humanize } from '#/shared/utils'

import { useTrainingQuery } from '../resources.query'

// ── Constants ──────────────────────────────────────────

const CARD_COLORS: Record<string, { bg: string; text: string; panel: string }> =
  {
    accelerator: { bg: '#F9E6FF', text: '#581c87', panel: '#EFBDFF' },
    bootcamp: { bg: '#ffedd5', text: '#7c2d12', panel: '#F9DBB2' },
    workshop: { bg: '#DEF6EB', text: '#033F25', panel: '#91D3BE' },
    online_course: { bg: '#dbeafe', text: '#1e3a8a', panel: '#96C1FC' },
    mentorship_programme: { bg: '#fce7f3', text: '#831843', panel: '#EDAEC2' },
  }

const PROGRAMME_TYPES: Record<string, string> = {
  accelerator: 'Accelerator',
  bootcamp: 'Bootcamp',
  workshop: 'Workshop',
  online_course: 'Online Course',
  mentorship_programme: 'Mentorship Programme',
}

// ── Component ──────────────────────────────────────────
export function TrainingDetailPage({ id }: { id: string }) {
  const { data: training, error, isError, isLoading } = useTrainingQuery(id)

  if (!id) {
    return (
      <div className="detail-page__state text-content-muted min-h-screen pt-5 pb-5 text-center font-sans text-base">
        <h2>No training specified</h2>
        <p>The training programme you are looking for was not specified.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="loading-container text-content-muted min-h-screen pt-5 pb-5 text-center font-sans text-base">
        <p>Loading training programme...</p>
        <TrainingSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div
        id="detail-error"
        className="detail-page__state text-content-muted min-h-screen pt-5 pb-5 text-center font-sans text-base"
      >
        <p id="detail-error-message">
          {error.message || 'Something went wrong, please try again.'}{' '}
          <a href="/resources" className="text-primary">
            Go Back
          </a>
        </p>
      </div>
    )
  }

  if (!training) {
    return (
      <div className="detail-page__state text-content-muted min-h-screen pt-5 pb-5 text-center font-sans text-base">
        <h2>Training Not Found</h2>
        <p>
          The training programme you are looking for does not exist or the link
          is broken.
        </p>
      </div>
    )
  }

  const typeLabel =
    PROGRAMME_TYPES[training.programme_type] ??
    humanize(training.programme_type)

  const colors = CARD_COLORS[training.programme_type] ?? CARD_COLORS.accelerator

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="breadcrumb flex items-center text-sm font-normal">
        <a href="/resources" className="text-primary">
          Resources
        </a>
        <ChevronRight className="size-4" />
        <span
          id="detail-breadcrumb-title"
          className="text-content-secondary max-md:line-clamp-1"
        >
          {training.programme_name}
        </span>
      </nav>

      {/* Cover Panel */}
      <article className="flex justify-between py-8 max-md:flex-col">
        <div className="flex flex-col items-start justify-between md:min-w-1/2">
          <div className="space-y-4">
            <h1 className="date_time mb-4 text-sm font-medium text-gray-600 md:mb-8">
              {training.application_deadline
                ? formatDate(training.application_deadline)
                : 'Date TBC'}
            </h1>

            <h2 className="font-serif text-4xl font-medium text-wrap">
              {training.programme_name || 'Untitled programme'}
            </h2>
          </div>

          <aside
            className="mt-4 flex justify-between gap-4 rounded-xl p-4 md:hidden"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            <div
              style={{ backgroundColor: colors.panel }}
              className="flex w-1/2 flex-col justify-between rounded-xl p-3"
            >
              <p className="text-4xl leading-snug font-medium text-pretty max-sm:text-xl">
                {typeLabel}
              </p>
              <p>
                with{' '}
                <span className="text-lg font-medium capitalize">
                  {training.provider || ''}
                </span>
              </p>
            </div>
            <div className="image-info w-1/2">
              <img
                className="aspect-square size-72 overflow-hidden rounded-xl object-cover"
                src={IMAGES.blackWomanWearingGlasses}
                alt={typeLabel}
              />
            </div>
          </aside>

          {training.apply_url && (
            <Button id="detail-cta" asChild className="cta-button max-md:mt-10">
              <a
                href={training.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium"
              >
                Register Now
              </a>
            </Button>
          )}
        </div>

        <aside
          className="flex justify-between gap-4 rounded-xl p-4 max-md:hidden"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          <div
            style={{ backgroundColor: colors.panel }}
            className="flex w-1/2 flex-col justify-between rounded-xl p-3"
          >
            <p className="text-2xl leading-snug font-semibold text-pretty max-sm:text-xl">
              {typeLabel}
            </p>
            <p>
              with{' '}
              <span className="text-lg font-medium capitalize">
                {training.provider || ''}
              </span>
            </p>
          </div>
          <div className="image-info w-1/2">
            <img
              className="aspect-square size-72 overflow-hidden rounded-xl object-cover"
              src={IMAGES.blackWomanWearingGlasses}
              alt={typeLabel}
            />
          </div>
        </aside>
      </article>

      {/* Main Content */}
      <div className="flex w-full flex-col items-start justify-between gap-10 py-10 md:flex-row">
        <article className="space-y-2 md:w-[60%]">
          <h2 className="text-xl font-medium text-gray-900 capitalize">
            About this event
          </h2>
          <p className="description text-left font-normal text-gray-700">
            {training.description || 'No description available.'}
          </p>
        </article>

        <aside className="w-full flex-1 space-y-6 md:w-2/3">
          <h2 className="w-full border-b border-black text-xl">
            Event Details
          </h2>
          <div className="flex items-center gap-2 text-sm capitalize">
            <div
              className="flex size-12 items-center justify-center"
              style={{ backgroundColor: colors.bg }}
            >
              <VideoIcon className="text-content-secondary size-6" />
            </div>
            <p id="sidebar-format-value">{formatLabel(training.format)}</p>
          </div>

          <div className="flex items-center gap-2 text-sm capitalize">
            <div
              className="flex size-12 items-center justify-center"
              style={{ backgroundColor: colors.bg }}
            >
              <LucideCalendarClock className="text-content-secondary size-6" />
            </div>
            <p id="sidebar-deadline-value">
              {training.application_deadline
                ? daysUntil(training.application_deadline) === 'Expired'
                  ? 'Event has expired'
                  : `Event is in ${daysUntil(training.application_deadline)}`
                : 'Date TBC'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm capitalize">
            <div
              className="flex size-12 items-center justify-center"
              style={{ backgroundColor: colors.bg }}
            >
              <Languages className="text-content-secondary size-6" />
            </div>
            <p id="sidebar-language-value">English</p>
          </div>

          <div className="flex items-center gap-2 text-sm capitalize">
            <div
              className="flex size-12 items-center justify-center"
              style={{ backgroundColor: colors.bg }}
            >
              <Speech className="text-content-secondary size-6" />
            </div>
            <p id="sidebar-provider-value">{training.provider || '—'}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
