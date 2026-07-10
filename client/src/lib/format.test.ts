import { describe, expect, it } from 'vitest'

import {
  daysUntil,
  formatAmount,
  formatDate,
  formatLabel,
  formatShortDate,
  getOrdinal,
  humanize,
} from './format'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

describe('formatAmount', () => {
  it('formats a min–max range with currency prefix', () => {
    expect(formatAmount(500_000, 5_000_000, 'NGN')).toBe('NGN500K - NGN5M')
  })

  it('does not round sub-million amounts up to millions', () => {
    expect(formatAmount(500_000, null, 'NGN')).toBe('NGN500K')
    expect(formatAmount(100_000, null, 'NGN')).toBe('NGN100K')
  })

  it('keeps one decimal for non-round millions', () => {
    expect(formatAmount(1_500_000, null, 'NGN')).toBe('NGN1.5M')
  })

  it('treats 0 as a real amount, not a missing one', () => {
    expect(formatAmount(0, 5_000_000, 'NGN')).toBe('NGN0 - NGN5M')
    expect(formatAmount(0, null, 'NGN')).toBe('NGN0')
  })

  it('falls back to a single value when only one bound exists', () => {
    expect(formatAmount(null, 2_000_000, 'NGN')).toBe('NGN2M')
    expect(formatAmount(15_000_000, null, 'NGN')).toBe('NGN15M')
  })

  it('omits the prefix when currency is null', () => {
    expect(formatAmount(1_000_000, null, null)).toBe('1M')
  })

  it('returns a dash when both bounds are missing', () => {
    expect(formatAmount(null, null, 'NGN')).toBe('—')
  })
})

describe('getOrdinal', () => {
  it('handles the standard suffixes', () => {
    expect(getOrdinal(1)).toBe('1st')
    expect(getOrdinal(2)).toBe('2nd')
    expect(getOrdinal(3)).toBe('3rd')
    expect(getOrdinal(4)).toBe('4th')
  })

  it('handles the 11–13 exceptions', () => {
    expect(getOrdinal(11)).toBe('11th')
    expect(getOrdinal(12)).toBe('12th')
    expect(getOrdinal(13)).toBe('13th')
    expect(getOrdinal(21)).toBe('21st')
  })
})

describe('formatDate', () => {
  it('formats a valid ISO date in the Lagos timezone', () => {
    expect(formatDate('2026-03-11T12:00:00Z')).toBe(
      'Wednesday, 11th March, 2026.',
    )
  })

  it('returns the fallback for unparseable input', () => {
    expect(formatDate('not-a-date')).toBe('Date TBC')
    expect(formatDate('')).toBe('Date TBC')
  })
})

describe('formatShortDate', () => {
  it('formats a valid ISO date', () => {
    expect(formatShortDate('2026-03-11T12:00:00Z')).toBe('11 March 2026')
  })

  it('returns a dash for null or unparseable input', () => {
    expect(formatShortDate(null)).toBe('—')
    expect(formatShortDate('not-a-date')).toBe('—')
  })
})

describe('daysUntil', () => {
  it('returns the fallback for unparseable input', () => {
    expect(daysUntil('not-a-date')).toBe('Date TBC')
  })

  it('reports past dates as expired', () => {
    expect(daysUntil(new Date(Date.now() - 3 * DAY).toISOString())).toBe(
      'Expired',
    )
  })

  it('reports earlier today as today', () => {
    expect(daysUntil(new Date(Date.now() - HOUR).toISOString())).toBe('Today')
  })

  it('reports within the next day as tomorrow', () => {
    expect(daysUntil(new Date(Date.now() + HOUR).toISOString())).toBe(
      'Tomorrow',
    )
  })

  it('reports whole days for later dates', () => {
    expect(daysUntil(new Date(Date.now() + 5 * DAY).toISOString())).toBe(
      '5 days',
    )
  })
})

describe('humanize', () => {
  it('title-cases snake_case values', () => {
    expect(humanize('mentorship_programme')).toBe('Mentorship Programme')
  })
})

describe('formatLabel', () => {
  it('maps known event formats', () => {
    expect(formatLabel('online')).toBe('Virtual event')
    expect(formatLabel('in_person')).toBe('In-person event')
    expect(formatLabel('hybrid')).toBe('Hybrid event')
  })

  it('humanizes unknown values', () => {
    expect(formatLabel('bootcamp')).toBe('Bootcamp')
  })
})
