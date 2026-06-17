# Ekehi Backend API — Week 2 Sprint Plan
## Auth + GET endpoints for Opportunities & Training Programmes

---

## Context

The Ekehi project needs a working Express API (deployed to Render) so the Netlify frontend can pull real data from Supabase. The backend skeleton exists but every directory is empty. The Supabase database is already seeded with production tables (`funding_opportunities` × 20 rows, `training_programmes` × 10 rows, `profiles` × 2 rows — all RLS-enabled with an `approval_status` enum).

Week 2 scope: **Auth (signup/login/logout) + public GET endpoints for opportunities & training**, so the frontend can stop using hardcoded data.

---

## Architecture

```
Client (Netlify)  →  Express Server (Render)  →  Supabase (PostgreSQL + Auth)
```

- Express uses `SUPABASE_SERVICE_ROLE_KEY` → bypasses RLS; the **server is the security layer**
- GET `/opportunities` and GET `/training` are **public** (no auth required)
- Auth endpoints use a stricter rate limiter (10 req/15 min vs 100 for general API)
- Layered: `Route → Controller → Service → Supabase`

---

## Files Created

### Backend (server/src/)

| # | File | Purpose |
|---|------|---------|
| 1 | `config/supabaseClient.js` | Init Supabase client (service role, stateless singleton) |
| 2 | `utils/response.utils.js` | `sendSuccess`, `sendError`, `buildPaginationMeta` |
| 3 | `middleware/errorHandler.middleware.js` | Global 4-arg Express error handler |
| 4 | `middleware/auth.middleware.js` | `requireAuth` — verify Supabase JWT (ready for Week 3) |
| 5 | `services/auth.service.js` | `signUp`, `signIn`, `signOut` via Supabase Auth SDK |
| 6 | `services/opportunities.service.js` | `getOpportunities` (filter-query-builder), `getOpportunityById` |
| 7 | `services/training.service.js` | `getTrainingProgrammes`, `getTrainingProgrammeById` |
| 8 | `controllers/auth.controller.js` | Parse req → call service → send response |
| 9 | `controllers/opportunities.controller.js` | Parse query params → call service → paginated response |
| 10 | `controllers/training.controller.js` | Same as above for training |
| 11 | `routes/auth.routes.js` | `POST /signup`, `POST /login`, `POST /logout` |
| 12 | `routes/opportunities.routes.js` | `GET /`, `GET /:id` |
| 13 | `routes/training.routes.js` | `GET /`, `GET /:id` |
| 14 | `routes/index.js` | Route aggregator — mounts all 3 route files |
| 15 | `app.js` | Express entry point — helmet, CORS, morgan, rate limiters, routes, error handler |

### Frontend (client/shared/services/)

| # | File | Purpose |
|---|------|---------|
| 16 | `api.js` | Base fetch wrapper — attaches Bearer token, handles 401 redirect |
| 17 | `auth.service.js` | `login`, `signup`, `logout`, `isLoggedIn` — stores tokens in localStorage |

---

## API Endpoints

```
GET    /api/v1/health             — Health check (no auth, no rate limit)

POST   /api/v1/auth/signup        — { email, password, firstName, lastName }
POST   /api/v1/auth/login         — { email, password }  → returns access_token + refresh_token
POST   /api/v1/auth/logout        — Authorization: Bearer <token>

GET    /api/v1/opportunities      — Public. Filters: search, type, sector, stage, country, status, is_women_only, page, limit
GET    /api/v1/opportunities/:id  — Public. Single opportunity by UUID.

GET    /api/v1/training           — Public. Filters: search, format, sector, stage, status, is_free, is_featured, page, limit
GET    /api/v1/training/:id       — Public. Single programme by UUID.
```

---

## Response Envelope

Every response (success or error):
```json
{ "success": true, "message": "...", "data": {} }
```

List endpoints include a `meta` field:
```json
{
  "success": true,
  "message": "...",
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 20, "totalPages": 2, "hasNextPage": true, "hasPrevPage": false }
}
```

---

## Key Design Decisions

### Supabase Client
```js
createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
```
Stateless singleton — no session stored server-side.

### Filter-as-Query-Builder Pattern
Each filter is applied conditionally:
```js
if (search) query = query.or(`opportunity_title.ilike.%${search}%,...`);
if (sector) query = query.eq('sector', sector);
```
Only `approval_status = 'approved'` rows are ever exposed.

### Signup → Profile Creation
After `supabase.auth.signUp()`, insert into `profiles` using `user.id`. Profile failure is logged but non-blocking.

### Middleware Order in app.js
```
helmet → cors → morgan → body-parser → auth-rate-limiter → general-rate-limiter → health-check → routes → 404 → errorHandler
```

### CORS
`ALLOWED_ORIGINS` env var (comma-separated). For Render production:
```
ALLOWED_ORIGINS=https://your-app.netlify.app,http://localhost:5500,http://127.0.0.1:5500
```

### Frontend Base URL
`api.js` reads `window.EKEHI_API_URL` if set, otherwise falls back to `http://localhost:3000/api/v1`.
For production, add a `config.js` loaded before `api.js`:
```html
<script>window.EKEHI_API_URL = 'https://your-api.onrender.com/api/v1';</script>
<script src="/client/shared/services/api.js"></script>
```

### Script Loading Order
```html
<!-- Auth pages -->
<script src="/client/shared/services/api.js"></script>
<script src="/client/shared/services/auth.service.js"></script>
<script src="login.js"></script>

<!-- Data pages -->
<script src="/client/shared/services/api.js"></script>
<script src="opportunities.js"></script>
```

---

## Local Development Setup

```bash
cd server
npm install
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
npm run dev
```

---

## Verification Steps

1. `GET http://localhost:3000/api/v1/health` → `{ success: true, data: { status: "ok" } }`
2. `GET http://localhost:3000/api/v1/opportunities` → array of approved opportunities with `meta`
3. `GET http://localhost:3000/api/v1/opportunities?search=women&status=Open` → filtered results
4. `GET http://localhost:3000/api/v1/training` → array of approved training programmes
5. `POST http://localhost:3000/api/v1/auth/signup` with valid body → 201, returns session tokens
6. `POST http://localhost:3000/api/v1/auth/login` with same credentials → 200, returns tokens
7. `POST http://localhost:3000/api/v1/auth/login` with wrong password → 401
8. In browser console on login page: `await AuthService.login('email', 'pass')` → token stored in localStorage

---

## Week 3 Scope (next sprint)

- Protected routes using `requireAuth` middleware (already implemented)
- `POST /opportunities` / `POST /training` — admin submission endpoints
- `PATCH /opportunities/:id/approve` — admin approval
- Frontend pages wired to real API (replace hardcoded data)
