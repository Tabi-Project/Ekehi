# Nav Component

**File:** `client/shared/components/nav/nav.js`
**CSS:** `client/shared/components/nav/nav.css`

A self-mounting navigation component. Renders the site header nav into a `#nav-root` element and handles mobile menu behaviour.

---

## Usage

Every page includes it the same way — no configuration needed per page:

```html
<nav id="nav-root" class="nav" aria-label="Main navigation"></nav>

<script src="/shared/components/nav/nav.js"></script>
```

The script auto-mounts on load. `#nav-root` is replaced with the full nav markup.

---

## Configuration — `NAV_CONFIG`

All nav content is controlled by the `NAV_CONFIG` object at the top of `nav.js`.

```js
const NAV_CONFIG = {
  logo: {
    href: '/',
    src: '/assets/icons/ekehi-logo.png',
    alt: 'Ekehi',
    wordmark: 'ekehi',
  },
  links: [
    { href: '/contributors/', label: 'Contributors' },
  ],
  cta: {
    signup: { href: '/signup/', label: 'Sign up' },
    login:  { href: '/login/',  label: 'Log in'  },
  },
};
```

### Adding a nav link

Add an entry to `links`:

```js
links: [
  { href: '/opportunities/', label: 'Browse Funding' },
  { href: '/contributors/',  label: 'Contributors'   },
],
```

---

## Active link detection

`#isActive(href)` compares `href` against `window.location.pathname`. A link gets `aria-current="page"` when the pathname matches or starts with the link's href.

```
Current page: /contributors/profile
Link href:    /contributors/
→ active ✅  (pathname starts with href)
```

---

## Mobile menu

The hamburger toggle is shown below 768px. Behaviour:

- Click toggle → opens menu
- Click outside menu → closes
- Press `Escape` → closes, returns focus to toggle
- Click a nav link → closes
- Resize above 768px → closes

All managed by `#attachEventListeners()` — no external dependencies.

---

## Design pattern

`NavComponent` uses **private instance methods** (ES2022):

```
NavComponent
├── #isActive()              private — checks if a link matches the current URL
├── #buildLogo()             private — renders logo anchor
├── #buildNavLinks()         private — renders <ul> of links + mobile CTA
├── #buildDesktopCTA()       private — renders desktop sign up / log in
├── #buildToggle()           private — renders hamburger button
├── #buildHTML()             private — composes all parts into final HTML string
├── #attachEventListeners()  private — wires up mobile menu interactions
└── mount(selector)          public  — the only method called externally
```

---

## Adding a new component that needs the nav

1. Add `id="nav-root"` to your HTML
2. Add the `nav.js` script tag before `</body>`

No JS configuration is needed in your page — the component is self-contained.
