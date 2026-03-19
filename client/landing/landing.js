import Button from "/shared/components/button/button.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

const heroBtns = document.querySelector(".hero__btns");
const aboutBtnMount = document.querySelector(".about-btn-mount");
const ctaBtnMount = document.querySelector(".cta-btn-mount");
const cards = document.querySelectorAll(".offerings__card");

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

// offering section click setting
cards.forEach((card) => {
  card.addEventListener("click", () => {
    cards.forEach((c) => {
      c.classList.remove("offerings__card--active");
    });
    card.classList.add("offerings__card--active");
  });
});
