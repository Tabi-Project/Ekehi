import { guardAdmin, renderSidebar, formatDate, statusBadge, CONTENT_TYPE_LABELS, getItemTitle, getSubmitterName } from "/shared/utils/admin.utils.js";
import api from "/shared/services/api.js";

if (!guardAdmin()) throw new Error("Access denied");
renderSidebar();

const CONTENT_TYPES = Object.keys(CONTENT_TYPE_LABELS);

async function loadDashboard() {
  try {
    const { data } = await api.get("/admin/queue?status=pending&limit=100");
    const items = data ?? [];

    renderStatCards(items);
    renderRecentQueue(items.slice(0, 10));
  } catch (err) {
    document.getElementById("stat-cards").innerHTML =
      `<p class="error-message">Failed to load dashboard: ${err.message}</p>`;
  }
}

function countByType(items) {
  return CONTENT_TYPES.reduce((acc, type) => {
    acc[type] = items.filter((i) => i.content_type === type).length;
    return acc;
  }, {});
}

function renderStatCards(items) {
  const counts = countByType(items);
  const total = items.length;

  const cards = [
    { label: "Total Pending", count: total, href: "/admin/queue/" },
    ...CONTENT_TYPES.map((type) => ({
      label: CONTENT_TYPE_LABELS[type],
      count: counts[type],
      href: `/admin/queue/?type=${type}`,
    })),
  ];

  document.getElementById("stat-cards").innerHTML = cards
    .map(
      ({ label, count, href }) => `
    <a href="${href}" class="stat-card">
      <span class="stat-card__label">${label}</span>
      <span class="stat-card__count">${count}</span>
      <span class="stat-card__sub">pending review</span>
    </a>
  `,
    )
    .join("");
}

function renderRecentQueue(items) {
  const tbody = document.getElementById("recent-queue-body");

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
      <td><a href="/admin/review/?type=${item.content_type}&id=${item.id}">Review →</a></td>
    </tr>
  `,
    )
    .join("");
}

loadDashboard();
