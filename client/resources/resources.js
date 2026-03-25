import api from "/shared/services/api.js";
import Dropdown from "/shared/components/dropdown/dropdown.js";
import SearchBar from "/shared/components/search-bar/search-bar.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";
import {
  formatDate,
  buildQueryString,
} from "/shared/utils/opportunity.utils.js";
import EKEHI_ENUMS from "/shared/constants/enums.js";

const filters = {
  programme_type: null,
  cost_type: null,
  duration_range: null,
  location_scope: null,
  search: null,
};

function onFilterChange(key, value) {
  filters[key] = value || null;
  loadTrainings();
}

document.getElementById("search-bar").appendChild(
  SearchBar.create({
    placeholder: "Search 20+ training resources",
    onSearch: (query) => onFilterChange("search", query),
  }),
);

const filterContainer = document.getElementById("filter-dropdowns");

const FILTER_CONFIGS = [
  { label: "Resource type", name: "programme_type", enumKey: "programmeType" },
  { label: "Cost", name: "cost_type", enumKey: "costType" },
  { label: "Duration", name: "duration_range", enumKey: "durationRange" },
  { label: "Location", name: "location_scope", enumKey: "locationScope" },
];

FILTER_CONFIGS.forEach(({ label, name, enumKey }) =>
  filterContainer.appendChild(
    Dropdown.create({
      label,
      name,
      options: Object.entries(EKEHI_ENUMS[enumKey]).map(([value, label]) => ({
        value,
        label,
      })),
      onChange: (value) => onFilterChange(name, value),
    }),
  ),
);

const CARD_COLORS = {
  accelerator: { bg: "#F9E6FF", panel: "#E599FF", text: "#581c87" },
  bootcamp: { bg: "#ffedd5", panel: "#fb923c", text: "#7c2d12" },
  workshop: { bg: "#DEF6EB", panel: "#4ade80", text: "#033F25" },
  online_course: { bg: "#dbeafe", panel: "#60a5fa", text: "#1e3a8a" },
  mentorship_programme: { bg: "#fce7f3", panel: "#f472b6", text: "#831843" },
};






function renderDateMeta(deadline) {
  if (!deadline) return "";
  return `<span class="training-card__date">
    <img src="/assets/icons/calendar_2_fill.svg" /> ${formatDate(deadline)}
  </span>`;
}

function renderLocationMeta(locationLabel) {
  if (!locationLabel) return "";
  return `<span class="training-card__location">
    <img src="/assets/icons/world_2_fill.svg" /> ${locationLabel}
  </span>`;
}

function renderTrainingCard(programme) {
  const card = document.createElement("div");
  card.className = "training-card | flex flex-col gap-4";

  const colors =
    CARD_COLORS[programme.programme_type] ?? CARD_COLORS.accelerator;
  const typeLabel =
    EKEHI_ENUMS.programmeType[programme.programme_type] ??
    programme.programme_type;
  const locationLabel =
    EKEHI_ENUMS.locationScope[programme.location_scope] ??
    programme.location_scope;

  card.innerHTML = `
    <figure class="training-card__display" style="background-color: ${colors.bg}">
      <figcaption class="training-card__caption" style="background-color: ${colors.panel}; color: ${colors.text}">
        <span class="training-card__caption--type">${typeLabel}</span>
        <span class="training-card__caption--provider">${programme.provider}</span>
      </figcaption>
      <img src="/assets/images/black-woman-wearing-glasses.png" class="training-card__image" alt="${programme.programme_name}" />
    </figure>
    <div class="training-card__body | flex flex-col gap-2">
      <div class="training-card__meta | flex items-center gap-3 flex-wrap">
        ${renderDateMeta(programme.application_deadline)}
        ${renderLocationMeta(locationLabel)}
      </div>
      <h3 class="training-card__title">${programme.programme_name}</h3>
      ${programme.description ? `<p class="training-card__description">${programme.description}</p>` : ""}
    </div>
  `;
  return card;
}

function initTrainingsHeader() {
  if (document.getElementById("results-count")) return;
  const header = document.createElement("div");
  header.className = "results-header";
  header.innerHTML = '<h2 id="results-count">Training &amp; Events</h2>';
  document.querySelector(".results-section").prepend(header);
}

const list = document.getElementById("trainings-list");
list.className = "trainings-grid";

async function loadTrainings() {
  list.innerHTML = '<p class="loading-text">Loading...</p>';

  try {
    const res = await api.get(`/trainings${buildQueryString(filters)}`);
    const programmes = res.data ?? [];

    list.innerHTML = "";
    programmes.forEach((p) => list.appendChild(renderTrainingCard(p)));
  } catch (err) {
    list.innerHTML = `<p class="error-message">${err.message}</p>`;
  }
}

initTrainingsHeader();
loadTrainings();





const templateData = [
  {
    id: "1",
    title: "Basic financial management template",
    excerpt: "Explore our Basic Financial Management Template designed specifically for small and medium enterprises! It's an excellent resource to get you ready for global opportunities.",
    color: "#4ecdc4", 
    cover_image: null
  },
  {
    id: "2",
    title: "Tax basics for Nigerian SMEs",
    excerpt: "Explore our template on Tax Basics for Nigerian SMEs. It's an essential resource to help you navigate the complexities of taxation and ensure your business is ready for success.",
    color: "#e91e8c", 
    cover_image: null
  },
  {
    id: "3",
    title: "Export readiness checklist for SMEs",
    excerpt: "Check out our template for the Export Readiness Checklist tailored for SMEs! It's a great tool to help you prepare for international markets.",
    color: "#4caf50",
    cover_image: null
  }
];

function loadTemplates() {
  const grid = document.getElementById('templates-grid');
  if (!grid) return;

  grid.innerHTML = templateData.map(item => `
    <article class="template-card flex flex-col shadow-sm">
      <div class="template-card__visual">
        <div class="template-card__mockup" style="background-color:${item.color}">
          <div class="mockup-header">${item.title}</div>
          <div class="mockup-img"></div>
        </div>
      </div>
      
      <div class="template-card__content flex flex-col flex-1">
        <h3 class="font-sans text-lg text-primary mb-3 font-semibold py-2">${item.title}</h3>
        <p class="text-xs text-secondary leading-relaxed mb-6">${item.excerpt}</p>
        <a href="#" class="template-card__link mt-auto">
          Read more <span>→</span>
        </a>
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadTemplates);
