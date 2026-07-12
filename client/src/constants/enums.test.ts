import { describe, expect, it } from 'vitest'

import { EKEHI_ENUMS, enumLabel, toOptions } from './enums'

// Mirrors server/src/models/enums.ts — if the server enums change,
// these fail here instead of silently sending unknown filter values.
const SERVER_OPPORTUNITY_TYPES = [
  'grant_ngo',
  'grant_government',
  'angel_investment',
  'accelerator',
  'loan',
  'microfinance',
  'vc',
  'prize_money',
]

const SERVER_LISTING_STATUSES = ['open', 'rolling_applications', 'closed']

describe('EKEHI_ENUMS', () => {
  it('opportunityType keys match the server enum', () => {
    expect(Object.keys(EKEHI_ENUMS.opportunityType).sort()).toEqual(
      [...SERVER_OPPORTUNITY_TYPES].sort(),
    )
  })

  it('listingStatus keys match the server enum', () => {
    expect(Object.keys(EKEHI_ENUMS.listingStatus).sort()).toEqual(
      [...SERVER_LISTING_STATUSES].sort(),
    )
  })
})

describe('toOptions', () => {
  it('maps an enum map to value/label pairs', () => {
    expect(toOptions(EKEHI_ENUMS.businessStage)).toEqual([
      { value: 'idea', label: 'Idea' },
      { value: 'early', label: 'Early' },
      { value: 'growth', label: 'Growth' },
    ])
  })
})

describe('enumLabel', () => {
  it('returns the label for a known slug', () => {
    expect(enumLabel(EKEHI_ENUMS.opportunityType, 'grant_ngo')).toBe(
      'Grant (NGO / Foundation)',
    )
  })

  it('returns undefined for an unknown slug', () => {
    expect(enumLabel(EKEHI_ENUMS.opportunityType, 'crowdfunding')).toBe(
      undefined,
    )
  })
})
