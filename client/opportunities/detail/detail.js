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

const SAVE_LABEL = { saved: "Saved", unsaved: "Save" };

function getElements() {
  const root = document.getElementById("detail-root");
  if (!root) throw new Error("detail-root element not found");
  return {
    root,
    contentEl: root.querySelector(".detail-content"),
    asideEl: root.querySelector(".detail-aside"),
    loadingEl: root.querySelector(".loading"),
    refCodeEl: document.getElementById("detail-ref-code"),
    currentDetailEl: document.querySelector(".current-detail-page"),
  };
}

const els = getElements();

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
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

function eligibilityList(str) {
  if (!str) return "<p>—</p>";
  const items = str
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean);
  return `<ul class="eligibility-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderHeader(opp) {
  return `
    <header class="detail-header">
      <h1 class="detail-title">${escapeHtml(opp.opportunity_title)}</h1>
      <div class="detail-header__badges">
        <span class="badge badge--type">${humanize(opp.opportunity_type)}</span>
        <span class="badge badge--${escapeHtml(opp.status)}">${humanize(opp.status)}</span>
        ${opp.is_women_only ? '<span class="badge badge--flag">Women only</span>' : ""}
        ${opp.is_equity_free ? '<span class="badge badge--flag">Equity free</span>' : ""}
      </div>
    </header>`;
}

function renderBody(opp) {
  return `
    <section class="detail-body">
      <div class="detail-section">
        <h2>About this opportunity</h2>
        <p>${escapeHtml(opp.description) || "—"}</p>
      </div>
      <div class="detail-section">
        <h2>Eligibility criteria</h2>
        ${eligibilityList(opp.eligibility_criteria)}
      </div>
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

function renderAsideHTML(opp, deadlineDate) {
  const deadlineSub = daysUntil(deadlineDate);
  const contactEmail = escapeHtml(opp.contact_email);
  const contactHTML = contactEmail
    ? `<p class="detail-contact">Contact: <a href="mailto:${contactEmail}">${contactEmail}</a></p>`
    : "";

  return `
    <div class="aside-actions"></div>
    <dl class="detail-meta">
      <div class="detail-meta__item">
        <dt class="detail-meta__label">Organiser</dt>
        <dd class="detail-meta__value">${escapeHtml(opp.funder_name) || "—"}</dd>
      </div>
      <div class="detail-meta__item">
        <dt class="detail-meta__label">Amount</dt>
        <dd class="detail-meta__value">${formatAmount(opp.amount_min, opp.amount_max, opp.currency)}</dd>
      </div>
      <div class="detail-meta__item">
        <dt class="detail-meta__label">Deadline</dt>
        <dd class="detail-meta__value">
          ${formatDate(deadlineDate)}
          ${deadlineSub ? `<br><span class="detail-meta__sub">${deadlineSub}</span>` : ""}
        </dd>
      </div>
      <div class="detail-meta__item">
        <dt class="detail-meta__label">Country/Region</dt>
        <dd class="detail-meta__value">${escapeHtml(opp.country) || "—"}</dd>
      </div>
      ${contactHTML}
    </dl>
  `;
}

function appendApplyAction(actionsEl, applyUrl) {
  if (applyUrl) {
    const btn = Button.create({
      label: "Apply",
      variant: "primary",
      as: "a",
      href: applyUrl,
      className: "apply-btn",
    });
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    actionsEl.appendChild(btn);
  } else {
    const p = document.createElement("p");
    p.className = "no-apply";
    p.textContent = "No application link available.";
    actionsEl.appendChild(p);
  }
}

function appendSaveButton(actionsEl, oppId) {
  const saveBtn = Button.create({
    label: SAVE_LABEL.unsaved,
    variant: "outline",
    className: "save-btn",
  });
  saveBtn.dataset.id = oppId;
  saveBtn.dataset.saved = "false";
  saveBtn.setAttribute("aria-pressed", "false");
  actionsEl.appendChild(saveBtn);
  return saveBtn;
}

function buildAside(opp, deadlineDate) {
  els.asideEl.innerHTML = renderAsideHTML(opp, deadlineDate);
  const actionsEl = els.asideEl.querySelector(".aside-actions");
  appendApplyAction(actionsEl, opp.apply_url);
  return appendSaveButton(actionsEl, opp.id);
}

function createSaveModal() {
  const modal = new Modal({
    id: "save-modal",
    className: "modal--centered",
    content: `
      <img src="/assets/icons/ekehi-logo2.png" alt="Ekehi" class="modal__icon" />
      <h2 class="modal__title">Save this opportunity</h2>
      <p class="modal__body">Create a free account to save and track opportunities that matter to you.</p>
      <div class="modal__actions">
        <a href="/signup/" class="btn btn--primary">Create account</a>
        <p class="modal__login-hint">Already have an account? <a href="/login/">Login</a></p>
      </div>`,
  });

  modal.el.querySelector(".modal__actions").appendChild(
    Button.create({
      label: "Continue browsing",
      variant: "ghost",
      onClick: () => modal.close(),
    }),
  );

  return modal;
}

function setSavedState(btn, isSaved) {
  btn.dataset.saved = String(isSaved);
  btn.setAttribute("aria-pressed", String(isSaved));
  btn.textContent = isSaved ? SAVE_LABEL.saved : SAVE_LABEL.unsaved;
}

function registerSaveClick(btn, opportunityId, modal) {
  btn.addEventListener("click", async () => {
    if (!AuthService.isLoggedIn()) {
      modal.open();
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

function initSaveButton(saveBtn, opp, modal) {
  if (AuthService.isLoggedIn()) setSavedState(saveBtn, opp.is_saved ?? false);
  registerSaveClick(saveBtn, opp.id, modal);
}

function updatePageMeta(opp) {
  document.title = `Ekehi — ${opp.opportunity_title}`;
  if (opp.reference_code) els.refCodeEl.textContent = opp.reference_code;
  if (opp.opportunity_title)
    els.currentDetailEl.textContent = opp.opportunity_title;
}

function render(opp) {
  updatePageMeta(opp);

  const deadlineDate = opp.application_deadline
    ? new Date(opp.application_deadline)
    : null;

  els.contentEl.innerHTML = `${renderHeader(opp)}${renderBody(opp)}`;

  const saveBtn = buildAside(opp, deadlineDate);

  els.loadingEl.remove();
  els.root.classList.add("is-loaded");

  const modal = createSaveModal();
  initSaveButton(saveBtn, opp, modal);
}

function renderError(message) {
  els.loadingEl.className = "error-message";
  els.loadingEl.textContent = message;
}

async function loadOpportunity() {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    renderError("No opportunity ID provided.");
    return;
  }

  try {
    const res = await api.get(`/opportunities/${id}`);
    if (!res.data) {
      renderError("Opportunity not found.");
      return;
    }
    render(res.data);
  } catch (error) {
    renderError(
      `There was an error loading this opportunity. ${error.message}`,
    );
  }
}

loadOpportunity();
