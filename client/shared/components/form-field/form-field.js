/**
 * FormField — labelled form control using the shared Input component where applicable.
 *
 * FormField.create(options) → HTMLElement (.form-field wrapper)
 *
 * Options:
 *   name        {string}   input name + id
 *   label       {string}   visible label text
 *   type        {'text'|'email'|'number'|'url'|'date'|'tel'|'select'|'textarea'|'checkbox'}
 *   required    {boolean}  default: false
 *   placeholder {string}
 *   options     {string[]} values for <select>
 *   value       {string}   initial value
 *   rows        {number}   textarea row count, default: 5
 */

import Input from "/shared/components/input/input.js";

const INPUT_TYPES = new Set(["text", "email", "number", "url", "date", "tel"]);

class FormField {
  static create({ name, label, type = "text", required = false, placeholder = "", options = [], value = "", rows = 5 } = {}) {
    if (type === "checkbox") return FormField.#checkbox({ name, label });

    const wrapper = document.createElement("div");
    wrapper.className = "form-field";

    const labelEl = FormField.#label(name, label, required);
    wrapper.appendChild(labelEl);

    if (type === "select") {
      wrapper.appendChild(FormField.#select({ name, options, required, value }));
    } else if (type === "textarea") {
      wrapper.appendChild(FormField.#textarea({ name, placeholder, required, rows, value }));
    } else if (INPUT_TYPES.has(type)) {
      const inputWrapper = Input.create({ type, name, id: name, placeholder, required, value: value || undefined });
      wrapper.appendChild(inputWrapper);
    }

    return wrapper;
  }

  static #label(forId, text, required) {
    const el = document.createElement("label");
    el.htmlFor = forId;
    el.textContent = text;
    if (required) {
      const mark = document.createElement("span");
      mark.className = "required";
      mark.textContent = " *";
      el.appendChild(mark);
    }
    return el;
  }

  static #select({ name, options, required, value }) {
    const select = document.createElement("select");
    select.name = name;
    select.id = name;
    if (required) select.required = true;
    select.className = "form-field__select";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select…";
    select.appendChild(placeholder);

    options.forEach((opt) => {
      const el = document.createElement("option");
      el.value = opt;
      el.textContent = opt;
      if (opt === value) el.selected = true;
      select.appendChild(el);
    });

    return select;
  }

  static #textarea({ name, placeholder, required, rows, value }) {
    const el = document.createElement("textarea");
    el.name = name;
    el.id = name;
    el.placeholder = placeholder;
    el.rows = rows;
    el.className = "form-field__textarea";
    if (required) el.required = true;
    if (value) el.value = value;
    return el;
  }

  static #checkbox({ name, label }) {
    const wrapper = document.createElement("div");
    wrapper.className = "form-field form-field--checkbox";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = name;
    input.id = name;

    const labelEl = document.createElement("label");
    labelEl.htmlFor = name;
    labelEl.textContent = label;

    wrapper.append(input, labelEl);
    return wrapper;
  }
}

export default FormField;
