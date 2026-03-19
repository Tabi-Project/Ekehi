import api from "/shared/services/api.js";
import AuthService from "/shared/services/auth.service.js";
import Modal from "/shared/components/modal/modal.js";
import Button from "/shared/components/button/button.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";
import {
  formatAmount,
  formatDate,
  daysUntil,
  humanize,
} from "/shared/utils/opportunity.utils.js";

const root = document.getElementById("detail-root");

function escapeHtml(str) {
  if (!str) return "—";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
        <p>${escapeHtml(opp.description)}</p>
      </article>
      <article class="detail-section">
        <h2>Eligibility criteria</h2>
        <p>${escapeHtml(opp.eligibility_criteria)}</p>
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

function buildActions(opp) {
  const wrapper = document.createElement("div");
  wrapper.className = "detail-actions";

  if (opp.apply_url) {
    const applyBtn = Button.create({ label: "Apply now", variant: "primary", as: "a", href: opp.apply_url, className: "apply-btn" });
    applyBtn.target = "_blank";
    applyBtn.rel = "noopener noreferrer";
    wrapper.appendChild(applyBtn);
  } else {
    const p = document.createElement("p");
    p.className = "no-apply";
    p.textContent = "No application link available.";
    wrapper.appendChild(p);
  }

  const saveBtn = Button.create({ label: "🔖 Save", variant: "outline", className: "save-btn" });
  saveBtn.dataset.id = opp.id;
  saveBtn.dataset.saved = "false";
  saveBtn.setAttribute("aria-pressed", "false");
  wrapper.appendChild(saveBtn);

  if (opp.contact_email) {
    const p = document.createElement("p");
    p.className = "detail-contact";
    p.innerHTML = `Contact: <a href="mailto:${opp.contact_email}">${opp.contact_email}</a>`;
    wrapper.appendChild(p);
  }

  return wrapper;
}

let saveModal;

function initSaveModal() {
  saveModal = new Modal({
    id: "save-modal",
    className: "modal--centered",
    content: `
      <img src="/shared/assets/ekehi-icon.svg" alt="Ekehi" class="modal__icon" />
      <h2 id="save-modal-title" class="modal__title">Save this opportunity</h2>
      <p class="modal__body">Create a free account to save and track opportunities that matter to you.</p>
      <div class="modal__actions"></div>`,
  });

  const actions = saveModal.el.querySelector(".modal__actions");

  actions.appendChild(Button.create({ label: "Create account", variant: "primary", as: "a", href: "/signup/" }));

  const alreadyP = document.createElement("p");
  alreadyP.style.cssText = "font-size:var(--text-sm);color:var(--color-text-muted);";
  alreadyP.innerHTML = `Already have an account? <a href="/login/" style="color:var(--color-primary);">Login</a>`;
  actions.appendChild(alreadyP);

  actions.appendChild(Button.create({ label: "Continue browsing", variant: "ghost", onClick: () => saveModal.close() }));
}

async function initSaveButton(opportunityId) {
  const btn = document.querySelector(".save-btn");
  if (!btn) return;

  if (AuthService.isLoggedIn()) {
    const savedRes = await api.get("/opportunities/saved").catch(() => null);
    const savedIds = savedRes?.data?.map((o) => o.id) ?? [];
    setSavedState(btn, savedIds.includes(opportunityId));
  }

  btn.addEventListener("click", async () => {
    if (!AuthService.isLoggedIn()) {
      saveModal.open();
      return;
    }

    const saved = btn.dataset.saved === "true";
    setSavedState(btn, !saved);

    try {
      if (saved) {
        await api.delete(`/opportunities/${opportunityId}/save`);
      } else {
        await api.post(`/opportunities/${opportunityId}/save`, {});
      }
    } catch {
      setSavedState(btn, saved);
    }
  });
}

function setSavedState(btn, isSaved) {
  btn.dataset.saved = String(isSaved);
  btn.setAttribute("aria-pressed", String(isSaved));
  btn.textContent = isSaved ? "🔖 Saved" : "🔖 Save";
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
  `;

  root.appendChild(buildActions(opp));
  initSaveModal();
  initSaveButton(opp.id);
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
