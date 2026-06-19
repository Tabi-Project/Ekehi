# Contributing — Adding a Feature

This guide describes how to add a new feature to the Ekehi React client (e.g. `opportunities`, `resources`, `submissions`, `admin`). The **auth** feature (`src/features/auth/`) is the canonical reference — copy its shape, change the names.

> If you only need to add a page placeholder or a route, see [`README.md`](./README.md) for routing basics. This document covers data-fetching features that talk to the backend.

## Table of contents

- [Mental model](#mental-model)
- [What the foundation gives you for free](#what-the-foundation-gives-you-for-free)
- [Step-by-step: adding a feature](#step-by-step-adding-a-feature)
- [Patterns](#patterns)
- [Routes and layouts](#routes-and-layouts)
- [Naming](#naming)
- [Don'ts](#donts)
- [Pre-PR checklist](#pre-pr-checklist)

## Mental model

```
src/
├─ config/
│  ├─ env.ts               ← typed env (zod), import as `env`
│  └─ endpoints.ts         ← single map of all server paths
├─ lib/
│  ├─ api/                 ← request foundation (do not edit per-feature)
│  │  ├─ request.ts        ← makeRequest factory
│  │  ├─ refresh.ts        ← single-flight token refresh on 401
│  │  ├─ errors.ts         ← ApiError, envelope helpers
│  │  ├─ types.ts          ← HttpMethod, ApiResponse, envelopes
│  │  └─ index.ts          ← barrel; import from here
│  └─ auth/
│     └─ token-store.ts    ← localStorage wrappers for tokens
└─ features/
   └─ <feature>/
      ├─ <feature>.types.ts    ← zod schemas + TS types
      ├─ <feature>.service.ts  ← service object built from makeRequest
      ├─ <feature>.query.ts    ← useXQuery / useXMutation hooks
      └─ pages/                ← route-rendered components
```

**Rules:**

- A feature owns its types, service, queries, and pages.
- Routes (`src/routes/`) import pages only; they contain no business logic.
- Cross-feature usage goes through the other feature's `*.query.ts` or `*.service.ts` exports, never deep imports.
- All imports use the `#/` alias (e.g. `import { makeRequest } from '#/lib/api'`). Do not use relative `../../`.

## What the foundation gives you for free

Every response from `makeRequest` is unwrapped to `{ data, meta? }`:

| Concern                                              | Behavior                                                                                                                      |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Success envelope `{ success, message, data, meta? }` | Unwrapped → `{ data, meta }`                                                                                                  |
| Error envelope `{ success: false, message, data? }`  | Thrown as `ApiError(message, status, data)`                                                                                   |
| `Authorization: Bearer <token>`                      | Attached automatically when a token exists in `token-store`                                                                   |
| 401 on non-`/auth/*` routes                          | Triggers a single refresh attempt; retries the original once. On refresh failure, tokens are cleared and `ApiError` is thrown |
| `FormData` body                                      | Skips JSON serialization; browser sets the multipart boundary                                                                 |
| `GET` requests with `data`                           | Serialized to query string (`{ page: 2 }` → `?page=2`)                                                                        |
| `204 No Content`                                     | Returns `undefined` data                                                                                                      |

You do **not** implement any of that per feature. You declare endpoints, types, and a thin service.

## Step-by-step: adding a feature

The example below adds an `opportunities` feature with list, detail, and apply endpoints.

### 1. Add endpoints to `src/config/endpoints.ts`

```ts
export const ENDPOINTS = {
  auth: {
    /* ... */
  },
  me: {
    /* ... */
  },
  opportunities: {
    list: '/opportunities',
    detail: (id: string) => `/opportunities/${id}`,
    apply: (id: string) => `/opportunities/${id}/apply`,
  },
} as const
```

Use a string for static paths, a function for paths with params.

### 2. Define types in `src/features/opportunities/opportunities.types.ts`

Use zod for runtime validation. Export `z.infer` types for everything callers touch.

```ts
import { z } from 'zod'

export const opportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  created_at: z.string(),
})
export type Opportunity = z.infer<typeof opportunitySchema>

export const listOpportunitiesQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
})
export type ListOpportunitiesQuery = z.infer<
  typeof listOpportunitiesQuerySchema
>

export const listOpportunitiesResponseSchema = z.array(opportunitySchema)
export type ListOpportunitiesResponse = z.infer<
  typeof listOpportunitiesResponseSchema
>
```

**Keep snake_case** for field names that come off the wire — the backend uses snake_case and we don't transform.

### 3. Build the service in `opportunities.service.ts`

```ts
import { ENDPOINTS } from '#/config/endpoints'
import { makeRequest } from '#/lib/api'

import type {
  ListOpportunitiesQuery,
  ListOpportunitiesResponse,
  Opportunity,
} from './opportunities.types'

export const OpportunitiesService = {
  list: makeRequest<ListOpportunitiesResponse, ListOpportunitiesQuery>(
    ENDPOINTS.opportunities.list,
    'GET',
  ),
  detail: (id: string) =>
    makeRequest<Opportunity>(ENDPOINTS.opportunities.detail(id), 'GET'),
  apply: (id: string) =>
    makeRequest<null>(ENDPOINTS.opportunities.apply(id), 'POST'),
}
```

Two patterns:

- **Static endpoint** → call `makeRequest(...)` once at module scope.
- **Param endpoint** → wrap in an arrow that takes the param and returns a fresh `makeRequest`. Callers invoke with `OpportunitiesService.detail(id)({ data })`.

### 4. Build query/mutation hooks in `opportunities.query.ts`

Define a key factory, then one hook per server call.

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '#/lib/api'

import { OpportunitiesService } from './opportunities.service'
import type {
  ListOpportunitiesQuery,
  ListOpportunitiesResponse,
  Opportunity,
} from './opportunities.types'

export const opportunityKeys = {
  all: ['opportunities'] as const,
  list: (params: ListOpportunitiesQuery) =>
    [...opportunityKeys.all, 'list', params] as const,
  detail: (id: string) => [...opportunityKeys.all, 'detail', id] as const,
}

export function useOpportunitiesQuery(params: ListOpportunitiesQuery) {
  return useQuery<ListOpportunitiesResponse, ApiError>({
    queryKey: opportunityKeys.list(params),
    queryFn: () =>
      OpportunitiesService.list({ data: params }).then((r) => r.data),
  })
}

export function useOpportunityQuery(id: string) {
  return useQuery<Opportunity, ApiError>({
    queryKey: opportunityKeys.detail(id),
    queryFn: () => OpportunitiesService.detail(id)().then((r) => r.data),
    enabled: Boolean(id),
  })
}

export function useApplyToOpportunityMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation<null, ApiError, void>({
    mutationFn: () => OpportunitiesService.apply(id)().then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.detail(id) })
    },
  })
}
```

**Rules of thumb:**

- Type the error generic as `ApiError` so consumers can read `error.status` and `error.data` without a cast.
- Include every parameter that affects the result in the queryKey — otherwise the cache splits incorrectly.
- Invalidate the smallest surface that changed (a single detail key, not the whole `all` namespace) so you don't refetch unrelated lists.

### 5. Consume from a page

```tsx
// src/features/opportunities/pages/opportunities-page.tsx
import { useOpportunitiesQuery } from '../opportunities.query'

export function OpportunitiesPage() {
  const { data, isPending, error } = useOpportunitiesQuery({
    page: 1,
    limit: 20,
  })

  if (isPending) return <p>Loading…</p>
  if (error) return <p>{error.message}</p>

  return (
    <ul>
      {data.map((o) => (
        <li key={o.id}>{o.title}</li>
      ))}
    </ul>
  )
}
```

Pages never import `makeRequest` or `fetch` directly. If you find yourself reaching for either in a page, the logic belongs in the service.

## Patterns

### Pagination meta

If a list endpoint returns `meta: { page, limit, total, totalPages, hasNextPage, hasPrevPage }`, declare a `Meta` type and return the full envelope from the hook:

```ts
import type { ApiResponse } from '#/lib/api'

type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function useOpportunitiesQuery(params: ListOpportunitiesQuery) {
  return useQuery<
    ApiResponse<ListOpportunitiesResponse, PaginationMeta>,
    ApiError
  >({
    queryKey: opportunityKeys.list(params),
    queryFn: () => OpportunitiesService.list({ data: params }),
  })
}
```

The hook returns `{ data, meta }` so the UI can render page controls from `meta.totalPages`.

### File uploads (multipart)

When the endpoint accepts a file, build a `FormData` inside the service method:

```ts
type CreateSubmissionRequest = {
  title: string
  description: string
  file: File
}

const createRequest = makeRequest<Submission, FormData>(
  ENDPOINTS.submissions.create,
  'POST',
)

export const SubmissionsService = {
  create: (input: CreateSubmissionRequest) => {
    const form = new FormData()
    form.append('title', input.title)
    form.append('description', input.description)
    form.append('file', input.file)
    return createRequest({ data: form })
  },
}
```

`makeRequest` detects `FormData` and skips JSON serialization, so the browser sets the multipart boundary automatically.

### Auth-gated queries

For endpoints that require a logged-in user, gate the query on the access token to avoid a guaranteed 401 before sign-in:

```ts
import { getAccessToken } from '#/lib/auth/token-store'

useQuery({
  queryKey: ...,
  queryFn: ...,
  enabled: Boolean(getAccessToken()),
})
```

### Optimistic mutations

For "feels-instant" interactions, snapshot, write the optimistic value, and roll back on error:

```ts
useMutation({
  mutationFn: ...,
  onMutate: async (vars) => {
    await queryClient.cancelQueries({ queryKey: opportunityKeys.detail(vars.id) })
    const previous = queryClient.getQueryData(opportunityKeys.detail(vars.id))
    queryClient.setQueryData(opportunityKeys.detail(vars.id), (old) => ({
      ...old,
      applied: true,
    }))
    return { previous }
  },
  onError: (_err, vars, ctx) => {
    if (ctx?.previous) {
      queryClient.setQueryData(opportunityKeys.detail(vars.id), ctx.previous)
    }
  },
  onSettled: (_data, _err, vars) => {
    queryClient.invalidateQueries({ queryKey: opportunityKeys.detail(vars.id) })
  },
})
```

### Handling `ApiError`

`ApiError` exposes:

- `error.message` — the server's `message` string
- `error.status` — HTTP status (or `0` if the request never reached the server)
- `error.data` — the server's `data` field on the error envelope, useful for validation issues

Branch on `status` for UX:

```ts
if (error.status === 401) /* redirect to login */
if (error.status === 409) /* show conflict UI */
if (error.status === 422) /* render field-level errors from error.data */
```

## Routes and layouts

Routing uses TanStack Router's file-based routing. Source of truth: `src/routes/`. The generated `src/routeTree.gen.ts` is auto-written by `pnpm generate-routes` (and by `pnpm dev`) — never edit it by hand.

### Route group conventions

Groups use the `(name)` directory pattern. A group is a layout boundary that does **not** add to the URL — `(auth)/login.tsx` becomes `/login`, not `/(auth)/login`.

Current groups:

| Group                   | Path                               | Purpose                                                                                  |
| ----------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------- |
| `(auth)/`               | `src/routes/(auth)/`               | Public auth pages (`/login`, `/signup`). No guard.                                       |
| `(layout)/`             | `src/routes/(layout)/`             | Site shell — Navbar + Outlet + Footer. Wraps every public route and everything below it. |
| `(layout)/(protected)/` | `src/routes/(layout)/(protected)/` | Auth-required routes. Inherits the site shell. Guarded by `beforeLoad`.                  |

### How to add a new route

1. **Public marketing/content route** → add a file under `src/routes/(layout)/<path>.tsx`. URL is whatever the filename says, minus the `(layout)` segment.
2. **Auth-required user route** → add under `src/routes/(layout)/(protected)/<path>.tsx`. The guard at `(protected)/route.tsx` handles redirect-to-login if no token.
3. **Detail route with a param** → use the `$param` filename convention: `(layout)/opportunities/$id.tsx` → `/opportunities/<id>`.

After adding/renaming any route file:

```
pnpm generate-routes
```

Each route file follows the same shape:

```tsx
import { createFileRoute } from '@tanstack/react-router'

import { OpportunitiesPage } from '#/features/opportunities/pages/opportunities-page'
import { pageMeta } from '#/lib/page-meta'

export const Route = createFileRoute('/(layout)/opportunities/')({
  component: OpportunitiesPage,
  head: () =>
    pageMeta({
      title: 'Opportunities',
      description: '…',
      path: '/opportunities',
    }),
})
```

Pages live in their feature directory. Routes are thin wrappers — they import a page, declare meta, and that's it.

### Writing a layout file

A layout is `route.tsx` inside a group directory. It renders `<Outlet />` where children mount.

```tsx
// src/routes/(layout)/route.tsx
import { Outlet, createFileRoute } from '@tanstack/react-router'

import { Footer } from '#/components/layout/footer'
import { Navbar } from '#/components/layout/navbar'

export const Route = createFileRoute('/(layout)')({
  component: SiteLayout,
})

function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

### Auth guard via `beforeLoad`

The `(protected)` layout runs `beforeLoad` before any child route renders. If the user has no access token, it throws a redirect to `/login` with the original URL captured in the `redirect` search param, so the login flow can return them.

```tsx
// src/routes/(layout)/(protected)/route.tsx
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { getAccessToken } from '#/lib/auth/token-store'

export const Route = createFileRoute('/(layout)/(protected)')({
  beforeLoad: ({ location }) => {
    if (!getAccessToken()) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: () => <Outlet />,
})
```

To add a role-gated layout (e.g. admin-only), nest another group inside `(protected)` and run an `ensureQueryData` call against `authKeys.me()` in its `beforeLoad`:

```tsx
beforeLoad: async ({ context }) => {
  const profile = await context.queryClient.ensureQueryData({
    queryKey: authKeys.me(),
    queryFn: () => AuthService.me().then((r) => r.data),
  })
  if (profile.role !== 'admin') {
    throw redirect({ to: '/' })
  }
},
```

`context.queryClient` is wired in `__root.tsx` and available to every route loader and guard.

### Reading `redirect` after login

The login mutation's `onSuccess` should pull the `redirect` param off the URL and navigate back:

```tsx
const search = Route.useSearch()
const navigate = useNavigate()

useLoginMutation().mutate(credentials, {
  onSuccess: () => navigate({ to: search.redirect ?? '/' }),
})
```

## Naming

| Layer     | File                                       | Export                                                   |
| --------- | ------------------------------------------ | -------------------------------------------------------- |
| Endpoints | `config/endpoints.ts`                      | `ENDPOINTS.<feature>.<action>`                           |
| Types     | `features/<feature>/<feature>.types.ts`    | `<thing>Schema`, `<Thing>`                               |
| Service   | `features/<feature>/<feature>.service.ts`  | `<Feature>Service`                                       |
| Queries   | `features/<feature>/<feature>.query.ts`    | `use<Thing>Query`, `use<Thing>Mutation`, `<feature>Keys` |
| Page      | `features/<feature>/pages/<name>-page.tsx` | `<Name>Page`                                             |

File names are kebab-case. Exports use PascalCase for types/components/services and camelCase for hooks/functions.

## Don'ts

- ❌ `fetch` in a service or component — always `makeRequest`.
- ❌ `localStorage` outside `lib/auth/token-store.ts` — wrap it if you need more keys.
- ❌ Converting snake_case to camelCase — the wire and the UI agree on snake_case.
- ❌ Throwing custom errors from a service — `makeRequest` throws `ApiError` consistently.
- ❌ Calling a query hook outside `<QueryClientProvider>` — the provider is wired once in `src/main.tsx`.
- ❌ Business logic in a route file — routes are wrappers; logic lives in the feature.
- ❌ Relative imports (`../../lib/api`) — always use the `#/` alias.

## Pre-PR checklist

- [ ] New endpoints declared in `config/endpoints.ts`.
- [ ] Types match server response exactly (zod schemas where validation is useful).
- [ ] Service uses `makeRequest` only.
- [ ] Query hooks type `error` as `ApiError`.
- [ ] Query keys include every parameter that affects the result.
- [ ] Cache invalidation hits only what changed.
- [ ] Page renders loading, error, and empty states.
- [ ] No `fetch`, no `localStorage`, no third-party HTTP client in feature code.
- [ ] All imports use the `#/` alias.
- [ ] `pnpm lint` clean.
