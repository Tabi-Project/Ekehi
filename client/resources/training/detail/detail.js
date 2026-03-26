import api from "/shared/services/api.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";
import {
  formatDate,
  daysUntil,
  humanize,
} from "/shared/utils/opportunity.utils.js";
import EKEHI_ENUMS from "/shared/constants/enums.js";


// ── State helpers ──────────────────────────────────────
function showLoading() {
  document.getElementById("detail-loading").hidden = false;
  document.getElementById("detail-error").hidden   = true;
  document.getElementById("detail-content").hidden = true;
}

function showError(message) {
  document.getElementById("detail-loading").hidden            = true;
  document.getElementById("detail-error").hidden              = false;
  document.getElementById("detail-content").hidden            = true;
  document.getElementById("detail-error-message").textContent = message;
}

function showContent() {
  document.getElementById("detail-loading").hidden = true;
  document.getElementById("detail-error").hidden   = true;
  document.getElementById("detail-content").hidden = false;
}

// ── Helpers ────────────────────────────────────────────
function formatLabel(value) {
  const map = {
    online:    "Virtual event",
    in_person: "In-person event",
    hybrid:    "Hybrid event",
  };
  return map[value] ?? humanize(value) ?? "—";
}

// ── Render ─────────────────────────────────────────────
function render(programme) {
  const deadline = programme.application_deadline;

  const typeLabel =
    EKEHI_ENUMS.programmeType[programme.programme_type] ??
    humanize(programme.programme_type);

  const locationLabel =
    EKEHI_ENUMS.locationScope[programme.location_scope] ??
    programme.location_scope ??
    "—";

  document.getElementById("detail-datetime").textContent =
    deadline ? formatDate(deadline) : "Date TBC";

  document.getElementById("detail-title").textContent =
    programme.programme_name || "Untitled programme";

  const cta = document.getElementById("detail-cta");
  if (programme.apply_url) {
    cta.href = programme.apply_url;
    cta.style.display = "inline-block";
  } else {
    cta.style.display = "none";
  }

  // Cover panel
  const typeEl = document.getElementById("detail-type");
  const hostEl = document.getElementById("detail-host");
  if (typeEl) typeEl.textContent = typeLabel || "Training";
  if (hostEl) hostEl.textContent = programme.provider || "";

  document.getElementById("detail-description").textContent =
    programme.description || "No description available.";

  document.getElementById("sidebar-format-value").textContent =
    formatLabel(programme.format);

  document.getElementById("sidebar-deadline-value").textContent =
    deadline ? daysUntil(deadline) : "Date TBC";

  document.getElementById("sidebar-language-value").textContent = "English";

  document.getElementById("sidebar-provider-value").textContent =
    programme.provider || "—";

  const locationEl = document.getElementById("sidebar-location-value");
  if (locationEl) locationEl.textContent = locationLabel;

  document.title = `${programme.programme_name} — Ekehi`;

  showContent();

  const breadcrumb = document.getElementById("detail-breadcrumb-title");
  if (breadcrumb) breadcrumb.textContent = programme.programme_name;

  // Colour the cover panel to match the card colours
const CARD_COLORS = {
  accelerator:          { bg: "#F9E6FF", text: "#581c87" },
  bootcamp:             { bg: "#ffedd5", text: "#7c2d12" },
  workshop:             { bg: "#DEF6EB", text: "#033F25" },
  online_course:        { bg: "#dbeafe", text: "#1e3a8a" },
  mentorship_programme: { bg: "#fce7f3", text: "#831843" },
};

const colors = CARD_COLORS[programme.programme_type] ?? CARD_COLORS.accelerator;
const panel = document.getElementById("detail-cover-panel");
if (panel) {
  panel.style.backgroundColor = colors.bg;
  panel.style.color = colors.text;
}

}

// ── Fetch ──────────────────────────────────────────────
async function loadTraining() {
  showLoading();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    showError("No training programme specified.");
    return;
  }

  try {
    const res = await api.get(`/trainings/${id}`);

    if (!res?.data) {
      showError("Training programme not found.");
      return;
    }

    render(res.data);
  } catch (err) {
    if (err?.status === 404) {
      showError("This training programme could not be found.");
    } else {
      showError(err.message || "Something went wrong. Please try again.");
    }
  }
}

loadTraining();