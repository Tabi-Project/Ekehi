/**
 * SearchBar component
 *
 * SearchBar.create(options) → HTMLElement
 *
 * Options:
 *   placeholder   {string}    Input placeholder text
 *   buttonLabel   {string}    Button text, default: 'Search'
 *   name          {string}    Input name attribute
 *   onSearch      {Function(value: string)}  Called on button click or Enter key
 *   className     {string}    Extra class(es) on the wrapper
 *
 * Examples:
 *   SearchBar.create({
 *     placeholder: 'Search 30+ funding opportunities',
 *     onSearch: (value) => fetchOpportunities(value),
 *   })
 *
 *   SearchBar.create({
 *     placeholder: 'Search 20+ training resources',
 *     buttonLabel: 'Search',
 *     onSearch: (value) => fetchTraining(value),
 *   })
 */

const SEARCH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"/>
  <path d="m21 21-4.35-4.35"/>
</svg>`;

class SearchBar {
  static create({
    placeholder = '',
    buttonLabel = 'Search',
    name,
    onSearch,
    className = '',
  } = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = ['search-bar', className].filter(Boolean).join(' ');

    const input = document.createElement('input');
    input.type = 'search';
    input.className = 'search-bar__input';
    if (placeholder) input.placeholder = placeholder;
    if (name) input.name = name;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'search-bar__btn';

    const iconEl = document.createElement('span');
    iconEl.className = 'search-bar__btn-icon';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.innerHTML = SEARCH_SVG;

    btn.append(iconEl, buttonLabel);

    const handleSearch = () => {
      if (onSearch) onSearch(input.value.trim());
    };

    btn.addEventListener('click', handleSearch);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });

    wrapper.append(input, btn);
    return wrapper;
  }
}

export default SearchBar;
