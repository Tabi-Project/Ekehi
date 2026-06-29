# Changelog

All notable changes to **Ekehi** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project loosely follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Submission page for the submissions flow 
- Opportunity details page '(#164)'
- Landing page with hero and CTA sections 
- Training details page backed by a data layer, fetching training data via TanStack useQuery 
- Template detail page with its data layer, , fetching training data via TanStack useQuery 
- Guide detail page, including tests for GuideDetailPage 
- Styling for loading and error states
- Base UI Component Library
- Updated **`CHANGELOG.md`** (this file).

### Changed
- Navbar theming on the submissions page
- Training data fetching moved to **TanStack useQuery** 
- Margin spacing and font styles refined, with domain services relocated
- Resources content formatting updated, with accompanying test updates 

### Deprecated
Nothing in this release

### Removed
- Stale 'fix/contributors-page' branch deleted (housekeeping)

### Fixed
- Navbar transparency and hero section content layout on the landing page 
- Content formatting in resources
- **CORS configuration** to allow Netlify deploy previews through 
- Outstanding check errors resolved

### Security
- Nothing in this release


## [2.0.0] — 2026-06-17

Frontend rewrite from vanilla HTML/CSS/JS to React 19 + Vite + TanStack Router, with full repo-level tooling (Husky, commitlint, lint-staged, ESLint 9, Prettier 3) and documentation overhaul.

### Added

- **React client** under `client/`: React 19, Vite 8, TanStack Router (file-based, code-split), Tailwind CSS 4, TypeScript 6.
- **Root tooling** (`package.json` at repo root): Husky 9, `@commitlint/cli` + `@commitlint/config-conventional`, `lint-staged`.
- **Git hooks** (`.husky/`):
  - `commit-msg` — enforces Conventional Commits on every commit (client, server, root).
  - `pre-commit` — runs `lint-staged` on staged client files (eslint --fix, prettier --write).
- **ESLint 9 flat config** in `client/eslint.config.js`: `@tanstack/eslint-config`, `eslint-plugin-simple-import-sort`, `eslint-plugin-unicorn`, `eslint-plugin-unused-imports`, `eslint-config-prettier`.
- **Prettier 3** with `prettier-plugin-tailwindcss` for deterministic class ordering.
- **Client script set**: `lint`, `lint:fix`, `typecheck`, `format`, `format:check`, `check`, `fix`, `generate-routes`.
- **Zod-validated env module** (`client/src/config/env.ts`, `client/src/config/env-schema.ts`):
  - Build-time validation in `vite.config.ts` via Vite's `loadEnv`.
  - Runtime validation at module load in the browser.
  - Shared schema + KISS error formatter (`formatEnvError`) telling the next dev exactly what to set.
- **`client/.env.example`** template documenting required `VITE_API_BASE_URL` and `VITE_SITE_URL`.
- **VS Code workspace TypeScript pinning** (`client/.vscode/settings.json` → `typescript.tsdk`).
- **Documentation reorganization**:
  - `client/docs/tooling-plan.md` — design notes for the new tooling layout.
  - `server/docs/api/endpoints.md` — backend API reference.
  - `server/docs/archive/backend-sprint.md` — historical sprint plan.
- **`CHANGELOG.md`** (this file).

### Changed

- **Branching strategy** documented in `CONTRIBUTING.md`: branch off `development`, PR back into `development`. `main` updates only via release merge.
- **`README.md`** updated end-to-end: new tech stack table, repo layout diagram, Getting Started with split client/server install instructions, environment-setup step, Contributing section linking commit conventions and quality scripts. Broken `docs/api/endpoints.md` link replaced with `server/docs/api/endpoints.md`.
- **`CONTRIBUTING.md`** rewritten for the React stack: pnpm install order, frontend conventions (TypeScript, Tailwind, TanStack Router, `simple-import-sort`), backend conventions (unchanged), updated commit format with `<scope>` syntax, PR checklist matching the new hooks and scripts.
- **GitHub issue templates** (`.github/ISSUE_TEMPLATE/`):
  - `bug_report.md`: replaced single Area checkbox with `Package` selector (`client/`, `server/`, tooling) and added a `Commit / branch` field.
  - `feature_request.md` and `task.md`: replaced Area with Package selector and added baseline acceptance items (`Tests added or updated`, `pnpm check passes`).
- **`.github/pull_request_template.md`**:
  - Checklist items: `pnpm check` passes, Conventional Commits compliance.
  - Removed vague "Code follows project conventions" line.
  - Removed ClickUp references.

### Removed

- **Vanilla JS client**: deleted `client/shared/`, `client/landing/`, `client/contributors/`, `client/login/`, `client/signup/`, `client/admin/`, root `client/index.html`, root `client/styles.css`, and associated assets/icons/fonts no longer used by the React app.
- **Stale component docs** under `docs/components/`: `button.md`, `dropdown.md`, `footer.md`, `form-field.md`, `input.md`, `modal.md`, `nav.md`, `search-bar.md`. All referenced deleted vanilla-JS components.
- **`docs/setup/es-modules-migration.md`**: obsolete — the React migration supersedes the planned vanilla-ESM transition entirely.
- **`docs/`** directory at repo root: contents moved into `client/docs/` or `server/docs/` (see Changed → docs reorganization).
- **ClickUp integration references** across `CONTRIBUTING.md` and `.github/` templates: ClickUp is no longer in use.

### Architectural decisions

- **Two-package monorepo, no workspace**: `client/` and `server/` are independent packages with their own `package.json`, dependency trees, and tooling. No `pnpm-workspace.yaml` — root tooling reaches into client via `pnpm -C client exec`.
- **Root owns shared git hooks only**: repo-root `package.json` carries husky + commitlint + lint-staged. All other tooling lives inside `client/`. Server is currently unmanaged at the root level.
- **Package managers split intentionally**: pnpm for repo root and client; npm for server. The server stays on npm until it's refactored to TypeScript, at which point it will move to pnpm and gain a parity script set.
- **Lint-staged is client-scoped**: `pre-commit` only auto-fixes `client/**` files. Server files are not auto-linted until the TS migration.
- **Conventional Commits enforced repo-wide**: `commit-msg` validates every commit message regardless of which files changed.
- **Env validation strategy**: zod schema is the single source of truth. Validated twice — once at Vite build time (`vite.config.ts` → `loadEnv`) and once at app boot (`src/config/env.ts` → `import.meta.env`). Both throw hard on missing/malformed vars. No silent fallbacks: missing env is a deployment bug, not a runtime fallback case.
- **Branching model**: `main` is release-only. `development` is the integration branch. All feature branches start from and target `development`.
- **Docs ownership**: client docs live under `client/docs/`, server docs under `server/docs/`. No shared top-level `docs/` directory.


<!--
How to append:

1. Add a new heading under [Unreleased] using the KaC categories (Added, Changed,
   Deprecated, Removed, Fixed, Security).
2. On release, rename [Unreleased] to a new version + date, and start a fresh
   [Unreleased] block above it.
3. Keep entries terse and user-facing. Implementation details go in commit
   messages, not here.
-->
