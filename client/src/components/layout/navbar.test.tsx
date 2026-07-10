import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLogoutMutation, useMeQuery } from '#/features/auth/auth.query'

import { Navbar } from './navbar'

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
  useRouterState: ({ select }: any) =>
    select({ location: { pathname: mockCurrentPath } }),
}))

vi.mock('#/assets/svgs', () => ({
  SVGS: {
    ekehiLogo: 'logo.svg',
    ekehiLogo2: 'logo2.svg',
  },
}))

vi.mock('#/features/auth/auth.query', () => ({
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
        first_name: 'Ada',
        last_name: 'Lovelace',
        email: 'ada@example.com',
      },
    } as any)

    vi.mocked(useLogoutMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any)
  }

  // Radix DropdownMenu opens on pointerdown, not click, and attaches its
  // outside-press listener on a timeout — hence the pointer events and
  // waits in the avatar-menu tests.
  const openAvatarMenu = async () => {
    fireEvent.pointerDown(
      screen.getByRole('button', { name: /account menu/i }),
      { button: 0, ctrlKey: false },
    )
    await screen.findByText('Log out')
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

  it('opens avatar dropdown', async () => {
    mockLoggedIn()

    render(<Navbar />)

    await openAvatarMenu()

    expect(screen.getByText('Log out')).toBeTruthy()
  })

  it('calls logout when logout clicked', async () => {
    mockLoggedIn()

    render(<Navbar />)

    await openAvatarMenu()

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

  it('closes avatar menu on escape', async () => {
    mockLoggedIn()

    render(<Navbar />)

    await openAvatarMenu()

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText('Log out')).toBeNull()
    })
  })

  it('closes avatar menu on outside click', async () => {
    mockLoggedIn()

    render(
      <>
        <Navbar />
        <div data-testid="outside">outside</div>
      </>,
    )

    await openAvatarMenu()

    // Radix attaches its outside-press listener on a 0ms timeout after open.
    await new Promise((resolve) => setTimeout(resolve, 0))

    fireEvent.pointerDown(screen.getByTestId('outside'), { button: 0 })

    await waitFor(() => {
      expect(screen.queryByText('Log out')).toBeNull()
    })
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
