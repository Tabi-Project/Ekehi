import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { isApiError } from '#/lib/api'

import { useTemplateQuery } from '../resources.query'
import { TemplateDetailPage } from './template-detail-page'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className, ...props }: any) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('../resources.query', () => ({
  useTemplateQuery: vi.fn(),
}))

vi.mock('#/lib/api', () => ({
  isApiError: vi.fn(),
}))

describe('TemplateDetailPage', () => {
  const mockId = 'test-template-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the loading skeleton while the query is in flight', () => {
    vi.mocked(useTemplateQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    render(<TemplateDetailPage id={mockId} />)

    // TemplateSkeleton renders its placeholder blocks with aria-hidden,
    // so we assert on the absence of real content instead of querying text.
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('renders a "Template not found" message and back link on a 404 error', () => {
    const mockError = { status: 404, message: 'Not found' }

    vi.mocked(useTemplateQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    } as any)

    vi.mocked(isApiError).mockReturnValue(true)

    render(<TemplateDetailPage id={mockId} />)

    expect(screen.getByText('Template not found')).toBeTruthy()
    expect(
      screen.getByText(/We couldn't find the template you're looking for/i),
    ).toBeTruthy()

    const backLink = screen.getByText('← Back to templates')
    expect(backLink.getAttribute('href')).toBe('/resources/templates')
  })

  it('renders a generic error message for non-404 errors', () => {
    const mockError = { status: 500, message: 'Server exploded' }

    vi.mocked(useTemplateQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    } as any)

    vi.mocked(isApiError).mockReturnValue(true)

    render(<TemplateDetailPage id={mockId} />)

    expect(screen.getByText('Something went wrong')).toBeTruthy()
    expect(
      screen.getByText(/There was a problem loading this template/i),
    ).toBeTruthy()
  })

  it('renders a generic error message when the error is not an ApiError at all', () => {
    vi.mocked(useTemplateQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network down'),
    } as any)

    vi.mocked(isApiError).mockReturnValue(false)

    render(<TemplateDetailPage id={mockId} />)

    expect(screen.getByText('Something went wrong')).toBeTruthy()
  })

  it('renders the template title, category, description, content, and created date on success', () => {
    vi.mocked(useTemplateQuery).mockReturnValue({
      data: {
        id: mockId,
        title: 'Pitch Deck Template',
        description: 'A clean starting point for your fundraising pitch.',
        category: 'Fundraising',
        content: 'Slide 1: Problem\nSlide 2: Solution',
        file_url: null,
        created_at: '2026-01-15T00:00:00.000Z',
        updated_at: '2026-01-15T00:00:00.000Z',
      },
      isLoading: false,
      error: null,
    } as any)

    render(<TemplateDetailPage id={mockId} />)

    expect(screen.getByText('Pitch Deck Template')).toBeTruthy()
    expect(screen.getByText('Fundraising')).toBeTruthy()
    expect(
      screen.getByText('A clean starting point for your fundraising pitch.'),
    ).toBeTruthy()
    expect(screen.getByText(/Slide 1: Problem/)).toBeTruthy()
    expect(screen.getByText(/15 January 2026/)).toBeTruthy()
  })

  it('shows the "Open template" link only when file_url is present', () => {
    vi.mocked(useTemplateQuery).mockReturnValue({
      data: {
        id: mockId,
        title: 'Template With File',
        description: null,
        category: null,
        content: null,
        file_url: 'https://example.com/template.pdf',
        created_at: '2026-01-15T00:00:00.000Z',
        updated_at: '2026-01-15T00:00:00.000Z',
      },
      isLoading: false,
      error: null,
    } as any)

    render(<TemplateDetailPage id={mockId} />)

    const openLink = screen.getByText('Download template')
    expect(openLink.closest('a')?.getAttribute('href')).toBe(
      'https://example.com/template.pdf',
    )
  })

  it('does not render the "Download template" link when file_url is null', () => {
    vi.mocked(useTemplateQuery).mockReturnValue({
      data: {
        id: mockId,
        title: 'Template Without File',
        description: null,
        category: null,
        content: null,
        file_url: null,
        created_at: '2026-01-15T00:00:00.000Z',
        updated_at: '2026-01-15T00:00:00.000Z',
      },
      isLoading: false,
      error: null,
    } as any)

    render(<TemplateDetailPage id={mockId} />)

    expect(screen.queryByText('Download template')).toBeNull()
  })
})
