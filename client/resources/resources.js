import api from '/shared/services/api.js';
import Dropdown from '/shared/components/dropdown/dropdown.js';
import SearchBar from '/shared/components/search-bar/search-bar.js';
import '/shared/components/nav/nav.js';
import '/shared/components/footer/footer.js';

// ── Filter state ───────────────────────────────────────
const filters = {
  programme_type: null,
  cost_type:      null,
  duration_range: null,
  location_scope: null,
  search:         null,
};

function onFilterChange(key, value) {
  filters[key] = value || null;
  console.log('[Trainings] active filters:', filters);
}

// ── Search bar ─────────────────────────────────────────
document.getElementById('search-bar').appendChild(
  SearchBar.create({
    placeholder: 'Search 20+ training resources',
    onSearch: (query) => onFilterChange('search', query),
  })
);

// ── Filter dropdowns ───────────────────────────────────
const filterContainer = document.getElementById('filter-dropdowns');

filterContainer.appendChild(Dropdown.create({
  label: 'Resource type',
  name: 'programme_type',
  options: [
    { value: 'accelerator',          label: 'Accelerator' },
    { value: 'bootcamp',             label: 'Bootcamp' },
    { value: 'workshop',             label: 'Workshop' },
    { value: 'online_course',        label: 'Online Course' },
    { value: 'mentorship_programme', label: 'Mentorship Programme' },
  ],
  onChange: (value) => onFilterChange('programme_type', value),
}));

filterContainer.appendChild(Dropdown.create({
  label: 'Cost',
  name: 'cost_type',
  options: [
    { value: 'free',      label: 'Free' },
    { value: 'paid',      label: 'Paid' },
    { value: 'sponsored', label: 'Sponsored' },
  ],
  onChange: (value) => onFilterChange('cost_type', value),
}));

filterContainer.appendChild(Dropdown.create({
  label: 'Duration',
  name: 'duration_range',
  options: [
    { value: 'lt_1_week',      label: 'Less than 1 week' },
    { value: '1_4_weeks',      label: '1–4 weeks' },
    { value: '1_3_months',     label: '1–3 months' },
    { value: '3_plus_months',  label: '3+ months' },
    { value: 'self_paced',     label: 'Self-paced' },
  ],
  onChange: (value) => onFilterChange('duration_range', value),
}));

filterContainer.appendChild(Dropdown.create({
  label: 'Location',
  name: 'location_scope',
  options: [
    { value: 'nigeria', label: 'Nigeria' },
    { value: 'africa',  label: 'Africa' },
    { value: 'global',  label: 'Global' },
    { value: 'online',  label: 'Online' },
  ],
  onChange: (value) => onFilterChange('location_scope', value),
}));

// ── Helpers ────────────────────────────────────────────
function formatDeadline(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}
 
function formatDuration(range) {
  const map = {
    lt_1_week:       '< 1 week',
    '1_4_weeks':     '1–4 weeks',
    '1_3_months':    '1–3 months',
    '3_plus_months': '3+ months',
    self_paced:      'Self-paced',
  };
  return map[range] ?? range ?? '—';
}
 
// ── Card renderer ──────────────────────────────────────
function renderTrainingCard(programme) {
  const card = document.createElement('div');
  card.className = 'training-card';
 
  card.innerHTML = `
    <div class="training-card__image"></div>
    <div class="training-card__body">
      <div class="training-card__meta">
        ${programme.application_deadline
          ? `<span class="training-card__date">${formatDeadline(programme.application_deadline)}</span>`
          : ''}
        <span class="training-card__location">${programme.location_scope ?? '—'}</span>
      </div>
      <h3 class="training-card__title">${programme.programme_name}</h3>
      <p class="training-card__provider">${programme.provider}</p>
    </div>
  `;
 
  return card;
}
 
// ── Section header renderer ────────────────────────────
function renderTrainingsHeader(total) {
  const existing = document.getElementById('results-count');
  if (existing) { existing.textContent = 'Training & Events'; return; }
 
  const header = document.createElement('div');
  header.className = 'results-header';
  header.innerHTML = `
    <h2 id="results-count">Training &amp; Events</h2>
    <a href="#" class="view-all-link">View all events</a>
  `;
  document.querySelector('.results-section').prepend(header);
}
 
// ── Fetch and render trainings ─────────────────────────
async function loadTrainings() {
  const list = document.getElementById('trainings-list');
 
  list.innerHTML = '<p class="loading-text">Loading...</p>';
 
  try {
    const res = await api.get('/trainings?limit=20');
    const programmes = res.data ?? [];
    const total = res.meta?.total ?? programmes.length;
 
    renderTrainingsHeader(total);
    list.className = 'trainings-grid';
    list.innerHTML = '';
    programmes.forEach((p) => list.appendChild(renderTrainingCard(p)));
  } catch (err) {
    list.innerHTML = `<p class="error-message">${err.message}</p>`;
  }
}
 
loadTrainings();