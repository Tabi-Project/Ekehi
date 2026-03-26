import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";
import Button from "/shared/components/button/button.js";
const templateContent = document.getElementById("template-content");
const templateAside = document.getElementById("template-aside");
const downloadBtn = document.querySelector(".download_btn");

const templateData = [
  {
    id: "1",
    title: "Basic financial management template",
    excerpt:
      "Explore our Basic Financial Management Template designed specifically for small and medium enterprises! It's an excellent resource to get you ready for global opportunities.",
    color: "#4ecdc4",
    cover_image: null,
    author: "Fisayo Rotibi",
  },
  {
    id: "2",
    title: "Tax basics for Nigerian SMEs",
    excerpt:
      "Explore our template on Tax Basics for Nigerian SMEs. It's an essential resource to help you navigate the complexities of taxation and ensure your business is ready for success.",
    color: "#e91e8c",
    cover_image: null,
    author: "Ejemen Iboi",
  },
  {
    id: "3",
    title: "Export readiness checklist for SMEs",
    excerpt:
      "Check out our template for the Export Readiness Checklist tailored for SMEs! It's a great tool to help you prepare for international markets.",
    color: "#4caf50",
    cover_image: null,
    author: "Esther Orieji",
  },
];

const card_colors = {
  fisayo: { bg: "#26B3B5", text: "#033F25" },
  esther: { bg: "#4caf50", text: "#033F25" },
  ejemen: { bg: "#e91e8c", text: "#341539" },
};

const params = new URLSearchParams(window.location.search);
const templateID = params.get("id");
const template = templateData.find((t) => t.id === templateID);

if (downloadBtn) {
  downloadBtn.appendChild(
    Button.create({
      label: "Download template",
      as: "a",
      href: "/#/",
      variant: "primary",
      className: "btn--radius",
    }),
  );
}

function renderBody(temp) {
  return `
    <div class="template__header">
    <h1>${temp.title}</h1>
    </div>
    <div class="detail-body">
    <p>${temp.excerpt}</p>
    </div>
 `;
}

function renderAside(temp) {
  const authorKey = temp.author.split(" ")[0].toLowerCase();
  const colors = card_colors[authorKey] ?? card_colors.fisayo;
  return `
    <div class="temp__aside" style="background-color: ${colors.bg}">
    <h3 style="color: ${colors.text}">${temp.title}</h3>
    <img src=${temp.cover_image ?? "/assets/images/black-woman-wearing-glasses.png"} class="temp__cover-image" alt=${temp.title}>
    <span style="color: ${colors.text}">with ${temp.author}</span>
    </div>
    `;
}

function renderTemplate(temp) {
  if (!template) {
    templateContent.innerHTML = ` <h2>Template Not found</h2> <p>The template you are looking for does not exist or the link is broken</p>`;
    templateAside.innerHTML = ` `;
    downloadBtn.innerHTML = " ";
  } else {
    templateContent.innerHTML = `${renderBody(temp)}`;
    templateAside.innerHTML = `${renderAside(temp)}`;
  }
}
renderTemplate(template);
