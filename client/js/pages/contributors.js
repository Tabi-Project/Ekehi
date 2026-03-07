const CARD_VARIANTS = ["blue", "pink", "purple", "green", "yellow"];

const contributors = [
  { name: "Peace Marionbraide", role: "Frontend Engineer", image: "" },
  {
    name: "Osezele Iboi",
    role: "Frontend Engineer",
    image: "../assets/images/contributors/osezele-iboi.png",
  },
  { name: "Esther Orieji", role: "Frontend Engineer", image: "" },
  { name: "Iyobosa", role: "Frontend Engineer", image: "" },
  { name: "Oluchi Okwuosa", role: "Frontend Engineer", image: "" },
  { name: "Florence Onwuegbuzie", role: "Frontend Engineer", image: "" },
  { name: "Akinwunmi Fatihat", role: "Frontend Engineer", image: "" },
  {
    name: "Victor Okoukoni",
    role: "Frontend Engineer",
    image: "../assets/images/contributors/victor-okoukoni.png",
  },
  {
    name: "Fisayo Rotibi",
    role: "UI/UX Designer",
    image: "../assets/images/contributors/fisayo-rotibi.png",
    imageStyle: {
      objectPosition: "bottom center",
      transform: "scale(1.1)",
      marginLeft: "-12px",
      marginTop: "-12px",
    },
  },
  { name: "Michael Babjide Boluwatife", role: "UI/UX Designer", image: "" },
  { name: "Osuji Wisdom", role: "UI/UX Designer", image: "" },
  { name: "Olusegun Adeleke", role: "Backend Engineer", image: "" },
  { name: "Sodiq Semiu", role: "Backend Engineer", image: "" },
  { name: "Gabriel Abubakar", role: "QA Tester", image: "" },
];

function renderContributors(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  data.forEach(({ name, role, image, imageStyle }, index) => {
    const article = document.createElement("article");
    article.className = "contributor-card flex flex-col gap-0-5";
    article.dataset.variant = CARD_VARIANTS[index % CARD_VARIANTS.length];

    const figure = document.createElement("figure");
    figure.className = "contributor-card__display";

    const img = document.createElement("img");
    img.className = "contributor-card__image";
    if (image) {
      img.src = image;
      img.alt = name;
      if (imageStyle) Object.assign(img.style, imageStyle);
    }

    const nameEl = document.createElement("h3");
    nameEl.className = "contributor-card__name";
    nameEl.textContent = name;

    const roleEl = document.createElement("p");
    roleEl.className = "contributor-card__role";
    roleEl.textContent = role;

    figure.append(img);
    article.append(figure, nameEl, roleEl);
    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}

document.addEventListener("DOMContentLoaded", () => {
  renderContributors(contributors, "contributors-grid");
});
