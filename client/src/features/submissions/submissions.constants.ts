/**
 * Human labels for the enum slugs returned by `/meta` (which sends raw slugs
 * only). Unknown slugs fall back to `humanizeSlug`.
 */
export const OPPORTUNITY_TYPE_LABELS: Record<string, string> = {
  grant_ngo: 'Grant (NGO)',
  grant_government: 'Grant (Government)',
  angel_investment: 'Angel investment',
  accelerator: 'Accelerator',
  loan: 'Loan',
  microfinance: 'Microfinance',
  vc: 'Venture capital',
  prize_money: 'Prize money',
}

export const LISTING_STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  rolling_applications: 'Rolling applications',
  closed: 'Closed',
}

/** Country options (the backend stores `country` as a free string). */
export const COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'Egypt',
  'Rwanda',
  'Uganda',
  'Tanzania',
  'Ethiopia',
  'Senegal',
  'Côte d’Ivoire',
  'Other',
] as const

export const DEFAULT_CURRENCY = 'NGN'

export function humanizeSlug(slug: string): string {
  return slug
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function labelFor(map: Record<string, string>, slug: string): string {
  return map[slug] ?? humanizeSlug(slug)
}
