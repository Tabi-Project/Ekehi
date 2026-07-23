const compactNumber = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const currencyFormatters = new Map<string, Intl.NumberFormat | null>()

/** null when the currency code is not a valid ISO 4217 code. */
function getCurrencyFormatter(currency: string): Intl.NumberFormat | null {
  if (!currencyFormatters.has(currency)) {
    let formatter: Intl.NumberFormat | null
    try {
      formatter = new Intl.NumberFormat('en', {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        notation: 'compact',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })
    } catch {
      formatter = null
    }
    currencyFormatters.set(currency, formatter)
  }
  return currencyFormatters.get(currency) ?? null
}

export function formatAmount(
  min: number | null,
  max: number | null,
  currency: string | null,
): string {
  const formatter = currency ? getCurrencyFormatter(currency) : null
  const format = (value: number) =>
    formatter
      ? formatter.format(value)
      : `${currency ?? ''}${compactNumber.format(value)}`
  if (min !== null && max !== null) return `${format(min)} - ${format(max)}`
  if (min !== null) return format(min)
  if (max !== null) return format(max)
  return '—'
}

export function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/** Long form with weekday, e.g. "Wednesday, 11th March, 2026." */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Date TBC'

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

  return `${weekday}, ${day} ${month}, ${year}.`
}

/** Short form, e.g. "11 March 2026". Missing or invalid dates render as a dash. */
export function formatShortDate(dateString: string | null): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function daysUntil(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Date TBC'

  const diffTime = date.getTime() - Date.now()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Expired'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  return `${diffDays} days`
}

/** True when the deadline is today or within the next `thresholdDays` days. */
export function isClosingSoon(
  dateString: string | null,
  thresholdDays = 7,
): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return false

  const diffTime = date.getTime() - Date.now()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= thresholdDays
}

export function humanize(value: string): string {
  return value
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatLabel(value: string): string {
  const map: Record<string, string> = {
    online: 'Virtual event',
    in_person: 'In-person event',
    hybrid: 'Hybrid event',
  }
  return map[value] ?? humanize(value)
}
