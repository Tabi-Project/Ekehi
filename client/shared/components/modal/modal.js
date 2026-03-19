/**
 * Modal — thin wrapper around the native <dialog> element.
 *
 * Usage:
 *   const modal = new Modal({ id: 'my-modal', content: '<p>Hello</p>' });
 *   modal.open();
 *   modal.close();
 *   modal.destroy();  // removes from DOM
 */
export default class Modal {
  #dialog;

  constructor({ id, content, className = "" }) {
    this.#dialog = this.#create(id, content, className);
    document.body.appendChild(this.#dialog);
    this.#attachListeners();
  }

  #create(id, content, className) {
    const dialog = document.createElement("dialog");
    dialog.id = id;
    dialog.className = `modal ${className}`.trim();
    dialog.innerHTML = content;
    return dialog;
  }

  #attachListeners() {
    // Backdrop click closes the modal
    this.#dialog.addEventListener("click", (e) => {
      if (e.target === this.#dialog) this.close();
    });

    // Escape key is handled natively by <dialog>, but we listen for it
    // to allow subclasses to hook into the close event if needed
    this.#dialog.addEventListener("cancel", () => this.close());
  }

  open() {
    this.#dialog.showModal();
  }

  close() {
    this.#dialog.close();
  }

  destroy() {
    this.#dialog.remove();
  }

  get el() {
    return this.#dialog;
  }
}
