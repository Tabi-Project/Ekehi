import { guardAdmin, renderSidebar, formatDate, statusBadge, CONTENT_TYPE_LABELS, getItemTitle, getSubmitterName } from "/shared/utils/admin.utils.js";
import api from "/shared/services/api.js";

if (!guardAdmin()) throw new Error("Access denied");
renderSidebar();

const CONTENT_TYPES = Object.keys(CONTENT_TYPE_LABELS);

// Read ?type= from URL
const params = new URLSearchParams(window.location.search);
let activeType = params.get("type") ?? "all";

function renderTabs() {
  const tabs = [{ key: "all", label: "All" }, ...CONTENT_TYPES.map((t) => ({ key: t, label: CONTENT_TYPE_LABELS[t] }))];

  document.getElementById("type-tabs").innerHTML = tabs
    .map(
      ({ key, label }) => `
    <button class="admin-tab ${activeType === key ? "is-active" : ""}" data-type="${key}">
      ${label}
    </button>
  `,
    )
    .join("");

  document.querySelectorAll(".admin-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeType = btn.dataset.type;
      renderTabs();
      loadQueue();
    });
  });
}

async function loadQueue() {
  const tbody = document.getElementById("queue-body");
  tbody.innerHTML = `<tr><td colspan="6" class="loading">Loading…</td></tr>`;

  try {
    const typeParam = activeType !== "all" ? `&type=${activeType}` : "";
    const { data } = await api.get(`/admin/queue?status=pending${typeParam}&limit=50`);
    const items = data?.items ?? [];
    renderRows(items);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="error-message">Failed to load queue: ${err.message}</td></tr>`;
  }
}

function renderRows(items) {
  const tbody = document.getElementById("queue-body");

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="admin-empty">No pending submissions</td></tr>`;
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
      <td>${getSubmitterName(item)}</td>
      <td>${formatDate(item.created_at)}</td>
      <td>${statusBadge(item.approval_status)}</td>
      <td>
        <a href="/admin/review/?type=${item.content_type}&id=${item.id}">Review →</a>
      </td>
    </tr>
  `,
    )
    .join("");
}

renderTabs();
loadQueue();
