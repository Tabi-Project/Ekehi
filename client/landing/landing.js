const heroBtns = document.querySelector(".hero-btn");
const aboutBtnMount = document.querySelector(".about-btn-mount");
const ctaBtnMount = document.querySelector(".cta-btn-mount");

if (heroBtns) {
  heroBtns.appendChild(
    Button.create({
      label: "Join the network",
      variant: "primary",
      size: "sm",
    }),
  );
  heroBtns.appendChild(
    Button.create({ label: "Learn more", variant: "secondary", size: "sm" }),
  );
}

if (aboutBtnMount) {
  aboutBtnMount.appendChild(
    Button.create({
      label: "Learn more",
      variant: "secondary",
      as: "a",
      href: "#",
      className: "self-start",
    }),
  );
}

if (ctaBtnMount) {
  ctaBtnMount.appendChild(
    Button.create({
      label: "Join the network",
      variant: "primary",
      as: "a",
      href: "/signup/",
    }),
  );
}
