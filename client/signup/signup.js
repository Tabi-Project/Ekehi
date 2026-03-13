import Button from "/shared/components/button/button.js";
import Input from "/shared/components/input/input.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

document
  .getElementById("preview-input")
  .appendChild(Input.create({ placeholder: "Email address", type: "email" }));

document
  .getElementById("preview-password")
  .appendChild(Input.createPassword({ placeholder: "Password" }));

document
  .getElementById("preview-button")
  .appendChild(Button.create({ label: "Create account", variant: "primary" }));
