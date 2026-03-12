const NAV_CONFIG = {
  logo: {
    href: "/",
    src: "/assets/icons/ekehi-logo.png",
    alt: "Ekehi",
    wordmark: "ekehi",
  },
  links: [
    { href: "/contributors/", label: "Contributors" },
    { href: "/opportunities/", label: "Opportunities" },
    { href: "/resources/", label: "Resources" },
  ],
  cta: {
    signup: { href: "/signup/", label: "Sign up" },
    login: { href: "/login/", label: "Log in" },
  },
};

class NavComponent {
  #isActive(href) {
    const pathname = window.location.pathname;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  }

  #buildLogo({ href, src, alt, wordmark }) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.className = "nav__logo";
    anchor.setAttribute("aria-label", "Ekehi homepage");

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.width = 43;
    img.height = 48;

    const wordmarkEl = document.createElement("span");
    wordmarkEl.className = "nav__logo-wordmark";
    wordmarkEl.textContent = wordmark;

    anchor.append(img, wordmarkEl);
    return anchor;
  }

  #buildNavLinks(links, cta) {
    const ul = document.createElement("ul");
    ul.className = "nav__links";
    ul.id = "nav-menu";

    links.forEach(({ href, label }) => {
      const li = document.createElement("li");
      li.className = "nav__item";

      const a = document.createElement("a");
      a.href = href;
      a.className = "nav__link";
      if (this.#isActive(href)) a.setAttribute("aria-current", "page");
      a.textContent = label;

      li.appendChild(a);
      ul.appendChild(li);
    });

    // Mobile CTA
    const ctaLi = document.createElement("li");
    ctaLi.className = "nav__item nav__item--cta";

    const ctaMobile = document.createElement("div");
    ctaMobile.className = "nav__cta-mobile";
    ctaMobile.setAttribute("aria-label", "Account actions");

    ctaMobile.appendChild(
      Button.create({ label: cta.signup.label, variant: "primary", size: "sm", as: "a", href: cta.signup.href }),
    );
    ctaMobile.appendChild(
      Button.create({ label: cta.login.label, variant: "outline", size: "sm", as: "a", href: cta.login.href }),
    );

    ctaLi.appendChild(ctaMobile);
    ul.appendChild(ctaLi);

    return ul;
  }

  #buildDesktopCTA({ signup, login }) {
    const wrapper = document.createElement("div");
    wrapper.className = "nav__cta";
    wrapper.setAttribute("aria-label", "Account actions");

    wrapper.appendChild(
      Button.create({ label: signup.label, variant: "primary", size: "sm", as: "a", href: signup.href }),
    );
    wrapper.appendChild(
      Button.create({ label: login.label, variant: "outline", size: "sm", as: "a", href: login.href }),
    );

    return wrapper;
  }

  #buildToggle() {
    const btn = document.createElement("button");
    btn.className = "nav__toggle";
    btn.setAttribute("aria-label", "Open navigation menu");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "nav-menu");
    btn.type = "button";

    for (let i = 0; i < 3; i++) {
      const bar = document.createElement("span");
      bar.className = "nav__toggle-bar";
      btn.appendChild(bar);
    }

    return btn;
  }

  #buildHTML() {
    const inner = document.createElement("div");
    inner.className = "nav__inner";

    const { logo, links, cta } = NAV_CONFIG;
    inner.appendChild(this.#buildLogo(logo));
    inner.appendChild(this.#buildNavLinks(links, cta));
    inner.appendChild(this.#buildDesktopCTA(cta));
    inner.appendChild(this.#buildToggle());

    return inner;
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
      if (menu.classList.contains("nav__links--open") && !inner.contains(e.target)) {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > MOBILE_BREAKPOINT && menu.classList.contains("nav__links--open")) {
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
    mountEl.appendChild(this.#buildHTML());
    this.#attachEventListeners(mountEl);
  }
}

new NavComponent().mount("#nav-root");
