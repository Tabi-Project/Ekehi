/**
 * Button component
 *
 * Button.create(options) → HTMLElement
 *
 * Options:
 *   label        {string}               Button text
 *   variant      {'primary'|'secondary'|'outline'|'ghost'}  default: 'primary'
 *   size         {'sm'|'md'|'lg'}       default: 'md'
 *   as           {'button'|'a'}         default: 'button'
 *   href         {string}               Required when as='a'
 *   icon         {string|HTMLElement}   SVG string or element
 *   iconPosition {'left'|'right'}       default: 'left'
 *   full         {boolean}              Full-width, default: false
 *   disabled     {boolean}              default: false
 *   type         {'button'|'submit'|'reset'}  default: 'button'
 *   className    {string}               Extra CSS class(es) to append
 *   onClick      {Function}             Click handler
 *
 * Examples:
 *   Button.create({ label: 'Sign up', variant: 'primary' })
 *   Button.create({ label: 'Learn more', variant: 'outline', size: 'sm' })
 *   Button.create({ label: 'Go', as: 'a', href: '/signup', variant: 'primary' })
 *   Button.create({ label: 'Next', icon: arrowSvg, iconPosition: 'right' })
 *   Button.create({ label: 'Submit', type: 'submit', full: true })
 */

class Button {
  static #VARIANTS = ['primary', 'secondary', 'outline', 'ghost'];
  static #SIZES = ['sm', 'md', 'lg'];

  static #buildClasses(variant, size, full, className) {
    const classes = ['btn'];
    if (Button.#VARIANTS.includes(variant)) classes.push(`btn--${variant}`);
    if (size !== 'md' && Button.#SIZES.includes(size)) classes.push(`btn--${size}`);
    if (full) classes.push('btn--full');
    if (className) classes.push(className);
    return classes.join(' ');
  }

  static #buildIcon(icon) {
    const span = document.createElement('span');
    span.className = 'btn__icon';
    span.setAttribute('aria-hidden', 'true');
    if (typeof icon === 'string') span.innerHTML = icon;
    else span.appendChild(icon);
    return span;
  }

  static create({
    label = '',
    variant = 'primary',
    size = 'md',
    as = 'button',
    href,
    icon,
    iconPosition = 'left',
    full = false,
    disabled = false,
    type = 'button',
    className = '',
    onClick,
  } = {}) {
    const el = document.createElement(as === 'a' ? 'a' : 'button');
    el.className = Button.#buildClasses(variant, size, full, className);

    if (as === 'a') {
      if (href) el.href = href;
    } else {
      el.type = type;
    }

    if (disabled) el.disabled = true;
    if (onClick) el.addEventListener('click', onClick);

    const iconEl = icon ? Button.#buildIcon(icon) : null;

    if (iconEl && iconPosition === 'right') {
      if (label) el.append(label);
      el.appendChild(iconEl);
    } else {
      if (iconEl) el.appendChild(iconEl);
      if (label) el.append(label);
    }

    return el;
  }
}
