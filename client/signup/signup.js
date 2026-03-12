// 1. Mount components
document.getElementById("firstname-field").appendChild(
  Input.create({
    type: "text",
    placeholder: "Enter first name",
    name: "firstName",
    variant: "filled",
    required: true,
  }),
);

document.getElementById("lastname-field").appendChild(
  Input.create({
    type: "text",
    placeholder: "Enter last name",
    name: "lastName",
    variant: "filled",
    required: true,
  }),
);

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
    placeholder: "Confirm password",
    name: "password",
    variant: "filled",
  }),
);

document.getElementById("submit-btn").appendChild(
  Button.create({
    label: "Create account",
    variant: "primary",
    full: true,
    type: "submit",
  }),
);

// 2. Handle submit
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const firstName = e.target.querySelector('[name="firstName"]').value.trim();
  const lastName = e.target.querySelector('[name="lastName"]').value.trim();
  const email = e.target.querySelector('[name="email"]').value.trim();
  const password = e.target.querySelector('[name="password"]').value;
  const errorEl = document.getElementById("signup-error");
  errorEl.hidden = true;

  try {
    await AuthService.signup(email, password, firstName, lastName);
    window.location.href = "/client/opportunities/index.html";
  } catch (err) {
    errorEl.textContent = err.message || "Sign up failed. Please try again.";
    errorEl.hidden = false;
  }
});
