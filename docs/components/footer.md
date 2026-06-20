# Footer Component

**File:** `client/shared/components/footer/footer.js`
**CSS:** `client/shared/components/footer/footer.css`

A self-mounting footer component. Renders the site footer into a `#footer-root` element.

---

## Usage

Every page includes it the same way:

```html
<footer id="footer-root" class="footer"></footer>

<script src="/shared/components/footer/footer.js"></script>
```

The script auto-mounts on load. `#footer-root` is filled with the full footer markup.

---

## Configuration — `FOOTER_CONFIG`

All footer content is controlled by the `FOOTER_CONFIG` object at the top of `footer.js`.

```js
const FOOTER_CONFIG = {
  brand: {
    href: '/',
    logo: { src: '/assets/icons/ekehi-logo.png', alt: 'Ekehi' },
    wordmark: 'ekehi',
    tagline: 'A searchable, continuously updated business resource centre...',
  },
  nav: [
    {
      heading: 'Explore',
      links: [
        { href: '/opportunities/', label: 'Browse funding' },
        // ...
      ],
    },
    // more nav groups...
  ],
  bottom: {
    copyright: '© 2026 Tabi Project (TEE Foundation)',
    note: 'Open Source & Open for Contributions',
    legal: [
      { href: '/privacy/', label: 'Privacy' },
      // ...
    ],
  },
};
```

### Adding a footer link

Find the relevant group in `nav` and add to its `links` array:

```js
{ heading: 'Explore', links: [
  { href: '/opportunities/', label: 'Browse funding' },
  { href: '/training/',      label: 'Training programmes' }, // new
]},
```

### Adding a nav group

Add a new object to the `nav` array:

```js
{ heading: 'Community', links: [
  { href: '/contributors/', label: 'Contributors' },
  { href: 'https://github.com/Tabi-Project', label: 'GitHub' },
]},
```

---

## Design pattern

`FooterComponent` uses **private instance methods** (ES2022):

```
FooterComponent
├── #buildBrand()       private — renders logo + tagline
├── #buildNavGroup()    private — renders a single heading + link list
├── #buildNav()         private — maps all groups through #buildNavGroup
├── #buildBottom()      private — renders copyright, note, legal links
├── #buildHTML()        private — composes all parts
└── mount(selector)     public  — the only method called externally
```

---

## Adding a new component that needs the footer

1. Add `id="footer-root"` with class `footer` to your HTML
2. Add the `footer.js` script tag before `</body>`
