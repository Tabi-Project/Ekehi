# System Design Case Study: Ekehi Backend API

## Building a Secure, Layered REST API with Express, Supabase, and a Decoupled Frontend

---

## Overview

Ekehi is a resource discovery platform for African entrepreneurs — surfacing funding opportunities, training programmes, and credit products. This case study documents the system design decisions behind its backend API: how the architecture is structured, why each decision was made, and how to reproduce it from scratch.

---

## The Problem

The frontend was built with hardcoded data. The team needed a real API that could:

- Serve live data from a managed database
- Handle user authentication securely
- Filter and paginate large result sets
- Be deployed independently from the frontend
- Scale without architectural rewrites

---

## Architecture

```
┌─────────────────────┐        HTTPS         ┌──────────────────────┐
│   Client (Netlify)  │ ──────────────────→  │  API Server (Render) │
│   Vanilla JS        │  REST / JSON          │  Node.js + Express   │
│   Static Site       │ ←──────────────────  │  Port 3000           │
└─────────────────────┘                       └──────────┬───────────┘
                                                         │
                                              Service Role Key
                                                         │
                                              ┌──────────▼───────────┐
                                              │   Supabase           │
                                              │   PostgreSQL + Auth  │
                                              │   RLS enabled        │
                                              └──────────────────────┘
```

Three independently deployed systems. Each has a single responsibility:

| System           | Responsibility                                       |
| ---------------- | ---------------------------------------------------- |
| Netlify (Client) | Render HTML/CSS/JS. Call the API. Display data.      |
| Render (Server)  | Validate requests. Enforce business rules. Query DB. |
| Supabase         | Store data. Handle auth tokens. Enforce schema.      |

---

## Technology Choices

### Why Express over Fastify / Hapi / NestJS?

Express has the smallest learning curve and the largest ecosystem. For a team working across a product sprint, the priority is shipping — not framework features. Express does not impose an architecture, which forced the team to design one deliberately (which is the point of this document).

### Why Supabase over raw PostgreSQL?

Supabase provides:

- A managed Postgres instance with no DevOps overhead
- A built-in Auth service (JWT issuance, refresh, email confirmation)
- Row Level Security (RLS) at the database layer
- A typed JavaScript SDK that replaces a query builder

The tradeoff: you are coupling your auth flow to Supabase's implementation. This is acceptable for the current scale.

### Why Render over Railway / Fly.io / AWS?

Render offers free-tier web services with zero-downtime deploys and automatic HTTPS. For a project at this stage, operational simplicity outweighs fine-grained infrastructure control.

---

## The Security Model

The most important design decision in this architecture is **who enforces security**.

```
Database (Supabase)
  └── RLS policies enabled on all tables
        └── But bypassed by the service role key

Server (Express)
  └── Holds the service role key in an environment variable
  └── Applies its own access rules before querying
  └── Is the actual security boundary
```

Supabase RLS is a safety net, not the primary gate. The Express server is responsible for:

- Only returning rows where `approval_status = 'approved'`
- Verifying JWT tokens on protected routes
- Rate limiting auth endpoints

This means **the server must never be skipped**. The service role key must never be exposed to the client.

---

## Project Structure

```
server/
└── src/
    ├── config/
    │   ├── env.js              ← Loads + validates all env vars on startup
    │   └── supabaseClient.js   ← Single Supabase client instance (singleton)
    ├── middleware/
    │   ├── auth.middleware.js  ← requireAuth: verifies JWT from Authorization header
    │   └── errorHandler.middleware.js ← Global 4-arg Express error handler
    ├── services/               ← All database interaction lives here
    │   ├── auth.service.js
    │   ├── opportunities.service.js
    │   └── trainings.service.js
    ├── controllers/            ← Parse request → call service → send response
    │   ├── auth.controller.js
    │   ├── opportunities.controller.js
    │   └── trainings.controller.js
    ├── routes/                 ← Express routers (no logic here)
    │   ├── auth.routes.js
    │   ├── opportunities.routes.js
    │   ├── trainings.routes.js
    │   └── index.js            ← Aggregates all routers under /api/v1
    ├── utils/
    │   └── response.utils.js   ← sendSuccess, sendError, buildPaginationMeta
    └── app.js                  ← Entry point: middleware chain + server start
```

### The Layered Pattern

```
Request
  → Route        (maps HTTP method + path to a controller function)
  → Controller   (parses req, validates input, calls service, sends response)
  → Service      (builds Supabase query, applies filters, returns data)
  → Supabase SDK (executes against PostgreSQL)
```

Each layer has one job. A controller never touches the database. A service never touches `req` or `res`. This makes each layer independently testable.

---

## API Design

### Base URL

```
/api/v1/
```

Versioning in the URL path ensures the frontend can continue using `/api/v1` while a `/api/v2` is developed in parallel.

### Endpoints

```
GET    /api/v1/health

POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/logout

GET    /api/v1/opportunities
GET    /api/v1/opportunities/:id

GET    /api/v1/trainings
GET    /api/v1/trainings/:id
```

GET endpoints are public — no token required. Auth endpoints require a body. Logout requires a `Bearer` token in the `Authorization` header.

### Response Envelope

Every response, success or error, uses the same shape:

```json
{
  "success": true,
  "message": "Opportunities retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

`meta` only appears on list endpoints. This consistency means the frontend can handle all responses with the same code path.

---

## Key Implementation Patterns

### 1. Singleton Supabase Client

```js
// config/supabaseClient.js
const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
module.exports = supabase;
```

One instance, shared by all services via `require`. Stateless — the server never stores session data. `autoRefreshToken: false` and `persistSession: false` enforce this.

### 2. Filter-as-Query-Builder (Services)

Instead of building a WHERE clause string, filters are applied conditionally to a Supabase query object:

```js
let query = supabase
  .from("funding_opportunities")
  .select(FIELDS, { count: "exact" })
  .eq("approval_status", "approved"); // always applied

if (search) query = query.or(`opportunity_title.ilike.%${search}%,...`);
if (sector) query = query.eq("sector", sector);
if (country) query = query.eq("country", country);

query = query
  .range(offset, offset + limit - 1)
  .order("created_at", { ascending: false });
```

The `approval_status` filter is hardcoded — not a user parameter. This is the core access control: unapproved records are never reachable regardless of what the client sends.

`{ count: 'exact' }` tells Supabase to return the total row count alongside the data, enabling server-side pagination without a second query.

### 3. Middleware Order in app.js

Order is not optional in Express. The chain must be:

```
helmet          ← Set security headers (first, always)
cors            ← Handle preflight before any processing
morgan          ← Log the request
body-parser     ← Parse JSON body before controllers read req.body
auth limiter    ← Applied before general limiter (more specific first)
general limiter
health check    ← Lightweight route, outside the router
api routes      ← All /api/v1/* routes
404 handler     ← Catches unmatched routes
errorHandler    ← 4-arg signature, must be absolute last
```

The error handler's 4-argument signature `(err, req, res, next)` is what signals Express to treat it as an error handler rather than a regular middleware.

### 4. Rate Limiting by Endpoint Type

```js
// Auth endpoints — strict (brute force protection)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

// All other API endpoints — relaxed
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use("/api/v1/auth", authLimiter); // applied first (more specific)
app.use("/api/v1", generalLimiter);
```

Auth routes get both limiters — `authLimiter` fires first, and if the request is not rejected, `generalLimiter` also runs. This is intentional: auth attempts are counted in both windows.

### 5. Signup → Profile Creation

Supabase Auth creates a user in its internal `auth.users` table. To associate application data, a row is also inserted into the `profiles` table using the returned `user.id`:

```js
const { data, error } = await supabase.auth.signUp({ email, password });
if (data.user) {
  await supabase.from('profiles').insert({ id: data.user.id, email, ... });
}
```

The profile insert is **best-effort** — if it fails, it is logged but does not throw. The auth user already exists; the profile can be repaired without re-registering.

---

## Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key              # unused server-side, kept for reference
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # never expose to client

# Auth
JWT_SECRET=your-jwt-secret

# CORS
ALLOWED_ORIGINS=https://your-app.netlify.app,http://localhost:5500
```

`env.js` validates all required variables on startup and throws if any are missing — the server refuses to start with an incomplete configuration.

---

## Frontend Integration

### Base Fetch Wrapper (`api.js`)

```js
const BASE_URL = window.EKEHI_API_URL || "http://localhost:3000/api/v1";

async function request(path, options = {}) {
  const token = localStorage.getItem("ekehi_access_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (response.status === 401) {
    /* clear tokens, redirect to login */
  }
  if (!response.ok) throw new Error(body.message);
  return body;
}
```

`window.EKEHI_API_URL` allows the base URL to be overridden per environment without changing `api.js`:

```html
<!-- In production HTML, loaded before api.js -->
<script>
  window.EKEHI_API_URL = "https://ekehi-api.onrender.com/api/v1";
</script>
<script src="/client/shared/services/api.js"></script>
```

---

## Reproducing This Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Create your tables with an `approval_status` enum column (`approved`, `pending`, `rejected`)
3. Enable RLS on all tables
4. Copy your `Project URL` and `service_role` key from Project Settings → API

### 2. Server

```bash
mkdir server && cd server
npm init -y
npm install express @supabase/supabase-js helmet cors morgan express-rate-limit dotenv
npm install -D nodemon
```

Create `src/` with the folder structure above. Start with `config/env.js` and `config/supabaseClient.js`, then build outward: utils → middleware → services → controllers → routes → app.js.

Add to `package.json`:

```json
"scripts": {
  "dev": "nodemon src/app.js",
  "start": "node src/app.js"
}
```

### 3. Environment

```bash
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
```

### 4. Verify

```bash
npm run dev

curl http://localhost:3000/api/v1/health
# → { "success": true, "data": { "status": "ok" } }

curl http://localhost:3000/api/v1/opportunities
# → { "success": true, "data": [...], "meta": { ... } }
```

### 5. Deploy to Render

1. Push server code to GitHub
2. Create a new **Web Service** on Render, connect the repo
3. Set **Root Directory** to `server/`
4. Set **Start Command** to `npm start`
5. Add all environment variables under Render → Environment
6. Set `ALLOWED_ORIGINS` to your Netlify domain
7. Deploy

---

## What This Architecture Does Not Cover

| Concern                      | Status                               |
| ---------------------------- | ------------------------------------ |
| Input validation (Joi/Zod)   | Not implemented — added in Week 3    |
| Admin routes (POST, PATCH)   | Week 3 scope                         |
| Refresh token rotation       | Not implemented                      |
| Request logging to a service | Using Morgan to stdout only          |
| Database migrations          | Managed manually via Supabase Studio |
| Tests (unit + integration)   | Not yet written                      |

---

## Summary

The Ekehi backend is a deliberately simple layered Express API. Its key properties:

- **Stateless** — the server holds no session state; all auth context travels in the JWT
- **Single security boundary** — the Express server is the only thing between the client and the database
- **Consistent responses** — every endpoint returns the same envelope shape
- **Approval-gated data** — `approval_status = 'approved'` is hardcoded in every list query, not a client parameter
- **Environment-driven config** — all credentials and origins are injected via environment variables, never hardcoded

This pattern scales horizontally (run multiple server instances behind a load balancer), works with any Postgres-compatible database, and can be progressively extended with admin routes, webhooks, and background jobs without restructuring the existing layers.
