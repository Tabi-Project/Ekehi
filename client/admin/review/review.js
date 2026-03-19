import { guardAdmin, renderSidebar, formatDate, statusBadge, CONTENT_TYPE_LABELS, getItemTitle, getSubmitterName } from "/shared/utils/admin.utils.js";
import api from "/shared/services/api.js";
import FormField from "/shared/components/form-field/form-field.js";
import Button from "/shared/components/button/button.js";

if (!guardAdmin()) throw new Error("Access denied");
renderSidebar();

const params = new URLSearchParams(window.location.search);
const contentType = params.get("type");
const contentId = params.get("id");

if (!contentType || !contentId) {
  window.location.href = "/admin/queue/";
}

// All admin fetches go through /admin/:contentType/:id (no approval_status filter)

async function loadReview() {
  const container = document.getElementById("review-content");

  try {
    const [itemRes, historyRes] = await Promise.all([
      api.get(`/admin/${contentType}/${contentId}`),
      api.get(`/admin/${contentType}/${contentId}/reviews`),
    ]);

    const item = itemRes.data;
    const history = historyRes.data ?? [];

    const title = getItemTitle(item);
    document.getElementById("review-title").textContent = title;
    document.getElementById("review-subtitle").innerHTML =
      `${CONTENT_TYPE_LABELS[contentType] ?? contentType} &nbsp;·&nbsp; ${statusBadge(item.approval_status)}`;

    renderLayout(container, item, history);
  } catch (err) {
    container.innerHTML = `<p class="error-message">Failed to load submission: ${err.message}</p>`;
  }
}

function renderFieldRows(item) {
  const skip = new Set(["id", "approval_status", "submitted_by", "created_at", "updated_at", "profiles"]);

  return Object.entries(item)
    .filter(([key, val]) => !skip.has(key) && val !== null && val !== undefined && val !== "")
    .map(
      ([key, val]) => `
      <p class="review-card__label">${key.replace(/_/g, " ")}</p>
      <p class="review-card__value">${Array.isArray(val) ? val.join(", ") : val}</p>
    `,
    )
    .join("");
}

function renderHistory(history) {
  if (!history.length) return `<p style="font-size:var(--text-sm);color:var(--color-text-muted);">No reviews yet</p>`;

  return history
    .map((r) => {
      const reviewer = r.profiles
        ? [r.profiles.first_name, r.profiles.last_name].filter(Boolean).join(" ") || r.profiles.email
        : "Admin";
      return `
      <div class="review-history__item review-history__item--${r.decision}">
        <strong>${r.decision === "approved" ? "Approved" : "Rejected"}</strong>
        ${r.feedback ? `<p style="margin-top:var(--space-1)">${r.feedback}</p>` : ""}
        <p class="review-history__meta">${reviewer} · ${formatDate(r.created_at)}</p>
      </div>
    `;
    })
    .join("");
}

function renderLayout(container, item, history) {
  container.innerHTML = `
    <div class="review-layout">
      <div>
        <div class="review-card">
          <p class="review-card__label">Title</p>
          <p class="review-card__value review-card__value--large">${getItemTitle(item)}</p>
          <hr class="review-card__divider" />
          ${renderFieldRows(item)}
          <hr class="review-card__divider" />
          <p class="review-card__label">Submitted by</p>
          <p class="review-card__value">${getSubmitterName(item)}</p>
          <p class="review-card__label">Submitted on</p>
          <p class="review-card__value">${formatDate(item.created_at)}</p>
        </div>
      </div>

      <div id="sidebar-col"></div>
    </div>
  `;

  buildDecisionPanel(item, history);
}

function buildDecisionPanel(item, history) {
  const col = document.getElementById("sidebar-col");

  // --- Decision panel ---
  const panel = document.createElement("div");
  panel.className = "decision-panel";

  const title = document.createElement("p");
  title.className = "decision-panel__title";
  title.textContent = "Review Decision";

  const feedbackField = FormField.create({
    name: "feedback-input",
    label: "Feedback (required when rejecting)",
    type: "textarea",
    placeholder: "Leave feedback for the submitter…",
    rows: 4,
  });

  const errorEl = document.createElement("div");
  errorEl.className = "error-message";
  errorEl.style.display = "none";

  const btnApprove = Button.create({ label: "Approve", className: "btn--approve" });
  const btnReject = Button.create({ label: "Reject", variant: "outline", className: "btn--reject" });

  const actions = document.createElement("div");
  actions.className = "decision-panel__actions";
  actions.append(btnApprove, btnReject);

  panel.append(title, feedbackField, errorEl, actions);

  // --- Review history ---
  const historySection = document.createElement("div");
  historySection.className = "review-history";
  historySection.style.marginTop = "var(--space-6)";
  historySection.innerHTML = `<p class="review-history__title">Review History</p>${renderHistory(history)}`;

  col.append(panel, historySection);

  // --- Wire up interactions ---
  const isPending = item.approval_status === "pending";
  const feedbackInput = document.getElementById("feedback-input");

  if (!isPending) {
    btnApprove.disabled = true;
    btnReject.disabled = true;
    feedbackInput.disabled = true;
    return;
  }

  async function submitDecision(decision) {
    const feedback = feedbackInput.value.trim();
    errorEl.style.display = "none";

    if (decision === "rejected" && !feedback) {
      errorEl.textContent = "Feedback is required when rejecting.";
      errorEl.style.display = "block";
      return;
    }

    btnApprove.disabled = true;
    btnReject.disabled = true;

    try {
      await api.patch(`/admin/${contentType}/${contentId}/review`, { decision, feedback });
      window.location.href = "/admin/queue/";
    } catch (err) {
      errorEl.textContent = err.message ?? "Review failed. Please try again.";
      errorEl.style.display = "block";
      btnApprove.disabled = false;
      btnReject.disabled = false;
    }
  }

  btnApprove.addEventListener("click", () => submitDecision("approved"));
  btnReject.addEventListener("click", () => submitDecision("rejected"));
}

loadReview();
