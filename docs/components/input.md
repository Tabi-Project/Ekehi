# Input Component

**File:** `client/shared/components/input/input.js`
**CSS:** `client/shared/components/input/input.css`

A general-purpose text input with an optional right-side icon. Includes a built-in password factory that handles the eye toggle automatically.

---

## API

### `Input.create(options)` → HTMLElement

Returns a `div.input-wrapper` containing an `<input>` and optional icon button.

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `string` | `'text'` | Native input type |
| `placeholder` | `string` | `''` | Placeholder text |
| `name` | `string` | — | Input name |
| `id` | `string` | — | Input id |
| `value` | `string` | — | Initial value |
| `variant` | `'default' \| 'filled'` | `'default'` | Visual style |
| `icon` | `string` | — | SVG string shown on the right |
| `iconLabel` | `string` | `'Action'` | `aria-label` for the icon button |
| `iconAction` | `Function` | — | Click handler for the icon button |
| `disabled` | `boolean` | `false` | |
| `required` | `boolean` | `false` | |
| `className` | `string` | `''` | Extra class(es) on `<input>` |

### `Input.createPassword(options)` → HTMLElement

Shortcut for password fields. Wires the eye icon to toggle visibility automatically.

| Option | Type | Default |
|---|---|---|
| `placeholder` | `string` | `''` |
| `name` | `string` | — |
| `id` | `string` | — |
| `variant` | `'default' \| 'filled'` | `'filled'` |
| `className` | `string` | `''` |

---

## Variants

| Variant | Use case | Appearance |
|---|---|---|
| `default` | Search, filters, general forms | White bg, visible border |
| `filled` | Auth forms (login, signup) | Gray bg, no border — border appears on focus |

---

## Examples

```js
// Standard text input
Input.create({ placeholder: 'Email address', type: 'email', name: 'email' })

// Filled variant (auth forms)
Input.create({ placeholder: 'Your name', variant: 'filled' })

// Password with eye toggle (variant defaults to 'filled')
Input.createPassword({ placeholder: 'Password', name: 'password' })
Input.createPassword({ placeholder: 'Confirm password', name: 'confirm_password' })

// Input with a custom icon
const clearIcon = `<svg>...</svg>`;
Input.create({
  placeholder: 'Search',
  icon: clearIcon,
  iconLabel: 'Clear input',
  iconAction: () => { input.value = ''; },
})
```

---

## How to load

```html
<script src="/shared/components/input/input.js"></script>
```

`input.css` is already imported via `main.css` — no separate link needed.
