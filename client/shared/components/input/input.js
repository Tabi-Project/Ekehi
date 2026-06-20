/**
 * Input component
 *
 * Input.create(options)         → HTMLElement (wrapper div containing the input)
 * Input.createPassword(options) → HTMLElement (handles eye toggle internally)
 *
 * Options:
 *   type        {'text'|'email'|'password'|...}  default: 'text'
 *   placeholder {string}
 *   name        {string}
 *   id          {string}
 *   value       {string}
 *   variant     {'default'|'filled'}  default: 'default'
 *                 'default' — white bg, visible border
 *                 'filled'  — gray bg, no border (auth forms)
 *   icon        {string}    SVG string rendered on the right
 *   iconLabel   {string}    aria-label for the icon button
 *   iconAction  {Function}  click handler for the icon button
 *   disabled    {boolean}   default: false
 *   required    {boolean}   default: false
 *   className   {string}    extra class(es) on the <input>
 *
 * Examples:
 *   Input.create({ placeholder: 'Email address', type: 'email' })
 *   Input.create({ placeholder: 'Search...', variant: 'default' })
 *   Input.createPassword({ placeholder: 'Password', variant: 'filled' })
 */

const EYE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>`;

const EYE_OFF_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
  <path d="m10.73 10.73 2.54 2.54"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
</svg>`;

class Input {
  static #buildClasses(variant, hasIcon, className) {
    const classes = ["input"];
    if (variant !== "default") classes.push(`input--${variant}`);
    if (hasIcon) classes.push("input--has-icon");
    if (className) classes.push(className);
    return classes.join(" ");
  }

  static create({
    type = "text",
    placeholder = "",
    name,
    id,
    value,
    variant = "default",
    icon,
    iconLabel = "Action",
    iconAction,
    disabled = false,
    required = false,
    className = "",
  } = {}) {
    const wrapper = document.createElement("div");
    wrapper.className = "input-wrapper";

    const input = document.createElement("input");
    input.type = type;
    input.className = Input.#buildClasses(variant, !!icon, className);
    if (placeholder) input.placeholder = placeholder;
    if (name) input.name = name;
    if (id) input.id = id;
    if (value !== undefined) input.value = value;
    if (disabled) input.disabled = true;
    if (required) input.required = true;

    wrapper.appendChild(input);

    if (icon) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "input__icon-btn";
      btn.setAttribute("aria-label", iconLabel);
      btn.innerHTML = icon;
      if (iconAction) btn.addEventListener("click", iconAction);
      wrapper.appendChild(btn);
    }

    return wrapper;
  }

  static createPassword({
    placeholder = "",
    name,
    id,
    variant = "filled",
    className = "",
  } = {}) {
    let visible = false;

    const wrapper = Input.create({
      type: "password",
      placeholder,
      name,
      id,
      variant,
      icon: EYE_SVG,
      iconLabel: "Show password",
      className,
    });

    const inputEl = wrapper.querySelector("input");
    const iconBtn = wrapper.querySelector(".input__icon-btn");

    iconBtn.addEventListener("click", () => {
      visible = !visible;
      inputEl.type = visible ? "text" : "password";
      iconBtn.innerHTML = visible ? EYE_OFF_SVG : EYE_SVG;
      iconBtn.setAttribute(
        "aria-label",
        visible ? "Hide password" : "Show password",
      );
    });

    return wrapper;
  }
}

export default Input;
