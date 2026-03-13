const heroBtns = document.querySelector(".hero__btns");
const aboutBtnMount = document.querySelector(".about-btn-mount");
const ctaBtnMount = document.querySelector(".cta-btn-mount");

if (heroBtns) {
  heroBtns.appendChild(
    Button.create({
      label: "Join the network",
      as: "a",
      href: "/signup/",
      variant: "primary",
    }),
  );
  heroBtns.appendChild(
    Button.create({ label: "Learn more", variant: "outline" }),
  );
}

if (aboutBtnMount) {
  aboutBtnMount.appendChild(
    Button.create({
      label: "Learn more",
      variant: "outline",
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
