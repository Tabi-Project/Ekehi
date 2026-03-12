// document.getElementById("preview-dropdown").appendChild(
//   Dropdown.create({
//     label: "Business sector",
//     options: [
//       { value: "fintech", label: "Fintech" },
//       { value: "health", label: "Health & Wellness" },
//       { value: "retail", label: "Retail" },
//     ],
//   }),
// );

// document
//   .getElementById("preview-searchbar")
//   .appendChild(
//     SearchBar.create({ placeholder: "Search 30+ funding opportunities" }),
//   );


// 1. Filter state
const filters = {
  programme_type: null,
  cost_type: null,
  duration_range: null,
  location_scope: null,
  search: null,
};

function onFilterChange(key, value) {
  filters[key] = value || null;
  console.log('[Trainings] active filters:', filters);
}

// 2. Search bar
document.getElementById('search-bar').appendChild(
  SearchBar.create({
    placeholder: 'Search 20+ training resources',
    onSearch: (query) => onFilterChange('search', query),
  })
);

// 3. Filter dropdowns
const filterContainer = document.getElementById('filter-dropdowns');

filterContainer.appendChild(Dropdown.create({
  label: 'Resource type',
  name: 'programme_type',
  options: [
    { value: 'accelerator', label: 'Accelerator' },
    { value: 'bootcamp', label: 'Bootcamp' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'online_course', label: 'Online Course' },
    { value: 'mentorship_programme', label: 'Mentorship Programme' },
  ],
  onChange: (value) => onFilterChange('programme_type', value),
}));

filterContainer.appendChild(Dropdown.create({
  label: 'Cost',
  name: 'cost_type',
  options: [
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
    { value: 'sponsored', label: 'Sponsored' },
  ],
  onChange: (value) => onFilterChange('cost_type', value),
}));

filterContainer.appendChild(Dropdown.create({
  label: 'Duration',
  name: 'duration_range',
  options: [
    { value: 'lt_1_week', label: 'Less than 1 week' },
    { value: '1_4_weeks', label: '1–4 weeks' },
    { value: '1_3_months', label: '1–3 months' },
    { value: '3_plus_months', label: '3+ months' },
    { value: 'self_paced', label: 'Self-paced' },
  ],
  onChange: (value) => onFilterChange('duration_range', value),
}));

filterContainer.appendChild(Dropdown.create({
  label: 'Location',
  name: 'location_scope',
  options: [
    { value: 'nigeria', label: 'Nigeria' },
    { value: 'africa', label: 'Africa' },
    { value: 'global', label: 'Global' },
    { value: 'online', label: 'Online' },
  ],
  onChange: (value) => onFilterChange('location_scope', value),
}));