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

// ── Guides ───────────────────────────────────────────

const GUIDES_PLACEHOLDER = [
  {
    id: "1",
    title: "Guide to understanding and improving business credit scores",
    excerpt:
      "Unlock your business's full potential by improving your credit score. Check out our guide for expert tips.",
    cover_image: null,
  },
  {
    id: "2",
    title: "CAC registration guide for Nigeria",
    excerpt:
      "Learn how to register your business with the Corporate Affairs Commission. Read our guide for expert tips.",
    cover_image: null,
  },
  {
    id: "3",
    title: "Women's Empowerment Training Guide: A Step-by-Step Approach",
    excerpt:
      "Ready to elevate your business? Read our Women's Empowerment Training Guide for actionable strategies.",
    cover_image: null,
  },
];

function renderGuideCard(guide) {
  const card = document.createElement("div");
  card.className = "guide-card | flex flex-col gap-3";

  const imageSrc =
    guide.cover_image ?? "/assets/images/black-woman-wearing-glasses.png";

  card.innerHTML = `
    <figure class="guide-card__cover">
      <img
        src="${imageSrc}"
        alt="${guide.title}"
        class="guide-card__image"
      />
    </figure>
    <div class="guide-card__body | flex flex-col gap-2">
      <h3 class="guide-card__title">${guide.title}</h3>
      <p class="guide-card__excerpt">${guide.excerpt}</p>
    </div>
  `;

  return card;
}

function initGuidesHeader() {
  if (document.getElementById("guides-heading")) return;
  const header = document.createElement("div");
  header.className = "results-header";
  header.innerHTML = `
    <h2 id="guides-heading">Guides</h2>
    <a href="#" class="view-all-link view-all-link--outlined">View all guides</a>
  `;
  document.querySelector(".guides-section").prepend(header);
}

function loadGuides() {
  // When a guides API is available, replace the body of this function with:
  // const res = await api.get('/guides');
  // const guides = res.data ?? [];

  const guides = GUIDES_PLACEHOLDER;
  const guidesList = document.getElementById("guides-list");
  guidesList.className = "guides-grid";

  guidesList.innerHTML = "";
  guides.forEach((guide) => guidesList.appendChild(renderGuideCard(guide)));
}

initTrainingsHeader();
loadTrainings();

initGuidesHeader();
loadGuides();
