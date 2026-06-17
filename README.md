# Ekehi – Women’s SME & Business Resource Centre

**Ekehi** is a business intelligence platform designed to support **women entrepreneurs and women-led SMEs across Nigeria and Africa**.  

The platform aggregates funding opportunities, financial products, training programs, and business resources into a **searchable, filterable resource hub**.

This project was created as part of the **Tabî Project by TEE Foundation** for **International Women's Day 2026**.


# Product Vision

Ekehi aims to reduce the barriers women entrepreneurs face in accessing capital and business networks by providing:

- A centralized directory of funding opportunities
- Access to credit products and financial services
- Listings for training programs and accelerators
- A curated library of practical business resources

All resources are **searchable and filterable by sector, business stage, region, and funding size**.


# Problem Statement

Women-owned businesses in Africa often experience a **“triple penalty”**:

1. Limited access to capital  
2. Fewer connections to formal business networks  
3. Low visibility in male-dominated investment ecosystems  

Even when opportunities exist (grants, venture funding, government programs), many women **do not know about them or struggle to navigate the process**.

Ekehi addresses this by creating a **structured, accessible database of opportunities and support resources**.


## Target Users

| User Type | Description |
|---|---|
| Women Entrepreneurs | Individuals at ideation, early, or growth stage seeking funding or training |
| Women-led SMEs | Businesses seeking capital, loans, or capacity building |
| Business Development Officers | Professionals sourcing resources for entrepreneurs |
| NGOs & Government Agencies | Organizations supporting women-led enterprises |
| Investors & Funders | Institutions looking to list opportunities |


## Core Features

### 1. Funding Opportunity Database

A searchable directory of funding opportunities for women-led businesses.

### Opportunity Types

- Venture Capital
- Angel Investment
- Government Grants
- Foundation / NGO Grants
- Loans and Credit Facilities
- Microfinance
- Accelerator Funding
- Prize Money


### 2. Credit & Financial Products Directory

A directory of loan and financing options tailored to women-owned businesses.

Each listing includes:

- Financial institution
- Product name
- Loan amount range
- Interest rate
- Repayment terms
- Collateral requirements
- Eligibility
- Application instructions

### 3. Training & Capacity Building Directory

A searchable list of programs supporting women entrepreneurs.

Examples include:

- Bootcamps
- Accelerators
- Workshops
- Training programs

### 4. Sector Classification

All listings are categorized into sectors to enable accurate filtering.

Sectors include:

- Agriculture & Food Processing
- Fashion & Textiles
- Health & Wellness
- Technology & Digital Services
- Education & EdTech
- Financial Services & Fintech
- Retail & E-Commerce
- Manufacturing & Production
- Creative Industries
- Logistics & Distribution
- Beauty & Personal Care
- Tourism & Hospitality


### 5. Opportunity Submission System

Funders and program providers can submit opportunities to the platform.

### Workflow

1. Funder submits opportunity through a form
2. Admin reviews submission
3. Admin can:
   - Approve
   - Request changes
   - Reject
4. Submitter receives email notification

Future versions will allow funders to **manage their own listings**.

### 6. Business Resource Library

A curated library of practical tools for women entrepreneurs.

Initial resources include:

- CAC registration guide (Nigeria)
- Cash flow and budgeting templates
- Invoice templates
- Pitch deck templates
- Business plan templates
- SME tax guides
- Business credit score guide
- Export readiness checklist


## API Reference

See [`server/docs/api/endpoints.md`](./server/docs/api/endpoints.md) for the full endpoint reference, including request/response shapes, query params, and error codes.


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + Vite + TanStack Router |
| Styling | Tailwind CSS 4 |
| Frontend testing | Vitest + Testing Library |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Search | Supabase Full-Text Search |
| Authentication | Supabase Auth + JWT |
| File storage | Supabase Storage |
| Email | Resend or Mailgun |
| Admin CMS | Directus or custom admin panel |
| Tooling | ESLint 9, Prettier 3, Husky, lint-staged, commitlint |
| Package manager | pnpm (client + root), npm (server) |
| Hosting | Netlify (frontend), Render (backend) |


## Repo Layout

This repo holds two independent packages plus root-level tooling:

```
.
├── client/          # React 19 + Vite + TanStack Router app
│   ├── src/
│   └── docs/        # client-specific docs (e.g. tooling-plan.md)
├── server/          # Express API
│   ├── src/
│   └── docs/        # server-specific docs (API reference, design notes)
├── .husky/          # git hooks (commit-msg, pre-commit)
├── package.json     # root: husky + commitlint + lint-staged only
└── README.md
```

Each package has its own `package.json` and own dependency tree. Treat them as separate apps that happen to share a repo.


## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm (`npm i -g pnpm`)

### Install

```sh
# from repo root — installs husky hooks
pnpm install

# install client deps (pnpm)
cd client && pnpm install

# install server deps (npm — server is still on JS)
cd ../server && npm install
```

### Environment variables

The client validates env vars at build time and at app boot via [zod](https://zod.dev). Missing or malformed values throw immediately with a clear error.

```sh
cd client
cp .env.example .env.local
# edit .env.local with your local API + site URLs
```

The server reads its env from `server/.env`:

```sh
cd server
cp .env.example .env
# ask a maintainer for dev credentials
```

### Run locally

```sh
# in one terminal
cd client && pnpm dev          # http://localhost:3000

# in another
cd server && npm run dev       # http://localhost:<server-port>
```


## Contributing

### Commit messages

Conventional Commits is enforced by the `commit-msg` hook (commitlint). Format:

`<type>(<scope>): <subject>`

Examples: `feat(auth): add password reset`, `fix(opportunities): handle empty filter`, `chore: bump deps`.

### Pre-commit hook

`pre-commit` runs `lint-staged` over changed files in `client/`:

- `*.{ts,tsx,js,jsx,mjs,cjs}` → `eslint --fix` → `prettier --write`
- `*.{css,json,md,mdx,yml,yaml}` → `prettier --write`

If a check fails, the commit is blocked. Fix and re-stage.

### Quality scripts (client)

```sh
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
pnpm format:check   # prettier check
pnpm check          # all three above
pnpm fix            # auto-fix lint + format
```

Run `pnpm check` before pushing.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the deeper contributor guide.

