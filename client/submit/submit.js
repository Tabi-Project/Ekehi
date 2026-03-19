import { guardAdmin, renderSidebar } from "/shared/utils/admin.utils.js";
import api from "/shared/services/api.js";
import FormField from "/shared/components/form-field/form-field.js";
import Button from "/shared/components/button/button.js";

if (!guardAdmin()) throw new Error("Access denied");
renderSidebar();

const TYPE_ENDPOINTS = {
  funding_opportunity: "/opportunities",
  training_programme: "/trainings",
  guide: "/guides",
  template: "/templates",
};

const FIELD_SCHEMAS = {
  funding_opportunity: [
    { name: "opportunity_title", label: "Opportunity Title", type: "text", required: true },
    { name: "funder_name", label: "Funder / Organisation", type: "text", required: true },
    { name: "opportunity_type", label: "Opportunity Type", type: "select", required: true, options: ["grant", "loan", "equity", "prize", "accelerator", "other"] },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "eligibility_criteria", label: "Eligibility Criteria", type: "textarea" },
    { row: true, fields: [
      { name: "amount_min", label: "Min Amount", type: "number" },
      { name: "amount_max", label: "Max Amount", type: "number" },
    ]},
    { row: true, fields: [
      { name: "currency", label: "Currency", type: "text", placeholder: "e.g. USD" },
      { name: "country", label: "Country", type: "text", required: true },
    ]},
    { name: "sectors", label: "Sectors (comma-separated)", type: "text", placeholder: "e.g. agritech, fintech" },
    { name: "stages", label: "Stages (comma-separated)", type: "text", placeholder: "e.g. seed, series-a" },
    { name: "application_deadline", label: "Application Deadline", type: "date", required: true },
    { name: "apply_url", label: "Apply URL", type: "url", required: true },
    { name: "contact_email", label: "Contact Email", type: "email" },
    { row: true, fields: [
      { name: "is_women_only", label: "Women-only opportunity", type: "checkbox" },
      { name: "is_equity_free", label: "Equity-free", type: "checkbox" },
    ]},
  ],
  training_programme: [
    { name: "programme_name", label: "Programme Name", type: "text", required: true },
    { name: "provider", label: "Provider / Organisation", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { row: true, fields: [
      { name: "programme_type", label: "Programme Type", type: "select", required: true, options: ["bootcamp", "online-course", "workshop", "mentorship", "fellowship", "other"] },
      { name: "format", label: "Format", type: "select", required: true, options: ["online", "in-person", "hybrid"] },
    ]},
    { row: true, fields: [
      { name: "cost_type", label: "Cost Type", type: "select", required: true, options: ["free", "paid", "scholarship-available"] },
      { name: "location_scope", label: "Location Scope", type: "select", required: true, options: ["global", "africa", "country-specific"] },
    ]},
    { row: true, fields: [
      { name: "cost", label: "Cost Amount", type: "number" },
      { name: "currency", label: "Currency", type: "text", placeholder: "e.g. USD" },
    ]},
    { name: "topics_covered", label: "Topics Covered", type: "textarea", required: true },
    { name: "duration_range", label: "Duration Range", type: "text", placeholder: "e.g. 3-6 months" },
    { name: "location", label: "Location (city/country)", type: "text" },
    { name: "certification", label: "Certification Offered", type: "text" },
    { name: "application_deadline", label: "Application Deadline", type: "date" },
    { name: "apply_url", label: "Apply URL", type: "url", required: true },
  ],
  guide: [
    { name: "title", label: "Guide Title", type: "text", required: true },
    { name: "category", label: "Category", type: "select", required: true, options: ["funding", "legal", "marketing", "operations", "technology", "other"] },
    { name: "summary", label: "Summary", type: "textarea", required: true },
    { name: "body", label: "Content / Body", type: "textarea", required: true, rows: 10 },
    { name: "slug", label: "URL Slug", type: "text", placeholder: "auto-filled from title" },
  ],
  template: [
    { name: "title", label: "Template Title", type: "text", required: true },
    { name: "category", label: "Category", type: "select", required: true, options: ["pitch-deck", "business-plan", "financial-model", "proposal", "contract", "other"] },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "file_url", label: "File URL", type: "url", required: true, placeholder: "Google Drive, Dropbox, etc." },
  ],
};

let activeType = "funding_opportunity";

// --- Tabs ---

function renderTabs() {
  document.querySelectorAll(".submit-type-tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.type === activeType);
  });
}

document.getElementById("type-tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".submit-type-tab");
  if (!btn) return;
  activeType = btn.dataset.type;
  renderTabs();
  renderFields();
});

// --- Form building ---

function buildRow(fieldDefs) {
  const row = document.createElement("div");
  row.className = "form-row";
  fieldDefs.forEach((def) => row.appendChild(FormField.create(def)));
  return row;
}

function renderFields() {
  const container = document.getElementById("form-fields");
  container.innerHTML = "";

  FIELD_SCHEMAS[activeType].forEach((entry) => {
    const el = entry.row ? buildRow(entry.fields) : FormField.create(entry);
    container.appendChild(el);
  });

  // Auto-fill slug from title for guides
  if (activeType === "guide") {
    const titleInput = document.getElementById("title");
    const slugInput = document.getElementById("slug");
    titleInput?.addEventListener("input", () => {
      if (slugInput && !slugInput.dataset.edited) {
        slugInput.value = titleInput.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      }
    });
    slugInput?.addEventListener("input", () => { slugInput.dataset.edited = "true"; });
  }
}

// --- Submit button (built once via Button component) ---

const submitBtn = Button.create({ label: "Submit for Review", type: "submit", full: true });
document.querySelector(".submit-actions").appendChild(submitBtn);

// --- Data collection ---

function collectFormData() {
  const flat = FIELD_SCHEMAS[activeType].flatMap((e) => e.row ? e.fields : [e]);
  const payload = {};

  flat.forEach(({ name, type }) => {
    const el = document.getElementById(name);
    if (!el) return;

    if (type === "checkbox") {
      payload[name] = el.checked;
    } else if (type === "number") {
      payload[name] = el.value ? Number(el.value) : null;
    } else if (name === "sectors" || name === "stages") {
      payload[name] = el.value ? el.value.split(",").map((s) => s.trim()).filter(Boolean) : [];
    } else {
      payload[name] = el.value || null;
    }
  });

  return payload;
}

// --- Submit handler ---

document.getElementById("submit-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const errorEl = document.getElementById("form-error");
  const successEl = document.getElementById("form-success");

  errorEl.style.display = "none";
  successEl.style.display = "none";
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";

  try {
    const { data } = await api.post(TYPE_ENDPOINTS[activeType], collectFormData());
    successEl.textContent = `Submitted! Reference: ${data.reference_code ?? data.id}. It will appear publicly once approved.`;
    successEl.style.display = "block";
    document.getElementById("form-fields").querySelectorAll("input, select, textarea").forEach((el) => { el.value = ""; });
  } catch (err) {
    errorEl.textContent = err.message ?? "Submission failed. Please try again.";
    errorEl.style.display = "block";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit for Review";
  }
});

renderTabs();
renderFields();
