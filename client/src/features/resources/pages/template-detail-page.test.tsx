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

  it('renders title, category, description, and formatted created date on success', () => {
    vi.mocked(useTemplateQuery).mockReturnValue({
      data: {
        id: mockId,
        title: 'Basic financial management template',
        description:
          'Explore our Basic Financial Management Template designed for SMEs.',
        category: 'finance',
        content: null,
        file_url: null,
        created_at: '2026-03-26T00:00:00.000Z',
        updated_at: '2026-03-26T00:00:00.000Z',
      },
      isLoading: false,
      error: null,
    } as any)

    render(<TemplateDetailPage id={mockId} />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Basic financial management template',
      }),
    ).toBeTruthy()
    expect(screen.getByText('finance')).toBeTruthy()
    expect(
      screen.getByText(/Explore our Basic Financial Management Template/i),
    ).toBeTruthy()
    expect(screen.getByText(/26 March 2026/)).toBeTruthy()
  })

  it('parses JSON content into formatted sections instead of showing the raw string', () => {
    const rawContent = JSON.stringify({
      author: 'Fisayo Rotibi',
      sections: [
        {
          heading: null,
          body: 'Managing your business finances does not have to be complicated.',
        },
        {
          heading: 'What this template includes',
          body: 'The template covers five core areas.',
        },
      ],
    })

    vi.mocked(useTemplateQuery).mockReturnValue({
      data: {
        id: mockId,
        title: 'Basic financial management template',
        description: null,
        category: 'finance',
        content: rawContent,
        file_url: null,
        created_at: '2026-03-26T00:00:00.000Z',
        updated_at: '2026-03-26T00:00:00.000Z',
      },
      isLoading: false,
      error: null,
    } as any)

    render(<TemplateDetailPage id={mockId} />)

    // The raw JSON string itself should never appear on screen.
    expect(screen.queryByText(/"author":/)).toBeNull()

    // The parsed sections should render as real headings and paragraphs.
    expect(screen.getByText('What this template includes')).toBeTruthy()
    expect(
      screen.getByText(
        /Managing your business finances does not have to be complicated/i,
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(/The template covers five core areas/i),
    ).toBeTruthy()
  })

  it('renders the author line on the sidebar card when content includes an author', () => {
    const rawContent = JSON.stringify({
      author: 'Fisayo Rotibi',
      sections: [{ heading: null, body: 'Some body text.' }],
    })

    vi.mocked(useTemplateQuery).mockReturnValue({
      data: {
        id: mockId,
        title: 'Basic financial management template',
        description: null,
        category: 'finance',
        content: rawContent,
        file_url: null,
        created_at: '2026-03-26T00:00:00.000Z',
        updated_at: '2026-03-26T00:00:00.000Z',
      },
      isLoading: false,
      error: null,
    } as any)

    render(<TemplateDetailPage id={mockId} />)

    expect(screen.getByText('with Fisayo Rotibi')).toBeTruthy()
  })

  it('falls back to a single plain section when content is not valid JSON', () => {
    vi.mocked(useTemplateQuery).mockReturnValue({
      data: {
        id: mockId,
        title: 'Legacy plain text template',
        description: null,
        category: null,
        content: 'Just a plain string, not JSON at all.',
        file_url: null,
        created_at: '2026-03-26T00:00:00.000Z',
        updated_at: '2026-03-26T00:00:00.000Z',
      },
      isLoading: false,
      error: null,
    } as any)

    render(<TemplateDetailPage id={mockId} />)

    expect(
      screen.getByText('Just a plain string, not JSON at all.'),
    ).toBeTruthy()
  })

  it('shows the "Download template" link only when file_url is present', () => {
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

    const downloadLink = screen.getByText('Download template')
    expect(downloadLink.closest('a')?.getAttribute('href')).toBe(
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
