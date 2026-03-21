import { guardAdmin, renderSidebar, formatDate, statusBadge, CONTENT_TYPE_LABELS, getItemTitle } from "/shared/utils/admin.utils.js";
import api from "/shared/services/api.js";
import Button from "/shared/components/button/button.js";

if (!guardAdmin()) throw new Error("Access denied");
renderSidebar();

document.getElementById("new-submission-btn").appendChild(
  Button.create({ label: "+ New Submission", variant: "primary", size: "sm", as: "a", href: "/submit/" }),
);

const EDIT_ENDPOINTS = {
  funding_opportunity: "/submit/",
  training_programme: "/submit/",
  guide: "/submit/",
  template: "/submit/",
};

function renderFeedbackLink(item) {
  if (item.approval_status !== "rejected") return "";
  return `<a href="/admin/review/?type=${item.content_type}&id=${item.id}" style="color:#dc2626;font-size:var(--text-xs);">View feedback</a>`;
}

function renderEditLink(item) {
  if (item.approval_status === "approved") return "";
  // Link back to submit page with type + id pre-filled for editing
  return `<a href="/submit/?edit=${item.id}&type=${item.content_type}">Edit</a>`;
}

async function loadSubmissions() {
  const tbody = document.getElementById("submissions-body");

  try {
    const { data } = await api.get("/admin/my-submissions");
    const items = data ?? [];

    if (!items.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="admin-empty">
            No submissions yet. <a href="/submit/">Submit your first piece of content →</a>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = items
      .map(
        (item) => `
      <tr>
        <td>
          <div class="admin-table__title">${getItemTitle(item)}</div>
          <div class="admin-table__meta">${item.reference_code ?? ""}</div>
        </td>
        <td>${CONTENT_TYPE_LABELS[item.content_type] ?? item.content_type}</td>
        <td>${formatDate(item.created_at)}</td>
        <td>${statusBadge(item.approval_status)}</td>
        <td style="display:flex;gap:var(--space-3);align-items:center;">
          ${renderEditLink(item)}
          ${renderFeedbackLink(item)}
        </td>
      </tr>`,
      )
      .join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="error-message">Failed to load submissions: ${err.message}</td></tr>`;
  }
}

loadSubmissions();
