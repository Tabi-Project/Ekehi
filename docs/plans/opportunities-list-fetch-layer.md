# Plan: Opportunities list fetch layer

## Task
Plug the data layer for `GET /opportunities` into `client/src/features/opportunities/` and wire the list page to real data. Server response is the standard envelope: `{ success, message, data: OpportunityListItem[], meta: PaginationMeta }`.

Server query params (from `server/src/modules/opportunities/opportunities.schema.ts`): `search`, `opportunity_type`, `sector`, `stage`, `country`, `status`, `is_women_only`, `page`, `limit`.

## Files

1. `client/src/lib/api/types.ts` — add shared `PaginationMeta` type (page, limit, total, totalPages, hasNextPage, hasPrevPage). Re-export from `client/src/lib/api/index.ts`. Shared because training/guides lists use the same meta shape.
2. `client/src/features/opportunities/opportunities.types.ts` — add `opportunityListItemSchema` derived via `opportunityDetailSchema.omit({ updated_at, is_saved, sector, stage })`, plus `OpportunityListItem` and `OpportunityListFilters` types.
3. `client/src/features/opportunities/opportunities.service.ts` — add `OpportunitiesService.list(filters)` using `makeRequest<OpportunityListItem[], OpportunityListFilters, PaginationMeta>(ENDPOINTS.opportunities.list, 'GET')` (GET data becomes query params in `buildUrl`).
4. `client/src/features/opportunities/opportunities.query.ts` — add `opportunityKeys.list(filters)` and `useOpportunitiesQuery(filters)` returning `{ data, meta }`, with `placeholderData: keepPreviousData` for pagination/filter UX.
5. `client/src/lib/format.ts` — add `isClosingSoon(deadline, thresholdDays = 7)`.
6. `client/src/lib/format.test.ts` — gate tests for `isClosingSoon`.
7. `client/src/features/opportunities/opportunities.types.test.ts` — gate test: real sample list payload item parses with `opportunityListItemSchema` (contract check).
8. `client/src/features/opportunities/components/opportunity-row-card.tsx` — take `opportunity: OpportunityListItem` prop, render amount (`formatAmount`), type (`humanize`), title, funder, "Closing Soon" badge (`isClosingSoon`), days-left (`daysUntil`), and link the card to `/opportunities/$id`.
9. `client/src/features/opportunities/pages/opportunities-page.tsx` — wire `useOpportunitiesQuery`; search input as a form driving the `search` param; count from `meta.total`; loading/error/empty states; Previous/Next pagination from `meta`.

## Filter selects (done in follow-up pass)
Label maps ported from `old/client/shared/constants/enums.js` to `client/src/constants/enums.ts` (`EKEHI_ENUMS`, `toOptions`, `enumLabel`), matching the old page's wiring in `old/client/opportunities/opportunities.js`:
- Five filters driven by a `FILTER_SELECTS` config: `sector`, `status`, `stage`, `country` (labelled "Region"), `opportunity_type` (labelled "Type").
- Any filter change resets to page 1.
- Row card shows the mapped type label (`Grant (NGO / Foundation)`) with `humanize` fallback.
- Gate tests in `enums.test.ts` pin `opportunityType`/`listingStatus` keys to the server enums in `server/src/models/enums.ts`.

## Filter dropdown UI (third pass)
Replicates the legacy custom dropdown (`old/client/shared/components/dropdown/`) instead of native selects:
- `client/src/components/ui/filter-dropdown.tsx` — `FilterDropdown` composes the existing Radix `Dropdown` compound (`components/ui/dropdown.tsx`) rather than recreating open/close, Escape, and outside-click handling. Props: `label`, `options`, `value: string | null`, `onChange(value: string | null)`, `name?`, `className?`.
- Legacy styling translated to tokens: trigger `border-[1.5px] px-4 py-3 text-base gap-4`, open state gets a 3px `primary-subtle` ring (border-primary + chevron rotate come from the base Dropdown), selected state is `text-primary font-semibold`; panel is trigger-width min, `border-[1.5px] shadow-lg py-2`, options `px-6 py-3 text-base` with selected highlight.
- Deselect-on-reclick: picking the already-selected option calls `onChange(null)` — replaces the explicit `All` option from the second pass.
- `opportunities-page.tsx` swaps `Select` for `FilterDropdown`; `handleFilterChange` now takes `string | null`.
- Gate tests in `filter-dropdown.test.tsx` (Radix pointerdown pattern from `navbar.test.tsx`): label/selected-label rendering, panel opens with options, select fires `onChange(value)`, re-click fires `onChange(null)`, panel closes after pick.
- `components/ui/select.tsx` stays untouched — still used by `submit-opportunity-page.tsx`.

## Out of scope (follow-up)
- Saved tab (`/opportunities/saved`) from the old page — needs auth-gated tab UI.
- Old page used a 10-day closing-soon threshold and showed humanized status as a badge otherwise; current card uses 7 days and shows the badge only when closing soon.

## Evals
No LLM involvement — deterministic feature, gate tests only.
