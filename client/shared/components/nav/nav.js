import AuthService from "/shared/services/auth.service.js";
import Button from "/shared/components/button/button.js";
import { REVIEWER_ROLES } from "/shared/utils/admin.utils.js";

const USER_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.672-10 5v1h20v-1c0-3.328-6.67-5-10-5z"/>
</svg>`;

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
  #isLoggedIn() {
    return AuthService.isLoggedIn();
  }

  #logout() {
    AuthService.logout();
  }

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

  #getRoleLinks() {
    const isReviewer = AuthService.hasRole(...REVIEWER_ROLES);
    const isContentEditor = AuthService.hasRole("content-editor");

    const links = [];
    if (isReviewer) links.push({ href: "/admin/", label: "Admin Dashboard" });
    if (isReviewer) links.push({ href: "/admin/queue/", label: "Review Queue" });
    if (isContentEditor) links.push({ href: "/submit/", label: "Submit Content" });
    if (isContentEditor) links.push({ href: "/my-submissions/", label: "My Submissions" });
    return links;
  }

  #buildAvatar() {
    const wrapper = document.createElement("div");
    wrapper.className = "nav__avatar-wrapper";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav__avatar";
    btn.setAttribute("aria-label", "Account menu");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-haspopup", "menu");
    btn.innerHTML = USER_ICON_SVG;

    const menu = document.createElement("div");
    menu.className = "nav__avatar-menu";
    menu.setAttribute("role", "menu");

    this.#getRoleLinks().forEach(({ href, label }) => {
      const a = document.createElement("a");
      a.href = href;
      a.className = "nav__avatar-menu-item";
      a.setAttribute("role", "menuitem");
      a.textContent = label;
      menu.appendChild(a);
    });

    if (menu.childElementCount > 0) {
      const divider = document.createElement("hr");
      divider.className = "nav__avatar-menu-divider";
      menu.appendChild(divider);
    }

    const logoutBtn = document.createElement("button");
    logoutBtn.type = "button";
    logoutBtn.className = "nav__avatar-menu-item";
    logoutBtn.setAttribute("role", "menuitem");
    logoutBtn.textContent = "Log out";
    logoutBtn.addEventListener("click", () => this.#logout());
    menu.appendChild(logoutBtn);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains("nav__avatar-menu--open");
      menu.classList.toggle("nav__avatar-menu--open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });

    document.addEventListener("click", () => {
      menu.classList.remove("nav__avatar-menu--open");
      btn.setAttribute("aria-expanded", "false");
    });

    wrapper.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        menu.classList.remove("nav__avatar-menu--open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });

    wrapper.append(btn, menu);
    return wrapper;
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

    if (this.#isLoggedIn()) {
      ctaMobile.appendChild(
        Button.create({
          label: "Log out",
          variant: "outline",
          size: "sm",
          onClick: () => this.#logout(),
        }),
      );
    } else {
      ctaMobile.appendChild(
        Button.create({
          label: cta.signup.label,
          variant: "primary",
          size: "sm",
          as: "a",
          href: cta.signup.href,
        }),
      );
      ctaMobile.appendChild(
        Button.create({
          label: cta.login.label,
          variant: "outline",
          size: "sm",
          as: "a",
          href: cta.login.href,
        }),
      );
    }

    ctaLi.appendChild(ctaMobile);
    ul.appendChild(ctaLi);

    return ul;
  }

  #buildDesktopCTA({ signup, login }) {
    const wrapper = document.createElement("div");
    wrapper.className = "nav__cta";
    wrapper.setAttribute("aria-label", "Account actions");

    if (this.#isLoggedIn()) {
      wrapper.appendChild(this.#buildAvatar());
      return wrapper;
    }

    wrapper.appendChild(
      Button.create({
        label: signup.label,
        variant: "primary",
        size: "sm",
        as: "a",
        href: signup.href,
      }),
    );
    wrapper.appendChild(
      Button.create({
        label: login.label,
        variant: "outline",
        size: "sm",
        as: "a",
        href: login.href,
      }),
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

    const openMenu = () => {
      menu.classList.add("nav__links--open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
    };

    const closeMenu = () => {
      menu.classList.remove("nav__links--open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
    };

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.contains("nav__links--open");
      isOpen ? closeMenu() : openMenu();
    });

    document.addEventListener("click", (e) => {
      if (
        menu.classList.contains("nav__links--open") &&
        !inner.contains(e.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (
        window.innerWidth > MOBILE_BREAKPOINT &&
        menu.classList.contains("nav__links--open")
      ) {
        closeMenu();
      }
    });

    menu.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (e) => {
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
