import { Link } from '@tanstack/react-router'

import { ClockCountdown } from '#/assets/svgs'
import { EKEHI_ENUMS, enumLabel } from '#/constants/enums'
import { daysUntil, formatAmount, humanize, isClosingSoon } from '#/lib/format'

import type { OpportunityListItem } from '../opportunities.types'

function deadlineLabel(deadline: string | null): string {
  if (!deadline) return 'Rolling'
  const label = daysUntil(deadline)
  return label.endsWith('days') ? `${label} left` : label
}

export function OpportunityRowCard({
  opportunity,
}: {
  opportunity: OpportunityListItem
}) {
  const closingSoon =
    opportunity.status === 'open' &&
    isClosingSoon(opportunity.application_deadline)

  return (
    <Link
      to="/opportunities/$id"
      params={{ id: opportunity.id }}
      className="block"
    >
      <article className="grid py-8 max-lg:gap-4 lg:grid-cols-[17.5rem_1fr_7.5rem]">
        <div>
          <p className="mb-1 font-medium text-neutral-900">
            {formatAmount(
              opportunity.amount_min,
              opportunity.amount_max,
              opportunity.currency,
            )}
          </p>
          <p className="text-neutral-700">
            {enumLabel(
              EKEHI_ENUMS.opportunityType,
              opportunity.opportunity_type,
            ) ?? humanize(opportunity.opportunity_type)}
          </p>
        </div>

        <div>
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-neutral-900">
              {opportunity.opportunity_title}
            </h3>
            {closingSoon && <span>Closing Soon</span>}
          </div>
          <p className="text-neutral-700">{opportunity.funder_name}</p>
        </div>

        <div className="flex items-center gap-1">
          <ClockCountdown className="text-neutral-700" />
          <span className="font-medium text-neutral-900">
            {deadlineLabel(opportunity.application_deadline)}
          </span>
        </div>
      </article>
    </Link>
  )
}
