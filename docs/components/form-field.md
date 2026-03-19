# FormField Component

**File:** `client/shared/components/form-field/form-field.js`
**CSS:** `client/shared/components/form-field/form-field.css`

A labelled form control. Wraps `Input`, `<select>`, `<textarea>`, or `<input type="checkbox">` with a visible label and required indicator. Use this for all form fields — it keeps label/input pairing consistent and accessible.

---

## API

### `FormField.create(options)` → HTMLElement

Returns a `div.form-field` containing a `<label>` and the appropriate control. For checkboxes, returns `div.form-field.form-field--checkbox` with the label placed after the input.

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Sets `name` and `id` on the control — required for label association |
| `label` | `string` | — | Visible label text |
| `type` | `string` | `'text'` | Control type — see supported types below |
| `required` | `boolean` | `false` | Appends a red `*` to the label; sets `required` on the control |
| `placeholder` | `string` | `''` | Placeholder text (inputs and textarea) |
| `options` | `string[]` | `[]` | Option values for `select` type |
| `value` | `string` | `''` | Pre-filled value |
| `rows` | `number` | `5` | Row count for `textarea` |

---

## Supported types

| `type` | Renders | Notes |
|---|---|---|
| `'text'`, `'email'`, `'number'`, `'url'`, `'date'`, `'tel'` | `Input.create()` | Uses the shared Input component |
| `'select'` | `<select>` | Requires `options` array; first option is always a "Select…" placeholder |
| `'textarea'` | `<textarea>` | Configurable via `rows` |
| `'checkbox'` | `<input type="checkbox">` | Label rendered inline after the checkbox; ignores `required` |

---

## Examples

```js
// Text input
FormField.create({ name: 'title', label: 'Title', required: true })

// Select
FormField.create({
  name: 'type',
  label: 'Opportunity Type',
  type: 'select',
  required: true,
  options: ['grant', 'loan', 'equity'],
})

// Textarea with more rows
FormField.create({
  name: 'body',
  label: 'Content',
  type: 'textarea',
  required: true,
  rows: 10,
})

// Checkbox (inline label)
FormField.create({ name: 'is_equity_free', label: 'Equity-free', type: 'checkbox' })

// Two fields side by side (wrap in a .form-row div)
const row = document.createElement('div');
row.className = 'form-row';
row.appendChild(FormField.create({ name: 'amount_min', label: 'Min Amount', type: 'number' }));
row.appendChild(FormField.create({ name: 'amount_max', label: 'Max Amount', type: 'number' }));
```

---

## How to load

```js
import FormField from '/shared/components/form-field/form-field.js';
```

`form-field.css` is already imported via `main.css` — no separate link needed.
