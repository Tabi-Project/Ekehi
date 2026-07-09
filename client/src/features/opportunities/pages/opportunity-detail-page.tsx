import { Bookmark, BookmarkCheck } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Modal } from '#/components/ui/modal'
import { getAccessToken } from '#/lib/auth/token-store'

import {
  useOpportunityDetailQuery,
  useSaveOpportunityMutation,
} from '../opportunities.query'
import type { OpportunityDetail } from '../opportunities.types'

// --- Helpers ---

function formatAmount(
  min: number | null,
  max: number | null,
  currency: string | null,
) {
  const fmt = (n: number) => `${currency ?? ''}${(n / 1_000_000).toFixed(0)}m`
  if (min && max) return `${fmt(min)} - ${fmt(max)}`
  if (min) return fmt(min)
  if (max) return fmt(max)
  return '—'
}

function formatDate(dateString: string | null) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function humanize(string_: string | null) {
  if (!string_) return '—'
  return string_.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function eligibilityList(string_: string | null) {
  if (!string_)
    return (
      <p className="text-content-secondary text-base leading-[150%] font-normal">
        —
      </p>
    )
  const items = string_
    .split('.')
    .map((s) => s.trim())
    .filter(Boolean)
  return (
    <ul className="text-content-secondary list-disc space-y-1 pl-5 text-base leading-[150%] font-normal">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

// --- Inline SVG share icons (avoids img src path issues) ---

function LinkedInIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        d="M7.5 9.5H5V19H7.5V9.5ZM6.25 8.5C7.08 8.5 7.75 7.83 7.75 7C7.75 6.17 7.08 5.5 6.25 5.5C5.42 5.5 4.75 6.17 4.75 7C4.75 7.83 5.42 8.5 6.25 8.5ZM19 19H16.5V14.25C16.5 13.01 16.48 11.41 14.77 11.41C13.04 11.41 12.77 12.77 12.77 14.16V19H10.27V9.5H12.67V10.94H12.7C13.04 10.29 13.88 9.6 15.14 9.6C17.67 9.6 19 11.22 19 13.58V19Z"
        fill="white"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="url(#ig-grad)" />
      <path
        d="M12 8.5C10.07 8.5 8.5 10.07 8.5 12C8.5 13.93 10.07 15.5 12 15.5C13.93 15.5 15.5 13.93 15.5 12C15.5 10.07 13.93 8.5 12 8.5ZM12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14Z"
        fill="white"
      />
      <path
        d="M15.5 5.5H8.5C6.84 5.5 5.5 6.84 5.5 8.5V15.5C5.5 17.16 6.84 18.5 8.5 18.5H15.5C17.16 18.5 18.5 17.16 18.5 15.5V8.5C18.5 6.84 17.16 5.5 15.5 5.5ZM17 15.5C17 16.33 16.33 17 15.5 17H8.5C7.67 17 7 16.33 7 15.5V8.5C7 7.67 7.67 7 8.5 7H15.5C16.33 7 17 7.67 17 8.5V15.5Z"
        fill="white"
      />
      <circle cx="16" cy="8" r="1" fill="white" />
      <defs>
        <linearGradient id="ig-grad" x1="0" y1="24" x2="24" y2="0">
          <stop offset="0%" stopColor="#F9CE34" />
          <stop offset="50%" stopColor="#EE2A7B" />
          <stop offset="100%" stopColor="#6228D7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#000000" />
      <path
        d="M17.75 5H15.08L12 8.77L9.33 5H5.25L9.92 11.07L5 19H7.67L11 14.9L14.08 19H18.17L13.25 12.6L17.75 5ZM14.75 17.5L7.5 6.5H9.25L16.5 17.5H14.75Z"
        fill="white"
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#25D366" />
      <path
        d="M12 4C7.58 4 4 7.58 4 12C4 13.49 4.41 14.88 5.12 16.07L4 20L8.05 18.91C9.2 19.55 10.56 19.92 12 19.92C16.42 19.92 20 16.34 20 11.92C20 7.5 16.42 4 12 4ZM16.22 15.33C16.03 15.84 15.14 16.31 14.73 16.35C14.32 16.39 13.93 16.53 12.06 15.79C9.82 14.9 8.4 12.61 8.29 12.47C8.18 12.33 7.39 11.28 7.39 10.19C7.39 9.1 7.95 8.57 8.16 8.34C8.37 8.11 8.62 8.06 8.78 8.06H9.25C9.41 8.06 9.62 8 9.82 8.49L10.57 10.31C10.67 10.54 10.63 10.8 10.5 10.98L10.14 11.45C10.01 11.63 9.87 11.82 10.03 12.09C10.19 12.36 10.74 13.23 11.53 13.93C12.54 14.83 13.38 15.11 13.65 15.24C13.92 15.37 14.08 15.35 14.24 15.17L14.83 14.49C14.99 14.29 15.19 14.33 15.42 14.42L17.04 15.19C17.27 15.28 17.43 15.33 17.47 15.43C17.51 15.56 17.41 16.01 17.22 16.52L16.22 15.33Z"
        fill="white"
      />
    </svg>
  )
}

// --- Sub components ---

function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'status' | 'flag'
}) {
  const styles = {
    default: 'bg-purple-100 text-purple-800',
    status: 'bg-orange-100 text-orange-800',
    flag: 'bg-green-100 text-green-800',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  )
}

// Inter 500 16px 150% — Gray-900
function DetailSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-base leading-[150%] font-medium text-[#18181B]">
        {title}
      </h2>
      {children}
    </div>
  )
}

// Aside meta: label = Inter 400 16px 100% Gray-500 | value = Inter 400 16px 100% Gray-900
function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-base leading-[100%] font-normal text-[#72717B]">
        {label}
      </p>
      <div className="text-base leading-[100%] font-normal text-[#18181B]">
        {value}
      </div>
    </div>
  )
}

function SaveModal() {
  return (
    <Modal.Content className="max-w-sm text-center">
      <div className="flex flex-col items-center gap-4">
        {/* Using a text fallback in case image path fails */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
          <img
            src="../../../assets/svgs/logo2.png"
            alt="Ekehi"
            className="h-12 w-12"
            onError={(error) => {
              error.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="space-y-2">
          <Modal.Title>Save this opportunity</Modal.Title>
          <Modal.Description>
            Create a free account to bookmark opportunities and access them
            anytime.
          </Modal.Description>
        </div>
        <div className="w-full space-y-3">
          <input
            type="email"
            placeholder="Enter email address"
            className="border-line text-content placeholder:text-content-muted w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button full asChild>
            <a href="/signup/">Create account</a>
          </Button>
          <p className="text-content-secondary text-sm">
            Already have an account?{' '}
            <a href="/login/" className="text-primary underline">
              Login
            </a>
          </p>
          <Modal.Close asChild>
            <button className="text-content-secondary hover:text-content w-full text-sm">
              Continue browsing
            </button>
          </Modal.Close>
        </div>
      </div>
    </Modal.Content>
  )
}

function OpportunityAside({
  opp,
  isLoggedIn,
}: {
  opp: OpportunityDetail
  isLoggedIn: boolean
}) {
  const saveMutation = useSaveOpportunityMutation(opp.id)
  const isSaved = opp.is_saved ?? false

  function handleSaveClick() {
    if (!isLoggedIn) return
    saveMutation.mutate(isSaved)
  }

  return (
    <aside className="h-fit space-y-4 self-start rounded-[4px] bg-white p-6">
      {opp.apply_url ? (
        <Button full asChild size="lg">
          <a href={opp.apply_url} target="_blank" rel="noopener noreferrer">
            Apply
          </a>
        </Button>
      ) : (
        <p className="text-content-muted text-center text-sm">
          No application link available.
        </p>
      )}

      {isLoggedIn ? (
        <Button
          full
          variant="outline"
          onClick={handleSaveClick}
          disabled={saveMutation.isPending}
        >
          {isSaved ? (
            <>
              <BookmarkCheck size={16} />
              Saved
            </>
          ) : (
            <>
              <Bookmark size={16} />
              Save
            </>
          )}
        </Button>
      ) : (
        <Modal.Trigger asChild>
          <Button full variant="outline">
            <Bookmark size={16} />
            Save
          </Button>
        </Modal.Trigger>
      )}

      <dl className="space-y-4">
        <MetaItem label="Organiser" value={opp.funder_name || '—'} />
        <MetaItem
          label="Amount"
          value={formatAmount(opp.amount_min, opp.amount_max, opp.currency)}
        />
        <MetaItem
          label="Deadline"
          value={formatDate(opp.application_deadline)}
        />
        <MetaItem label="Country/Region" value={opp.country || '—'} />
        {opp.contact_email && (
          <MetaItem
            label="Contact"
            value={
              <a
                href={`mailto:${opp.contact_email}`}
                className="text-primary underline"
              >
                {opp.contact_email}
              </a>
            }
          />
        )}
      </dl>

      <hr className="border-line" />

      <div className="space-y-3">
        <p className="text-content-muted text-center text-sm">
          Share this opportunity
        </p>
        <div className="flex justify-center gap-3">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
          >
            <XIcon />
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </aside>
  )
}

// --- Newsletter section ---

function NewsletterSection() {
  return (
    <div className="space-y-3 pt-2">
      <h2 className="text-xl font-semibold text-[#18181B]">
        Never miss an opportunity
      </h2>
      <p className="text-sm text-[#403F46]">
        Subscribe to receive important application and funding deadlines
        directly in your inbox
      </p>
      <div className="flex gap-3">
        <input
          type="email"
          placeholder="Enter email address"
          className="border-line text-content placeholder:text-content-muted flex-1 rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button variant="primary">Subscribe</Button>
      </div>
    </div>
  )
}

// --- Main page ---

export function OpportunityDetailPage({ id }: { id: string }) {
  const { data, isLoading, error } = useOpportunityDetailQuery(id)
  const isLoggedIn = Boolean(getAccessToken())

  if (isLoading) {
    return (
      <div className="text-content-muted container py-16 text-center">
        Loading opportunity...
      </div>
    )
  }

  if (error) {
    const is404 = error.status === 404
    return (
      <div className="container space-y-2 py-16 text-center">
        <h1 className="text-content text-2xl font-semibold">
          {is404 ? 'Opportunity not found' : 'Something went wrong'}
        </h1>
        <p className="text-content-secondary">{error.message}</p>
        <a href="/opportunities/" className="text-primary text-sm underline">
          Back to opportunities
        </a>
      </div>
    )
  }

  if (!data) return null

  return (
    <Modal>
      <div className="bg-surface-subtle">
        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          {/* Breadcrumb */}
          <nav className="text-content-muted mb-6 flex items-center gap-2 text-sm">
            <a href="/opportunities/" className="text-primary hover:underline">
              Funding opportunities
            </a>
            <span>›</span>
            <span>{data.opportunity_title}</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_296px]">
            {/* Left — main content card */}
            <div className="space-y-6">
              <div className="rounded-[4px] bg-white p-6">
                {/* Header */}
                <header className="border-line mb-[30px] space-y-3 border-b pb-6">
                  {/* Lora 500 28px 100% line-height Gray-900 */}
                  <h1 className="font-serif text-[28px] leading-[100%] font-medium text-[#18181B]">
                    {data.opportunity_title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{humanize(data.opportunity_type)}</Badge>
                    <Badge variant="status">{humanize(data.status)}</Badge>
                    {data.is_women_only && (
                      <Badge variant="flag">Women only</Badge>
                    )}
                    {data.is_equity_free && (
                      <Badge variant="flag">Equity free</Badge>
                    )}
                  </div>
                </header>

                {/* Body sections — Inter 400 16px 150% Gray-700 */}
                <div className="space-y-[30px]">
                  <DetailSection title="About this opportunity">
                    <p className="text-base leading-[150%] font-normal text-[#403F46]">
                      {data.description || '—'}
                    </p>
                  </DetailSection>

                  <DetailSection title="Eligibility criteria">
                    {eligibilityList(data.eligibility_criteria)}
                  </DetailSection>

                  <div className="grid grid-cols-2 gap-6">
                    {data.sectors && data.sectors.length > 0 && (
                      <DetailSection title="Sectors">
                        <div className="flex flex-wrap gap-2">
                          {data.sectors.map((s) => (
                            <Badge key={s}>{humanize(s)}</Badge>
                          ))}
                        </div>
                      </DetailSection>
                    )}
                    {data.stages && data.stages.length > 0 && (
                      <DetailSection title="Stages">
                        <div className="flex flex-wrap gap-2">
                          {data.stages.map((s) => (
                            <Badge key={s}>{humanize(s)}</Badge>
                          ))}
                        </div>
                      </DetailSection>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[4px] bg-white p-6">
                <NewsletterSection />
              </div>
            </div>

            {/* Right — sidebar */}
            <OpportunityAside opp={data} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
      <SaveModal />
    </Modal>
  )
}
