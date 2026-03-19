import api from "/shared/services/api.js";
import AuthService from "/shared/services/auth.service.js";
import Dropdown from "/shared/components/dropdown/dropdown.js";
import SearchBar from "/shared/components/search-bar/search-bar.js";
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
const totalOpportunities = document.querySelector(".total");
const listHead = document.querySelector(".list-head");
const opportunityCard = document.querySelector(".opportunityCard");
const listLabel = document.getElementById("list-label");
const tabAllCount = document.getElementById("tab-all-count");
const tabSavedCount = document.getElementById("tab-saved-count");

let activeTab = "all";

const filters = {
  sector: null,
  status: null,
  stage: null,
  country: null,
  opportunity_type: null,
  search: null,
};

function onFilterChange(key, value) {
  filters[key] = value || null;
  loadOpportunities();
}

searchBar.appendChild(
  SearchBar.create({
    placeholder: "Search 30+ funding opportunities",
    onSearch: (query) => onFilterChange("search", query),
  }),
);

filterContainer.appendChild(
  Dropdown.create({
    label: "Sector",
    name: "sector",
    options: [
      { value: "agriculture_food", label: "Agriculture & Food Processing" },
      { value: "beauty_personal_care", label: "Beauty & Personal Care" },
      { value: "creative_industries", label: "Creative Industries" },
      { value: "education_edtech", label: "Education & EdTech" },
      { value: "fashion_textiles", label: "Fashion & Textiles" },
      { value: "financial_services_fintech", label: "Financial Services & Fintech" },
      { value: "health_wellness", label: "Health & Wellness" },
      { value: "logistics_distribution", label: "Logistics & Distribution" },
      { value: "retail_ecommerce", label: "Retail & E-Commerce" },
      { value: "technology_digital", label: "Technology & Digital Services" },
    ],
    onChange: (value) => onFilterChange("sector", value),
  }),
);

filterContainer.appendChild(
  Dropdown.create({
    label: "Status",
    name: "status",
    options: Object.entries(EKEHI_ENUMS.listingStatus).map(([value, label]) => ({ value, label })),
    onChange: (value) => onFilterChange("status", value),
  }),
);

filterContainer.appendChild(
  Dropdown.create({
    label: "Business stage",
    name: "stage",
    options: [
      { value: "idea", label: "Idea" },
      { value: "early", label: "Early" },
      { value: "growth", label: "Growth" },
    ],
    onChange: (value) => onFilterChange("stage", value),
  }),
);

filterContainer.appendChild(
  Dropdown.create({
    label: "Region",
    name: "country",
    options: [
      { value: "Nigeria", label: "Nigeria" },
      { value: "Ghana", label: "Ghana" },
      { value: "Kenya", label: "Kenya" },
      { value: "South Africa", label: "South Africa" },
    ],
    onChange: (value) => onFilterChange("country", value),
  }),
);

filterContainer.appendChild(
  Dropdown.create({
    label: "Type",
    name: "opportunity_type",
    options: Object.entries(EKEHI_ENUMS.opportunityType).map(([value, label]) => ({ value, label })),
    onChange: (value) => onFilterChange("opportunity_type", value),
  }),
);

function closingSoon(dateStr, status) {
  if (!dateStr) return humanize(status);
  const diff = diffDays(dateStr);
  return diff !== null && diff <= 10 ? "closing soon" : humanize(status);
}

function populateOpportunities(opps) {
  listHead.innerHTML = `<p>amount</p> <p>deadline</p>`;
  opportunityCard.innerHTML = opps
    .map(
      (opp) => `
     <a class="opportunity-card" href="/opportunities/detail/?id=${opp.id}">
      <div class="opportunity-amount">
        <p class="foundation-amount">${formatAmount(opp.amount_min, opp.amount_max, opp.currency)}</p>
        <p class="foundation-type">${humanize(opp.opportunity_type)}</p>
      </div>
      <div class="opportunity-title">
        <div class="opportunity-title-tag">
          <p>${opp.opportunity_title}</p>
          <span class='badge badge--${opp.status}'>${closingSoon(opp.application_deadline, opp.status)}</span>
        </div>
        <p class="foundaton-owner">${opp.funder_name}</p>
      </div>
      <div class="opportunity-deadline">
        <img src="/assets/images/time-vector.png" alt="clock"/>
        <p>${daysUntil(opp.application_deadline) ?? "—"}</p>
      </div>
     </a>
     `,
    )
    .join("");
}

async function loadOpportunities() {
  opportunityCard.innerHTML = `<p class='loading'>Loading Opportunities</p>`;
  try {
    const res = await api.get(`/opportunities${buildQueryString(filters)}`);
    const opportunities = res.data ?? [];
    const total = res.meta?.total ?? opportunities.length;

    totalOpportunities.innerHTML = total;
    tabAllCount.textContent = total;
    listLabel.innerHTML = `All Opportunities (<span class="total">${total}</span>)`;

    if (total === 0) {
      opportunityCard.innerHTML = "<p>No Opportunities found</p>";
    } else {
      populateOpportunities(opportunities);
    }
  } catch (e) {
    opportunityCard.innerHTML = `<p class='error-message'>There was an error fetching opportunities. ${e.message}</p>`;
  }
}

async function loadSavedOpportunities() {
  if (!AuthService.isLoggedIn()) {
    opportunityCard.innerHTML = `<p>Please <a href="/login/">log in</a> to view your saved opportunities.</p>`;
    return;
  }

  opportunityCard.innerHTML = `<p class='loading'>Loading saved opportunities…</p>`;
  try {
    const res = await api.get("/opportunities/saved");
    const opportunities = res.data ?? [];
    const total = res.meta?.total ?? opportunities.length;

    tabSavedCount.textContent = total;
    listLabel.innerHTML = `Saved Opportunities (<span class="total">${total}</span>)`;

    if (total === 0) {
      opportunityCard.innerHTML = "<p>You have no saved opportunities yet.</p>";
    } else {
      populateOpportunities(opportunities);
    }
  } catch (e) {
    opportunityCard.innerHTML = `<p class='error-message'>There was an error fetching saved opportunities. ${e.message}</p>`;
  }
}

function initTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const selected = tab.dataset.tab;
      if (selected === activeTab) return;

      activeTab = selected;

      document.querySelectorAll(".tab").forEach((t) => {
        t.classList.toggle("tab--active", t.dataset.tab === activeTab);
        t.setAttribute("aria-selected", String(t.dataset.tab === activeTab));
      });

      if (activeTab === "all") {
        loadOpportunities();
      } else {
        loadSavedOpportunities();
      }
    });
  });
}

initTabs();
loadOpportunities();
