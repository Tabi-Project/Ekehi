import api from "/shared/services/api.js";
import AuthService from "/shared/services/auth.service.js";
import Dropdown from "/shared/components/dropdown/dropdown.js";
import EKEHI_ENUMS from "/shared/constants/enums.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

if (!AuthService.isLoggedIn()) {
  window.location.href = `/login/?redirect=${encodeURIComponent(window.location.pathname)}`;
}

// ── Dropdowns ─────────────────────────────────────────────────────────────────

const selected = { opportunity_type: null, status: null, country: null };

const DROPDOWN_CONFIGS = [
  { mountId: "opportunity_type-mount", key: "opportunity_type", enumObj: EKEHI_ENUMS.opportunityType, placeholder: "-- Select a type --" },
  { mountId: "status-mount",           key: "status",           enumObj: EKEHI_ENUMS.listingStatus,   placeholder: "-- Select status --"  },
  { mountId: "country-mount",          key: "country",          enumObj: EKEHI_ENUMS.country,         placeholder: "-- Select country --" },
];

DROPDOWN_CONFIGS.forEach(({ mountId, key, enumObj, placeholder }) => {
  const options = Object.entries(enumObj).map(([value, label]) => ({ value, label }));
  document.getElementById(mountId).appendChild(
    Dropdown.create({ label: placeholder, options, onChange: (value) => { selected[key] = value; } }),
  );
});

// ── Checkbox grids ────────────────────────────────────────────────────────────

const CHECKBOX_CONFIGS = [
  { gridId: "sectors-grid", enumObj: EKEHI_ENUMS.sector,        name: "sectors" },
  { gridId: "stages-grid",  enumObj: EKEHI_ENUMS.businessStage, name: "stages"  },
];

CHECKBOX_CONFIGS.forEach(({ gridId, enumObj, name }) => {
  const grid = document.getElementById(gridId);
  Object.entries(enumObj).forEach(([value, label]) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = name;
    checkbox.value = value;
    const wrapper = document.createElement("label");
    wrapper.className = "checkbox-option";
    wrapper.append(checkbox, document.createTextNode(label));
    grid.appendChild(wrapper);
  });
});

// ── Accordion sections ────────────────────────────────────────────────────────

document.querySelectorAll(".form-section__toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    const body = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", String(!isOpen));
    body.classList.toggle("form-section__body--collapsed", isOpen);
  });
});

// ── Form submission ───────────────────────────────────────────────────────────

const form = document.getElementById("submission-form");
const submitBtn = document.getElementById("submit-btn");
const feedback = document.getElementById("form-feedback");

function showFeedback(message, isError) {
  feedback.textContent = message;
  feedback.className = `form-feedback ${isError ? "form-feedback--error" : "form-feedback--success"}`;
  feedback.hidden = false;
  feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function collectChecked(name) {
  return [...form.querySelectorAll(`[name="${name}"]:checked`)].map(
    (el) => el.value,
  );
}

function getFieldValue(name) {
  return form.querySelector(`[name="${name}"]`)?.value.trim() || null;
}

function buildPayload() {
  return {
    opportunity_title: getFieldValue("opportunity_title"),
    opportunity_type: selected.opportunity_type,
    description: getFieldValue("description"),
    eligibility_criteria: getFieldValue("eligibility_criteria"),
    is_women_only: form.querySelector("#is_women_only").checked,
    is_equity_free: form.querySelector("#is_equity_free").checked,
    amount_min: getFieldValue("amount_min") ? Number(getFieldValue("amount_min")) : null,
    amount_max: getFieldValue("amount_max") ? Number(getFieldValue("amount_max")) : null,
    application_deadline: getFieldValue("application_deadline"),
    status: selected.status,
    sectors: collectChecked("sectors"),
    stages: collectChecked("stages"),
    funder_name: getFieldValue("funder_name"),
    contact_email: getFieldValue("contact_email"),
    apply_url: getFieldValue("apply_url"),
    country: selected.country,
    currency: "NGN",
  };
}

function validate(payload) {
  if (!payload.opportunity_title) return "Opportunity name is required.";
  if (!payload.opportunity_type) return "Please select an opportunity type.";
  if (!payload.description) return "Opportunity description is required.";
  if (!payload.funder_name) return "Organizer name is required.";
  return null;
}

function resetForm() {
  form.reset();
  Object.keys(selected).forEach((k) => {
    selected[k] = null;
  });
  document.querySelectorAll(".form-section__body--collapsed").forEach((el) => {
    el.classList.remove("form-section__body--collapsed");
  });
  document.querySelectorAll(".form-section__toggle").forEach((btn) => {
    btn.setAttribute("aria-expanded", "true");
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  feedback.hidden = true;

  const payload = buildPayload();
  const error = validate(payload);
  if (error) return showFeedback(error, true);

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";

  try {
    await api.post("/opportunities", payload);
    showFeedback(
      "Your opportunity has been submitted for review. We'll notify you once it's live.",
      false,
    );
    resetForm();
  } catch (err) {
    showFeedback(
      err.message ?? "Something went wrong. Please try again.",
      true,
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});
