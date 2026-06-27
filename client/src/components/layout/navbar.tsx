import { Link, useRouterState } from '@tanstack/react-router'
import React, { useEffect, useRef, useState } from 'react'

import { SVGS } from '#/assets/svgs'
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

export const Navbar: React.FC = () => {
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState<boolean>(false)

  const innerRef = useRef<HTMLDivElement>(null)
  const avatarWrapperRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setIsAvatarMenuOpen(false)
        setIsMobileMenuOpen(false)
      },
    })
  }

  useEffect(() => {
    const handleClickOutside = (event_: MouseEvent) => {
      const target = event_.target as Node
      if (
        isMobileMenuOpen &&
        innerRef.current &&
        !innerRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false)
      }
      if (
        isAvatarMenuOpen &&
        avatarWrapperRef.current &&
        !avatarWrapperRef.current.contains(target)
      ) {
        setIsAvatarMenuOpen(false)
      }
    }

    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleGlobalKeyDown = (event_: KeyboardEvent) => {
      if (event_.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsAvatarMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', handleResize)
    document.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isMobileMenuOpen, isAvatarMenuOpen])

  const fallbackAvatar =
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'

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
                      ? 'bg-white text-[#4a0066] hover:bg-white/90'
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
              <div className="relative" ref={avatarWrapperRef}>
                <button
                  type="button"
                  aria-label="Account menu"
                  aria-expanded={isAvatarMenuOpen}
                  aria-haspopup="menu"
                  onClick={(event_) => {
                    event_.stopPropagation()
                    setIsAvatarMenuOpen((previous) => !previous)
                  }}
                  className="group relative flex items-center focus:outline-none"
                >
                  <img
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-transparent transition-all group-hover:ring-purple-200"
                    src={profileImage || fallbackAvatar}
                    alt="User Avatar"
                  />
                </button>

                {isAvatarMenuOpen && (
                  <div
                    className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg duration-150"
                    role="menu"
                  >
                    <button
                      type="button"
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
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
                activeProps={{ className: 'text-[#730099]' }}
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
                    className="w-full rounded-full bg-[#4C0066] py-2.5 text-center font-medium text-white shadow-sm"
                  >
                    {cta.signup.label}
                  </Link>
                  <Link
                    to={cta.login.to}
                    className="w-full rounded-full border border-[#4d0066] py-2.5 text-center font-medium text-[#550073] hover:bg-purple-50"
                  >
                    {cta.login.label}
                  </Link>
                </>
              ) : (
                <div className="space-y-2">
                  <div
                    className={`flex items-center space-x-3 pt-2 text-red-600 ${logoutMutation.isPending ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                    onClick={handleLogout}
                  >
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={profileImage || fallbackAvatar}
                      alt="User Avatar"
                    />
                    <span className="text-sm font-medium">
                      {logoutMutation.isPending ? 'Logging Out...' : 'Log Out'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navbar
