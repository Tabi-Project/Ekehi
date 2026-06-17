import { env } from '#/config/env'

const BRAND = 'Ekehi'
const DEFAULT_OG_IMAGE = '/og-default.png'

type PageMetaInput = {
  title?: string
  description?: string
  path: string
  image?: string
  noIndex?: boolean
  ogType?: 'website' | 'article' | 'profile'
}

type Meta = {
  title?: string
  name?: string
  property?: string
  content?: string
}

type Link = { rel: string; href: string }

type HeadOutput = { meta: Array<Meta>; links: Array<Link> }

const stripTrailingSlash = (value: string) => value.replace(/\/$/, '')

export function pageMeta({
  title,
  description,
  path,
  image,
  noIndex,
  ogType = 'website',
}: PageMetaInput): HeadOutput {
  const siteUrl = stripTrailingSlash(env.VITE_SITE_URL)
  const fullTitle = title ? `${title} · ${BRAND}` : BRAND
  const url = `${siteUrl}${path}`
  const ogImage = image ?? `${siteUrl}${DEFAULT_OG_IMAGE}`

  const meta: Array<Meta> = [
    { title: fullTitle },
    { property: 'og:title', content: fullTitle },
    { property: 'og:url', content: url },
    { property: 'og:type', content: ogType },
    { property: 'og:image', content: ogImage },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:image', content: ogImage },
  ]

  if (description) {
    meta.push(
      { name: 'description', content: description },
      { property: 'og:description', content: description },
      { name: 'twitter:description', content: description },
    )
  }

  if (noIndex) {
    meta.push({ name: 'robots', content: 'noindex,nofollow' })
  }

  return {
    meta,
    links: [{ rel: 'canonical', href: url }],
  }
}
