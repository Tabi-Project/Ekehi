import AuthService from '/shared/services/auth.service.js';
import Button from '/shared/components/button/button.js';
import Input from '/shared/components/input/input.js';

// ── Redirect if already logged in ─────────────────────
if (AuthService.isLoggedIn()) {
  window.location.href = '/opportunities/';
}

// ── Step references ────────────────────────────────────
const step1 = document.getElementById('signup-step-1');
const step2 = document.getElementById('signup-step-2');

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

// ── Mount Step 2 components ────────────────────────────
document.getElementById('password-field').appendChild(
  Input.createPassword({
    placeholder: 'Password',
    name: 'password',
    variant: 'filled',
  })
);

document.getElementById('confirm-password-field').appendChild(
  Input.createPassword({
    placeholder: 'Confirm password',
    name: 'confirmPassword',
    variant: 'filled',
  })
);

document.getElementById('submit-btn').appendChild(
  Button.create({
    label: 'Sign up',
    variant: 'primary',
    full: true,
    type: 'submit',
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
  window.location.href = '/login/';
});

// ── Step 2 — Back (return to step 1) ──────────────────
document.getElementById('back-btn-2').addEventListener('click', () => {
  step2.hidden = true;
  step1.hidden = false;
});

// ── Step 2 — Submit ────────────────────────────────────
document.getElementById('signup-form-step2').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullname        = document.querySelector('[name="fullname"]').value.trim();
  const email           = document.querySelector('[name="email"]').value.trim();
  const password        = document.querySelector('[name="password"]').value;
  const confirmPassword = document.querySelector('[name="confirmPassword"]').value;
  const errorEl         = document.getElementById('signup-error-2');
  const submitBtn       = document.querySelector('#submit-btn button');

  errorEl.hidden = true;
  errorEl.textContent = '';

  if (password !== confirmPassword) {
    errorEl.textContent = 'Passwords do not match.';
    errorEl.hidden = false;
    return;
  }

  const [firstName, ...rest] = fullname.split(' ');
  const lastName = rest.join(' ') || '';

  submitBtn.disabled = true;

  try {
    await AuthService.signup(email, password, firstName, lastName);
    window.location.href = '/opportunities/';
  } catch (err) {
    errorEl.textContent = err.message || 'Sign up failed. Please try again.';
    errorEl.hidden = false;
    return;
  }
});
