import api from "/shared/services/api.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";
import Button from "/shared/components/button/button.js";

const CATEGORY_COLORS = {
  finance: { bg: "#26B3B5", text: "#033F25" },
  tax: { bg: "#e91e8c", text: "#341539" },
  export: { bg: "#4caf50", text: "#033F25" },
};
const DEFAULT_COLOR = { bg: "#6366f1", text: "#1e1b4b" };

const templateContent = document.getElementById("template-content");
const templateAside = document.getElementById("template-aside");
const downloadBtn = document.querySelector(".download_btn");

const params = new URLSearchParams(window.location.search);
const templateId = params.get("id");

function renderNotFound() {
  templateContent.innerHTML = "<h2>Template not found</h2><p>The template you are looking for does not exist or the link is broken.</p>";
  templateAside.innerHTML = "";
  downloadBtn.innerHTML = "";
}

function renderSections(sections) {
  return sections.map((section) => {
    const heading = section.heading
      ? `<h2 class="template__section-heading">${section.heading}</h2>`
      : "";
    return `
      <div class="template__section">
        ${heading}
        <p class="template__section-body">${section.body}</p>
      </div>
    `;
  }).join("");
}

function renderTemplate(template) {
  const colors = CATEGORY_COLORS[template.category] ?? DEFAULT_COLOR;
  const parsed = template.content ? JSON.parse(template.content) : null;
  const author = parsed?.author ?? null;
  const sections = parsed?.sections ?? [];

  templateContent.innerHTML = `
    <div class="template__header">
      <h1 class="template__title">${template.title}</h1>
    </div>
    <div class="template__body">
      ${sections.length > 0 ? renderSections(sections) : `<p>${template.description ?? ""}</p>`}
    </div>
  `;

  templateAside.innerHTML = `
    <div class="temp__aside" style="background-color: ${colors.bg}">
      <h3 class="temp__aside-title" style="color: ${colors.text}">${template.title}</h3>
      <img
        src="/assets/images/black-woman-wearing-glasses.png"
        class="temp__cover-image"
        alt="${template.title}"
      />
      ${author ? `<span class="temp__aside-author" style="color: ${colors.text}">with ${author}</span>` : ""}
    </div>
  `;

  if (template.file_url) {
    downloadBtn.appendChild(
      Button.create({
        label: "Download template",
        as: "a",
        href: template.file_url,
        variant: "primary",
        className: "btn--radius",
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    );
  }
}

async function loadTemplate() {
  if (!templateId) return renderNotFound();

  try {
    const res = await api.get(`/templates/${templateId}`);
    renderTemplate(res.data);
  } catch (err) {
    renderNotFound();
  }
}

loadTemplate();
