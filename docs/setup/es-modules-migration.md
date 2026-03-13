# ES Modules Migration Plan

## Goal
Convert all client-side JS from globals + ordered `<script>` tags to native ES modules (`import`/`export`). This removes the need to repeat `api.js` and `auth.service.js` on every page and eliminates implicit ordering requirements.

## Dependency Graph (after migration)

```
api.js
  └── auth.service.js
        └── nav.js (also imports button.js)

button.js       ← standalone
input.js        ← standalone
dropdown.js     ← standalone
search-bar.js   ← standalone
footer.js       ← standalone
enums.js        ← standalone

Page scripts import only what they use
```

## Changes Per File

### Shared services
| File | Change |
|------|--------|
| `api.js` | Remove CJS compat block → `export default api` |
| `auth.service.js` | `import api` → Remove CJS compat block → `export default AuthService` |

### Shared components
| File | Change |
|------|--------|
| `button.js` | `export default Button` |
| `input.js` | `export default Input` |
| `dropdown.js` | `export default Dropdown` |
| `search-bar.js` | `export default SearchBar` |
| `nav.js` | `import Button, AuthService` → use them directly → auto-mounts on import |
| `footer.js` | No imports needed → auto-mounts on import |
| `enums.js` | Remove `window.EKEHI_ENUMS` → `export default EKEHI_ENUMS` |

### Page scripts (add imports, remove global references)
| File | Imports |
|------|---------|
| `landing/landing.js` | `Button`, nav, footer |
| `login/login.js` | `AuthService`, `Button`, `Input`, nav, footer |
| `signup/signup.js` | `Button`, `Input`, nav, footer |
| `opportunities/opportunities.js` | `api`, `Dropdown`, `SearchBar`, nav, footer |
| `resources/resources.js` | `Dropdown`, `SearchBar`, nav, footer |
| `contributors/contributors.js` | nav, footer |

### HTML pages
Each page goes from many `<script>` tags to one:
```html
<script type="module" src="./page.js"></script>
```
`type="module"` is automatically deferred — no load-order issues.

## Notes
- ES modules are cached — `auth.service.js` imported by both `nav.js` and `login.js` evaluates only once.
- Auto-mounting in `nav.js` / `footer.js` runs as a side effect when the module is imported — no change needed in page scripts.
- `type="module"` scripts run after the DOM is parsed — `DOMContentLoaded` wrappers become unnecessary but harmless.
