# Sprint 4 — Content Management & Approval Workflow

**Date:** 2026-03-18

## Overview

Content managers create submissions (funding opportunities, training programmes, guides, templates). Admins review each submission and approve or reject it with written feedback. Rejected content can be revised and resubmitted.

---

## Content Types

| Type | Table | Status |
|------|-------|--------|
| Funding Opportunity | `funding_opportunities` | exists — needs `submitted_by` |
| Training Programme | `training_programmes` | exists — needs `submitted_by` |
| Guide | `guides` | new |
| Template | `templates` | new |

---

## Workflow

```
Content Manager                    Admin
      |                              |
  Creates submission                 |
  (approval_status = 'pending')      |
      |                              |
      |-----------> Pending Queue -->|
                                     |
                              Reviews content
                                     |
                    ┌────────────────┴────────────────┐
                    |                                 |
                Approves                          Rejects
         (approval_status='approved')    (approval_status='rejected'
                    |                      + feedback in content_reviews)
                    |                                 |
            Live on frontend               Content Manager notified
                                                      |
                                              Revises and resubmits
                                          (approval_status='pending')
```

---

## Database Design

### Best Practices Applied (supabase-postgres-best-practices)

- **Primary keys:** `uuid DEFAULT gen_random_uuid()` — consistent with existing tables, safe for external exposure
- **Data types:** `text` over `varchar(n)`, `timestamptz` over `timestamp`, `numeric` over `float`
- **Partial indexes:** Admin queue always filters `approval_status = 'pending'` → partial index per table (5–20x smaller, faster)
- **FK indexes:** Explicit index on every FK column — Postgres does NOT auto-create these
- **Constraints:** Idempotent `DO $$` blocks in all migrations

---

### Migration 1 — Add `submitted_by` to existing tables

```sql
ALTER TABLE public.funding_opportunities
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.training_programmes
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- FK indexes (Postgres does not create these automatically)
CREATE INDEX IF NOT EXISTS funding_opportunities_submitted_by_idx
  ON public.funding_opportunities (submitted_by);

CREATE INDEX IF NOT EXISTS training_programmes_submitted_by_idx
  ON public.training_programmes (submitted_by);
```

---

### Migration 2 — `guides` table

```sql
CREATE TABLE public.guides (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL,
  slug           text        NOT NULL,
  summary        text,
  content        text,
  category       text,
  submitted_by   uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  approval_status text       NOT NULL DEFAULT 'pending'
                              CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT guides_slug_unique UNIQUE (slug)
);

-- Partial index: admin queue only queries pending rows
CREATE INDEX guides_pending_idx
  ON public.guides (created_at DESC)
  WHERE approval_status = 'pending';

-- FK index
CREATE INDEX guides_submitted_by_idx
  ON public.guides (submitted_by);

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
```

---

### Migration 3 — `templates` table

```sql
CREATE TABLE public.templates (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL,
  description    text,
  file_url       text,
  category       text,
  submitted_by   uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  approval_status text       NOT NULL DEFAULT 'pending'
                              CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Partial index: admin queue
CREATE INDEX templates_pending_idx
  ON public.templates (created_at DESC)
  WHERE approval_status = 'pending';

-- FK index
CREATE INDEX templates_submitted_by_idx
  ON public.templates (submitted_by);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
```

---

### Migration 4 — `content_reviews` table

Separate table (not columns on each content table) so the full review history is preserved across multiple rounds of rejection/revision.

```sql
CREATE TYPE content_type_enum AS ENUM (
  'funding_opportunity',
  'training_programme',
  'guide',
  'template'
);

CREATE TABLE public.content_reviews (
  id           uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type content_type_enum NOT NULL,
  content_id   uuid             NOT NULL,
  reviewer_id  uuid             NOT NULL REFERENCES public.profiles(id),
  decision     text             NOT NULL CHECK (decision IN ('approved', 'rejected')),
  feedback     text,
  created_at   timestamptz      NOT NULL DEFAULT now()
);

-- Composite index: look up all reviews for a specific piece of content
CREATE INDEX content_reviews_content_idx
  ON public.content_reviews (content_type, content_id, created_at DESC);

-- FK index on reviewer
CREATE INDEX content_reviews_reviewer_idx
  ON public.content_reviews (reviewer_id);

ALTER TABLE public.content_reviews ENABLE ROW LEVEL SECURITY;
```

Why `content_reviews` is a separate table (not columns on each content table):
- Preserves full audit trail across multiple rounds of rejection → revision → re-review
- Admin can see who reviewed what and when
- A single content piece can have many reviews over time

---

## API Endpoints

### Content Manager (requires auth, any role)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/opportunities` | Submit new funding opportunity |
| `PUT` | `/opportunities/:id` | Edit own pending/rejected submission |
| `POST` | `/trainings` | Submit new training programme |
| `PUT` | `/trainings/:id` | Edit own pending/rejected submission |
| `POST` | `/guides` | Submit new guide |
| `PUT` | `/guides/:id` | Edit own pending/rejected submission |
| `POST` | `/templates` | Submit new template |
| `PUT` | `/templates/:id` | Edit own pending/rejected submission |
| `GET` | `/submissions` | List own submissions across all types with status |

### Admin (requires `super-admin`, `data-manager`, or `content-editor` role)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/queue` | All pending submissions across all types |
| `GET` | `/admin/queue?type=guide&status=pending` | Filtered queue |
| `PATCH` | `/admin/opportunities/:id/review` | Approve or reject with feedback |
| `PATCH` | `/admin/trainings/:id/review` | Approve or reject with feedback |
| `PATCH` | `/admin/guides/:id/review` | Approve or reject with feedback |
| `PATCH` | `/admin/templates/:id/review` | Approve or reject with feedback |
| `GET` | `/admin/opportunities/:id/reviews` | Full review history for a submission |

### Review request body

```json
{
  "decision": "approved" | "rejected",
  "feedback": "Great content, approved." | "Please add eligibility criteria."
}
```

- `feedback` is required when `decision = "rejected"`
- `feedback` is optional when `decision = "approved"`

---

## Frontend Pages (Admin Dashboard)

```
/admin/                              → stats: pending counts per type
/admin/queue/                        → unified pending queue (all types)
/admin/queue/?type=guide             → filtered by type
/admin/opportunities/:id/review      → review detail + approve/reject form
/admin/trainings/:id/review          → review detail
/admin/guides/:id/review             → review detail
/admin/templates/:id/review          → review detail
```

## Frontend Pages (Content Manager)

```
/submit/opportunity/                 → submission form
/submit/training/                    → submission form
/submit/guide/                       → submission form
/submit/template/                    → submission form
/my-submissions/                     → list own submissions + status + feedback
```

---

## Server File Plan

### New files
- `server/src/routes/admin.routes.js`
- `server/src/controllers/admin.controller.js`
- `server/src/services/admin.service.js`
- `server/src/routes/guides.routes.js`
- `server/src/controllers/guides.controller.js`
- `server/src/services/guides.service.js`
- `server/src/routes/templates.routes.js`
- `server/src/controllers/templates.controller.js`
- `server/src/services/templates.service.js`
- `server/src/middleware/requireRole.middleware.js`

### Modified files
- `server/src/routes/index.js` — register new routes
- `server/src/routes/opportunities.routes.js` — add POST, PUT
- `server/src/routes/trainings.routes.js` — add POST, PUT
- `server/src/services/opportunities.service.js` — add createOpportunity, updateOpportunity
- `server/src/services/training.service.js` — add createTraining, updateTraining

---

## Order of Work

1. DB migrations (4 migrations above)
2. `requireRole` middleware
3. Admin service + controller + routes (queue + review endpoints)
4. Opportunity + training POST/PUT endpoints
5. Guides routes/controller/service
6. Templates routes/controller/service
7. Frontend admin dashboard pages
8. Frontend submission forms
9. Frontend "My Submissions" page
