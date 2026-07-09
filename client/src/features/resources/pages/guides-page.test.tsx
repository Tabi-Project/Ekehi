import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { isApiError } from '#/lib/api'

import { useGuidesQuery } from '../resources.query'
import { GuidesPage } from './guides-page'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className, ...props }: any) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('../resources.query', () => ({
  useGuidesQuery: vi.fn(),
}))

vi.mock('#/lib/api', () => ({
  isApiError: vi.fn(),
}))

describe('GuidesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeleton state initially', () => {
    vi.mocked(useGuidesQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any)

    render(<GuidesPage />)

    expect(screen.getByRole('status', { name: /loading guides/i })).toBeTruthy()
  })

  it('renders fallback error message when server returns an ApiError', () => {
    const mockError = { message: 'Database connection failed' }

    vi.mocked(useGuidesQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as any)

    vi.mocked(isApiError).mockReturnValue(true)

    render(<GuidesPage />)

    expect(screen.getByText("Couldn't load guides")).toBeTruthy()
    expect(screen.getByText('Database connection failed')).toBeTruthy()
    expect(screen.getByRole('button', { name: /reload page/i })).toBeTruthy()
  })

  it('renders generic fallback error message for standard exceptions', () => {
    vi.mocked(useGuidesQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Standard broken instance text'),
    } as any)

    vi.mocked(isApiError).mockReturnValue(false)

    render(<GuidesPage />)

    expect(
      screen.getByText('Please refresh the page and try again.'),
    ).toBeTruthy()
  })

  it('renders empty state message if no guides are returned', () => {
    vi.mocked(useGuidesQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<GuidesPage />)

    expect(screen.getByText('No guides found')).toBeTruthy()
  })

  it('renders list of guides when fetch is successful', () => {
    const mockGuides = [
      {
        id: 'guide-1',
        title: 'How to write a business plan',
        summary: 'A step by step guide for beginners.',
        slug: 'how-to-write-business-plan',
        created_at: '2026-06-29',
        updated_at: '2026-06-29',
      },
      {
        id: 'guide-2',
        title: 'Scaling your startup',
        summary: 'Growth frameworks that work.',
        slug: 'scaling-your-startup',
        created_at: '2026-06-29',
        updated_at: '2026-06-29',
      },
    ]

    vi.mocked(useGuidesQuery).mockReturnValue({
      data: mockGuides,
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<GuidesPage />)

    expect(screen.getByText('Guides')).toBeTruthy()
    expect(screen.getByText('How to write a business plan')).toBeTruthy()
    expect(screen.getByText('A step by step guide for beginners.')).toBeTruthy()
    expect(screen.getByText('Scaling your startup')).toBeTruthy()
    expect(screen.getByText('Growth frameworks that work.')).toBeTruthy()

    const links = screen.getAllByRole('link')
    expect(links[0].getAttribute('href')).toBe('/resources/guides/$slug')
  })
})
