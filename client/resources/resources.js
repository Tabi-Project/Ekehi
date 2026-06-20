import api from "/shared/services/api.js";
import Dropdown from "/shared/components/dropdown/dropdown.js";
import SearchBar from "/shared/components/search-bar/search-bar.js";
import LoadingSkeleton from "/shared/components/loading-skeleton/loading-skeleton.js";
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

  const colors = CARD_COLORS[programme.programme_type] ?? CARD_COLORS.accelerator;
  const typeLabel = EKEHI_ENUMS.programmeType[programme.programme_type] ?? programme.programme_type;
  const locationLabel = EKEHI_ENUMS.locationScope[programme.location_scope] ?? programme.location_scope;

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

  card.addEventListener("click", () => {
    window.location.href = `/resources/training/detail/?id=${programme.id}`;
  });

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
  list.innerHTML = LoadingSkeleton.render("training", 6);

  try {
    const res = await api.get(`/trainings${buildQueryString(filters)}`);
    const programmes = res.data ?? [];
    const total = res.meta?.total ?? programmes.length;

    if (total === 0) {
      list.innerHTML = "<p>No Training & Events found</p>";
    } else {
      list.innerHTML = "";
      programmes.forEach((p) => list.appendChild(renderTrainingCard(p)));
    }
  } catch (err) {
    list.innerHTML = `<p class="error-message">${err.message}</p>`;
  }
}

// ── Guides ─────────────────────────────────────────────

function renderGuideCard(guide) {
  const card = document.createElement("a");
  card.className = "guide-card | flex flex-col gap-3";
  card.href = `/resources/guides/detail/?guideId=${guide.id}`;

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
      <p class="guide-card__excerpt">${guide.summary}</p>
    </div>
  `;

  return card;
}

function initGuidesHeader() {
  if (document.getElementById("guides-heading")) return;
  const header = document.createElement("div");
  header.className = "results-header";
  header.innerHTML = `<h2 id="guides-heading">Guides</h2>`;
  document.querySelector(".guides-section").prepend(header);
}

async function loadGuides() {
  const guidesList = document.getElementById("guides-list");
  guidesList.className = "guides-grid";
  guidesList.innerHTML = LoadingSkeleton.render("guide", 3);

  try {
    const res = await api.get("/guides");
    const guides = res.data ?? [];

    guidesList.innerHTML = "";
    if (guides.length === 0) {
      guidesList.innerHTML = "<p>No guides found</p>";
    } else {
      guides.forEach((guide) => guidesList.appendChild(renderGuideCard(guide)));
    }
  } catch (err) {
    guidesList.innerHTML = `<p class="error-message">${err.message}</p>`;
  }
}

initTrainingsHeader();
loadTrainings();

const TEMPLATE_COLORS = ["#4ecdc4", "#e91e8c", "#4caf50", "#6366f1", "#f59e0b"];

async function loadTemplates() {
  const grid = document.getElementById("templates-grid");
  if (!grid) return;

  grid.innerHTML = LoadingSkeleton.render("template", 3);

  try {
    const res = await api.get("/templates");
    const templates = res.data ?? [];

    if (templates.length === 0) {
      grid.innerHTML = "<p>No templates found</p>";
      return;
    }

    grid.innerHTML = templates.map((item, index) => {
      const color = TEMPLATE_COLORS[index % TEMPLATE_COLORS.length];
      return `
        <article class="template-card flex flex-col shadow-sm">
          <div class="template-card__visual">
            <div class="template-card__mockup" style="background-color:${color}">
              <div class="mockup-header">${item.title}</div>
              <div class="mockup-img"></div>
            </div>
          </div>
          <div class="template-card__content flex flex-col flex-1">
            <h3 class="font-sans text-lg text-primary mb-3 font-semibold py-2">${item.title}</h3>
            <p class="text-xs text-secondary leading-relaxed mb-6">${item.description}</p>
            <a href="/resources/template/?id=${item.id}" class="template-card__link mt-auto">
              Read more <span>→</span>
            </a>
          </div>
        </article>
      `;
    }).join("");
  } catch (err) {
    grid.innerHTML = `<p class="error-message">${err.message}</p>`;
  }
}
initGuidesHeader();
loadGuides();
loadTemplates();
