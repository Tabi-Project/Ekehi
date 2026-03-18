# Code Review: Clean Code & Modern JS Patterns

## Context
Full audit of the Ekehi client and server codebase against:
- Clean Code / SOLID / DRY principles
- Modern JavaScript patterns (ES6+)
- Performance & security

---

## Findings

### 🔴 High Priority (Bugs / Security / DRY violations)

#### 1. `EKEHI_ENUMS` exists but is never used (DRY violation)
- **File**: `client/shared/constants/enums.js`
- **Problem**: `opportunities.js` and `resources.js` hardcode dropdown option arrays inline, duplicating values from `enums.js`. If a slug changes server-side, it must be updated in 3 places.
- **Fix**: Generate dropdown `options` arrays from `EKEHI_ENUMS` keys:
  ```js
  Object.entries(EKEHI_ENUMS.programmeType).map(([value, label]) => ({ value, label }))
  ```

#### 2. `closingSoon` in `opportunities.js` duplicates `daysUntil` logic
- **File**: `client/opportunities/opportunities.js`
- **Problem**: Hardcodes `86_400_000` and re-calculates diff — same formula already in `opportunity.utils.js:daysUntil`.
- **Fix**: Export a `diffDays(dateInput)` helper from `opportunity.utils.js`. Use it in both `daysUntil` and `closingSoon`.

#### 3. `formatDuration` in `resources.js` duplicates `EKEHI_ENUMS.durationRange`
- **File**: `client/resources/resources.js`
- **Problem**: A local map object with identical values to `EKEHI_ENUMS.durationRange`. Dead code — never called in `renderTrainingCard`.
- **Fix**: Remove `formatDuration`. Import `EKEHI_ENUMS`; use `EKEHI_ENUMS.durationRange[range] ?? range ?? '—'` if needed.

#### 4. `AuthService.login()` doesn't use `_storeSession` (DRY)
- **File**: `client/shared/services/auth.service.js`
- **Problem**: `login()` manually sets tokens while `signup()` delegates to `_storeSession()`.
- **Fix**: `login()` calls `AuthService._storeSession(body.data)`.

#### 5. XSS risk in `detail.js`
- **File**: `client/opportunities/detail/detail.js`
- **Problem**: `opp.description` and `opp.eligibility_criteria` injected directly into `innerHTML`.
- **Fix**: Add `escapeHtml(str)` helper; apply to all user-supplied text fields before inserting into template literals.

#### 6. Dropdown registers a new `document` click listener per instance (memory leak)
- **File**: `client/shared/components/dropdown/dropdown.js`
- **Problem**: Every `Dropdown.create()` call adds another `document.addEventListener('click', ...)`. With 5 dropdowns, 5 listeners fire on every global click.
- **Fix**: Add a static `#listenerRegistered` flag; register the global close-on-outside-click listener only once.

---

### 🟡 Medium Priority (UX / Consistency)

#### 7. No loading/disabled state during form submit
- **Files**: `client/login/login.js`, `client/signup/signup.js`
- **Problem**: Submit button stays enabled during async call — users can double-submit.
- **Fix**: Disable button before `await`, re-enable in `finally`.

#### 8. `resources.js` sets `list.className` on every load
- **File**: `client/resources/resources.js`
- **Problem**: `list.className = 'trainings-grid'` inside `loadTrainings()` on every fetch.
- **Fix**: Lift `list` reference to module scope; set class once at init.

#### 9. Inconsistent function style in `nav.js`
- **File**: `client/shared/components/nav/nav.js`
- **Problem**: `#attachEventListeners` mixes `function` declarations and references to closures inconsistently.
- **Fix**: Use arrow functions consistently for all internal helpers.

---

### 🟢 Server-side (Backend)

#### 10. Fragile boolean query-param coercion
- **Files**: `server/src/services/opportunities.service.js`, `server/src/services/training.service.js`
- **Problem**: `is_women_only === "true" || is_women_only === true` duplicated in both services.
- **Fix**: Extract `parseBool(val)` in `response.utils.js`.

#### 11. Filter-chain duplication across services
- **Files**: Both service files build Supabase queries in identical patterns.
- **Fix**: Both services now call `parseBool` from shared utils. Full `applyFilters` abstraction deferred — services differ enough in field names/operators that a generic helper adds indirection without meaningful reduction.

---

## Files Modified

| File | Changes |
|------|---------|
| `client/shared/utils/opportunity.utils.js` | Export `diffDays` helper; refactor `daysUntil` to use it |
| `client/opportunities/opportunities.js` | Use `EKEHI_ENUMS` for Type/Status dropdowns; fix `closingSoon` to use `diffDays` |
| `client/resources/resources.js` | Use `EKEHI_ENUMS` for all dropdowns; remove `formatDuration`; lift `list` to module scope |
| `client/shared/services/auth.service.js` | Use `_storeSession` in `login()` |
| `client/opportunities/detail/detail.js` | Add `escapeHtml`; apply to description and eligibility_criteria |
| `client/shared/components/dropdown/dropdown.js` | Single shared document click listener via static flag |
| `client/login/login.js` | Disable button during submit |
| `client/signup/signup.js` | Disable button during submit |
| `client/shared/components/nav/nav.js` | Consistent arrow functions in `#attachEventListeners` |
| `server/src/utils/response.utils.js` | Add `parseBool` helper |
| `server/src/services/opportunities.service.js` | Use `parseBool` |
| `server/src/services/training.service.js` | Use `parseBool` |

---

## What's Already Good ✅

- ES modules throughout
- Private class fields (`#`) in components
- `DocumentFragment` in `contributors.js` for batch DOM updates
- `formatterCache` Map for expensive `Intl.NumberFormat`
- `buildQueryString` using `URLSearchParams`
- Accessibility attributes (aria-*) in all interactive components
- `async/await` with proper `try/catch` everywhere
- Auth token cleanup in `api.js` on 401
- `requireAuth` middleware correctly isolates auth from service-role client
- Clean Route → Controller → Service → Supabase layering on server

---

## Verification

After changes:
1. Open `opportunities/` page — dropdowns still populate and filter correctly
2. Open `resources/` page — dropdowns still filter, duration labels render
3. Login with valid credentials → redirected, no double-submit possible
4. Signup with valid credentials → redirected, no double-submit possible
5. Open opportunity detail → description renders as escaped plain text (no HTML injected)
6. Click outside dropdown → closes (single listener, no growing listener stack)
