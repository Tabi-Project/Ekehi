import AuthService from "/shared/services/auth.service.js";
import Button from "/shared/components/button/button.js";
import Input from "/shared/components/input/input.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

if (AuthService.isLoggedIn()) {
  window.location.href = "/opportunities/";
}

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
    label: "Login",
    variant: "primary",
    full: true,
    type: "submit",
  }),
);

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.querySelector('[name="email"]').value.trim();
  const password = e.target.querySelector('[name="password"]').value;
  const errorEl = document.getElementById("login-error");

  errorEl.hidden = true;
  errorEl.textContent = "";

  try {
    await AuthService.login(email, password);
    window.location.href = "/opportunities/";
  } catch (err) {
    errorEl.textContent = err.message || "Login failed. Please try again.";
    errorEl.hidden = false;
  }
});
