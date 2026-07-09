const compactNumber = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatAmount(
  min: number | null,
  max: number | null,
  currency: string | null,
): string {
  const format = (value: number) =>
    `${currency ?? ''}${compactNumber.format(value)}`
  if (min !== null && max !== null) return `${format(min)} - ${format(max)}`
  if (min !== null) return format(min)
  if (max !== null) return format(max)
  return '—'
}
