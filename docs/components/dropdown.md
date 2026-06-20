# Dropdown Component

**File:** `client/shared/components/dropdown/dropdown.js`
**CSS:** `client/shared/components/dropdown/dropdown.css`

A custom dropdown (not a native `<select>`). Renders a styled trigger button and a floating panel with options. Supports keyboard dismissal, click-outside-to-close, and active selection state.

---

## API — `Dropdown.create(options)` → HTMLElement

Returns a `div.dropdown-wrapper`.

| Option | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `'Select'` | Trigger text when nothing is selected |
| `options` | `Array<{ value, label }>` | `[]` | The list of options |
| `name` | `string` | — | Stored as `data-name` on wrapper, for form identification |
| `selected` | `string` | — | Pre-selected option value |
| `onChange` | `Function(value, label)` | — | Called when an option is picked |
| `className` | `string` | `''` | Extra class(es) on the wrapper |

---

## Examples

```js
// Basic filter dropdown
Dropdown.create({
  label: 'Cost',
  options: [
    { value: 'free',      label: 'Free' },
    { value: 'paid',      label: 'Paid' },
    { value: 'sponsored', label: 'Sponsored' },
  ],
  onChange: (value) => applyFilter('cost', value),
})

// With a pre-selected value
Dropdown.create({
  label: 'Region',
  options: [
    { value: 'lagos',   label: 'Lagos' },
    { value: 'abuja',   label: 'Abuja' },
    { value: 'ph',      label: 'Port Harcourt' },
  ],
  selected: 'lagos',
  onChange: (value) => applyFilter('region', value),
})

// Multiple dropdowns for a filter bar
const filters = document.querySelector('.filter-bar');
['Sector', 'Status', 'Business stage', 'Region', 'Type'].forEach((label) => {
  filters.appendChild(Dropdown.create({ label, options: [] }));
});
```

---

## Behaviour

| Interaction | Result |
|---|---|
| Click trigger | Opens panel, closes any other open dropdown |
| Click option | Selects it, updates trigger label, closes panel, calls `onChange` |
| Click outside | Closes panel |
| `Escape` key | Closes panel, returns focus to trigger |
| Selected option | Gets `aria-selected="true"` and purple text |

---

## How to load

```html
<script src="/shared/components/dropdown/dropdown.js"></script>
```

`dropdown.css` is already imported via `main.css`.
