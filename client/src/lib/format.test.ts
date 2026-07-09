import { describe, expect, it } from 'vitest'

import { formatAmount } from './format'

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
