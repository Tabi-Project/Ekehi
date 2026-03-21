import AuthService from "/shared/services/auth.service.js";

export const REVIEWER_ROLES = ["super-admin", "data-manager"];
const CONTENT_EDITOR_PATHS = ["/submit/", "/my-submissions/"];

export const CONTENT_TYPE_LABELS = {
  funding_opportunity: "Funding Opportunity",
  training_programme: "Training Programme",
  guide: "Guide",
  template: "Template",
};

/**
 * Redirect to login if not authenticated, or to home if wrong role.
 * - /submit/ and /my-submissions/ are content-editor only
 * - /admin/* pages are reviewer (super-admin, data-manager) only
 */
export function guardAdmin() {
  if (!AuthService.isLoggedIn()) {
    window.location.href = `/login/?redirect=${encodeURIComponent(window.location.pathname)}`;
    return false;
  }

  const path = window.location.pathname;
  const isContentEditorPage = CONTENT_EDITOR_PATHS.some((p) => path.startsWith(p));

  if (isContentEditorPage) {
    if (!AuthService.hasRole("content-editor")) {
      window.location.href = "/";
      return false;
    }
  } else {
    if (!AuthService.hasRole(...REVIEWER_ROLES)) {
      window.location.href = "/";
      return false;
    }
  }

  return true;
}

/**
 * Render the admin sidebar into an element with id="admin-sidebar".
 * Highlights the active link based on the current path.
 */
export function renderSidebar() {
  const sidebar = document.getElementById("admin-sidebar");
  if (!sidebar) return;

  const path = window.location.pathname;
  const role = AuthService.getRole();

  const isReviewer = REVIEWER_ROLES.includes(role);
  const isContentEditor = role === "content-editor";

  const navItems = [
    ...(isReviewer ? [{ href: "/admin/", label: "Dashboard", icon: "⬛" }] : []),
    ...(isReviewer ? [{ href: "/admin/queue/", label: "Review Queue", icon: "📋" }] : []),
    ...(isContentEditor ? [{ href: "/submit/", label: "Submit Content", icon: "✏️" }] : []),
    ...(isContentEditor ? [{ href: "/my-submissions/", label: "My Submissions", icon: "📁" }] : []),
  ];

  sidebar.innerHTML = `
    <div class="admin-sidebar__brand">
      <a href="/" class="admin-sidebar__logo">Ekehi</a>
      <span class="admin-sidebar__role">${role}</span>
    </div>
    <nav class="admin-sidebar__nav">
      ${navItems
        .map(
          ({ href, label, icon }) => `
        <a href="${href}" class="admin-sidebar__link ${path === href ? "is-active" : ""}">
          <span>${icon}</span> ${label}
        </a>
      `,
        )
        .join("")}
    </nav>
    <div class="admin-sidebar__footer">
      <a href="/opportunities/" class="admin-sidebar__link">← Back to site</a>
      <button class="admin-sidebar__logout" id="admin-logout">Log out</button>
    </div>
  `;

  document.getElementById("admin-logout")?.addEventListener("click", () => AuthService.logout());
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function statusBadge(status) {
  const map = {
    pending: "badge--pending",
    approved: "badge--approved",
    rejected: "badge--rejected",
  };
  return `<span class="badge ${map[status] ?? ""}">${status}</span>`;
}

export function getItemTitle(item) {
  return item.opportunity_title ?? item.programme_name ?? item.title ?? "—";
}

export function getSubmitterName(item) {
  const p = item.profiles;
  if (!p) return "—";
  return [p.first_name, p.last_name].filter(Boolean).join(" ") || p.email || "—";
}
