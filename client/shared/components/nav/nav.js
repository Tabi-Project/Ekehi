const NAV_CONFIG = {
  logo: {
    href: "/client/index.html",
    src: "/client/assets/icons/ekehi-logo.png",
    alt: "Ekehi",
    wordmark: "ekehi",
  },
  links: [{ href: "/client/contributors/index.html", label: "Contributors" }],
  cta: {
    signup: { href: "/client/signup/index.html", label: "Sign up" },
    login: { href: "/client/login/index.html", label: "Log in" },
  },
};

class NavComponent {
  #isActive(href) {
    const pathname = window.location.pathname;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  }

  #buildLogo({ href, src, alt, wordmark }) {
    return `<a href="${href}" class="nav__logo" aria-label="Ekehi homepage">
        <img src="${src}" alt="${alt}" width="43" height="48" />
        <span class="nav__logo-wordmark">${wordmark}</span>
      </a>`;
  }

  #buildNavLinks(links, cta) {
    const linkItems = links
      .map(({ href, label }) => {
        const active = this.#isActive(href);
        return `<li class="nav__item">
            <a href="${href}" class="nav__link"${active ? ' aria-current="page"' : ""}>${label}</a>
          </li>`;
      })
      .join("\n");

    return `<ul class="nav__links" id="nav-menu">
        ${linkItems}
        <li class="nav__item nav__item--cta">
          <div class="nav__cta-mobile" aria-label="Account actions">
            <a href="${cta.signup.href}" class="nav__cta-signup">${cta.signup.label}</a>
            <a href="${cta.login.href}" class="nav__cta-login">${cta.login.label}</a>
          </div>
        </li>
      </ul>`;
  }

  #buildDesktopCTA({ signup, login }) {
    return `<div class="nav__cta" aria-label="Account actions">
        <a href="${signup.href}" class="nav__cta-signup">${signup.label}</a>
        <a href="${login.href}" class="nav__cta-login">${login.label}</a>
      </div>`;
  }

  #buildToggle() {
    return `<button
        class="nav__toggle"
        aria-label="Open navigation menu"
        aria-expanded="false"
        aria-controls="nav-menu"
        type="button"
      >
        <span class="nav__toggle-bar"></span>
        <span class="nav__toggle-bar"></span>
        <span class="nav__toggle-bar"></span>
      </button>`;
  }

  #buildHTML() {
    const { logo, links, cta } = NAV_CONFIG;
    return `<div class="nav__inner">
        ${this.#buildLogo(logo)}
        ${this.#buildNavLinks(links, cta)}
        ${this.#buildDesktopCTA(cta)}
        ${this.#buildToggle()}
      </div>`;
  }

  #attachEventListeners(mount) {
    const toggle = mount.querySelector(".nav__toggle");
    const menu = mount.querySelector("#nav-menu");
    const inner = mount.querySelector(".nav__inner");

    if (!toggle || !menu || !inner) return;

    const MOBILE_BREAKPOINT = 768;

    function openMenu() {
      menu.classList.add("nav__links--open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMenu() {
      menu.classList.remove("nav__links--open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
    }

    toggle.addEventListener("click", function () {
      const isOpen = menu.classList.contains("nav__links--open");
      isOpen ? closeMenu() : openMenu();
    });

    document.addEventListener("click", function (e) {
      if (
        menu.classList.contains("nav__links--open") &&
        !inner.contains(e.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (
        window.innerWidth > MOBILE_BREAKPOINT &&
        menu.classList.contains("nav__links--open")
      ) {
        closeMenu();
      }
    });

    menu.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("nav__links--open")) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  mount(selector) {
    const mountEl = document.querySelector(selector);
    if (!mountEl) return;
    mountEl.innerHTML = this.#buildHTML();
    this.#attachEventListeners(mountEl);
  }
}

new NavComponent().mount("#nav-root");
