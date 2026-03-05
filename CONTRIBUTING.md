# Contributing to Ekehi

Thank you for contributing to **Ekehi** — a business intelligence platform supporting women entrepreneurs across Africa.

This guide covers everything you need to start contributing, whether you are working on the **frontend** (HTML, CSS, JS) or the **backend** (Node.js, Express, Supabase).

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Before You Start](#before-you-start)
3. [Task & Issue Workflow](#task--issue-workflow)
4. [Branching Strategy](#branching-strategy)
5. [Development Setup](#development-setup)
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
├── client/                     # Frontend — HTML, CSS, Vanilla JS
│   └── public/
│       ├── assets/             # Static assets
│       │   ├── fonts/
│       │   ├── icons/
│       │   └── images/
│       ├── css/
│       │   ├── base/           # Reset, variables, typography
│       │   ├── components/     # Reusable UI component styles
│       │   └── pages/          # Page-specific styles
│       ├── js/
│       │   ├── api/            # Fetch wrappers for backend endpoints
│       │   ├── components/     # Reusable UI logic (modals, filters, etc.)
│       │   ├── pages/          # Page-specific JS entry points
│       │   └── utils/          # Shared helper functions
│       └── pages/              # HTML page files
│
├── server/                     # Backend — Node.js, Express, Supabase
│   ├── src/
│   │   ├── config/             # Environment & Supabase client setup
│   │   ├── controllers/        # Route handler logic
│   │   ├── middleware/         # Auth, error handling, rate limiting
│   │   ├── models/             # Supabase query helpers per entity
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # Business logic (email, etc.)
│   │   └── utils/              # Shared server utilities
│   ├── .env.example            # Environment variable template
│   └── package.json
│
├── .github/
│   ├── ISSUE_TEMPLATE/         # Bug, feature, task issue templates
│   └── pull_request_template.md
│
├── docs/
│   ├── api/                    # API endpoint documentation
│   └── setup/                  # Local setup guides
│
├── CONTRIBUTING.md
├── README.md
└── LICENSE
```

---

## Before You Start

1. Read the [README](./README.md) to understand the product vision and tech stack.
2. Make sure you have been assigned a task on **ClickUp** or a **GitHub Issue** before writing any code.
3. Never start work without a linked issue or task — this prevents duplicated effort.

---

## Task & Issue Workflow

All work on Ekehi is driven by tasks. We use **ClickUp** for internal task management and **GitHub Issues** for open tracking.

### If you are an internal contributor (with ClickUp access):

1. Find your assigned task in ClickUp.
2. Move the task to **In Progress** when you begin.
3. Open a **GitHub Issue** linked to your ClickUp task (use the appropriate issue template).
4. Create your branch from `development` using the naming convention below.
5. When your PR is merged, move the ClickUp task to **Done**.

### If you are an external contributor:

1. Check existing [GitHub Issues](https://github.com/Tabi-Project/Ekehi/issues) for open tasks.
2. Comment on the issue to express interest before starting work.
3. Wait for a maintainer to assign the issue to you.
4. Then follow the workflow below.

> **Do not open a PR for work that has no associated issue.**

---

## Branching Strategy

```
main                        ← Production / stable
│
development                 ← Integration branch (all PRs target this)
│
├── feature/<feature-name>  ← New feature
├── fix/<bug-name>          ← Bug fix
├── docs/<topic>            ← Documentation change
└── chore/<task>            ← Maintenance (deps, config, tooling)
```

### Rules

- **Never commit directly to `main` or `development`.**
- All branches must be created from `development`.
- All PRs must target `development`, not `main`.
- `main` is only updated via a release merge from `development` by a maintainer.

---

## Development Setup

### Prerequisites

- Git
- Node.js >= 18
- A code editor (VS Code recommended)

### 1. Fork and Clone

```bash
# Fork via GitHub UI, then:
git clone https://github.com/YOUR_USERNAME/Ekehi.git
cd Ekehi
git remote add upstream https://github.com/Tabi-Project/Ekehi.git
```

### 2. Stay in Sync

Before creating a branch, always pull the latest `development`:

```bash
git checkout development
git pull upstream development
```

---

### Frontend Setup

The frontend is plain HTML, CSS, and JavaScript — no build step required.

```bash
# Navigate to the client
cd client/public
```

Open `pages/index.html` in your browser, or use the **Live Server** VS Code extension for hot reload.

**Frontend contributors work inside `client/public/` only.**

| Folder | Your responsibility |
|---|---|
| `pages/` | HTML pages |
| `css/components/` | Component-level styles |
| `css/pages/` | Page-specific styles |
| `js/api/` | Fetch calls to backend endpoints |
| `js/components/` | UI interaction logic |
| `js/pages/` | Page entry point scripts |

---

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values in .env (ask a maintainer for dev credentials)

# Start development server
npm run dev
```

The server runs on `http://localhost:3000` by default.

**Backend contributors work inside `server/src/` only.**

| Folder | Your responsibility |
|---|---|
| `routes/` | Define Express routes |
| `controllers/` | Handle request/response logic |
| `models/` | Supabase queries per entity |
| `services/` | Business logic (e.g. email sending) |
| `middleware/` | Auth, error handling |

> Never commit `.env`. It is in `.gitignore`. Use `.env.example` for sharing variable names.

---

## Development Workflow

### 1. Create your branch

```bash
git checkout development
git pull upstream development
git checkout -b feature/your-feature-name
```

### 2. Make your changes

- Keep changes focused on the task at hand.
- Do not refactor unrelated code in the same PR.

### 3. Commit your work

Follow the [commit message format](#commit-message-format).

```bash
git add .
git commit -m "feat: add filter by sector on opportunities page"
```

### 4. Push and open a PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub targeting `development`. Use the PR template provided.

---

## Code Conventions

### Frontend Conventions

- Use **semantic HTML** — prefer `<nav>`, `<section>`, `<article>`, `<main>` over generic `<div>`.
- CSS class naming follows **BEM** (Block Element Modifier): `.card__title`, `.filter--active`.
- One CSS file per page goes in `css/pages/`. Shared component styles go in `css/components/`.
- JavaScript files are **ES Modules** (`type="module"` in HTML).
- Keep JS functions small and single-purpose.
- No jQuery or external UI libraries unless approved by the team.
- Responsive design is required — mobile-first approach.

### Backend Conventions

- Follow **MVC separation**: routes → controllers → models.
- Controllers handle HTTP concerns only (req, res). Business logic belongs in services or models.
- All Supabase queries go in `models/`, not in controllers.
- Use `async/await` — no raw `.then()` chains.
- All errors must be passed to the Express error handler via `next(error)`.
- Validate all incoming request data before processing.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or any secret in responses or logs.

---

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>: <short description>
```

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no behavior change |
| `chore` | Tooling, dependencies, config |
| `test` | Adding or updating tests |

**Examples:**

```bash
feat: add opportunity search filter by sector
fix: resolve CORS error on /api/opportunities
docs: add backend setup guide
chore: update express to v4.19
```

- Use the imperative mood: "add", not "added" or "adds".
- Keep the subject under 72 characters.
- Reference the issue number where applicable: `feat: add sector filter (#12)`

---

## Pull Request Guidelines

Your PR must include:

- **Clear title** following the commit format: `feat: add sector filter`
- **Description** of what was done and why
- **Screenshots** for any UI changes
- **Linked issue**: use `Closes #<issue-number>` in the PR body
- **ClickUp task link** (if applicable)

PRs that do not follow the template or lack a linked issue will be held for revision.

### PR Checklist

Before requesting review, confirm:

- [ ] Branch is up to date with `development`
- [ ] Code follows the conventions in this guide
- [ ] No `.env` files or secrets are committed
- [ ] UI changes are tested on mobile and desktop
- [ ] Backend changes have been tested locally with Postman or curl
- [ ] PR is linked to a GitHub issue or ClickUp task

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/Tabi-Project/Ekehi/issues/new/choose) using the **Bug Report** template. Include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behaviour
- Screenshots or screen recordings if applicable
- Browser / Node version

---

## Community Guidelines

- Be respectful and constructive in all reviews and discussions.
- Ask questions early — don't wait until your PR is done to flag blockers.
- Review others' PRs when you can; it helps the team move faster.
- This is an inclusive project — discrimination of any kind will not be tolerated.
