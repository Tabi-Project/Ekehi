import api from "/shared/services/api.js";
import Dropdown from "/shared/components/dropdown/dropdown.js";
import SearchBar from "/shared/components/search-bar/search-bar.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

const previewDropdown = document.getElementById("preview-dropdown");
const previewSearchbar = document.getElementById("preview-searchbar");
const totalOpportunities = document.querySelector(".total");
const listHead = document.querySelector(".list-head");
const opportunityCard = document.querySelector(".opportunityCard");

previewDropdown.appendChild(
  Dropdown.create({
    label: "Business sector",
    options: [
      { value: "fintech", label: "Fintech" },
      { value: "health", label: "Health & Wellness" },
      { value: "retail", label: "Retail" },
    ],
  }),
);

previewSearchbar.appendChild(
  SearchBar.create({ placeholder: "Search 30+ funding opportunities" }),
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
