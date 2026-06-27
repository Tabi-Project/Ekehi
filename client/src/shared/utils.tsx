// ── Helpers ────────────────────────────────────────────
export function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export function formatDate(dateString: string): string {
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

    return `${weekday}, ${day} ${month}, ${year}.`
  } catch {
    return 'Date TBC'
  }
}

export function daysUntil(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days`
  } catch {
    return 'Date TBC'
  }
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
