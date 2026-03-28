import AuthService from "/shared/services/auth.service.js";
import Button from "/shared/components/button/button.js";
import Input from "/shared/components/input/input.js";

if (AuthService.isLoggedIn()) {
  window.location.href = "/opportunities/";
}

document.getElementById("email-field").appendChild(
  Input.create({
    type: "email",
    placeholder: "Email address",
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
    label: "Continue",
    variant: "primary",
    full: true,
    type: "submit",
  }),
);

document.getElementById("return-btn").appendChild(
  Button.create({
    label: "Back",
    variant: "outline",
    full: true,
    type: "button",
    as: "a",
    href: "/",
  }),
);

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.querySelector('[name="email"]').value.trim();
  const password = e.target.querySelector('[name="password"]').value;
  const errorEl = document.getElementById("login-error");
  const submitBtn = document.querySelector("#submit-btn button");

  errorEl.hidden = true;
  errorEl.textContent = "";
  submitBtn.disabled = true;

  try {
    const result = await AuthService.login(email, password);
    if (result?.data) window.location.href = "/opportunities/";
  } catch (err) {
    errorEl.textContent = err.message || "Login failed. Please try again.";
    errorEl.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
});
