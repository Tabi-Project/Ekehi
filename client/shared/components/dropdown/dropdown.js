/**
 * Dropdown component
 *
 * Dropdown.create(options) → HTMLElement
 *
 * Options:
 *   label     {string}             Trigger label when nothing is selected
 *   options   {Array<{value, label}>}  List of options
 *   name      {string}             For form use — identifies the field
 *   selected  {string}             Pre-selected value
 *   onChange  {Function(value, label)}  Called when an option is picked
 *   className {string}             Extra class(es) on the wrapper
 *
 * Examples:
 *   Dropdown.create({
 *     label: 'Cost',
 *     options: [
 *       { value: 'free', label: 'Free' },
 *       { value: 'paid', label: 'Paid' },
 *       { value: 'sponsored', label: 'Sponsored' },
 *     ],
 *     onChange: (value) => console.log(value),
 *   })
 */

const CHEVRON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="m6 9 6 6 6-6"/>
</svg>`;

class Dropdown {
  static #closeAll() {
    document.querySelectorAll(".dropdown__panel--open").forEach((panel) => {
      panel.classList.remove("dropdown__panel--open");
      const trigger = panel.previousElementSibling;
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  static create({
    label = "Select",
    options = [],
    name,
    selected,
    onChange,
    className = "",
  } = {}) {
    const wrapper = document.createElement("div");
    wrapper.className = ["dropdown-wrapper", className]
      .filter(Boolean)
      .join(" ");
    if (name) wrapper.dataset.name = name;

    // Trigger
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "dropdown__trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");

    let currentValue = selected ?? null;

    const labelEl = document.createElement("span");
    labelEl.className = "dropdown__label";
    labelEl.textContent = selected
      ? (options.find((o) => o.value === selected)?.label ?? label)
      : label;

    const chevron = document.createElement("span");
    chevron.className = "dropdown__chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML = CHEVRON_SVG;

    trigger.append(labelEl, chevron);

    // Panel
    const panel = document.createElement("div");
    panel.className = "dropdown__panel";
    panel.setAttribute("role", "listbox");

    options.forEach(({ value, label: optLabel }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dropdown__option";
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", value === selected ? "true" : "false");
      btn.dataset.value = value;
      btn.textContent = optLabel;

      btn.addEventListener("click", () => {
        const isAlreadySelected = currentValue === value;

        if (isAlreadySelected) {
          // Deselect
          currentValue = null;
          labelEl.textContent = label;
          panel.querySelectorAll(".dropdown__option").forEach((o) => {
            o.setAttribute("aria-selected", "false");
          });
          Dropdown.#closeAll();
          if (onChange) onChange(null, null);
        } else {
          // Select
          currentValue = value;
          labelEl.textContent = optLabel;
          panel.querySelectorAll(".dropdown__option").forEach((o) => {
            o.setAttribute(
              "aria-selected",
              o.dataset.value === value ? "true" : "false",
            );
          });
          Dropdown.#closeAll();
          if (onChange) onChange(value, optLabel);
        }
      });

      panel.appendChild(btn);
    });

    // Toggle open/close
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.contains("dropdown__panel--open");
      Dropdown.#closeAll();
      if (!isOpen) {
        panel.classList.add("dropdown__panel--open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    // Keyboard: close on Escape
    wrapper.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        Dropdown.#closeAll();
        trigger.focus();
      }
    });

    wrapper.append(trigger, panel);

    // Close when clicking outside
    document.addEventListener("click", () => {
      if (panel.classList.contains("dropdown__panel--open")) {
        Dropdown.#closeAll();
      }
    });

    return wrapper;
  }
}
