# Ekehi — Team Documentation

> Built for International Women's Day 2026 as part of the **Tabî Project by TEE Foundation**.
> A business intelligence platform helping women entrepreneurs and SME owners across Africa discover funding, training, and growth resources.

---

## Team

| Contributor | GitHub | Role |
|---|---|---|
| AJ | [@AJ1732](https://github.com/AJ1732) | Tech Lead — Architecture, design system, CSS infrastructure, contributors page |
| Marion Braide | [@MarionBraide](https://github.com/MarionBraide) | Frontend — Navigation, What We Offer section, mobile nav JS |
| Florence | [@Florence-code-hub](https://github.com/Florence-code-hub) | Frontend — About section, CTA section HTML |
| Okwuosa Oluchi | [@luchiiii](https://github.com/luchiiii) | Frontend — Mission section HTML, image assets |
| Victor Okoukoni | [@Okoukoni-Victor](https://github.com/Okoukoni-Victor) | Frontend — Value Proposition section (HTML + CSS) |
| Esther Orieji | [@first-afk](https://github.com/first-afk) | Frontend — Hero section (HTML + CSS) |
| Akinwunmi Fatihat | [@Pheonixai](https://github.com/Pheonixai) | Frontend — Footer HTML |

---

## What We Built

This sprint delivered the complete **Ekehi landing page** and **contributors page** — going from zero to a fully structured, styled, and responsive frontend in a single collaborative sprint (2–7 March 2026).

### Pages

| Page | File | Description |
|---|---|---|
| Landing page | `client/pages/index.html` | Hero, About, Value Proposition, Mission, What We Offer, CTA, Footer |
| Contributors page | `client/pages/contributors.html` | Team grid rendered by JavaScript, intro and outro sections |

---

## Sprint Work Log

Issues and PRs are listed in the order they were completed.

---

### Phase 1 — Foundation

#### #1 · #2 — Initialize Monorepo Architecture
**Issue:** [chore: Initialize monorepo architecture](https://github.com/Tabi-Project/Ekehi/issues/1)
**PR:** [chore: initialize monolith architecture](https://github.com/Tabi-Project/Ekehi/pull/2) — merged **5 Mar 2026**
**Author:** @AJ1732

Established the bare-bones project structure before any application code was written.

- Scaffolded `client/` with `pages/`, `css/` (base, components, pages), `js/`, and `assets/` directories
- Scaffolded `server/src/` following MVC separation (routes, controllers, models, middleware, services, utils)
- Added `server/package.json` with core dependencies (Express, Supabase, Helmet, CORS, Morgan, Nodemon)
- Added `server/.env.example` documenting all required environment variable keys
- Wrote `CONTRIBUTING.md` covering frontend and backend workflows, branching strategy, commit format, and ClickUp integration
- Added GitHub issue templates (Bug Report, Feature Request, Task) and a PR template
- Added `.gitignore` covering `.env` and `node_modules`

---

#### #16 · #26 — Design System (CSS tokens + utilities)
**Issue:** [CSS - Implement design system as CSS variables and utility classes](https://github.com/Tabi-Project/Ekehi/issues/16)
**PR:** [CSS - Implement design system as CSS variables and utility classes](https://github.com/Tabi-Project/Ekehi/pull/26) — merged **6 Mar 2026**
**Author:** @AJ1732

Converted the Figma design system into a CSS-native token and utility class system — the single source of truth for all visual decisions.

- `tokens.css` — all CSS custom properties under `:root`: purple and neutral color primitives, semantic aliases, typography (fonts, scale, weights, line heights, letter spacing), spacing scale, border radius, shadows
- `reset.css` — modern CSS reset (box-sizing, margin/padding normalisation, image defaults)
- `typography.css` — base prose styles for `body`, `h1`–`h6`, `p`, `a`, `strong`, `small` using tokens exclusively
- `utilities.css` — composable utility classes for flex, gap, text size/weight/alignment/color, padding, margin, border radius
- `main.css` — entry point importing the base layer and utilities in cascade order
- Google Fonts link added to `index.html` (DM Serif Text + Urbanist, full weight set, with preconnect hints)

---

#### · #31 — CSS Component and Page Structure
**PR:** [CSS - component and page styles](https://github.com/Tabi-Project/Ekehi/pull/31) — merged **6 Mar 2026**
**Author:** @AJ1732

Established the CSS file architecture so developers working on separate sections could never touch the same file.

- `button.css` — reusable BEM button component with local `--btn-*` CSS custom properties for all states; modifiers: `--primary`, `--secondary`, `--outline`, `--ghost`, `--sm`, `--lg`, `--full`; `:focus-visible` accessibility ring; `:disabled` / `--loading` shared state
- `pages/landing.css` — entry point importing each section CSS file in document order
- Section stubs created: `nav.css`, `hero.css`, `about.css`, `value-proposition.css`, `mission.css`, `what-we-offer.css`, `cta.css`, `footer.css`

---

### Phase 2 — HTML Structure

All HTML structure issues were worked on simultaneously by the team on **6 Mar 2026**.

#### #3 · #17 — Navigation HTML
**Issue:** [HTML - Build Navigation Section](https://github.com/Tabi-Project/Ekehi/issues/3)
**PR:** [add semantic navigation component and logo](https://github.com/Tabi-Project/Ekehi/pull/17) — merged **6 Mar 2026**
**Author:** @MarionBraide

- Semantic `<nav>` inside `<header>` with logo, primary links, and Sign up / Log in CTAs
- Hamburger toggle button with `aria-expanded`, `aria-controls`, and `aria-label` for accessibility
- BEM structure: `.nav`, `.nav__inner`, `.nav__logo`, `.nav__links`, `.nav__cta`, `.nav__toggle`

---

#### #4 · #34 — Hero Section HTML
**Issue:** [HTML - Build Hero Section](https://github.com/Tabi-Project/Ekehi/issues/4)
**PR:** [Add hero section to html structure](https://github.com/Tabi-Project/Ekehi/pull/34) — merged **6 Mar 2026**
**Author:** @first-afk

- Hero headline, supporting description, two CTA buttons (Join the network, Learn more)
- `<figure>` placeholder for hero visual display
- BEM structure: `.hero-text`, `.hero-display`, `.hero-btn`

---

#### #6 · #15 — About Section HTML
**Issue:** [HTML - Build About Section](https://github.com/Tabi-Project/Ekehi/issues/6)
**PR:** [Add about section html](https://github.com/Tabi-Project/Ekehi/pull/15) — merged **6 Mar 2026**
**Author:** @Florence-code-hub

- Two-column layout: "About *Ekehi*" heading left, description + Learn more CTA right
- Deep purple background section
- Mixed serif/sans heading — "About" in sans, "Ekehi" italic serif

---

#### #7 · #24 — Value Proposition Section HTML
**Issue:** [HTML - Build Landing Page Value Proposition Section](https://github.com/Tabi-Project/Ekehi/issues/7)
**PR:** [Build value proposition section on landing page](https://github.com/Tabi-Project/Ekehi/pull/24) — merged **6 Mar 2026**
**Author:** @Okoukoni-Victor

- Two-column top layout (heading + supporting description)
- Large visual/collage placeholder block
- Two caption columns below the visual
- BEM structure: `.value-proposition__header`, `.value-proposition__visual`, `.value-proposition__captions`

---

#### #8 · #20 — Mission Section HTML
**Issue:** [HTML - Build Landing Page Mission Section](https://github.com/Tabi-Project/Ekehi/issues/8)
**PR:** [Add mission section html](https://github.com/Tabi-Project/Ekehi/pull/20) — merged **6 Mar 2026**
**Author:** @luchiiii

- Centred eyebrow with decorative SVG brand marks flanking "Mission" label
- Large centred headline
- BEM structure: `.mission-eyebrow`, `.mission`

**Follow-up fix — #35:** Added the `<img>` tags and corresponding SVG decoration assets to the mission eyebrow (`top-left deco.svg`, `bottom-left deco.svg`, `top-right deco.svg`, `bottom-right deco.svg`).

---

#### #9 · #23 — What We Offer Section HTML
**Issue:** [HTML - Build Landing Page What We Offer Section](https://github.com/Tabi-Project/Ekehi/issues/9)
**PR:** [Build What We Offer Section](https://github.com/Tabi-Project/Ekehi/pull/23) — merged **6 Mar 2026**
**Author:** @MarionBraide

- Section heading and subtitle
- Two-column layout: visual placeholder left, four offering items right
- Four offerings: Funding Database (active), Training Programmes, Business Tools, Mentorship Network
- BEM structure: `.offerings`, `.offerings__visual`, `.offerings__list`, `.offerings__item`, `.offerings__card`

---

#### #13 · #32 — CTA Section HTML
**Issue:** [HTML - Build Landing Page CTA Section](https://github.com/Tabi-Project/Ekehi/issues/13)
**PR:** [Add CTA section](https://github.com/Tabi-Project/Ekehi/pull/32) — merged **6 Mar 2026**
**Author:** @Florence-code-hub

- "Stop searching. Start finding" headline, supporting copy, Join the network CTA
- Decorative image block on the right (women entrepreneurs)
- Light lavender background
- BEM structure: `.cta__inner`, `.cta__content`, `.cta__heading`, `.cta__body`, `.cta__visual`

---

#### #14 · #19 — Footer HTML
**Issue:** [HTML - Build Landing Page Footer](https://github.com/Tabi-Project/Ekehi/issues/14)
**PR:** [Build landing page footer](https://github.com/Tabi-Project/Ekehi/pull/19) — merged **6 Mar 2026**
**Author:** @Pheonixai

- Brand block: Ekehi logo, wordmark, and tagline
- Three navigation groups: Explore, For Partners, About
- Bottom bar: copyright notice, open-source statement, legal links (Privacy, Terms, Policy, Accessibility)
- BEM structure: `.footer__main`, `.footer__brand`, `.footer__nav`, `.footer__nav-group`, `.footer__bottom`

---

### Phase 3 — CSS Styling

#### #18 · #36 — Navigation CSS
**Issue:** [CSS - Style landing page navigation](https://github.com/Tabi-Project/Ekehi/issues/18)
**PR:** [Implement styling for navigation](https://github.com/Tabi-Project/Ekehi/pull/36) — merged **6 Mar 2026**
**Author:** @MarionBraide

- Fixed top navigation bar with border-bottom and `z-index: 100`
- Logo + wordmark (italic serif, brand purple)
- Nav link hover and active states using brand color tokens
- Sign up button: filled pill (`--color-purple-600`, white text)
- Log in button: transparent with border (`--color-purple-300`)
- Hamburger toggle: three bars animating to × on open via CSS transforms
- Mobile breakpoint (`≤768px`): hamburger visible, links dropdown from nav, `.nav__links--open` open state, CTA buttons appear in mobile dropdown

---

#### #21 · #40 — Hero Section CSS
**Issue:** [CSS - Style landing page hero section](https://github.com/Tabi-Project/Ekehi/issues/21)
**PR:** [CSS - style landing page hero section](https://github.com/Tabi-Project/Ekehi/pull/40) — merged **7 Mar 2026**
**Author:** @first-afk

- Centred hero layout with `flex-direction: column`
- Large `var(--text-5xl)` headline, `text-transform: capitalize`
- Hero display `<figure>`: wide aspect ratio (19:10), `--color-primary-subtle` background, `--radius-3xl`, overflow hidden
- Responsive: headline scales to `--text-3xl` on mobile

---

#### #22 · #37 — About Section CSS
**Issue:** [CSS - Style landing page about section](https://github.com/Tabi-Project/Ekehi/issues/22)
**PR:** [Styled About section in landing Page](https://github.com/Tabi-Project/Ekehi/pull/37) — merged **7 Mar 2026**
**Author:** @Florence-code-hub

- Deep purple section background (`--color-purple-900`)
- Two-column Flexbox layout: title left, description right
- Mixed serif/sans heading: "About" in `--font-sans`, "Ekehi" in italic `--font-serif`
- Inverse text colours for readability on dark background
- Learn more button: white pill style
- Responsive: single column on mobile

---

#### #25 · #42 — Value Proposition CSS
**Issue:** [CSS - Style landing page value proposition section](https://github.com/Tabi-Project/Ekehi/issues/25)
**PR:** [Style value proposition section on landing page](https://github.com/Tabi-Project/Ekehi/pull/42) — merged **7 Mar 2026**
**Author:** @Okoukoni-Victor

- Two-column header layout (heading + description)
- Full-width visual block with rounded corners (`--radius-xl`), overflow hidden
- Caption section below visual
- Responsive: stacks vertically on mobile, visual scales to `min-height: 16rem`

---

#### #28 · #39 — What We Offer Section CSS
**Issue:** [CSS - Style landing page what we offer section](https://github.com/Tabi-Project/Ekehi/issues/28)
**PR:** [Implement styling for what we offer section](https://github.com/Tabi-Project/Ekehi/pull/39) — merged **7 Mar 2026**
**Author:** @MarionBraide

- Two-column grid layout: visual placeholder left (square, `--radius-3xl`), offerings list right
- Offering item default state: bold title, muted description, border-bottom divider
- Active state: lavender tinted background (`--color-primary-subtle`)
- Hover state on non-active items
- JS-driven active state toggle — clicking any offering item activates it
- Responsive: stacks to single column on `≤900px`, visual shifts aspect ratio

---

### Phase 4 — JavaScript Behaviour

#### #38 · #43 — Mobile Navigation Toggle JS
**Issue:** [JS - Implement mobile navigation toggle](https://github.com/Tabi-Project/Ekehi/issues/38)
**PR:** [Implement Javascript for mobile nav toggle](https://github.com/Tabi-Project/Ekehi/pull/43) — merged **7 Mar 2026**
**Author:** @MarionBraide

Plain JavaScript module — no libraries or frameworks.

- Toggle button click: adds `.nav__links--open` to menu, updates `aria-expanded` and `aria-label`
- Hamburger → × animation via `aria-expanded="true"` CSS selector
- Outside click: closes menu if click is outside `.nav__inner`
- Window resize: closes menu if viewport width exceeds `MOBILE_BREAKPOINT = 768`
- Nav link click: closes menu on any `.nav__link` click for smooth in-page navigation
- Null-safe — no errors if toggle or menu elements are absent

---

### Phase 5 — Contributors Page

#### #33 · #44 — Build Contributors Page (HTML + JS + CSS)
**Issue:** [HTML - Build Contributors Page](https://github.com/Tabi-Project/Ekehi/issues/33)
**PR:** [Build contributors page](https://github.com/Tabi-Project/Ekehi/pull/44) — merged **7 Mar 2026**
**Author:** @AJ1732

Full page implementation — HTML structure, JavaScript renderer, and CSS styles.

**New files:**
- `client/pages/contributors.html` — nav (Contributors marked `aria-current="page"`), intro section, empty grid container, outro section, footer
- `client/js/pages/contributors.js` — `contributors` data array (name, role, image, imageStyle), `renderContributors(data, containerId)` using `DocumentFragment` + `createElement` (XSS-safe), called on `DOMContentLoaded`
- `client/css/pages/contributors.css` — contributors page layout, card grid, card styles
- `client/assets/card-backgrounds/` — 5 SVG card background variants (blue, pink, purple, green, yellow)
- `client/assets/images/contributors/` — contributor photo assets

**Key implementation details:**
- Card backgrounds: 5 SVG variants assigned via `data-variant` cycling by index — prevents same-colour runs
- Adding a contributor requires only a new entry in the data array; no HTML or render function changes needed
- Per-contributor `imageStyle` applied via `Object.assign(img.style, imageStyle)` for flexible photo positioning
- Grayscale treatment on contributor photos via `filter: grayscale(1)` in CSS

**Modified files:**
- `index.html` — BEM classes added to CTA section and footer
- `cta.css` — full CTA section styles (2-col grid, serif heading, responsive)
- `footer.css` — full footer styles (dark purple bg, brand + 3-col nav, bottom bar)
- `main.css` — `@import` added for contributors page CSS

---

## Open Issues

| # | Title | Status |
|---|---|---|
| [#27](https://github.com/Tabi-Project/Ekehi/issues/27) | CSS - Style landing page mission section | Open — PR #41 in review |
| [#29](https://github.com/Tabi-Project/Ekehi/issues/29) | CSS - Style landing page CTA section | Open |
| [#41](https://github.com/Tabi-Project/Ekehi/pull/41) | feat: add mission section styling | Open PR |

---

## Architecture Overview

```
Ekehi/
├── client/
│   ├── pages/
│   │   ├── index.html          # Landing page
│   │   └── contributors.html   # Contributors page
│   ├── css/
│   │   ├── main.css            # Entry point — imports all layers
│   │   ├── base/
│   │   │   ├── tokens.css      # All CSS custom properties (:root)
│   │   │   ├── reset.css       # Modern CSS reset
│   │   │   ├── typography.css  # Base prose styles
│   │   │   └── utilities.css   # Composable utility classes
│   │   ├── components/
│   │   │   └── button.css      # Reusable BEM button component
│   │   └── pages/
│   │       ├── landing.css     # Imports all landing section files
│   │       ├── contributors.css
│   │       └── landing/        # One file per section (BEM-scoped)
│   │           ├── nav.css
│   │           ├── hero.css
│   │           ├── about.css
│   │           ├── value-proposition.css
│   │           ├── mission.css
│   │           ├── what-we-offer.css
│   │           ├── cta.css
│   │           └── footer.css
│   ├── js/
│   │   └── pages/
│   │       ├── toggle.js         # Mobile nav toggle
│   │       └── contributors.js   # Contributors page renderer
│   └── assets/
│       ├── icons/              # Logo and brand icons
│       ├── images/             # Page images and contributor photos
│       └── card-backgrounds/   # SVG card background variants
└── server/
    └── src/                    # Express MVC structure (future backend)
```

### Key Decisions

**CSS architecture — one file per section.** Each BEM block lives in its own scoped CSS file. Developers working on separate sections never touch the same file, avoiding merge conflicts.

**Token-first styling.** No hardcoded colour values, font strings, or spacing values anywhere in the codebase. All visual decisions reference `tokens.css`, making design changes a single-source update.

**JS rendering for contributor cards.** The contributors grid is rendered by JavaScript from a data array rather than hardcoded HTML. Adding a new contributor requires only a new data entry — no HTML changes.

**BEM throughout.** All HTML elements use BEM class names (`block__element--modifier`). This keeps specificity flat, avoids cascade conflicts, and makes component boundaries explicit.

---

## Branching Strategy

```
main
└── development          ← base branch for all feature work
    ├── feature/*        ← new features (HTML structure, CSS sections, JS behaviour)
    ├── style/*          ← design system and component styling
    ├── fix/*            ← bug fixes
    └── chore/*          ← setup, tooling, documentation
```

All PRs target `development`. `development` is merged into `main` for releases.

---

## Commit Convention

```
type: short imperative description

Types: feat | fix | style | chore | docs | refactor | test
```

Examples:
```
feat: build and style the contributors page
fix: update html file to include img tag and corresponding images
style: create button styling
chore: initialize monolith architecture
```
