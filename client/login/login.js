// ── Redirect if already logged in ─────────────────────
if (AuthService.isLoggedIn()) {
  window.location.href = "/opportunities/index.html";
}

// ── Mount components ───────────────────────────────────
document.getElementById("email-field").appendChild(
  Input.create({
    type: "email",
    placeholder: "Enter email address",
    name: "email",
    variant: "filled",
    required: true,
  }),
);

document.getElementById("password-field").appendChild(
  Input.createPassword({
    placeholder: "Enter password",
    name: "password",
    variant: "filled",
  }),
);

document.getElementById("submit-btn").appendChild(
  Button.create({
    label: "Login account",
    variant: "primary",
    full: true,
    type: "submit",
  }),
);

// ── Handle submit ──────────────────────────────────────
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.querySelector('[name="email"]').value.trim();
  const password = e.target.querySelector('[name="password"]').value;
  const errorEl = document.getElementById("login-error");

  // Reset error state before each attempt
  errorEl.hidden = true;
  errorEl.textContent = "";

  try {
    await AuthService.login(email, password);
    window.location.href = "/opportunities/index.html";
  } catch (err) {
    errorEl.textContent = err.message || "Login failed. Please try again.";
    errorEl.hidden = false;
  }
});
