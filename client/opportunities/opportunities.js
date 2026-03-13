import api from "/shared/services/api.js";
import Dropdown from "/shared/components/dropdown/dropdown.js";
import SearchBar from "/shared/components/search-bar/search-bar.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

const searchBar = document.getElementById("search-bar");
const filterContainer = document.getElementById("filter-dropdowns");
const totalOpportunities = document.querySelector(".total");
const listHead = document.querySelector(".list-head");
const opportunityCard = document.querySelector(".opportunityCard");

// 1. Filter state object — single source of truth
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
  console.log("[Opportunities] active filters:", filters);
}

// 2. Search bar
searchBar.appendChild(
  SearchBar.create({
    placeholder: "Search 30+ funding opportunities",
    onSearch: (query) => onFilterChange("search", query),
  }),
);

// 3. Filter dropdowns

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
      {
        value: "financial_services_fintech",
        label: "Financial Services & Fintech",
      },
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
    options: [
      { value: "open", label: "Open" },
      { value: "rolling_applications", label: "Rolling Applications" },
      { value: "closed", label: "Closed" },
    ],
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
    options: [
      { value: "grant_ngo", label: "Grant (NGO)" },
      { value: "grant_government", label: "Grant (Government)" },
      { value: "angel_investment", label: "Angel Investment" },
      { value: "accelerator", label: "Accelerator" },
      { value: "loan", label: "Loan" },
      { value: "microfinance", label: "Microfinance" },
      { value: "vc", label: "VC" },
      { value: "prize_money", label: "Prize Money" },
    ],
    onChange: (value) => onFilterChange("opportunity_type", value),
  }),
);

function formatAmount(min, max, currency) {
  const fmt = (n) =>
    n != null ? `${currency ?? ""}${(n / 1_000_000).toFixed(0)}m` : "—";
  return `${fmt(min)} - ${fmt(max)}`;
}

function daysUntil(dateStr) {
  if (!dateStr) return "—";
  const diff = Math.ceil((new Date(dateStr) - Date.now()) / 86_400_000);
  if (diff < 0) return "Closed";
  if (diff === 0) return "Closes today";
  return `${diff} days left`;
}

function closingSoon(dateStr, status) {
  status = (status ?? "").replace(/_/g, " ");
  if (!dateStr) return status;
  const diff = Math.ceil((new Date(dateStr) - Date.now()) / 86_400_000);
  if (diff <= 10) status = "closing soon";
  return status;
}

function populateOpportunities(opps) {
  listHead.innerHTML = `<p>amount</p> <p>deadline</p>`;
  opportunityCard.innerHTML = opps
    .map(
      (opp) => `
     <div class="opportunity-card">
      <div class="opportunity-amount">
        <p class="foundation-amount">${formatAmount(opp.amount_min, opp.amount_max, opp.currency)}</p>
        <p class="foundation-type">${(opp.opportunity_type ?? "").replace(/_/g, " ")}</p>
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
        <p>${daysUntil(opp.application_deadline)}</p>
      </div>
     </div>
     `,
    )
    .join("");
}

async function loadOpportunities() {
  opportunityCard.innerHTML = `<p class='loading'>Loading Opportunities</p>`;
  try {
    const res = await api.get("/opportunities");
    const opportunities = res.data ?? [];
    const total = res.meta?.total ?? opportunities.length;

    totalOpportunities.innerHTML = total;

    total === 0
      ? (opportunityCard.innerHTML = "No Opportunities found")
      : populateOpportunities(opportunities);
  } catch (e) {
    console.log("error:", e);
    opportunityCard.innerHTML = `<p class='error-message'>There was an error fetching opportunities. ${e.message}</p>`;
  }
}

loadOpportunities();
