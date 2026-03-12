# Button Component

**File:** `client/shared/components/button/button.js`
**CSS:** `client/shared/components/button/button.css`

A static factory that creates styled button elements. Supports all variants, sizes, icons, and rendering as a link.

---

## Usage

```js
// In any page script, after button.js is loaded:
const btn = Button.create({ label: 'Sign up', variant: 'primary' });
document.querySelector('#some-container').appendChild(btn);
```

---

## API — `Button.create(options)`

Returns an `HTMLElement` (`<button>` or `<a>`).

| Option | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `''` | Button text |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `as` | `'button' \| 'a'` | `'button'` | Rendered element |
| `href` | `string` | — | URL — required when `as: 'a'` |
| `icon` | `string \| HTMLElement` | — | SVG string or element |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon placement relative to label |
| `full` | `boolean` | `false` | Full-width button |
| `disabled` | `boolean` | `false` | Disabled state |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type |
| `onClick` | `Function` | — | Click event handler |

---

## Examples

### Variants

```js
Button.create({ label: 'Join the network', variant: 'primary' });
Button.create({ label: 'Learn more',       variant: 'secondary' });
Button.create({ label: 'View details',     variant: 'outline' });
Button.create({ label: 'Cancel',           variant: 'ghost' });
```

### Sizes

```js
Button.create({ label: 'Small',   variant: 'primary', size: 'sm' });
Button.create({ label: 'Default', variant: 'primary' });             // md
Button.create({ label: 'Large',   variant: 'primary', size: 'lg' });
```

### With icon (SVG string)

```js
const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12h14M12 5l7 7-7 7"/>
</svg>`;

// Icon on the left (default)
Button.create({ label: 'Next', icon: arrowIcon });

// Icon on the right
Button.create({ label: 'Next', icon: arrowIcon, iconPosition: 'right' });
```

### Rendered as a link

```js
Button.create({ label: 'Sign up', variant: 'primary', as: 'a', href: '/signup/' });
Button.create({ label: 'Learn more', variant: 'outline', as: 'a', href: '#about' });
```

### Form submit button

```js
Button.create({ label: 'Submit', type: 'submit', full: true });
```

### With click handler

```js
Button.create({
  label: 'Log out',
  variant: 'ghost',
  onClick: () => authService.logout(),
});
```

---

## How to load it

Add the script to your page **before** any script that calls `Button.create()`:

```html
<script src="/shared/components/button/button.js"></script>
<script src="/your-page/your-page.js"></script>
```

`button.js` is not auto-executed — it only exposes the `Button` class. Nothing renders until you call `Button.create()`.

---

## Design pattern

`Button` uses a **static factory with private helpers** (ES2022 class fields).

```
Button
├── #VARIANTS, #SIZES      private constants — guard invalid values
├── #buildClasses()        private — assembles the CSS class string
├── #buildIcon()           private — wraps SVG in .btn__icon span
└── create()               public — the only method you call
```

`#` methods cannot be called from outside the class. They are internal implementation details. If you're extending the component, only modify what's inside the class — the public API (`create`) stays stable.

---

## Adding a new variant

1. Add the CSS modifier in `button.css`:

```css
/* Modifier — Destructive */
.btn--destructive {
  --btn-bg: var(--color-error);
  --btn-color: white;
  /* ... */
}
```

2. Add the variant name to `#VARIANTS` in `button.js`:

```js
static #VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive'];
```

That's it. `Button.create({ variant: 'destructive' })` now works.
