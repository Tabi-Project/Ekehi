import api from "/shared/services/api.js";
import Dropdown from "/shared/components/dropdown/dropdown.js";
import SearchBar from "/shared/components/search-bar/search-bar.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";
import {
  formatAmount,
  daysUntil,
  humanize,
} from "/shared/utils/opportunity.utils.js";

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

function closingSoon(dateStr, status) {
  if (!dateStr) return humanize(status);
  const diff = Math.ceil((new Date(dateStr) - Date.now()) / 86_400_000);
  return diff <= 10 ? "closing soon" : humanize(status);
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
