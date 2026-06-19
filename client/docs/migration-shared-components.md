# Shared components migration — shipped reference

Status: **SHIPPED** (2026-06-17). Nav and Footer deferred.
This document is the source of truth for the `src/components/ui/` library
and the design-token system. Update it alongside any structural change.

The original legacy code lived in `repository/client/shared/` (vanilla JS +
co-located CSS). It has been replaced by a React + Tailwind v4 + Radix
primitives library that follows shadcn/ui conventions.

---

## 1. What landed

| Area                                    | Where                                               |
| --------------------------------------- | --------------------------------------------------- |
| Design tokens + reset + base typography | `src/styles.css` (`@theme` block + `@layer base`)   |
| `cn()` helper                           | `src/lib/utils.ts`                                  |
| UI primitives + compounds               | `src/components/ui/*.tsx` (12 files, no barrel)     |
| Static images                           | `src/assets/images/` + `IMAGES` const in `index.ts` |
| Static icons / SVGs / logos             | `src/assets/svgs/` + `SVGS` const in `index.ts`     |

Snake-cased asset filenames were rewritten to kebab-case during the copy:
`world_2_fill.svg` → `world-2-fill.svg`, `calendar_2_fill.svg` →
`calendar-2-fill.svg`, `right_line.svg` → `right-line.svg`,
`arrow_left_line.png` → `arrow-left-line.png`.

---

## 2. Dependencies added

```
class-variance-authority
clsx
tailwind-merge
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-slot
```

No other runtime additions. `lucide-react` was already in place.

---

## 3. Design tokens — `src/styles.css`

All tokens are declared inside a single `@theme` block. Tailwind v4 auto-
generates utility classes from these CSS variables, so `bg-primary`,
`text-text-muted`, `border-border`, `font-serif` etc. work out of the box.

| Group           | Custom property                                                                                                 | Resulting Tailwind utility                              |
| --------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Purple scale    | `--color-purple-{25,50,…,950}`                                                                                  | `bg-purple-500`, `text-purple-700`, …                   |
| Neutral scale   | `--color-neutral-{50,…,950}`                                                                                    | `bg-neutral-200`, `text-neutral-700`, …                 |
| Semantic colors | `--color-primary`, `--color-primary-hover`, `--color-primary-active`, `--color-primary-subtle`, `--color-error` | `bg-primary`, `hover:bg-primary-hover`, `text-error`, … |
| Backgrounds     | `--color-bg-{base,subtle,muted,cta}`                                                                            | `bg-bg-subtle`, `bg-bg-muted`, …                        |
| Text            | `--color-text-{primary,secondary,muted,inverse,on-primary}`                                                     | `text-text-primary`, `text-text-muted`, …               |
| Borders         | `--color-border`, `--color-border-strong`                                                                       | `border-border`, `border-border-strong`                 |
| Fonts           | `--font-serif`, `--font-sans`, `--font-inter`                                                                   | `font-serif`, `font-sans`, `font-inter`                 |
| Layout          | `--nav-height`, `--container-{max,wide,small}`                                                                  | use directly in inline styles or arbitrary values       |

The `@layer base` block in the same file ports the global reset and base
typography from the legacy `reset.css` + `typography.css`. The 449-line
legacy `utilities.css` was **not** carried over — Tailwind utilities cover it.

> **Don't hard-code hex values in component files.** Add a token if a colour
> is missing.

---

## 4. Component reference

### Conventions

- Each component lives in its own `.tsx` file under `src/components/ui/` and
  is imported by its full path: `import { Button } from '#/components/ui/button'`.
- No barrel `index.ts` — explicit paths only.
- Variants are defined with `class-variance-authority` and exported alongside
  the component.
- Compound components are exported as a namespaced object via
  `Object.assign`: `Modal.Trigger`, `FormField.Label`, etc.
- All components use React 19's prop-based `ref` (no `forwardRef`).
- Context is consumed with `use(Context)`, not `useContext(Context)`.

### 4.1 Button — `button.tsx`

`Variants` (cva): `variant` ∈ `primary | secondary | outline | ghost`,
`size` ∈ `sm | md | lg`, `full` ∈ `true`. Defaults: `primary`, `md`.

`asChild` (Radix `Slot`) replaces the legacy `as="a"` prop.

```tsx
<Button>Apply</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button full>Submit</Button>

<Button asChild>
  <Link to="/signup">Sign up</Link>
</Button>
```

Icons pass as children: `<Button><Search size={16} /> Search</Button>`.

### 4.2 Input — `input.tsx`

`variant` ∈ `default | filled`. Forwards all native `<input>` props.

```tsx
<Input placeholder="Email address" type="email" />
<Input variant="filled" placeholder="Search…" />
```

### 4.3 PasswordInput — `password-input.tsx`

`Input` with a show/hide toggle (lucide `Eye` / `EyeOff`). State held locally.

```tsx
<PasswordInput placeholder="Password" name="password" variant="filled" />
```

### 4.4 Label — `label.tsx`

Plain `<label>` styled with token classes. Used directly or by `FormField.Label`.

### 4.5 Textarea — `textarea.tsx`

Plain `<textarea>` styled to match `Input`. Defaults to `rows={5}`.

### 4.6 Select — `select.tsx`

Native `<select>` with a `lucide` chevron decoration and built-in
disabled-hidden placeholder option.

```tsx
<Select name="cost" placeholder="Cost">
  <option value="free">Free</option>
  <option value="paid">Paid</option>
</Select>
```

### 4.7 Checkbox — `checkbox.tsx`

Plain `<input type="checkbox">` with token styling. Compose with `Label`
manually:

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">I agree</Label>
</div>
```

### 4.8 FormField — `form-field.tsx` (compound)

Replaces the legacy 5-way `type=` switch with composition. Provider holds
`id`, `required`, `hasError`, `errorId`, `descriptionId`.

`FormField.Control` injects `id` and `aria-*` attributes into its single
child via Radix `Slot`. The caller still passes `name` and `type` to the
input directly — only field-level wiring is auto-injected.

```tsx
<FormField name="email" required error={errors.email}>
  <FormField.Label>Email</FormField.Label>
  <FormField.Control>
    <Input type="email" name="email" required placeholder="you@example.com" />
  </FormField.Control>
  <FormField.Description>We never share this.</FormField.Description>
  <FormField.Error /> {/* renders automatically when `error` prop is set */}
</FormField>
```

Subcomponents: `Label`, `Control`, `Description`, `Error`.

### 4.9 Modal — `modal.tsx` (Radix Dialog)

Backdrop click + Escape handled by Radix. The legacy imperative
`new Modal({...}).open()` API is gone — modals are now controlled or
trigger-driven.

```tsx
<Modal>
  <Modal.Trigger asChild>
    <Button>Confirm</Button>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Title>Delete submission?</Modal.Title>
    <Modal.Description>This cannot be undone.</Modal.Description>
    <Modal.Footer>
      <Modal.Close asChild>
        <Button variant="ghost">Cancel</Button>
      </Modal.Close>
      <Button variant="primary">Delete</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>
```

Subcomponents: `Trigger`, `Content` (accepts `hideClose`), `Title`,
`Description`, `Footer`, `Close`.

### 4.10 Dropdown — `dropdown.tsx` (Radix DropdownMenu)

Replaces the global document-click listener with Radix's outside-click
handling. The trigger renders a chevron by default (`showChevron`).

```tsx
<Dropdown>
  <Dropdown.Trigger>Cost</Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item onSelect={() => set('free')}>Free</Dropdown.Item>
    <Dropdown.Item onSelect={() => set('paid')}>Paid</Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item onSelect={() => set(null)}>Clear</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

Subcomponents: `Trigger`, `Content`, `Item`, `Label`, `Separator`, `Group`.

### 4.11 SearchBar — `search-bar.tsx`

Form-driven. Submission flows through one path so Enter and click behave
identically.

```tsx
<SearchBar
  placeholder="Search 30+ funding opportunities"
  onSearch={(value) => navigate({ to: '/opportunities', search: { q: value } })}
/>
```

### 4.12 Skeleton — `skeleton.tsx`

Primitive `<Skeleton />` plus named variant components:
`OpportunitySkeleton`, `TrainingSkeleton`, `GuideSkeleton`,
`TemplateSkeleton`. Callers render the variant directly — no
string-keyed `render('opportunity', 3)`.

```tsx
{
  isLoading
    ? Array.from({ length: 3 }, (_, i) => <OpportunitySkeleton key={i} />)
    : opportunities.map((o) => <OpportunityCard key={o.id} {...o} />)
}
```

---

## 5. Assets

```ts
import { IMAGES } from '#/assets/images'
import { SVGS } from '#/assets/svgs'

<img src={IMAGES.heroDisplay} alt="…" />
<img src={SVGS.ekehiLogo} alt="Ekehi" />
```

| Const    | Members                                                                                                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IMAGES` | `blackWomanWearingGlasses`, `ctaSectionDisplay`, `headerImg`, `heroDisplay`, `offeringsDisplay`, `timeVector`, `valuePropositionDisplay`                                      |
| `SVGS`   | `arrowLeftLine`, `bottomLeftDeco`, `bottomRightDeco`, `calendar2Fill`, `ekehiLogo`, `ekehiLogo2`, `flower`, `logo2`, `rightLine`, `topLeftDeco`, `topRightDeco`, `world2Fill` |

Both are typed `as const`. Vite hashes the URLs at build time.

---

## 6. Composition patterns applied

- **No boolean prop sprawl.** `Button.asChild` (Radix `Slot`) instead of
  `as="a" | "button"`.
- **Compound components** for `FormField`, `Modal`, `Dropdown` — internals
  share state via context; the caller composes the visual structure.
- **Explicit variant components** for skeletons rather than a string key.
- **Decoupled state interface.** `FormField` provider exposes
  `{ id, required, hasError, errorId, descriptionId }` — subcomponents
  don't know how state is managed.
- **React 19 APIs.** `use(Context)` not `useContext`. Refs flow as props.

---

## 7. Out of scope / follow-up

In rough order of priority:

1. Port `components/nav` to React — depends on `useAuth()` hook + TanStack
   Router `Link`.
2. Port `components/footer` to React.
3. Port `services/api.js` to `src/services/api.ts` (the worktree already
   has `src/lib/api/*` — confirm overlap before duplicating).
4. Port `services/auth.service.js` to a typed service + `useAuth()` hook.
5. Port `constants/enums.js` to `src/constants/enums.ts`.
6. Port `utils/opportunity.utils.js` to `src/lib/format.ts`
   (`formatAmount`, `daysUntil`, `humanize`, `formatDate`, `buildQueryString`).
7. Decide the fate of `admin.utils.js`: pure helpers move to `src/lib/admin.ts`;
   `guardAdmin` becomes a route `beforeLoad`; `renderSidebar` becomes
   `AdminSidebar.tsx` once admin features land.

---

## 8. Known IDE noise (not a real error)

- `styles.css:3` — `Unknown at rule @theme`. The CSS language server doesn't
  recognize Tailwind v4's `@theme` directive. Vite compiles it correctly.
  Safe to ignore.
