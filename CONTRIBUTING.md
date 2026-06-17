# Contributing to Ekehi

Thank you for contributing to **Ekehi** — a business intelligence platform supporting women entrepreneurs across Africa.

This guide covers everything you need to start contributing, whether you are working on the **frontend** (React + Vite + TanStack Router) or the **backend** (Node.js + Express + Supabase).

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Before You Start](#before-you-start)
3. [Task & Issue Workflow](#task--issue-workflow)
4. [Branching Strategy](#branching-strategy)
5. [Development Setup](#development-setup)
   - [Prerequisites](#prerequisites)
   - [Clone & Install](#clone--install)
   - [Frontend Setup](#frontend-setup)
   - [Backend Setup](#backend-setup)
6. [Development Workflow](#development-workflow)
7. [Code Conventions](#code-conventions)
   - [Frontend Conventions](#frontend-conventions)
   - [Backend Conventions](#backend-conventions)
8. [Commit Message Format](#commit-message-format)
9. [Pull Request Guidelines](#pull-request-guidelines)
10. [Reporting Bugs](#reporting-bugs)
11. [Community Guidelines](#community-guidelines)

---

## Project Structure

```
Ekehi/
├── client/                  # React 19 + Vite + TanStack Router app
│   ├── src/
│   │   ├── routes/          # TanStack Router file-based routes
│   │   ├── routeTree.gen.ts # generated — do not edit
│   │   ├── main.tsx
│   │   ├── router.tsx
│   │   └── styles.css
│   ├── docs/                # client-specific docs (e.g. tooling-plan.md)
│   ├── public/
│   ├── eslint.config.js
│   ├── prettier.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── server/                  # Express API (Node.js)
│   ├── src/
│   │   ├── config/          # env + Supabase client
│   │   ├── controllers/     # HTTP request/response logic
│   │   ├── middleware/      # auth, error handling, rate limiting
│   │   ├── models/          # shared JS constants / enums
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # business logic — Supabase queries
│   │   └── utils/
│   ├── docs/                # API reference + design notes
│   │   ├── api/endpoints.md
│   │   ├── archive/
│   │   ├── db-refactor.md
│   │   ├── profile-image-storage-design.md
│   │   └── system-design-case-study.md
│   ├── .env.example
│   └── package.json
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
│
├── .husky/                  # commit-msg + pre-commit hooks
├── package.json             # root: husky + commitlint + lint-staged only
├── commitlint.config.cjs
├── .lintstagedrc.mjs
├── CONTRIBUTING.md
├── README.md
└── LICENSE
```

`client/` and `server/` are independent packages with their own dependencies. Treat them as separate apps that share a repo.

> The client is on **pnpm**. The server is currently on **npm** and will be modernized when it moves to TypeScript.

---

## Before You Start

1. Read the [README](./README.md) for product vision and tech stack.
2. Make sure you have a **GitHub Issue** assigned to you before writing code.
3. Never start work without a linked issue — this prevents duplicated effort.

---

## Task & Issue Workflow

All work on Ekehi is tracked via **GitHub Issues**.

1. Check existing [GitHub Issues](https://github.com/Tabi-Project/Ekehi/issues) for open tasks.
2. Comment on the issue to express interest before starting work.
3. Wait for a maintainer to assign the issue to you.
4. Create your branch from `development` (see below) and open a PR back into `development` when ready.

> **Do not open a PR for work that has no associated issue.**

---

## Branching Strategy

```
main                        ← Production / stable (release-only)
│
development                 ← Integration branch — all PRs target this
│
├── feat/<feature-name>     ← New feature
├── fix/<bug-name>          ← Bug fix
├── docs/<topic>            ← Documentation change
├── chore/<task>            ← Maintenance (deps, config, tooling)
└── refactor/<topic>        ← Internal refactor, no behavior change
```

### Rules

- **Never commit directly to `main` or `development`.**
- All branches are created from `development`.
- All PRs target `development`. `main` updates only via release merge.

---

## Development Setup

### Prerequisites

- Git
- Node.js >= 18
- pnpm (`npm i -g pnpm`) — for the root and client
- A code editor (VS Code recommended)

### Clone & Install

```bash
# Fork via GitHub UI, then:
git clone https://github.com/YOUR_USERNAME/Ekehi.git
cd Ekehi
git remote add upstream https://github.com/Tabi-Project/Ekehi.git

# Sync with development
git checkout development
git pull upstream development

# Install root tooling (husky + commitlint + lint-staged)
pnpm install

# Install client deps (pnpm)
cd client && pnpm install

# Install server deps (npm)
cd ../server && npm install
```

After install, husky hooks (`commit-msg`, `pre-commit`) are active for every commit on every branch.

### Frontend Setup

```bash
cd client
pnpm dev          # http://localhost:3000
```

**Frontend contributors work inside `client/src/` only.**

| Folder | Your responsibility |
|---|---|
| `src/routes/` | TanStack Router file-based routes |
| `src/main.tsx`, `src/router.tsx` | Entry + router bootstrap |
| `src/styles.css` | Global styles, Tailwind layer |
| `public/` | Static assets shipped as-is |

Generated file: `src/routeTree.gen.ts` — never edit by hand. Run `pnpm generate-routes` after changing routes.

### Backend Setup

```bash
cd server

# Install
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values (ask a maintainer for dev credentials)

# Start dev server
npm run dev
```

The server runs on `http://localhost:<port>` per your `.env`.

**Backend contributors work inside `server/src/` only.**

| Folder | Your responsibility |
|---|---|
| `routes/` | Express route definitions |
| `controllers/` | Request/response handling (HTTP only) |
| `services/` | Business logic — Supabase queries, filtering, pagination |
| `models/` | Shared JS constants / enum arrays |
| `middleware/` | Auth (`requireAuth`), error handling, rate limiting |

> Never commit `.env`. It is in `.gitignore`. Use `.env.example` for sharing variable names.

---

## Development Workflow

### 1. Create your branch

```bash
git checkout development
git pull upstream development
git checkout -b feat/your-feature-name
```

### 2. Make your changes

- Keep changes focused on the task at hand.
- Do not refactor unrelated code in the same PR.

### 3. Verify before commit

If you touched `client/`:

```bash
cd client
pnpm check        # lint + typecheck + format check
pnpm fix          # auto-fix lint + format if check fails
```

If you touched `server/`, run the server locally and exercise the changed routes (Postman or curl).

### 4. Commit your work

Follow the [commit message format](#commit-message-format). The `commit-msg` hook will block messages that don't match — this applies to **every** commit, client or server.

```bash
git add .
git commit -m "feat: add filter by sector on opportunities page"
```

The `pre-commit` hook runs `lint-staged` on changed files in `client/` (server files are not auto-linted yet). If it fails, fix and re-stage.

### 5. Push and open a PR

```bash
git push origin feat/your-feature-name
```

Open a PR on GitHub targeting `development`. Use the template provided.

---

## Code Conventions

### Frontend Conventions

- **TypeScript everywhere.** Use `.ts`/`.tsx`. No untyped JS in `src/`.
- **Functional components only.** Use hooks for state and effects.
- **Tailwind for styling.** Compose utility classes; avoid one-off CSS files unless necessary.
- **TanStack Router.** Route components live under `src/routes/`. After adding/renaming a route, run `pnpm generate-routes`.
- **Imports.** `simple-import-sort` enforces order — let `pnpm fix` sort them. Internal imports use `@/` (e.g. `@/components/Button`).
- **No unused vars.** Prefix intentionally-unused params with `_`.
- **Accessibility.** Prefer semantic HTML (`<nav>`, `<main>`, `<button>`). Provide alt text and ARIA where needed.
- **Data-fetching features.** For features that talk to the API (endpoints, services, query hooks), follow the pattern in [`client/CONTRIBUTING.md`](./client/CONTRIBUTING.md). The `auth` feature is the canonical reference.

### Backend Conventions

- Follow the layered pattern: **routes → controllers → services**.
- Controllers handle HTTP concerns only (req, res, next). All business logic and Supabase queries go in `services/`.
- `models/` contains only shared JS constants (enum arrays). It does not hold DB query logic.
- Use `async/await` — no raw `.then()` chains.
- All errors must be passed to the Express error handler via `next(error)`.
- Validate all incoming request data before processing.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or any secret in responses or logs.

---

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/). The `commit-msg` hook (commitlint) **enforces this — bad messages are rejected before the commit lands.** This applies to every commit, regardless of whether you touched `client/`, `server/`, or repo-root tooling.

```
<type>(<scope>): <short description>
```

`<scope>` is optional but recommended (e.g. `auth`, `opportunities`, `routing`).

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no behavior change |
| `chore` | Tooling, dependencies, config |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |

**Examples:**

```bash
feat(opportunities): add sector filter
fix(auth): handle expired token on refresh
docs: update backend setup
chore: bump tanstack/react-router
```

- Use the imperative mood: "add", not "added" or "adds".
- Keep the subject under 72 characters.
- Reference issues in the body: `Closes #12`.

---

## Pull Request Guidelines

Your PR must include:

- **Clear title** following the commit format: `feat(opportunities): add sector filter`
- **Description** of what was done and why
- **Screenshots** for any UI changes
- **Linked issue**: use `Closes #<issue-number>` in the PR body

PRs that lack a linked issue or fail the checklist below will be held for revision.

### PR Checklist

Before requesting review, confirm:

- [ ] Branch is up to date with `development`
- [ ] `pnpm check` passes locally if you touched `client/`
- [ ] Commit messages follow Conventional Commits
- [ ] No `.env` files or secrets committed
- [ ] UI changes tested on mobile and desktop
- [ ] Backend changes tested locally with Postman or curl (see [`server/docs/api/endpoints.md`](./server/docs/api/endpoints.md))
- [ ] PR is linked to a GitHub issue

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/Tabi-Project/Ekehi/issues/new/choose) using the **Bug Report** template. Include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behaviour
- Screenshots or screen recordings if applicable
- Browser / Node version, OS
- Package: `client/`, `server/`, or tooling
- Commit SHA or branch

---

## Community Guidelines

- Be respectful and constructive in all reviews and discussions.
- Ask questions early — don't wait until your PR is done to flag blockers.
- Review others' PRs when you can; it helps the team move faster.
- This is an inclusive project — discrimination of any kind will not be tolerated.
