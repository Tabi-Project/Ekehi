import AuthService from "/shared/services/auth.service.js";
import Button from "/shared/components/button/button.js";
import Input from "/shared/components/input/input.js";


// ── Redirect if already logged in ─────────────────────
if (AuthService.isLoggedIn()) {
  window.location.href = '/opportunities/';
}

// ── Step references ────────────────────────────────────
const step1 = document.getElementById('signup-step-1');


// ── Mount Step 1 components ────────────────────────────
document.getElementById('email-field').appendChild(
  Input.create({
    type: 'email',
    placeholder: 'Email address',
    name: 'email',
    variant: 'filled',
    required: true,
  })
);

document.getElementById('fullname-field').appendChild(
  Input.create({
    type: 'text',
    placeholder: 'Full name',
    name: 'fullname',
    variant: 'filled',
    required: true,
  })
);

document.getElementById('continue-btn').appendChild(
  Button.create({
    label: 'Continue',
    variant: 'primary',
    full: true,
    type: 'button',
  })
);

// ── Step 1 — Continue ──────────────────────────────────
document.getElementById('continue-btn').addEventListener('click', () => {
  const email    = document.querySelector('[name="email"]').value.trim();
  const fullname = document.querySelector('[name="fullname"]').value.trim();
  const errorEl  = document.getElementById('signup-error-1');

  errorEl.hidden = true;
  errorEl.textContent = '';

  if (!email || !fullname) {
    errorEl.textContent = 'Please fill in all fields.';
    errorEl.hidden = false;
    return;
  }

  step1.hidden = true;
  step2.hidden = false;
});

// ── Step 1 — Back (go to login) ────────────────────────
document.getElementById('back-btn-1').addEventListener('click', () => {
  window.location.href = '/client/login/index.html';
});

  const fullname        = document.querySelector('[name="fullname"]').value.trim();
  const email           = document.querySelector('[name="email"]').value.trim();

  errorEl.hidden = true;
  errorEl.textContent = '';

  const [firstName, ...rest] = fullname.split(' ');
  const lastName = rest.join(' ') || '';
