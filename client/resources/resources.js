import api from '/shared/services/api.js';
import Dropdown from '/shared/components/dropdown/dropdown.js';
import SearchBar from '/shared/components/search-bar/search-bar.js';
import '/shared/components/nav/nav.js';
import '/shared/components/footer/footer.js';
import {
  formatDate,
  buildQueryString,
} from '/shared/utils/opportunity.utils.js';
import EKEHI_ENUMS from '/shared/constants/enums.js';

const filters = {
  programme_type: null,
  cost_type:      null,
  duration_range: null,
  location_scope: null,
  search:         null,
};

function onFilterChange(key, value) {
  filters[key] = value || null;
  loadTrainings();
}

document.getElementById('search-bar').appendChild(
  SearchBar.create({
    placeholder: 'Search 20+ training resources',
    onSearch: (query) => onFilterChange('search', query),
  })
);

const filterContainer = document.getElementById('filter-dropdowns');

filterContainer.appendChild(Dropdown.create({
  label: 'Resource type',
  name: 'programme_type',
  options: Object.entries(EKEHI_ENUMS.programmeType).map(([value, label]) => ({ value, label })),
  onChange: (value) => onFilterChange('programme_type', value),
}));

filterContainer.appendChild(Dropdown.create({
  label: 'Cost',
  name: 'cost_type',
  options: Object.entries(EKEHI_ENUMS.costType).map(([value, label]) => ({ value, label })),
  onChange: (value) => onFilterChange('cost_type', value),
}));

filterContainer.appendChild(Dropdown.create({
  label: 'Duration',
  name: 'duration_range',
  options: Object.entries(EKEHI_ENUMS.durationRange).map(([value, label]) => ({ value, label })),
  onChange: (value) => onFilterChange('duration_range', value),
}));

filterContainer.appendChild(Dropdown.create({
  label: 'Location',
  name: 'location_scope',
  options: Object.entries(EKEHI_ENUMS.locationScope).map(([value, label]) => ({ value, label })),
  onChange: (value) => onFilterChange('location_scope', value),
}));

function renderTrainingCard(programme) {
  const card = document.createElement('div');
  card.className = 'training-card';
  card.innerHTML = `
    <div class="training-card__image"></div>
    <div class="training-card__body">
      <div class="training-card__meta">
        ${programme.application_deadline
          ? `<span class="training-card__date">${formatDate(programme.application_deadline)}</span>`
          : ''}
        <span class="training-card__location">${programme.location_scope ?? '—'}</span>
      </div>
      <h3 class="training-card__title">${programme.programme_name}</h3>
      <p class="training-card__provider">${programme.provider}</p>
    </div>
  `;
  return card;
}

function initTrainingsHeader() {
  if (document.getElementById('results-count')) return;
  const header = document.createElement('div');
  header.className = 'results-header';
  header.innerHTML = '<h2 id="results-count">Training &amp; Events</h2>';
  document.querySelector('.results-section').prepend(header);
}

const list = document.getElementById('trainings-list');
list.className = 'trainings-grid';

async function loadTrainings() {
  list.innerHTML = '<p class="loading-text">Loading...</p>';

  try {
    const res = await api.get(`/trainings${buildQueryString(filters)}`);
    const programmes = res.data ?? [];

    list.innerHTML = '';
    programmes.forEach((p) => list.appendChild(renderTrainingCard(p)));
  } catch (err) {
    list.innerHTML = `<p class="error-message">${err.message}</p>`;
  }
}

initTrainingsHeader();
loadTrainings();
