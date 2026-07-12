import { describe, expect, it } from 'vitest'

import { opportunityListItemSchema } from './opportunities.types'

// Real item from GET /opportunities — contract check against the server envelope.
const sampleListItem = {
  id: 'fcc5ae99-0d24-4a53-abc6-48901d2d2aff',
  reference_code: 'OPP-031',
  opportunity_title: 'Women On Top',
  funder_name: 'Fisayo Rotibi Foundation',
  opportunity_type: 'accelerator',
  amount_min: 500000,
  amount_max: 5000000,
  currency: 'NGN',
  sectors: ['beauty_personal_care', 'creative_industries'],
  stages: ['idea', 'early'],
  country: 'Nigeria',
  application_deadline: '2026-04-01',
  status: 'open',
  eligibility_criteria: 'Women in business in Africa',
  description: 'Women on Top is a business accelerator.',
  apply_url: 'riseacademy.com',
  contact_email: 'hello@fisayorotibifoundation',
  is_women_only: true,
  is_equity_free: true,
  created_at: '2026-03-28T18:28:37.974461+00:00',
}

describe('opportunityListItemSchema', () => {
  it('parses a real list item from the API', () => {
    expect(opportunityListItemSchema.parse(sampleListItem)).toEqual(
      sampleListItem,
    )
  })

  it('accepts null amounts (rolling grants often omit them)', () => {
    const result = opportunityListItemSchema.parse({
      ...sampleListItem,
      amount_min: null,
      amount_max: null,
    })
    expect(result.amount_min).toBeNull()
    expect(result.amount_max).toBeNull()
  })

  it('does not require detail-only fields (updated_at, is_saved)', () => {
    expect(() => opportunityListItemSchema.parse(sampleListItem)).not.toThrow()
  })

  it('rejects an item missing required fields', () => {
    const withoutId: Record<string, unknown> = { ...sampleListItem }
    delete withoutId.id
    expect(() => opportunityListItemSchema.parse(withoutId)).toThrow()
  })
})
