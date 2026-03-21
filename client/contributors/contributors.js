import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

const CARD_VARIANTS = ["blue", "yellow", "pink", "purple", "green"];
const CONTRIBUTORS_CONTAINER_ID = "contributors-grid";

const contributors = [
  {
    name: "Peace Marionbraide",
    role: "Frontend Engineer",
    image: "profiles/peace-marionbraide.png",
    style: { transform: "scale(1.3)", marginTop: "-20px" },
  },
  {
    name: "Osezele Iboi",
    role: "Frontend Engineer",
    image: "profiles/osezele-iboi.png",
    style: { marginTop: "16px" },
  },
  {
    name: "Fisayo Rotibi",
    role: "UI/UX Designer",
    image: "profiles/fisayo-rotibi.png",
    style: {
      objectPosition: "bottom center",
      transform: "scale(1.2)",
      margin: "-16px 0 0 -12px",
    },
  },
  {
    name: "Esther Orieji",
    role: "Frontend Engineer",
    image: "profiles/esther-orieji.png",
  },

  {
    name: "Gabriel Abubakar",
    role: "QA Tester",
    image: "profiles/gabriel-abubakar.png",
    style: {
      objectPosition: "bottom right",
      transform: "scale(1.2)",
      marginTop: "-4px",
    },
  },
  {
    name: "Oluchi Okwuosa",
    role: "Frontend Engineer",
    image: "profiles/oluchi-okwuosa.png",
    style: {
      transform: "scale(0.99)",
      objectPosition: "bottom right",
      marginTop: "24px",
    },
  },
  {
    name: "Michael Babjide Boluwatife",
    role: "UI/UX Designer",
    image: "profiles/michael-babajide.png",
    style: { transform: "scale(1.1)", marginTop: "-4px" },
  },
  {
    name: "Florence Onwuegbuzie",
    role: "Frontend Engineer",
    image: "profiles/florence-onwuegbuzie.png",
  },
  {
    name: "Victor Okoukoni",
    role: "Frontend Engineer",
    image: "profiles/victor-okoukoni.png",
    style: { objectPosition: "top center", marginTop: "8px" },
  },
  {
    name: "Iyobosa Omoruyi",
    role: "Frontend Engineer",
    image: "profiles/iyobosa-omoruyi.png",
    style: { marginTop: "20px" },
  },
  {
    name: "Olusegun Adeleke",
    role: "Backend Engineer",
    image: "profiles/olusegun-adeleke.png",
    style: { objectPosition: "top center", marginTop: "16px" },
  },
  {
    name: "Osuji Wisdom",
    role: "UI/UX Designer",
    image: "profiles/wisdom-osuji.png",
  },
  {
    name: "Akinwunmi Fatihat",
    role: "Frontend Engineer",
    image: "profiles/fatihat-akinwumi.png",
    style: { transform: "scale(1.4)", marginTop: "-4px" },
  },
  { name: "Sodiq Semiu", role: "Backend Engineer", image: "" },
];

function createCardImage({ name, image, style }) {
  const figure = document.createElement("figure");
  figure.className = "contributor-card__display";

  if (image) {
    const img = document.createElement("img");
    img.className = "contributor-card__image";
    img.src = image;
    img.alt = name;
    if (style) Object.assign(img.style, style);
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
  card.className = "contributor-card flex flex-col";
  card.dataset.variant = variant;
  card.append(createCardImage(contributor), ...createCardMeta(contributor));
  return card;
}

function renderContributors(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  data.forEach((contributor, index) => {
    const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
    fragment.appendChild(createContributorCard(contributor, variant));
  });

  container.appendChild(fragment);
}

renderContributors(contributors, CONTRIBUTORS_CONTAINER_ID);
