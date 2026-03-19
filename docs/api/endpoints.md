# Ekehi API — Endpoint Reference

**Base URL (dev):** `http://localhost:3000/api/v1`
**Base URL (prod):** `https://<render-url>/api/v1`

All responses follow the envelope:

```json
{ "success": true | false, "message": "...", "data": ..., "meta": ... }
```

`meta` is only present on paginated list responses.

---

## Authentication

### POST /auth/signup

Register a new user.

**Auth:** None

**Body (JSON):**

```json
{
  "email": "hey@ejemeniboi.com",
  "password": "Password123$.",
  "firstName": "Ejemen",
  "lastName": "Iboi"
}
```

**Responses:**

`200 OK`

```json
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "user": { "id": "uuid", "email": "hey@ejemeniboi.com" },
    "session": { "access_token": "...", "refresh_token": "..." }
  }
}
```

`422 Unprocessable Entity` — email already registered

```json
{
  "success": false,
  "message": "User already registered",
  "data": null
}
```

---

### POST /auth/login

Log in an existing user.

**Auth:** None

**Body (JSON):**

```json
{
  "email": "hey@ejemeniboi.com",
  "password": "Password123$."
}
```

**Responses:**

`200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "uuid", "email": "hey@ejemeniboi.com" },
    "session": { "access_token": "...", "refresh_token": "..." }
  }
}
```

`401 Unauthorized` — wrong credentials

```json
{
  "success": false,
  "message": "Invalid login credentials",
  "data": null
}
```

---

### POST /auth/refresh

Exchange a refresh token for a new access token and refresh token pair.

**Auth:** None

**Body (JSON):**

```json
{
  "refresh_token": "..."
}
```

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "expires_at": 1234567890
  }
}
```

`400 Bad Request` — missing refresh_token

```json
{
  "success": false,
  "message": "refresh_token is required",
  "data": null
}
```

`401 Unauthorized` — invalid or expired refresh token

```json
{
  "success": false,
  "message": "Invalid or expired refresh token",
  "data": null
}
```

---

### POST /auth/logout

Log out the current user and invalidate the session.

**Auth:** `Bearer {{ekehi_access_token}}`

**Body:** None

**Responses:**

`200 OK`

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

`401 Unauthorized` — missing or invalid token

```json
{
  "success": false,
  "message": "Missing or invalid authorization header",
  "data": null
}
```

---

## Opportunities

### GET /opportunities

List all approved funding opportunities. Supports search, filtering, and pagination.

**Auth:** None

**Query Params:**

| Key                | Type      | Example                | Description                                           |
| ------------------ | --------- | ---------------------- | ----------------------------------------------------- |
| `search`           | string    | `tony`                 | Keyword search across title, funder name, description |
| `opportunity_type` | enum      | `vc`                   | Filter by type. See enum values below                 |
| `sector`           | enum slug | `retail_ecommerce`     | Filter by sector slug                                 |
| `stage`            | enum slug | `growth`               | Filter by stage slug (`idea`, `early`, `growth`)      |
| `country`          | string    | `Nigeria`              | Filter by country                                     |
| `status`           | enum      | `rolling_applications` | Filter by listing status                              |
| `is_women_only`    | boolean   | `false`                | Filter women-only opportunities                       |
| `page`             | number    | `1`                    | Page number (default: 1)                              |
| `limit`            | number    | `10`                   | Items per page (default: 10, max: 100)                |

**`opportunity_type` values:** `grant_ngo`, `grant_government`, `angel_investment`, `accelerator`, `loan`, `microfinance`, `vc`, `prize_money`

**`status` values:** `open`, `rolling_applications`, `closed`

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Opportunities retrieved successfully",
  "data": [
    {
      "id": "edbb662e-7e0b-490b-9ce4-0aeb87406796",
      "reference_code": "OPP-001",
      "opportunity_title": "Tony Elumelu Foundation Grant",
      "funder_name": "Tony Elumelu Foundation",
      "opportunity_type": "grant_ngo",
      "amount_min": 5000,
      "amount_max": 5000,
      "currency": "USD",
      "sectors": ["agriculture_food", "technology_digital"],
      "stages": ["idea", "early"],
      "country": "Nigeria",
      "application_deadline": "2026-04-30",
      "status": "open",
      "eligibility_criteria": "...",
      "description": "...",
      "apply_url": "https://...",
      "contact_email": "info@tefoundation.org",
      "is_women_only": false,
      "is_equity_free": true,
      "created_at": "2026-03-01T00:00:00Z"
    }
  ],
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

---

### GET /opportunities/:id

Get a single approved funding opportunity by ID.

**Auth:** None

**Path Variable:**

| Key  | Example                                |
| ---- | -------------------------------------- |
| `id` | `edbb662e-7e0b-490b-9ce4-0aeb87406796` |

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Opportunity retrieved successfully",
  "data": { ...full opportunity object... }
}
```

**Response `404 Not Found`:**

```json
{
  "success": false,
  "message": "Opportunity not found",
  "data": null
}
```

---

### GET /opportunities/saved

Return the authenticated user's saved opportunities (paginated).

**Auth:** `Bearer {{ekehi_access_token}}`

**Query Params:**

| Key     | Type   | Example | Description                            |
| ------- | ------ | ------- | -------------------------------------- |
| `page`  | number | `1`     | Page number (default: 1)               |
| `limit` | number | `10`    | Items per page (default: 10, max: 100) |

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Saved opportunities retrieved successfully",
  "data": [ ...opportunity objects... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

**Response `401 Unauthorized`:**

```json
{
  "success": false,
  "message": "Missing or invalid Authorization header",
  "data": null
}
```

---

### POST /opportunities/:id/save

Save an opportunity to the authenticated user's bookmarks. Idempotent — saving an already-saved opportunity is a no-op.

**Auth:** `Bearer {{ekehi_access_token}}`

**Path Variable:**

| Key  | Example                                |
| ---- | -------------------------------------- |
| `id` | `edbb662e-7e0b-490b-9ce4-0aeb87406796` |

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Opportunity saved",
  "data": null
}
```

**Response `401 Unauthorized`:**

```json
{
  "success": false,
  "message": "Missing or invalid Authorization header",
  "data": null
}
```

---

### DELETE /opportunities/:id/save

Remove an opportunity from the authenticated user's bookmarks.

**Auth:** `Bearer {{ekehi_access_token}}`

**Path Variable:**

| Key  | Example                                |
| ---- | -------------------------------------- |
| `id` | `edbb662e-7e0b-490b-9ce4-0aeb87406796` |

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Opportunity removed from saved",
  "data": null
}
```

**Response `401 Unauthorized`:**

```json
{
  "success": false,
  "message": "Missing or invalid Authorization header",
  "data": null
}
```

---

## Trainings

### GET /trainings

List all approved training programmes. Supports search, filtering, and pagination. Featured programmes are always sorted first.

**Auth:** None

**Query Params:**

| Key              | Type    | Example       | Description                                               |
| ---------------- | ------- | ------------- | --------------------------------------------------------- |
| `search`         | string  | `tony`        | Keyword search across name, provider, description, topics |
| `programme_type` | enum    | `accelerator` | Filter by programme type                                  |
| `format`         | enum    | `online`      | Delivery format                                           |
| `cost_type`      | enum    | `paid`        | Cost category                                             |
| `duration_range` | enum    | `lt_1_week`   | Duration bucket                                           |
| `location_scope` | enum    | `nigeria`     | Geographic scope                                          |
| `is_featured`    | boolean | `false`       | Show only featured programmes                             |
| `page`           | number  | `1`           | Page number (default: 1)                                  |
| `limit`          | number  | `10`          | Items per page (default: 10, max: 100)                    |

**`programme_type` values:** `accelerator`, `bootcamp`, `workshop`, `online_course`, `mentorship_programme`

**`format` values:** `online`, `in_person`, `hybrid`

**`cost_type` values:** `free`, `paid`, `sponsored`

**`duration_range` values:** `lt_1_week`, `1_4_weeks`, `1_3_months`, `3_plus_months`, `self_paced`

**`location_scope` values:** `nigeria`, `africa`, `global`, `online`

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Training programmes retrieved successfully",
  "data": [
    {
      "id": "00c5a65c-81f7-4c80-bd87-db88b38f9531",
      "reference_code": "TRN-001",
      "programme_name": "Tony Elumelu Foundation — Entrepreneurship Training",
      "provider": "Tony Elumelu Foundation",
      "programme_type": "accelerator",
      "format": "online",
      "duration_range": "1_3_months",
      "cost": null,
      "currency": "NGN",
      "cost_type": "free",
      "certification": "Certificate of Completion",
      "topics_covered": "Business planning, financial management, marketing, pitching",
      "location": "Online (Africa-wide)",
      "location_scope": "africa",
      "application_deadline": "2026-03-31",
      "apply_url": "https://...",
      "is_featured": true,
      "description": "...",
      "created_at": "2026-03-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### GET /trainings/:id

Get a single approved training programme by ID.

**Auth:** None

**Path Variable:**

| Key  | Example                                |
| ---- | -------------------------------------- |
| `id` | `00c5a65c-81f7-4c80-bd87-db88b38f9531` |

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Training programme retrieved successfully",
  "data": { ...full training programme object... }
}
```

**Response `404 Not Found`:**

```json
{
  "success": false,
  "message": "Training programme not found",
  "data": null
}
```

---

## Constants

### GET /meta

Returns all enum values used for filter dropdowns. Call this once on app load to populate filter UI.

**Auth:** None

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "Meta retrieved successfully",
  "data": {
    "opportunity_types": [
      "grant_ngo",
      "grant_government",
      "angel_investment",
      "accelerator",
      "loan",
      "microfinance",
      "vc",
      "prize_money"
    ],
    "listing_statuses": ["open", "rolling_applications", "closed"],
    "training_formats": ["online", "in_person", "hybrid"],
    "programme_types": [
      "accelerator",
      "bootcamp",
      "workshop",
      "online_course",
      "mentorship_programme"
    ],
    "cost_types": ["free", "paid", "sponsored"],
    "duration_ranges": [
      "lt_1_week",
      "1_4_weeks",
      "1_3_months",
      "3_plus_months",
      "self_paced"
    ],
    "location_scopes": ["nigeria", "africa", "global", "online"],
    "institution_types": [
      "commercial_bank",
      "development_bank",
      "microfinance_bank",
      "fintech",
      "government",
      "ngo"
    ],
    "sectors": [
      {
        "slug": "agriculture_food",
        "display_name": "Agriculture & Food Processing"
      },
      {
        "slug": "beauty_personal_care",
        "display_name": "Beauty & Personal Care"
      },
      { "slug": "creative_industries", "display_name": "Creative Industries" },
      { "slug": "cross_sector", "display_name": "Cross-sector / General" },
      { "slug": "education_edtech", "display_name": "Education & EdTech" },
      { "slug": "fashion_textiles", "display_name": "Fashion & Textiles" },
      {
        "slug": "financial_services_fintech",
        "display_name": "Financial Services & Fintech"
      },
      { "slug": "health_wellness", "display_name": "Health & Wellness" },
      {
        "slug": "logistics_distribution",
        "display_name": "Logistics & Distribution"
      },
      {
        "slug": "manufacturing_production",
        "display_name": "Manufacturing & Production"
      },
      { "slug": "retail_ecommerce", "display_name": "Retail & E-Commerce" },
      {
        "slug": "technology_digital",
        "display_name": "Technology & Digital Services"
      },
      { "slug": "tourism_hospitality", "display_name": "Tourism & Hospitality" }
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

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "data": null
}
```

| Status | Meaning                                 |
| ------ | --------------------------------------- |
| `400`  | Bad request — malformed input           |
| `401`  | Unauthorized — missing or invalid token |
| `404`  | Resource not found                      |
| `422`  | Validation error (e.g. duplicate email) |
| `429`  | Rate limit exceeded                     |
| `500`  | Internal server error                   |

**Rate limits:**

- Auth endpoints (`/auth/*`): 10 requests / 15 min per IP
- All other endpoints: 100 requests / 15 min per IP
