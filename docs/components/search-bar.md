# SearchBar Component

**File:** `client/shared/components/search-bar/search-bar.js`
**CSS:** `client/shared/components/search-bar/search-bar.css`

A search input with an attached purple Search button. Used on the opportunities and training pages.

---

## API — `SearchBar.create(options)` → HTMLElement

Returns a `div.search-bar`.

| Option | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `''` | Input placeholder |
| `buttonLabel` | `string` | `'Search'` | Button text |
| `name` | `string` | — | Input name |
| `onSearch` | `Function(value: string)` | — | Called on button click or Enter key |
| `className` | `string` | `''` | Extra class(es) on the wrapper |

---

## Examples

```js
// Opportunities page
SearchBar.create({
  placeholder: 'Search 30+ funding opportunities',
  onSearch: (query) => fetchOpportunities({ query }),
})

// Training page
SearchBar.create({
  placeholder: 'Search 20+ training resources',
  onSearch: (query) => fetchTraining({ query }),
})
```

---

## Behaviour

- Clicking the Search button fires `onSearch(value)`
- Pressing `Enter` inside the input fires `onSearch(value)`
- The border highlights on focus (`:focus-within` on wrapper)

---

## How to load

```html
<script src="/shared/components/search-bar/search-bar.js"></script>
```

`search-bar.css` is already imported via `main.css`.
