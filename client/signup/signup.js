document
  .getElementById("preview-input")
  .appendChild(Input.create({ placeholder: "Email address", type: "email" }));

document
  .getElementById("preview-password")
  .appendChild(Input.createPassword({ placeholder: "Password" }));

document
  .getElementById("preview-button")
  .appendChild(Button.create({ label: "Create account", variant: "primary" }));
