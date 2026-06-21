import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Footer } from './footer'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className, ...props }: any) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('@/assets/svgs', () => ({
  SVGS: {
    ekehiLogo2: 'logo2.svg',
  },
}))

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders brand wordmark and tagline', () => {
    render(<Footer />)

    expect(screen.getByText('Ekehi')).toBeTruthy()
    expect(
      screen.getByText(
        'A searchable, continuously updated business resource centre built for women entrepreneurs across Africa.',
      ),
    ).toBeTruthy()
  })

  it('renders all navigation section headings', () => {
    render(<Footer />)

    expect(screen.getByText('Explore')).toBeTruthy()
    expect(screen.getByText('For Partners')).toBeTruthy()
    expect(screen.getByText('About')).toBeTruthy()
  })

  it('renders navigation category links', () => {
    render(<Footer />)

    expect(screen.getByText('Browse funding')).toBeTruthy()
    expect(screen.getByText('Training programmes')).toBeTruthy()
    expect(screen.getByText('Mentorship')).toBeTruthy()
    expect(screen.getByText('Resources')).toBeTruthy()

    expect(screen.getByText('List an opportunity')).toBeTruthy()
    expect(screen.getByText('Sponsor a programme')).toBeTruthy()
    expect(screen.getByText('Become a mentor')).toBeTruthy()
    expect(screen.getByText('Success stories')).toBeTruthy()

    expect(screen.getByText('About Ekehi')).toBeTruthy()
    expect(screen.getByText('TEE Foundation')).toBeTruthy()
    expect(screen.getByText('Contribute on GitHub')).toBeTruthy()
    expect(screen.getByText('Contact Us')).toBeTruthy()
  })

  it('renders copyright section with project link text', () => {
    render(<Footer />)

    expect(screen.getByText(/2026/)).toBeTruthy()
    expect(screen.getByText('Tabî Project (TEE Foundation)')).toBeTruthy()
  })

  it('renders bottom contribution note', () => {
    render(<Footer />)

    expect(
      screen.getByText('Open Source & Open for Contributions'),
    ).toBeTruthy()
  })

  it('renders legal resource links', () => {
    render(<Footer />)

    expect(screen.getByText('Privacy Policy')).toBeTruthy()
    expect(screen.getByText('Terms of Service')).toBeTruthy()
    expect(screen.getByText('Accessibility')).toBeTruthy()
  })
})
