/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import {
  ChevronRight,
  Languages,
  LucideCalendarClock,
  MapPin,
  Speech,
  VideoIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '#/components/ui/button'
import { TrainingSkeleton } from '#/components/ui/skeleton'
import { makeRequest } from '#/lib/api'
import { IMAGES } from '#/assets/images'

// ── Types ──────────────────────────────────────────────
interface Training {
  id: string
  programme_name: string
  programme_type: string
  description: string
  provider: string
  format: 'online' | 'in_person' | 'hybrid'
  application_deadline: string | null
  apply_url?: string
  location_scope?: string
}

// ── Constants ──────────────────────────────────────────
const CARD_COLORS: Record<
  string,
  { bg: string; text: string; panel?: string }
> = {
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

const LOCATION_SCOPES: Record<string, string> = {
  local: 'Local',
  national: 'National',
  regional: 'Regional',
  global: 'Global',
}

// ── Helpers ────────────────────────────────────────────
function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const timeZone = 'Africa/Lagos'

    const weekday = date.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone,
    })

    const dayDate = Number(
      date.toLocaleDateString('en-US', { day: 'numeric', timeZone }),
    )
    const day = getOrdinal(dayDate)

    const month = date.toLocaleDateString('en-US', {
      month: 'long',
      timeZone,
    })

    const year = date.toLocaleDateString('en-US', {
      year: 'numeric',
      timeZone,
    })

    // const time = date.toLocaleTimeString('en-US', {
    //   hour: 'numeric',
    //   minute: '2-digit',
    //   hour12: true,
    //   timeZone,
    // })

    // const tzPart = new Intl.DateTimeFormat('en-US', {
    //   timeZone,
    //   timeZoneName: 'short',
    // })
    //   .formatToParts(date)
    //   .find((p) => p.type === 'timeZoneName')?.value

    // const tz = tzPart ?? 'WAT'

    return `${weekday}, ${day} ${month}, ${year}.`
  } catch {
    return 'Date TBC'
  }
}

function daysUntil(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days left`
  } catch {
    return 'Date TBC'
  }
}

function humanize(value: string): string {
  return value
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatLabel(value: string): string {
  const map: Record<string, string> = {
    online: 'Virtual event',
    in_person: 'In-person event',
    hybrid: 'Hybrid event',
  }
  return map[value] ?? humanize(value) ?? '—'
}

// ── Component ──────────────────────────────────────────
export function TrainingDetailPage({ id }: { id: string }) {
  const [training, setTraining] = useState<Training | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTraining()
  }, [id])

  async function loadTraining() {
    setLoading(true)
    setError(null)

    if (!id) {
      setError('No training programme specified.')
      setLoading(false)
      return
    }

    try {
      const request = makeRequest<Training>(`/trainings/${id}`, 'GET')
      const res = await request()

      if (!res?.data) {
        setError('Training programme not found.')
        setLoading(false)
        return
      }

      setTraining(res.data)
    } catch (error_) {
      const message =
        error_ instanceof Error
          ? error_.message
          : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div id="detail-loading" className="loading-container">
        <TrainingSkeleton />
        <p>Loading training programme...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div id="detail-error" className="detail-page__state" hidden>
        <p id="detail-error-message">Something went wrong. Please try again.</p>
        <a href="../index.html" className="detail-page__back-link">
          Back to Training &amp; Resources
        </a>
      </div>
    )
  }

  if (!training) {
    return (
      <div className="error-container">
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
    humanize(training.programme_type) ??
    'Training'

  const locationLabel =
    LOCATION_SCOPES[training.location_scope ?? ''] ??
    training.location_scope ??
    '—'

  const colors = CARD_COLORS[training.programme_type] ?? CARD_COLORS.accelerator

  return (
    <div className="m-10 py-10 md:px-10">
      {/* Breadcrumb */}
      <nav className="breadcrumb flex items-center text-sm font-medium">
        <a href="/resources" className="text-primary">
          Resources
        </a>
        <ChevronRight className="size-4" />
        <span id="detail-breadcrumb-title" className="text-content-secondary">
          {training.programme_name}
        </span>
      </nav>

      {/* Cover Panel */}
      <article className="flex justify-between py-8">
        <div className="flex flex-col items-start justify-between md:min-w-1/2">
          <div className="space-y-4">
            <h1 className="date_time text-content-secondary mb-4 text-sm font-medium md:mb-8">
              {training.application_deadline
                ? formatDate(training.application_deadline)
                : 'Date TBC'}
            </h1>

            <h2 className="text-3xl font-medium text-wrap">
              {training.programme_name || 'Untitled programme'}
            </h2>
          </div>

          {training.apply_url && (
            <Button id="detail-cta" asChild className="cta-button max-md:mt-10">
              <a
                href={training.apply_url}
                target="_blank"
                rel="noopener noreferrer"
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
            <p className="font-sans text-2xl leading-snug font-semibold">
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
      <div className="flex w-full flex-col items-start justify-between gap-10 py-18 md:flex-row">
        <article className="space-y-2 md:w-[60%]">
          <h2 className="text-xl font-semibold capitalize">About this event</h2>
          <p className="description text-left text-sm">
            {training.description || 'No description available.'}
          </p>
        </article>

        <aside className="w-full flex-1 space-y-2 md:w-2/3">
          <h2 className="w-full border-b border-black text-xl">
            Event Details
          </h2>
          <div className="flex items-center gap-2 text-sm capitalize">
            <div
              className="flex size-12 items-center justify-center rounded-md"
              style={{ backgroundColor: colors.bg }}
            >
              <VideoIcon className="text-content-secondary size-6" />
            </div>
            <p id="sidebar-format-value">{formatLabel(training.format)}</p>
          </div>

          <div className="flex items-center gap-2 text-sm capitalize">
            <div
              className="flex size-12 items-center justify-center rounded-md"
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
              className="flex size-12 items-center justify-center rounded-md"
              style={{ backgroundColor: colors.bg }}
            >
              <Languages className="text-content-secondary size-6" />
            </div>
            <p id="sidebar-language-value">English</p>
          </div>

          <div className="flex items-center gap-2 text-sm capitalize">
            <div
              className="flex size-12 items-center justify-center rounded-md"
              style={{ backgroundColor: colors.bg }}
            >
              <Speech className="text-content-secondary size-6" />
            </div>
            <p id="sidebar-provider-value">{training.provider || '—'}</p>
          </div>

          <div className="flex items-center gap-2 text-sm capitalize">
            <div
              className="flex size-12 items-center justify-center rounded-md"
              style={{ backgroundColor: colors.bg }}
            >
              <MapPin className="text-content-secondary size-6" />
            </div>
            <p id="sidebar-location-value">{locationLabel}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
