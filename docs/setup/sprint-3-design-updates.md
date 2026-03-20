# Sprint 3 — Design & Implementation Updates

**Date:** 2026-03-18
**Branch:** `chore/complete-sprint-2`

## Context

The designer has produced updated mockups for the Ekehi landing page, auth pages, and opportunity detail page. This sprint captures every design and implementation delta between the current codebase and the new designs.

---

## Issues (11 total)

### Issue 1 — Navigation Updates
**Label:** `feat`, `frontend`
**Files:** `client/shared/components/nav/nav.js`, `client/shared/components/nav/nav.css`

- Add "Submissions" as a 4th nav link (after Resources)
- Add "Post a job" as a third header button (outline style, visible to all)
- Logged-out state: Sign up (filled) + Log in (outline) + Post a job (outline)
- Logged-in state: Post a job (outline) + Avatar dropdown

---

### Issue 2 — Hero Section Redesign
**Label:** `feat`, `frontend`
**Files:** `client/index.html`, `client/landing/sections/hero.css`, `client/landing/landing.js`

- Full-viewport-height section with dark photography as background
- Title "Find Funding and Resources Built for You" — large, white, bottom-left
- Subtitle — white text, positioned center-right
- CTA buttons: "Join the network" (purple filled) + "Learn more" (white outline)
- Remove standalone image asset; background replaces it

---

### Issue 3 — About Section Redesign
**Label:** `feat`, `frontend`
**Files:** `client/index.html`, `client/landing/sections/about.css`

- Full-width dark purple (`#3B0065` approx) background
- Left: "About Ekehi" logo treatment (wordmark + sun/star icon)
- Right: Description paragraph text (white)
- "Learn more" button — white, pill-shaped outline

---

### Issue 4 — Value Proposition Section Update
**Label:** `feat`, `frontend`
**Files:** `client/index.html`, `client/landing/sections/value-proposition.css`

- Heading and right-aligned description stay at top (no visual change)
- Full-width image below heading, with purple color overlay/wash
- Two-column body text below the image
- Rounded corners on the image container

---

### Issue 5 — What-We-Offer Section Redesign
**Label:** `feat`, `frontend`
**Files:** `client/index.html`, `client/landing/sections/what-we-offer.css`, `client/landing/landing.js`

- Layout: two-column (left = selectable list, right = static image)
- Four items: Funding Database, Training Programmes, Business Tools, Mentorship Network
- Active/selected item gets lavender highlight background
- JS: click item to activate it (default: Training Programmes)
- Right image stays static (contextual image of workshop)

---

### Issue 6 — Add FAQ Section to Landing Page
**Label:** `feat`, `frontend`
**Files:** `client/index.html`, `client/landing/sections/faq.css` (new), `client/landing/landing.js`

- New section: "Frequently Asked Questions" heading (left), accordion (right)
- 4 FAQ items with expand/collapse (+ / − icons)
- Only one item open at a time
- "See more FAQs →" purple link at bottom right
- Insert between value-proposition and CTA sections

---

### Issue 7 — Opportunity Detail Page Redesign
**Label:** `feat`, `frontend`
**Files:** `client/opportunities/detail/index.html`, `client/opportunities/detail/detail.css`, `client/opportunities/detail/detail.js`

- Breadcrumb: "Funding opportunities > [title]" (purple link + plain text)
- Left content: Programme Benefits, Total Impact (bullet list), Female participation %, Application period, Programme focus
- Right sidebar:
  - Apply button (purple, full-width)
  - Save button (outline, with bookmark icon)
  - Metadata labels: Organiser, Amount, Deadline, Country/Region
  - Divider
  - "Share this opportunity" with social icons: LinkedIn, Instagram, X, WhatsApp
- Bottom: "Never miss an opportunity" email subscribe section

---

### Issue 8 — Save Opportunity Auth-Gate Modal
**Label:** `feat`, `frontend`
**Files:** `client/opportunities/detail/detail.js`, `client/opportunities/detail/detail.css`

- "Save" button click:
  - If logged in → save to user's account (API call, toggle state)
  - If not logged in → show modal overlay
- Modal: Ekehi icon, "Save this opportunity" title, subtitle, email input, "Create account" button, "Already have an account? Login" link, "Continue browsing" dismiss link
- Modal accessible (focus trap, Escape to close)

---

### Issue 9 — Signup Page Redesign — Step 1: Identity
**Label:** `feat`, `frontend`
**Files:** `client/signup/index.html`, `client/signup/signup.css`, `client/signup/signup.js`

- Centered card layout, no nav/footer
- Ekehi app icon at top
- Step 1: "Create your account" / "Join us today…" subtitle
- Fields: Email address, Full name
- "Continue" (purple pill) + "Back" (outline pill) buttons
- Terms & Privacy notice at bottom with purple links

---

### Issue 10 — Signup Page — Step 2: Create Password
**Label:** `feat`, `frontend`
**Files:** `client/signup/signup.js`, `client/signup/signup.css`

- Step 2 of multi-step signup flow (same page, JS-driven step)
- "Create your password" title / subtitle
- Fields: Password (with eye toggle) + Confirm password (eye toggle)
- "Continue" + "Back" buttons (same pill style)
- Back navigates to step 1

---

### Issue 11 — Login Page Redesign
**Label:** `feat`, `frontend`
**Files:** `client/login/index.html`, `client/login/login.css`, `client/login/login.js`

- Centered card layout matching signup style (no nav/footer)
- Ekehi app icon at top
- "Log in" title + "Log in to access your account and continue your journey!" subtitle
- Fields: Email address, Password (with eye toggle)
- "Continue" (purple pill) + "Back" (outline pill) buttons
