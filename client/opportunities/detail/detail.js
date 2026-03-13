import api from "/shared/services/api.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";
import {
  formatAmount,
  daysUntil,
  humanize,
} from "/shared/utils/opportunity.utils.js";

const root = document.getElementById("detail-root");

function formatDate(date) {
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function tagList(arr) {
  if (!arr?.length) return "<span>—</span>";
  return arr
    .map((t) => `<span class="badge badge--tag">${humanize(t)}</span>`)
    .join("");
}

function breadcrumb(refCode = "") {
  return `
    <nav class="detail-breadcrumb flex items-center justify-between" aria-label="Breadcrumb">
      <a href="/opportunities/" class="back-link">← Back to Opportunities</a>
      ${refCode ? `<span class="ref-code">${refCode}</span>` : ""}
    </nav>`;
}

function renderHeader(opp) {
  return `
    <header class="detail-header">
      <div class="detail-header__badges">
        <span class="badge badge--${opp.status}">${humanize(opp.status)}</span>
        <span class="badge badge--type">${humanize(opp.opportunity_type)}</span>
        ${opp.is_women_only ? '<span class="badge badge--flag">Women only</span>' : ""}
        ${opp.is_equity_free ? '<span class="badge badge--flag">Equity free</span>' : ""}
      </div>
      <h1 class="detail-title">${opp.opportunity_title}</h1>
      <p class="detail-funder">${opp.funder_name}</p>
    </header>`;
}

function renderStats(opp, deadlineDate) {
  const deadlineSub = daysUntil(deadlineDate);
  return `
    <section class="detail-stats">
      <div class="detail-stat">
        <span class="detail-stat__label">Funding</span>
        <span class="detail-stat__value">${formatAmount(opp.amount_min, opp.amount_max, opp.currency)}</span>
      </div>
      <div class="detail-stat">
        <span class="detail-stat__label">Deadline</span>
        <span class="detail-stat__value">${formatDate(deadlineDate)}</span>
        ${deadlineSub ? `<span class="detail-stat__sub">${deadlineSub}</span>` : ""}
      </div>
      <div class="detail-stat">
        <span class="detail-stat__label">Country</span>
        <span class="detail-stat__value">${opp.country ?? "—"}</span>
      </div>
    </section>`;
}

function renderBody(opp) {
  return `
    <section class="detail-body">
      <article class="detail-section">
        <h2>About this opportunity</h2>
        <p>${opp.description ?? "—"}</p>
      </article>
      <article class="detail-section">
        <h2>Eligibility criteria</h2>
        <p>${opp.eligibility_criteria ?? "—"}</p>
      </article>
      <div class="detail-tags-row">
        <div class="detail-section">
          <h2>Sectors</h2>
          <div class="detail-tags">${tagList(opp.sectors)}</div>
        </div>
        <div class="detail-section">
          <h2>Stages</h2>
          <div class="detail-tags">${tagList(opp.stages)}</div>
        </div>
      </div>
    </section>`;
}

function renderActions(opp) {
  const applyLink = opp.apply_url
    ? `<a href="${opp.apply_url}" target="_blank" rel="noopener noreferrer" class="btn btn--primary apply-btn">Apply now</a>`
    : '<p class="no-apply">No application link available.</p>';

  const contactLine = opp.contact_email
    ? `<p class="detail-contact">Contact: <a href="mailto:${opp.contact_email}">${opp.contact_email}</a></p>`
    : "";

  return `<div class="detail-actions">${applyLink}${contactLine}</div>`;
}

function render(opp) {
  document.title = `Ekehi — ${opp.opportunity_title}`;
  const deadlineDate = opp.application_deadline
    ? new Date(opp.application_deadline)
    : null;

  root.innerHTML = `
    ${breadcrumb(opp.reference_code)}
    ${renderHeader(opp)}
    ${renderStats(opp, deadlineDate)}
    ${renderBody(opp)}
    ${renderActions(opp)}
  `;
}

function renderError(message) {
  root.innerHTML = `${breadcrumb()}<p class="error-message">${message}</p>`;
}

async function loadOpportunity() {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    renderError("No opportunity ID provided.");
    return;
  }

  root.innerHTML = `<p class="loading">Loading opportunity…</p>`;

  try {
    const res = await api.get(`/opportunities/${id}`);
    if (!res.data) {
      renderError("Opportunity not found.");
      return;
    }
    render(res.data);
  } catch (e) {
    renderError(`There was an error loading this opportunity. ${e.message}`);
  }
}

loadOpportunity();
