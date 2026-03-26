import api from "/shared/services/api.js";
import AuthService from "/shared/services/auth.service.js";
import Dropdown from "/shared/components/dropdown/dropdown.js";
import SearchBar from "/shared/components/search-bar/search-bar.js";
import LoadingSkeleton from "/shared/components/loading-skeleton/loading-skeleton.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";
import {
  formatAmount,
  daysUntil,
  diffDays,
  humanize,
  buildQueryString,
} from "/shared/utils/opportunity.utils.js";
import EKEHI_ENUMS from "/shared/constants/enums.js";

const searchBar = document.getElementById("search-bar");
const filterContainer = document.getElementById("filter-dropdowns");
const listHead = document.querySelector(".list-head");
const opportunityCards = document.querySelector(".opportunity-cards");
const listLabel = document.getElementById("list-label");
const tabsEl = document.querySelector(".opportunities__tabs");
const tabAllCount = document.getElementById("tab-all-count");
const tabSavedCount = document.getElementById("tab-saved-count");

const isLoggedIn = AuthService.isLoggedIn();
tabsEl.style.display = isLoggedIn ? "" : "none";
listLabel.style.display = isLoggedIn ? "none" : "";

let activeTab = "all";

const filters = {
  sector: null,
  status: null,
  stage: null,
  country: null,
  opportunity_type: null,
  search: null,
};

const toOptions = (enumMap) =>
  Object.entries(enumMap).map(([value, label]) => ({ value, label }));

function onFilterChange(key, value) {
  filters[key] = value || null;
  if (activeTab !== "all") setActiveTab("all");
  loadOpportunities();
}

searchBar.appendChild(
  SearchBar.create({
    placeholder: "Search 30+ funding opportunities",
    onSearch: (query) => onFilterChange("search", query),
  }),
);

filterContainer.append(
  Dropdown.create({
    label: "Sector",
    name: "sector",
    options: toOptions(EKEHI_ENUMS.sector),
    onChange: (value) => onFilterChange("sector", value),
  }),
  Dropdown.create({
    label: "Status",
    name: "status",
    options: toOptions(EKEHI_ENUMS.listingStatus),
    onChange: (value) => onFilterChange("status", value),
  }),
  Dropdown.create({
    label: "Business stage",
    name: "stage",
    options: toOptions(EKEHI_ENUMS.businessStage),
    onChange: (value) => onFilterChange("stage", value),
  }),
  Dropdown.create({
    label: "Region",
    name: "country",
    options: toOptions(EKEHI_ENUMS.country),
    onChange: (value) => onFilterChange("country", value),
  }),
  Dropdown.create({
    label: "Type",
    name: "opportunity_type",
    options: toOptions(EKEHI_ENUMS.opportunityType),
    onChange: (value) => onFilterChange("opportunity_type", value),
  }),
);

function closingSoon(dateStr, status) {
  if (!dateStr) return humanize(status);
  const diff = diffDays(dateStr);
  return diff !== null && diff <= 10 ? "closing soon" : humanize(status);
}

function renderOpportunityCard(opp) {
  return `
    <a class="opportunity-card" href="/opportunities/detail/?id=${opp.id}">
      <div class="opportunity-amount">
        <p class="foundation-amount">${formatAmount(opp.amount_min, opp.amount_max, opp.currency)}</p>
        <p class="foundation-type">${humanize(opp.opportunity_type)}</p>
      </div>
      <div class="flex-1 flex flex-col gap-1">
        <div class="flex gap-2 items-start">
          <h3 class="opportunity-title | text-lg">${opp.opportunity_title}</h3>
          <span class='badge badge--${opp.status}'>${closingSoon(opp.application_deadline, opp.status)}</span>
        </div>
        <p class="foundaton-owner">${opp.funder_name}</p>
      </div>
      <div class="opportunity-deadline">
        <img src="/assets/images/time-vector.png" alt="clock"/>
        <p>${daysUntil(opp.application_deadline) ?? "—"}</p>
      </div>
    </a>
  `;
}

function populateOpportunities(opps) {
  listHead.innerHTML = `<p>amount</p> <p>deadline</p>`;
  opportunityCards.innerHTML = opps.map(renderOpportunityCard).join("");
}

async function loadOpportunities() {
  opportunityCards.innerHTML = LoadingSkeleton.render("opportunity", 5);
  try {
    const res = await api.get(`/opportunities${buildQueryString(filters)}`);
    const opportunities = res.data ?? [];
    const total = res.meta?.total ?? opportunities.length;

    tabAllCount.textContent = total;
    listLabel.innerHTML = `All Opportunities (<span class="total">${total}</span>)`;

    if (total === 0) {
      opportunityCards.innerHTML = "<p>No Opportunities found</p>";
    } else {
      populateOpportunities(opportunities);
    }
  } catch (e) {
    opportunityCards.innerHTML = `<p class='error-message'>There was an error fetching opportunities. ${e.message}</p>`;
  }
}

async function loadSavedOpportunities() {
  opportunityCards.innerHTML = LoadingSkeleton.render("opportunity", 5);
  try {
    const res = await api.get("/opportunities/saved");
    const opportunities = res.data ?? [];
    const total = res.meta?.total ?? opportunities.length;

    tabSavedCount.textContent = total;
    listLabel.innerHTML = `Saved Opportunities (<span class="total">${total}</span>)`;

    if (total === 0) {
      opportunityCards.innerHTML = "<p>You have no saved opportunities yet.</p>";
    } else {
      populateOpportunities(opportunities);
    }
  } catch (e) {
    opportunityCards.innerHTML = `<p class='error-message'>There was an error fetching saved opportunities. ${e.message}</p>`;
  }
}

const tabs = document.querySelectorAll(".tab");

function setActiveTab(name) {
  activeTab = name;
  tabs.forEach((t) => {
    t.classList.toggle("tab--active", t.dataset.tab === activeTab);
    t.setAttribute("aria-selected", String(t.dataset.tab === activeTab));
  });
}

function initTabs() {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selected = tab.dataset.tab;
      if (selected === activeTab) return;

      setActiveTab(selected);

      if (activeTab === "all") {
        loadOpportunities();
      } else {
        loadSavedOpportunities();
      }
    });
  });
}

async function prefetchSavedCount() {
  try {
    const res = await api.get("/opportunities/saved?limit=1");
    tabSavedCount.textContent = res.meta?.total ?? 0;
  } catch {
    // non-critical — tab count stays at 0
  }
}

initTabs();
loadOpportunities();
if (isLoggedIn) prefetchSavedCount();
