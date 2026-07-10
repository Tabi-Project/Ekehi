import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { SVGS } from '#/assets/svgs'
import { Dropdown } from '#/components/ui/dropdown'
import { useLogoutMutation, useMeQuery } from '#/features/auth/auth.query'
import { cn } from '#/lib/utils'

interface LinkItem {
  to: string
  label: string
}

interface NavConfig {
  logo: {
    to: string
    wordmark: string
  }
  links: LinkItem[]
  cta: {
    signup: LinkItem
    login: LinkItem
  }
}

const NAV_CONFIG: NavConfig = {
  logo: {
    to: '/',
    wordmark: 'Ekehi',
  },
  links: [
    { to: '/contributors', label: 'Contributors' },
    { to: '/opportunities', label: 'Opportunities' },
    { to: '/resources', label: 'Resources' },
    { to: '/submissions', label: 'Submissions' },
  ],
  cta: {
    signup: { to: '/signup', label: 'Sign up' },
    login: { to: '/login', label: 'Log in' },
  },
}

function Avatar({
  imageUrl,
  initials,
  className,
}: {
  imageUrl: string | null
  initials: string
  className?: string
}) {
  if (imageUrl) {
    return (
      <img
        className={cn('rounded-full object-cover', className)}
        src={imageUrl}
        alt="User avatar"
      />
    )
  }
  return (
    <span
      aria-hidden
      className={cn(
        'flex items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-800',
        className,
      )}
    >
      {initials}
    </span>
  )
}

export function Navbar() {
  const { logo, links, cta } = NAV_CONFIG

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isHome = pathname === '/'

  const linkBase = 'text-sm font-medium transition-colors duration-200'
  const linkActive = isHome
    ? 'font-semibold text-white'
    : 'font-semibold text-primary'
  const linkInactive = isHome
    ? 'text-white/80 hover:text-white'
    : 'text-content-muted hover:text-content'

  const { data: userProfile } = useMeQuery()
  const logoutMutation = useLogoutMutation()

  const isLoggedIn = !!userProfile
  const profileImage = userProfile?.profile_image_url || null
  const initials =
    `${userProfile?.first_name?.[0] ?? ''}${userProfile?.last_name?.[0] ?? ''}`.toUpperCase() ||
    userProfile?.email.charAt(0).toUpperCase() ||
    'U'

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  const innerRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setIsMobileMenuOpen(false)
      },
    })
  }

  // The avatar menu is a Radix dropdown (handles its own dismissal); this
  // effect only dismisses the hand-rolled mobile menu.
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const close = () => setIsMobileMenuOpen(false)

    const handleClickOutside = (event: MouseEvent) => {
      if (innerRef.current && !innerRef.current.contains(event.target as Node))
        close()
    }
    const handleResize = () => {
      if (window.innerWidth > 768) close()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', handleResize)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen])

  return (
    <div
      className={cn(
        'top-0 z-50 w-full font-sans',
        isHome
          ? 'absolute inset-x-0'
          : 'border-line bg-surface sticky border-b',
      )}
      ref={innerRef}
    >
      <nav className="relative">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            to={logo.to}
            className="flex cursor-pointer items-center space-x-3"
            aria-label="Ekehi homepage"
          >
            <img
              src={isHome ? SVGS.ekehiLogo2 : SVGS.ekehiLogo}
              alt={logo.wordmark}
              width={43}
              height={48}
            />
            <span
              className={cn(
                'font-serif text-2xl font-semibold tracking-wide italic',
                isHome ? 'text-white' : 'text-content',
              )}
            >
              {logo.wordmark}
            </span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {links.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                activeProps={{ className: linkActive }}
                inactiveProps={{ className: linkInactive }}
                className={linkBase}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            {!isLoggedIn ? (
              <>
                <Link
                  to={cta.signup.to}
                  className={cn(
                    'rounded-full px-6 py-2.5 text-center text-sm font-medium shadow-sm transition-colors',
                    isHome
                      ? 'bg-white text-purple-800 hover:bg-white/90'
                      : 'bg-primary text-on-primary hover:bg-primary-hover',
                  )}
                >
                  {cta.signup.label}
                </Link>
                <Link
                  to={cta.login.to}
                  className={cn(
                    'rounded-full border px-6 py-2.5 text-center text-sm font-medium transition-colors',
                    isHome
                      ? 'border-white text-white hover:bg-white/10'
                      : 'border-primary text-primary hover:bg-primary/10',
                  )}
                >
                  {cta.login.label}
                </Link>
              </>
            ) : (
              <Dropdown>
                <Dropdown.Trigger asChild>
                  <button
                    type="button"
                    aria-label="Account menu"
                    className="group focus-visible:ring-primary flex items-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Avatar
                      imageUrl={profileImage}
                      initials={initials}
                      className="h-11 w-11 ring-2 ring-transparent transition-all group-hover:ring-purple-200"
                    />
                  </button>
                </Dropdown.Trigger>
                <Dropdown.Content align="end" className="w-48">
                  <Dropdown.Item
                    disabled={logoutMutation.isPending}
                    onSelect={handleLogout}
                    className="text-red-600 focus:bg-red-50"
                  >
                    {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={
                isMobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              className={cn(
                'focus:outline-none',
                isHome
                  ? 'text-white hover:text-white/80'
                  : 'text-content hover:text-content-muted',
              )}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 z-50 space-y-3 border-b border-gray-100 bg-white px-6 py-4 shadow-lg md:hidden">
            {links.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                activeProps={{ className: 'text-primary' }}
                inactiveProps={{ className: 'text-gray-600' }}
                className="block py-2 text-base font-medium"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex flex-col space-y-3 border-t border-gray-100 pt-4">
              {!isLoggedIn ? (
                <>
                  <Link
                    to={cta.signup.to}
                    className="w-full rounded-full bg-purple-800 py-2.5 text-center font-medium text-white shadow-sm"
                  >
                    {cta.signup.label}
                  </Link>
                  <Link
                    to={cta.login.to}
                    className="w-full rounded-full border border-purple-800 py-2.5 text-center font-medium text-purple-800 hover:bg-purple-50"
                  >
                    {cta.login.label}
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="flex cursor-pointer items-center space-x-3 pt-2 text-red-600 disabled:pointer-events-none disabled:opacity-50"
                >
                  <Avatar
                    imageUrl={profileImage}
                    initials={initials}
                    className="h-10 w-10"
                  />
                  <span className="text-sm font-medium">
                    {logoutMutation.isPending ? 'Logging Out...' : 'Log Out'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
