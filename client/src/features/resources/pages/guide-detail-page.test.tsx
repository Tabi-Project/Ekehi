import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { isApiError } from '#/lib/api'

import { useGuideQuery } from '../resources.query'
import { GuideDetailPage } from './guide-detail-page'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className, ...props }: any) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('../resources.query', () => ({
  useGuideQuery: vi.fn(),
}))

vi.mock('#/lib/api', () => ({
  isApiError: vi.fn(),
}))

describe('GuideDetailPage', () => {
  const mockId = 'test-guide-123'

  beforeEach(() => {
    vi.clearAllMocks()

    window.HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  it('renders loading animation pulse state initially', () => {
    vi.mocked(useGuideQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any)

    render(<GuideDetailPage id={mockId} />)

    expect(screen.getByText('Loading guide information...')).toBeTruthy()
  })

  it('renders fallback error message when server returns an ApiError', () => {
    const mockError = { message: 'Database failure message connection' }

    vi.mocked(useGuideQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as any)

    vi.mocked(isApiError).mockReturnValue(true)

    render(<GuideDetailPage id={mockId} />)

    expect(screen.getByText('Guide not found')).toBeTruthy()
    expect(screen.getByText('Database failure message connection')).toBeTruthy()
  })

  it('renders generic fallback error message for standard exceptions', () => {
    vi.mocked(useGuideQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Standard broken instance text'),
    } as any)

    vi.mocked(isApiError).mockReturnValue(false)

    render(<GuideDetailPage id={mockId} />)

    expect(screen.getByText('Standard broken instance text')).toBeTruthy()
  })

  it('renders upcoming placeholder fallback message if guide content data is blank', () => {
    vi.mocked(useGuideQuery).mockReturnValue({
      data: {
        title: 'Empty Content Guide',
        content: undefined,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<GuideDetailPage id={mockId} />)

    expect(screen.getByText('Empty Content Guide')).toBeTruthy()
    expect(
      screen.getByText('Full content for this guide is coming soon.'),
    ).toBeTruthy()
  })

  it('renders custom sections correctly when guide content JSON string is passed', () => {
    const mockContent = JSON.stringify({
      content: [
        {
          heading: 'Introduction Block',
          body: 'This is step one content explanation.',
        },
        {
          heading: 'Deep Dive Focus',
          body: 'This is second step structural detail text.',
        },
      ],
    })

    vi.mocked(useGuideQuery).mockReturnValue({
      data: {
        title: 'Complete Master Guide',
        content: mockContent,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<GuideDetailPage id={mockId} />)

    expect(screen.getByText('Complete Master Guide')).toBeTruthy()

    expect(
      screen.getByRole('button', { name: /~ Introduction Block/i }),
    ).toBeTruthy()
    expect(
      screen.getByRole('button', { name: /Deep Dive Focus/i }),
    ).toBeTruthy()

    expect(
      screen.getByText('This is step one content explanation.'),
    ).toBeTruthy()
    expect(
      screen.getByText('This is second step structural detail text.'),
    ).toBeTruthy()
  })

  it('executes smooth scroll layout shifts when TOC links are selected by users', () => {
    const mockContent = JSON.stringify([
      { heading: 'First Segment', body: 'Body data element 1.' },
      { heading: 'Second Segment', body: 'Body data element 2.' },
    ])

    vi.mocked(useGuideQuery).mockReturnValue({
      data: {
        title: 'Scroll Action Test',
        content: mockContent,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<GuideDetailPage id={mockId} />)

    const targetedButton = screen.getByRole('button', {
      name: /Second Segment/i,
    })
    fireEvent.click(targetedButton)

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(1)
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })
})
