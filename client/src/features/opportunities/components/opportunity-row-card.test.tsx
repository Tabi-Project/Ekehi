import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { OpportunityListItem } from '../opportunities.types'
import { OpportunityRowCard } from './opportunity-row-card'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

const mockOpportunity: OpportunityListItem = {
  id: 'opp-123',
  reference_code: 'OPP-123',
  opportunity_title: 'Tech Innovation Grant 2026',
  funder_name: 'African Tech Fund',
  opportunity_type: 'grant',
  amount_min: 5000,
  amount_max: 25000,
  currency: 'USD',
  application_deadline: null,
  status: 'open',
  sectors: ['technology'],
  stages: ['early'],
  country: 'Kenya',
  description: 'Grant for tech startups.',
  eligibility_criteria: 'Early stage startups in tech.',
  apply_url: 'https://example.com/apply',
  contact_email: 'info@africantechfund.com',
  is_women_only: false,
  is_equity_free: true,
  created_at: '2026-01-01T00:00:00.000Z',
}

describe('OpportunityRowCard', () => {
  it('renders opportunity title, funder, and formatted amount correctly', () => {
    render(<OpportunityRowCard opportunity={mockOpportunity} />)

    expect(screen.getByText('Tech Innovation Grant 2026')).toBeTruthy()
    expect(screen.getByText('African Tech Fund')).toBeTruthy()
    expect(screen.getByText('$5K - $25K')).toBeTruthy()
    expect(screen.getByText('Rolling')).toBeTruthy()
  })

  it('displays "Closing Soon" badge when deadline is approaching', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 2)

    const closingSoonOpp: OpportunityListItem = {
      ...mockOpportunity,
      application_deadline: tomorrow.toISOString().split('T')[0],
    }

    render(<OpportunityRowCard opportunity={closingSoonOpp} />)

    expect(screen.getByText('Closing Soon')).toBeTruthy()
  })
})
