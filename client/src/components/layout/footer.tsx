import { Link } from '@tanstack/react-router'
import React from 'react'

import { SVGS } from '@/assets/svgs'

interface LinkItem {
  label: string
  to: string
}

interface NavGroup {
  heading: string
  links: LinkItem[]
}

interface FooterConfig {
  brand: {
    to: string
    logo: string
    wordmark: string
    tagline: string
  }
  nav: NavGroup[]
  bottom: {
    copyright: {
      text: string
      linkText: string
      to: string
    }
    note: string
    legal: LinkItem[]
  }
}

const FOOTER_CONFIG: FooterConfig = {
  brand: {
    to: '/',
    logo: SVGS.ekehiLogo2,
    wordmark: 'Ekehi',
    tagline:
      'A searchable, continuously updated business resource centre built for women entrepreneurs across Africa.',
  },
  nav: [
    {
      heading: 'Explore',
      links: [
        { label: 'Browse funding', to: '/funding' },
        { label: 'Training programmes', to: '/programs' },
        { label: 'Mentorship', to: '/mentorship' },
        { label: 'Resources', to: '/resources' },
      ],
    },
    {
      heading: 'For Partners',
      links: [
        { label: 'List an opportunity', to: '/opportunities/new' },
        { label: 'Sponsor a programme', to: '/sponsor' },
        { label: 'Become a mentor', to: '/mentor' },
        { label: 'Success stories', to: '/stories' },
      ],
    },
    {
      heading: 'About',
      links: [
        { label: 'About Ekehi', to: '/about' },
        { label: 'TEE Foundation', to: '/tee-foundation' },
        { label: 'Contribute on GitHub', to: '/github' },
        { label: 'Contact Us', to: '/contact' },
      ],
    },
  ],
  bottom: {
    copyright: {
      text: '© 2026',
      linkText: 'Tabî Project (TEE Foundation)',
      to: '/',
    },
    note: 'Open Source & Open for Contributions',
    legal: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Accessibility', to: '/accessibility' },
    ],
  },
}

export const Footer: React.FC = () => {
  const { brand, nav, bottom } = FOOTER_CONFIG

  return (
    <footer className="bg-[#20002B] font-sans text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pt-16 pb-12 md:grid-cols-12 md:gap-12">
        <div className="space-y-4 md:col-span-5">
          <Link
            to={brand.to}
            className="flex w-max items-center space-x-3 text-white"
          >
            <img src={brand.logo} alt={brand.wordmark} />
            <span className="font-serif text-2xl font-semibold tracking-wide">
              {brand.wordmark}
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-gray-400">
            {brand.tagline}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:col-span-7">
          {nav.map((group) => (
            <div key={group.heading}>
              <h3 className="mb-4 text-xs font-semibold tracking-wider text-white uppercase">
                {group.heading}
              </h3>
              <ul className="space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#310a3a]" />

      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-6 text-xs text-gray-400 sm:flex-row sm:items-center">
        <div>
          {bottom.copyright.text}{' '}
          <Link
            to={bottom.copyright.to}
            className="underline transition-colors hover:text-white"
          >
            {bottom.copyright.linkText}
          </Link>
        </div>

        <div>{bottom.note}</div>

        <div className="flex space-x-4">
          {bottom.legal.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer