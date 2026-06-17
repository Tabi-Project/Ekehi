# Migration: pnpm workspace

Converts the repo from three independently-installed packages into a single pnpm
workspace, so one `pnpm install` at the root installs everything and activates husky.

## Why

Today the repo is **not** a workspace: root (`ekehi-workspace`), `client`, and `server`
each install separately, with three lockfiles (`pnpm-lock.yaml`, `client/pnpm-lock.yaml`,
`server/package-lock.json`). The git hooks (`husky`), `lint-staged`, and `commitlint`
live only in the root package. Husky's hooks are created by the root `prepare: husky`
script, which runs **only** when `pnpm install` runs at the root. A contributor who runs
`pnpm i` inside `client/` never triggers it, so `.husky/_` is never created and commits
silently skip the hooks. (That is exactly the bug we hit — `core.hooksPath = .husky/_`
pointed at a directory that did not exist.)

A workspace fixes the root cause instead of patching it: root install installs all
packages and runs root `prepare`, so husky is always live.

## Decisions

- **Both `client` and `server` join the workspace.** Server moves off npm onto pnpm
  (its `package-lock.json` is removed). One package manager, one lockfile.
- **No devDep hoisting.** `client` uses eslint 9, `server` uses eslint 8. Hoisting a
  shared eslint would force a version conflict. pnpm resolves each package's deps
  independently, so they coexist fine — hoisting is an optional later cleanup *after*
  versions are aligned, not part of this migration.
- **Build-script allowlist moves to the root.** pnpm 10 blocks dependency build scripts
  by default. `client` allow-listed `esbuild` and `lightningcss` via its `pnpm.onlyBuiltDependencies`.
  In a workspace only the root's allowlist is honored, so that list moves to the root
  `package.json`.
- **`packageManager` pinned** to `pnpm@10.15.0` (current local version) so everyone uses
  the same toolchain.

## Changes

| File | Change |
|---|---|
| `pnpm-workspace.yaml` (new) | Lists workspace packages: `client`, `server` |
| `package.json` (root) | Add `packageManager: pnpm@10.15.0` and `pnpm.onlyBuiltDependencies: [esbuild, lightningcss]` |
| `client/package.json` | Remove the `pnpm` field (moved to root) |
| `client/pnpm-lock.yaml` | Deleted — root lockfile is now authoritative |
| `server/package-lock.json` | Deleted — server installs via pnpm now |
| `CONTRIBUTING.md` | Setup docs: single root `pnpm install`; server uses pnpm |

## Steps performed

1. Add `pnpm-workspace.yaml`.
2. Add `packageManager` + `pnpm.onlyBuiltDependencies` to root `package.json`.
3. Remove the `pnpm` field from `client/package.json`.
4. Delete `client/pnpm-lock.yaml` and `server/package-lock.json`.
5. Update `CONTRIBUTING.md` setup instructions.

## What the maintainer runs (regenerates the single lockfile + husky)

```sh
# from the repo root
pnpm install
```

If pnpm prints "Ignored build scripts" for anything beyond esbuild/lightningcss, approve
it (records to the root allowlist):

```sh
pnpm approve-builds
```

## Verify

```sh
ls .husky/_                         # pre-commit, commit-msg, husky.sh present
ls pnpm-lock.yaml                   # single root lockfile
ls client/pnpm-lock.yaml 2>/dev/null   # should be gone
pnpm --filter client check          # client toolchain resolves under the workspace
cd client && pnpm dev               # dev still works from client/
```

Then make a throwaway commit and confirm `lint-staged` + commitlint run.

## New contributor workflow

```sh
git clone <fork> && cd Ekehi
pnpm install                 # installs client + server, activates husky
pnpm --filter client dev     # or: cd client && pnpm dev
```
