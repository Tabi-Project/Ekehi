# Modal Component

**File:** `client/shared/components/modal/modal.js`
**CSS:** `client/shared/components/modal/modal.css`

A thin wrapper around the native `<dialog>` element. Appends itself to `document.body` on construction. Backdrop clicks and the Escape key both close it automatically.

---

## API

### `new Modal(options)` → Modal instance

Constructs and appends the dialog to the DOM. Does not open it — call `.open()` when ready.

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Sets the `id` on the `<dialog>` element |
| `content` | `string` | — | Inner HTML of the dialog |
| `className` | `string` | `''` | Extra class(es) added alongside `modal` |

### Instance methods

| Method | Description |
|---|---|
| `.open()` | Opens the dialog via `showModal()` — blocks background interaction |
| `.close()` | Closes the dialog |
| `.destroy()` | Removes the dialog from the DOM |
| `.el` | Returns the underlying `<dialog>` element for direct DOM access |

---

## Behaviour

- **Backdrop click** — clicking outside the dialog content (on the backdrop) closes it
- **Escape key** — handled natively by `<dialog>`, also triggers close
- **Stacking** — `showModal()` places the dialog in the top layer; only one modal can be open at a time

---

## Examples

```js
import Modal from '/shared/components/modal/modal.js';

// Basic confirmation dialog
const modal = new Modal({
  id: 'confirm-delete',
  content: `
    <h2>Delete this item?</h2>
    <p>This action cannot be undone.</p>
    <button id="confirm-yes">Delete</button>
    <button id="confirm-no">Cancel</button>
  `,
});

modal.open();

modal.el.querySelector('#confirm-yes').addEventListener('click', () => {
  // handle delete
  modal.destroy();
});

modal.el.querySelector('#confirm-no').addEventListener('click', () => modal.close());

// With extra class for custom sizing
const wide = new Modal({
  id: 'preview-modal',
  content: '<img src="..." alt="Preview" />',
  className: 'modal--wide',
});
```

---

## How to load

```js
import Modal from '/shared/components/modal/modal.js';
```

`modal.css` is already imported via `main.css` — no separate link needed.
