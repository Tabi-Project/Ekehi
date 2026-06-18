# Ekehi Database Schema Refactor — Enums, Lookup Tables & Filter Fix

**Date:** 2026-03-12
**Branch:** `feat/init-backend`

---

## Problem

The `funding_opportunities`, `training_programmes`, and `credit_products` tables stored categorical data as free-text `varchar`. Two critical issues:

1. **Filtering was broken**: `sector` and `stage_eligibility` were comma-separated strings (e.g. `"Technology & Digital Services, Financial Services & Fintech"`). The service's `.eq('sector', sector)` never matched multi-sector rows.
2. **No validation**: Any string could be inserted — typos and casing inconsistencies corrupted filter results.

---

## Solution

- **PostgreSQL enums** for single-value categoricals (`opportunity_type`, `status`, `format`, `institution_type`)
- **`text[]` arrays** for multi-value fields (`sectors`, `stages`) backed by GIN indexes
- **Lookup tables** (`sectors`, `stages`) as the canonical source of display names
- **`GET /api/v1/meta`** endpoint so the frontend fetches filter options dynamically

---

## Decision: Arrays vs Junction Tables

**Chosen: `text[]` arrays + lookup tables**

- Supabase JS SDK's `.contains('sectors', ['technology_digital'])` maps directly to PostgreSQL's `@>` with a GIN index — one line, no JOINs
- Junction tables require either raw SQL via `supabase.rpc()` or nested filters — breaks the existing service pattern
- Adding a new sector = one DB INSERT into the `sectors` table, no DDL change
- `text[]` not `enum[]` — adding values needs no `ALTER TYPE` lock

---

## Canonical Values

### PostgreSQL Enum Types

| Type                    | Values                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `opportunity_type_enum` | `grant_ngo`, `accelerator`, `loan`, `microfinance`, `vc`, `prize_money`                    |
| `listing_status_enum`   | `open`, `rolling_applications`, `closed`                                                   |
| `training_format_enum`  | `online`, `in_person`, `hybrid`                                                            |
| `institution_type_enum` | `commercial_bank`, `development_bank`, `microfinance_bank`, `fintech`, `government`, `ngo` |

### Lookup Table: `sectors`

| slug                         | display_name                  |
| ---------------------------- | ----------------------------- |
| `cross_sector`               | Cross-sector / General        |
| `technology_digital`         | Technology & Digital Services |
| `agriculture_food`           | Agriculture & Food Processing |
| `financial_services_fintech` | Financial Services & Fintech  |
| `retail_ecommerce`           | Retail & E-Commerce           |
| `creative_industries`        | Creative Industries           |
| `education_edtech`           | Education & EdTech            |
| `logistics_distribution`     | Logistics & Distribution      |

### Lookup Table: `stages`

| slug     | display_name |
| -------- | ------------ |
| `idea`   | Idea         |
| `early`  | Early        |
| `growth` | Growth       |

Legacy `"Any"` value in `stage_eligibility` → `NULL` (null = applies to all stages)

---

## Migrations Applied (in order)

| #    | Name                          | What it does                                                                                                                                     |
| ---- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 001  | `lookup_tables`               | Create + seed `sectors` and `stages` tables                                                                                                      |
| 002  | `enum_types`                  | `CREATE TYPE` for all 4 enums                                                                                                                    |
| 003  | `add_array_columns`           | Add `sectors text[]` and `stages text[]` to all 3 tables (non-destructive)                                                                       |
| 004  | `populate_arrays`             | UPDATE with CASE to map old comma-separated strings → slug arrays                                                                                |
| 004b | `populate_arrays_fix_nospace` | Fix rows where DB stored no-space commas (e.g. `"Tech,Finance"` not `"Tech, Finance"`)                                                           |
| 004c | `populate_arrays_fix_retail`  | Fix one `credit_products` row with single `"Retail & E-Commerce"` value                                                                          |
| 005  | `gin_indexes`                 | `CREATE INDEX USING GIN` on `sectors` and `stages` on all 3 tables                                                                               |
| 006  | `convert_enum_columns`        | Add new enum-typed columns, populate from old varchars, verify no nulls                                                                          |
| 007  | `drop_old_columns`            | Drop original `sector`, `stage_eligibility`, `opportunity_type`, `status`, `format`, `institution_type` varchar columns; rename new enum columns |
| 008  | `constraints`                 | Add NOT NULL constraints confirmed by data                                                                                                       |

---

## Data Mappings

### sector → sectors[]

| Old value                                                     | New array                                              |
| ------------------------------------------------------------- | ------------------------------------------------------ |
| `Cross-sector / General`                                      | `['cross_sector']`                                     |
| `Technology & Digital Services`                               | `['technology_digital']`                               |
| `Agriculture & Food Processing`                               | `['agriculture_food']`                                 |
| `Technology & Digital Services,Financial Services & Fintech`  | `['technology_digital', 'financial_services_fintech']` |
| `Agriculture & Food Processing,Technology & Digital Services` | `['agriculture_food', 'technology_digital']`           |
| `Retail & E-Commerce,Technology & Digital Services`           | `['retail_ecommerce', 'technology_digital']`           |
| `Technology & Digital Services,Creative Industries`           | `['technology_digital', 'creative_industries']`        |
| `Agriculture & Food Processing,Retail & E-Commerce`           | `['agriculture_food', 'retail_ecommerce']`             |
| `Retail & E-Commerce,Agriculture & Food Processing`           | `['retail_ecommerce', 'agriculture_food']`             |
| `Logistics & Distribution`                                    | `['logistics_distribution']`                           |
| `Education & EdTech`                                          | `['education_edtech']`                                 |
| `Retail & E-Commerce`                                         | `['retail_ecommerce']`                                 |

### stage_eligibility → stages[]

| Old value           | New array                     |
| ------------------- | ----------------------------- |
| `Early,Growth`      | `['early', 'growth']`         |
| `Idea,Early`        | `['idea', 'early']`           |
| `Growth`            | `['growth']`                  |
| `Idea,Early,Growth` | `['idea', 'early', 'growth']` |
| `Any`               | `NULL`                        |

### opportunity_type (varchar → enum)

| Old            | New            |
| -------------- | -------------- |
| `Grant-NGO`    | `grant_ngo`    |
| `Accelerator`  | `accelerator`  |
| `Loan`         | `loan`         |
| `VC`           | `vc`           |
| `Microfinance` | `microfinance` |
| `Prize Money`  | `prize_money`  |

### status (varchar → enum, all 3 tables)

| Old                    | New                    |
| ---------------------- | ---------------------- |
| `Open`                 | `open`                 |
| `Rolling Applications` | `rolling_applications` |

### format (varchar → enum, training_programmes)

| Old         | New         |
| ----------- | ----------- |
| `Online`    | `online`    |
| `In-Person` | `in_person` |
| `Hybrid`    | `hybrid`    |

### institution_type (varchar → enum, credit_products)

| Old                 | New                 |
| ------------------- | ------------------- |
| `Development Bank`  | `development_bank`  |
| `Commercial Bank`   | `commercial_bank`   |
| `Microfinance Bank` | `microfinance_bank` |
| `Fintech`           | `fintech`           |
| `Government`        | `government`        |

---

## New Backend Files

| File                                        | Purpose                                                   |
| ------------------------------------------- | --------------------------------------------------------- |
| `server/src/models/enums.js`                | JS constants for all enum values — single source of truth |
| `server/src/services/meta.service.js`       | Fetches enum constants + `sectors`/`stages` rows from DB  |
| `server/src/controllers/meta.controller.js` | Calls `getMeta()` → `sendSuccess`                         |
| `server/src/routes/meta.routes.js`          | `GET /` → meta controller                                 |

## Modified Backend Files

| File                                                 | Change                                                                                                                                                                             |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/src/routes/index.js`                         | Added `router.use('/meta', metaRoutes)`                                                                                                                                            |
| `server/src/services/opportunities.service.js`       | Updated FIELDS (`sector`→`sectors`, `stage_eligibility`→`stages`); `.eq('sector')` → `.contains('sectors', [sector])`; `.eq('stage_eligibility')` → `.contains('stages', [stage])` |
| `server/src/services/training.service.js`            | Same as opportunities service                                                                                                                                                      |
| `server/src/controllers/opportunities.controller.js` | Renamed `stage_eligibility` query param → `stage`                                                                                                                                  |
| `server/src/controllers/training.controller.js`      | Renamed `stage_eligibility` query param → `stage`                                                                                                                                  |

---

## New API Endpoint

```
GET /api/v1/meta    — Public, no auth required
```

Response shape:

```json
{
  "success": true,
  "data": {
    "opportunity_types": ["grant_ngo", "accelerator", "loan", "microfinance", "vc", "prize_money"],
    "listing_statuses": ["open", "rolling_applications", "closed"],
    "training_formats": ["online", "in_person", "hybrid"],
    "institution_types": ["commercial_bank", "development_bank", "microfinance_bank", "fintech", "government", "ngo"],
    "sectors": [
      { "slug": "agriculture_food", "display_name": "Agriculture & Food Processing" },
      { "slug": "creative_industries", "display_name": "Creative Industries" },
      ...
    ],
    "stages": [
      { "slug": "early", "display_name": "Early" },
      { "slug": "growth", "display_name": "Growth" },
      { "slug": "idea", "display_name": "Idea" }
    ]
  }
}
```

---

## Updated Filter Query Params

| Old param           | New param                                               | Filter type                      |
| ------------------- | ------------------------------------------------------- | -------------------------------- |
| `sector`            | `sector` (value is now slug e.g. `technology_digital`)  | `.contains('sectors', [sector])` |
| `stage_eligibility` | `stage` (value is now slug e.g. `early`)                | `.contains('stages', [stage])`   |
| `type`              | `opportunity_type` (value is now slug e.g. `grant_ngo`) | `.eq('opportunity_type', ...)`   |
| `status`            | `status` (value is now slug e.g. `open`)                | `.eq('status', ...)`             |
| `format`            | `format` (value is now slug e.g. `in_person`)           | `.eq('format', ...)`             |

---

## Verification Queries

```sql
-- Confirm lookup tables seeded
SELECT * FROM sectors;
SELECT * FROM stages;

-- Confirm arrays populated (no empty arrays)
SELECT COUNT(*) FROM funding_opportunities WHERE sectors = '{}';  -- should be 0
SELECT COUNT(*) FROM training_programmes WHERE sectors = '{}';    -- should be 0
SELECT COUNT(*) FROM credit_products WHERE sectors = '{}';        -- should be 0

-- Confirm enum columns have no nulls
SELECT COUNT(*) FROM funding_opportunities WHERE opportunity_type IS NULL;  -- 0
SELECT COUNT(*) FROM funding_opportunities WHERE status IS NULL;            -- 0

-- Test array filter
SELECT id, opportunity_title, sectors FROM funding_opportunities
WHERE 'technology_digital' = ANY(sectors);

-- Test stage filter (should include rows with ['early','growth'] and ['idea','early'])
SELECT id, stages FROM funding_opportunities
WHERE 'early' = ANY(stages);
```
