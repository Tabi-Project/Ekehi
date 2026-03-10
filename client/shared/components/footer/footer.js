const FOOTER_CONFIG = {
  brand: {
    href: "",
    logo: { src: "assets/icons/ekehi-logo.png", alt: "Ekehi" },
    wordmark: "ekehi",
    tagline:
      "A searchable, continuously updated business resource centre built for women entrepreneurs across Africa",
  },
  nav: [
    {
      heading: "Explore",
      links: [
        { href: "#", label: "Browse funding" },
        { href: "#", label: "Training programmes" },
        { href: "#", label: "Mentorship" },
        { href: "#", label: "Resources" },
      ],
    },
    {
      heading: "For Partners",
      links: [
        { href: "#", label: "List an opportunity" },
        { href: "#", label: "Sponsor a programme" },
        { href: "#", label: "Become a mentor" },
        { href: "#", label: "Success stories" },
      ],
    },
    {
      heading: "About",
      links: [
        { href: "#", label: "About Ekehi" },
        { href: "#", label: "TEE Foundation" },
        { href: "#", label: "Contribute on GitHub" },
        { href: "#", label: "Contact Us" },
      ],
    },
  ],
  bottom: {
    copyright: "© 2026 Tabi Project (TEE Foundation)",
    note: "Open Source & Open for Contributions",
    legal: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms" },
      { href: "#", label: "Policy" },
      { href: "#", label: "Accessibility" },
    ],
  },
};

class FooterComponent {
  #buildBrand({ href, logo, wordmark, tagline }) {
    return `<div class="footer__brand">
        <a href="${href}" class="footer__logo">
          <img src="${logo.src}" alt="${logo.alt}" class="footer__logo-image" />
          <span class="footer__wordmark">${wordmark}</span>
        </a>
        <p class="footer__tagline">${tagline}</p>
      </div>`;
  }

  #buildNavGroup({ heading, links }) {
    const linkItems = links
      .map(
        ({ href, label }) =>
          `<li><a href="${href}" class="footer__nav-link">${label}</a></li>`,
      )
      .join("\n");

    return `<div class="footer__nav-group">
        <h4 class="footer__nav-heading">${heading}</h4>
        <ul class="footer__nav-list">
          ${linkItems}
        </ul>
      </div>`;
  }

  #buildNav(groups) {
    return `<nav class="footer__nav" aria-label="Footer navigation">
        ${groups.map((group) => this.#buildNavGroup(group)).join("\n")}
      </nav>`;
  }

  #buildBottom({ copyright, note, legal }) {
    const legalLinks = legal
      .map(
        ({ href, label }) =>
          `<a href="${href}" class="footer__legal-link">${label}</a>`,
      )
      .join("\n");

    return `<div class="footer__bottom">
        <p class="footer__copyright">${copyright}</p>
        <p class="footer__note">${note}</p>
        <div class="footer__legal">
          ${legalLinks}
        </div>
      </div>`;
  }

  #buildHTML() {
    const { brand, nav, bottom } = FOOTER_CONFIG;
    return `<div class="footer__main">
        ${this.#buildBrand(brand)}
        ${this.#buildNav(nav)}
      </div>
      ${this.#buildBottom(bottom)}`;
  }

  mount(selector) {
    const mountEl = document.querySelector(selector);
    if (!mountEl) return;
    mountEl.innerHTML = this.#buildHTML();
  }
}

new FooterComponent().mount("#footer-root");
