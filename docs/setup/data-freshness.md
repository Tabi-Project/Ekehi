# Week 4 — Data Management & Freshness

**Sprint:** Week 4 — Polish, QA & Deploy
**PRD Reference:** Section 4 — Data Management & Freshness

---

## Requirements (from PRD)

1. Every listing has an expiry date/deadline — expired listings auto-flag for admin review
2. Users can flag outdated or inaccurate listings through a report button
3. "Last Updated" date shown on every listing card
4. Funders can claim and manage their own listings *(post-MVP — skip)*
5. Weekly admin checklist process documented *(non-technical — separate ops doc)*

---

## Implementation Plan

### 1. "Last Updated" on every listing card

`updated_at` already exists on all 3 tables. It is just not exposed in the API response.

**Change required:**
- `server/src/services/opportunities.service.js` — add `updated_at` to `FIELDS`
- `server/src/services/training.service.js` — add `updated_at` to `FIELDS`
- Add a `credit_products` service when that route is built, include `updated_at` in FIELDS from the start

**Verify `updated_at` auto-updates on row edits:**
```sql
-- Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND trigger_name LIKE '%updated_at%';
```
If no trigger exists, create one:
```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_funding_opportunities_updated_at
  BEFORE UPDATE ON funding_opportunities
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_training_programmes_updated_at
  BEFORE UPDATE ON training_programmes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_credit_products_updated_at
  BEFORE UPDATE ON credit_products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

### 2. Expired listings auto-flag for admin review

**Approach:** `needs_review` boolean column + `pg_cron` daily job.

Why not auto-close? "Rolling Applications" listings have no deadline — they need a human decision. Flagging gives the admin a queue to act on rather than silently removing listings.

**Migration:**
```sql
ALTER TABLE funding_opportunities  ADD COLUMN IF NOT EXISTS needs_review boolean NOT NULL DEFAULT false;
ALTER TABLE training_programmes    ADD COLUMN IF NOT EXISTS needs_review boolean NOT NULL DEFAULT false;
ALTER TABLE credit_products        ADD COLUMN IF NOT EXISTS needs_review boolean NOT NULL DEFAULT false;
```

**Enable pg_cron:**
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

**Schedule daily job (runs at midnight UTC):**
```sql
SELECT cron.schedule(
  'flag-expired-funding',
  '0 0 * * *',
  $$
    UPDATE funding_opportunities
    SET needs_review = true
    WHERE application_deadline < CURRENT_DATE
      AND approval_status = 'approved'
      AND needs_review = false;

    UPDATE training_programmes
    SET needs_review = true
    WHERE application_deadline < CURRENT_DATE
      AND approval_status = 'approved'
      AND needs_review = false;

    UPDATE credit_products
    SET needs_review = true
    WHERE application_deadline < CURRENT_DATE
      AND approval_status = 'approved'
      AND needs_review = false;
  $$
);
```

**Admin workflow:**
- Admin dashboard filters `WHERE needs_review = true` to show the review queue
- On review: admin extends the deadline, closes the listing, or archives it
- Reset flag after action: `UPDATE ... SET needs_review = false WHERE id = $1`

---

### 3. User listing reports ("flag as outdated" button)

**New table: `listing_reports`**

```sql
CREATE TABLE listing_reports (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_type text NOT NULL CHECK (listing_type IN ('funding_opportunity', 'training_programme', 'credit_product')),
  listing_id   uuid NOT NULL,
  reason       text,
  reported_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE listing_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a report (auth optional)
CREATE POLICY "Anyone can submit a report" ON listing_reports
  FOR INSERT WITH CHECK (true);

-- Only service role can read reports (admin only via backend)
-- No SELECT policy needed — server uses service role key which bypasses RLS
```

**New backend files:**
- `server/src/services/reports.service.js` — `createReport({ listing_type, listing_id, reason, reported_by })`
- `server/src/controllers/reports.controller.js` — reads from `req.body`, calls service
- `server/src/routes/reports.routes.js` — `POST /`
- `server/src/routes/index.js` — add `router.use('/reports', reportsRoutes)`

**Endpoint:**
```
POST /api/v1/reports   — Public, no auth required
Body: { listing_type, listing_id, reason }
```

**Validation rules:**
- `listing_type` must be one of the 3 allowed values
- `listing_id` must be a valid UUID
- `reason` optional, max 500 chars
- Rate limit: use the existing general rate limiter (100/15min)

---

## Files to Change in Week 4

| File | Change |
|------|--------|
| `server/src/services/opportunities.service.js` | Add `updated_at` to FIELDS |
| `server/src/services/training.service.js` | Add `updated_at` to FIELDS |
| `server/src/services/reports.service.js` | **New** |
| `server/src/controllers/reports.controller.js` | **New** |
| `server/src/routes/reports.routes.js` | **New** |
| `server/src/routes/index.js` | Add `/reports` route |

## Migrations to Run in Week 4

| # | Name | What it does |
|---|------|-------------|
| 012 | `updated_at_triggers` | Create `set_updated_at` function + triggers on all 3 tables |
| 013 | `needs_review_column` | Add `needs_review boolean` to all 3 tables |
| 014 | `pg_cron_expiry_job` | Enable pg_cron + schedule daily expiry flagging job |
| 015 | `listing_reports_table` | Create `listing_reports` table with RLS |
