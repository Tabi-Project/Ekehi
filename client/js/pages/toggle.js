(function () {

  // ── Selectors ─────────────────────────────────────
  const toggle = document.querySelector('.nav__toggle');
  const menu   = document.getElementById('nav-menu');
  const inner  = document.querySelector('.nav__inner');

  // Guard — exit silently if elements are missing from the DOM
  if (!toggle || !menu || !inner) return;

  // ── Breakpoint — matches CSS media query ──────────
  const MOBILE_BREAKPOINT = 768;

  // ── Helpers ───────────────────────────────────────
  function openMenu() {
    menu.classList.add('nav__links--open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
  }

  function closeMenu() {
    menu.classList.remove('nav__links--open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  }

  // ── Toggle on button click ─────────────────────────
  toggle.addEventListener('click', function () {
    const isOpen = menu.classList.contains('nav__links--open');
    isOpen ? closeMenu() : openMenu();
  });

  // ── Close on outside click ─────────────────────────
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('nav__links--open') && !inner.contains(e.target)) {
      closeMenu();
    }
  });

  // ── Close on viewport resize past breakpoint ───────
  window.addEventListener('resize', function () {
    if (window.innerWidth > MOBILE_BREAKPOINT && menu.classList.contains('nav__links--open')) {
      closeMenu();
    }
  });

  // ── Close on nav link click ────────────────────────
  menu.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // ── Close on Escape key ────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('nav__links--open')) {
      closeMenu();
      toggle.focus();
    }
  });

})();