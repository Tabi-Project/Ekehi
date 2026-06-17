# Client tooling plan

Port of the conventions from [`AJ1732/nextjs-template`](https://github.com/AJ1732/nextjs-template) into this Vite + React + TanStack Router client.

## Goals

- Husky-driven conventional commits at the repo boundary.
- Single command set per project: `lint`, `lint:fix`, `typecheck`, `format`, `format:check`, `check`, `fix`.
- ESLint quality plugins: `simple-import-sort`, `unicorn`, `unused-imports`, plus `eslint-config-prettier` so formatting never fights lint.
- Prettier + `prettier-plugin-tailwindcss` to keep class ordering deterministic.
- `lint-staged` so commits only touch their own files.

## Repo shape

This repo has no root `package.json`. `client/` and `server/` are independent. Husky must install hooks at the git root (where `.git` resolves), so a minimal root `package.json` owns husky + commitlint + lint-staged. The hooks delegate into `client/` so the server is untouched.

```
react-migration/
├── package.json            # husky + commitlint + lint-staged (new)
├── commitlint.config.cjs   # new
├── .lintstagedrc.mjs       # new, scoped to client/**
├── .husky/
│   ├── pre-commit          # pnpm lint-staged
│   └── commit-msg          # pnpm commitlint --edit "$1"
├── client/
│   ├── package.json        # adds plugins + script set
│   ├── eslint.config.js    # rewritten
│   ├── prettier.config.js  # adds tailwind plugin
│   └── .prettierignore     # extended
└── server/                 # untouched
```

## Scripts (client)

| Script            | Command                                            |
| ----------------- | -------------------------------------------------- |
| `dev`             | `vite dev --port 3000`                             |
| `build`           | `vite build`                                       |
| `preview`         | `vite preview`                                     |
| `test`            | `vitest run`                                       |
| `lint`            | `eslint .`                                         |
| `lint:fix`        | `eslint . --fix`                                   |
| `typecheck`       | `tsc --noEmit`                                     |
| `format`          | `prettier . --write`                               |
| `format:check`    | `prettier . --check`                               |
| `check`           | `pnpm lint && pnpm typecheck && pnpm format:check` |
| `fix`             | `pnpm lint:fix && pnpm format`                     |
| `generate-routes` | `tsr generate`                                     |

## Conventional commits

`@commitlint/config-conventional` defaults. No custom `type-enum` or `scope-enum` overrides. Hooks fire from the repo root via husky.

## Install order (AJ runs these)

```sh
# from repo root
pnpm install
pnpm prepare        # installs husky hooks

# in client/
cd client
pnpm install
```

## Verify

```sh
cd client
pnpm check          # lint + typecheck + format check
pnpm fix            # auto-fix what's fixable
```

Make a junk commit with a non-conventional message — it must be rejected by `commit-msg`. Stage a malformed file — `pre-commit` must rewrite it via lint-staged.
