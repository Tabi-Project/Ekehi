import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLogoutMutation, useMeQuery } from '#/features/auth/auth.query'

import Navbar from './navbar'

const mockMutate = vi.fn()
let mockCurrentPath = '/'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    activeProps,
    inactiveProps,
    className,
    ...props
  }: any) => {
    const isActive =
      to === '/' ? mockCurrentPath === '/' : mockCurrentPath.startsWith(to)

    const combinedClasses = [
      className,
      isActive ? activeProps?.className : inactiveProps?.className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <a
        href={to}
        className={combinedClasses}
        aria-current={isActive ? 'page' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  },
}))

vi.mock('@/assets/svgs', () => ({
  SVGS: {
    ekehiLogo: 'logo.svg',
  },
}))

vi.mock('@/features/auth/auth.query', () => ({
  useMeQuery: vi.fn(),
  useLogoutMutation: vi.fn(),
}))

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCurrentPath = '/'
  })

  const mockLoggedOut = () => {
    vi.mocked(useMeQuery).mockReturnValue({
      data: null,
    } as any)

    vi.mocked(useLogoutMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any)
  }

  const mockLoggedIn = () => {
    vi.mocked(useMeQuery).mockReturnValue({
      data: {
        profile_image_url: 'avatar.jpg',
      },
    } as any)

    vi.mocked(useLogoutMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any)
  }

  it('renders logo', () => {
    mockLoggedOut()

    render(<Navbar />)

    expect(screen.getByText('Ekehi')).toBeTruthy()
  })

  it('renders navigation links', () => {
    mockLoggedOut()

    render(<Navbar />)

    expect(screen.getByText('Contributors')).toBeTruthy()
    expect(screen.getByText('Opportunities')).toBeTruthy()
    expect(screen.getByText('Resources')).toBeTruthy()
    expect(screen.getByText('Submissions')).toBeTruthy()
  })

  it('shows signup and login buttons when logged out', () => {
    mockLoggedOut()

    render(<Navbar />)

    expect(screen.getAllByText('Sign up')[0]).toBeTruthy()
    expect(screen.getAllByText('Log in')[0]).toBeTruthy()
  })

  it('shows avatar button when logged in', () => {
    mockLoggedIn()

    render(<Navbar />)

    const avatarButton = screen.getByRole('button', {
      name: /account menu/i,
    })

    expect(avatarButton).toBeTruthy()
  })

  it('opens avatar dropdown', () => {
    mockLoggedIn()

    render(<Navbar />)

    const avatarButton = screen.getByRole('button', {
      name: /account menu/i,
    })

    fireEvent.click(avatarButton)

    expect(screen.getByText('Log out')).toBeTruthy()
  })

  it('calls logout when logout clicked', () => {
    mockLoggedIn()

    render(<Navbar />)

    const avatarButton = screen.getByRole('button', {
      name: /account menu/i,
    })

    fireEvent.click(avatarButton)

    fireEvent.click(screen.getByText('Log out'))

    expect(mockMutate).toHaveBeenCalledTimes(1)
  })

  it('opens mobile menu', () => {
    mockLoggedOut()

    render(<Navbar />)

    const menuButton = screen.getByRole('button', {
      name: /open navigation menu/i,
    })

    fireEvent.click(menuButton)

    expect(screen.getAllByText('Contributors').length).toBeGreaterThan(1)
  })

  it('closes mobile menu on escape', () => {
    mockLoggedOut()

    render(<Navbar />)

    const menuButton = screen.getByRole('button', {
      name: /open navigation menu/i,
    })

    fireEvent.click(menuButton)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.getAllByText('Contributors').length).toBe(1)
  })

  it('closes avatar menu on escape', () => {
    mockLoggedIn()

    render(<Navbar />)

    const avatarButton = screen.getByRole('button', {
      name: /account menu/i,
    })

    fireEvent.click(avatarButton)

    expect(screen.getByText('Log out')).toBeTruthy()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByText('Log out')).toBeNull()
  })

  it('closes avatar menu on outside click', () => {
    mockLoggedIn()

    render(
      <>
        <Navbar />
        <div data-testid="outside">outside</div>
      </>,
    )

    const avatarButton = screen.getByRole('button', {
      name: /account menu/i,
    })

    fireEvent.click(avatarButton)

    expect(screen.getByText('Log out')).toBeTruthy()

    fireEvent.click(screen.getByTestId('outside'))

    expect(screen.queryByText('Log out')).toBeNull()
  })

  it('marks active route correctly', () => {
    mockCurrentPath = '/resources'

    mockLoggedOut()

    render(<Navbar />)

    const resourcesLink = screen.getByText('Resources')

    expect(resourcesLink.getAttribute('aria-current')).toBe('page')
    expect(resourcesLink.className).toContain('font-semibold')
  })
})
