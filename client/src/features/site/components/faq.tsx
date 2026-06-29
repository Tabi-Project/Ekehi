import { useState } from 'react'

import { cn } from '#/lib/utils'

type FaqItem = {
  id: string
  question: string
  answer: string
}

const FAQS: Array<FaqItem> = [
  {
    id: 'need-account',
    question: 'Do I need an account to browse opportunities?',
    answer:
      "No. You can search and browse every opportunity on Ekehi without creating an account. Signing up lets you save opportunities, set alerts, and get weekly digests matched to your sector and stage — but it's entirely optional.",
  },
  {
    id: 'check-eligibility',
    question: "How do I know if I'm eligible for a funding opportunity?",
    answer:
      'Each listing includes a detailed Eligibility section. We categorize opportunities by sector, business stage, and location. Check these against your profile to see if you qualify.',
  },
  {
    id: 'report-listing',
    question: 'How do I report an outdated or closed listing?',
    answer:
      'We strive for accuracy, but if you find a broken link or a closed listing, please click the "Report" button on the opportunity page or contact our support team directly.',
  },
  {
    id: 'countries-covered',
    question: 'What countries does Ekehi cover?',
    answer:
      'Our primary focus is Nigeria, but we include Pan-African and global funding opportunities that are explicitly open to Nigerian founders and small business owners.',
  },
]

export function FaqSection() {
  // Tracks which single FAQ item is open. null means none are open.
  // Starts with the first item open, matching the design.
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id)

  function toggleItem(id: string) {
    // Clicking the already-open item closes it.
    // Clicking any other item opens that one and closes whatever was open before.
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-[100px]">
      <div className="mx-auto w-full max-w-7xl px-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <h2 className="text-content max-w-xs font-serif text-2xl sm:text-3xl md:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id

            return (
              <div key={faq.id} className="border-line border-b first:border-t">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleItem(faq.id)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                >
                  <h3 className="text-content text-sm font-semibold sm:text-base">
                    {faq.question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="text-content-muted shrink-0 text-lg"
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    isOpen ? 'max-h-96 pb-5' : 'max-h-0',
                  )}
                >
                  <p className="text-content-secondary text-sm leading-relaxed sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
