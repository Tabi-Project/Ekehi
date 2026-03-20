import Button from "/shared/components/button/button.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

const heroBtns = document.querySelector(".hero__btns");
const aboutBtnMount = document.querySelector(".about-btn-mount");
const ctaBtnMount = document.querySelector(".cta-btn-mount");
const siteHeader = document.querySelector(".site-header")
const nav = document.getElementById('nav-root')
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
    Button.create({ label: "Learn more", variant: "secondary" }),
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

const observerCallback = (entries) =>{
  entries.forEach(entry =>{
    if (!entry.isIntersecting){
      nav.classList.add('nav-background');
    } else{
      nav.classList.remove('nav-background')
    }
  });
};

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0,
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
observer.observe(siteHeader)
// offering section click setting
cards.forEach((card) => {
  card.addEventListener("click", () => {
    cards.forEach((c) => {
      c.classList.remove("offerings__card--active");
    });
    card.classList.add("offerings__card--active");
  });
});
