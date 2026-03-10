// Must match [data-variant] values in contributors.css
const CARD_VARIANTS = ["blue", "pink", "purple", "green", "yellow"];

const CONTRIBUTORS_CONTAINER_ID = "contributors-grid";

const contributors = [
  { name: "Peace Marionbraide", role: "Frontend Engineer", image: "" },
  {
    name: "Osezele Iboi",
    role: "Frontend Engineer",
    image: "../assets/images/contributors/osezele-iboi.png",
  },
  {
    name: "Fisayo Rotibi",
    role: "UI/UX Designer",
    image: "../assets/images/contributors/fisayo-rotibi.png",
    imageFit: "bottom-scaled",
  },
  { name: "Esther Orieji", role: "Frontend Engineer", image: "" },
  { name: "Iyobosa Omoruyi", role: "Frontend Engineer", image: "" },
  { name: "Gabriel Abubakar", role: "QA Tester", image: "" },
  { name: "Oluchi Okwuosa", role: "Frontend Engineer", image: "" },
  { name: "Florence Onwuegbuzie", role: "Frontend Engineer", image: "" },
  {
    name: "Victor Okoukoni",
    role: "Frontend Engineer",
    image: "../assets/images/contributors/victor-okoukoni.png",
  },
  { name: "Michael Babjide Boluwatife", role: "UI/UX Designer", image: "" },
  { name: "Olusegun Adeleke", role: "Backend Engineer", image: "" },
  { name: "Sodiq Semiu", role: "Backend Engineer", image: "" },
  { name: "Osuji Wisdom", role: "UI/UX Designer", image: "" },
  { name: "Akinwunmi Fatihat", role: "Frontend Engineer", image: "" },
];

function createCardImage({ name, image, imageFit }) {
  const figure = document.createElement("figure");
  figure.className = "contributor-card__display";

  if (image) {
    const img = document.createElement("img");
    img.className = "contributor-card__image";
    img.src = image;
    img.alt = name;
    if (imageFit) img.dataset.fit = imageFit;
    figure.append(img);
  }

  return figure;
}

function createCardMeta({ name, role }) {
  const nameEl = document.createElement("h3");
  nameEl.className = "contributor-card__name";
  nameEl.textContent = name;

  const roleEl = document.createElement("p");
  roleEl.className = "contributor-card__role";
  roleEl.textContent = role;

  return [nameEl, roleEl];
}

function createContributorCard(contributor, variant) {
  const card = document.createElement("article");
  card.className = "contributor-card flex flex-col gap-0-5";
  card.dataset.variant = variant;

  card.append(createCardImage(contributor), ...createCardMeta(contributor));
  return card;
}

function renderContributors(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  data.forEach((contributor, index) => {
    const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
    fragment.appendChild(createContributorCard(contributor, variant));
  });

  container.appendChild(fragment);
}

document.addEventListener("DOMContentLoaded", () => {
  renderContributors(contributors, CONTRIBUTORS_CONTAINER_ID);
});
