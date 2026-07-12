import { Link } from '@tanstack/react-router'

import { IMAGES } from '#/assets/images'
import { CalendarSVG, GlobeSVG } from '#/assets/svgs'
import { formatLabel, formatShortDate, humanize } from '#/lib/format'
import { cn } from '#/lib/utils'

import type { TrainingListItem } from '../resources.types'
import {
  TrainingCardCurve1,
  TrainingCardCurve2,
} from '../svgs/training-card-curves'

const colorTheme = [
  {
    card: '#E599FF',
    canvas: '#F9E6FF',
    foreground: '#4C0066',
    curves: { top: '#E6A4FC', bottom: '#DD89FA' },
  },
  {
    card: '#FF854C',
    canvas: '#FFE7DB',
    foreground: '#561E04',
    curves: { top: '#FF915E', bottom: '#FA773A' },
  },
  {
    card: '#1E9A64',
    canvas: '#DEF6EB',
    foreground: '#033F25',
    curves: { top: '#31A573', bottom: '#108F58' },
  },
]

export function TrainingCard({
  training,
  index,
}: {
  training: TrainingListItem
  index: number
}) {
  const theme = colorTheme[index % colorTheme.length]

  return (
    <div>
      <figure
        style={{ backgroundColor: theme.canvas }}
        className="bg-purple-25 mb-5 grid aspect-352/226 grid-cols-2 gap-2.5 rounded-2xl p-3 *:overflow-hidden *:rounded-sm"
      >
        <div
          style={{
            color: theme.foreground,
            backgroundColor: theme.card,
          }}
          className="relative flex flex-col justify-between bg-purple-200 p-3 pb-3.5"
        >
          <h4 className="z-1 text-lg leading-[110%] md:text-xl">
            {humanize(training.programme_type)}
          </h4>
          {training.provider && (
            <p className="z-1 line-clamp-2 text-xs">with {training.provider}</p>
          )}

          <TrainingCardCurve1
            aria-hidden
            stroke={theme.curves.top}
            className="absolute inset-x-0 top-0"
          />
          <TrainingCardCurve2
            aria-hidden
            stroke={theme.curves.bottom}
            className="absolute inset-x-0 bottom-0"
          />
        </div>
        <div>
          <img src={IMAGES.blackWomanWearingGlasses} alt="" />
        </div>
      </figure>
      <div
        className={cn(
          'mb-3 flex flex-wrap gap-4',
          '*:flex *:items-center *:gap-1 *:text-sm',
          '[&_span]:font-medium [&_span]:text-neutral-900',
          '[&_svg]:-mt-px [&_svg]:text-neutral-500',
        )}
      >
        {training.application_deadline && (
          <p>
            <CalendarSVG />
            <span>{formatShortDate(training.application_deadline)}</span>
          </p>
        )}
        <p>
          <GlobeSVG />
          <span>{formatLabel(training.format)}</span>
        </p>
      </div>
      <div>
        <h3 className="mb-2 font-medium text-balance text-neutral-900">
          <Link to="/resources/trainings/$id" params={{ id: training.id }}>
            {training.programme_name}
          </Link>
        </h3>
        {training.description && (
          <p className="line-clamp-3 text-sm text-neutral-700">
            {training.description}
          </p>
        )}
      </div>
    </div>
  )
}
