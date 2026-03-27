import api from "/shared/services/api.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

const params = new URLSearchParams(window.location.search);
const guideId = params.get("guideId");

const guideTitle = document.getElementById("guide-title");
const guideBody = document.getElementById("guide-body");
const tocRoot = document.getElementById("toc-root");

function renderNotFound(message = "The guide you are looking for does not exist or the link may be broken.") {
  guideTitle.textContent = "Guide not found";
  guideBody.innerHTML = `<p>${message}</p>`;
}

function renderToc(contentSections) {
  contentSections.forEach((section, index) => {
    const btn = document.createElement("button");
    btn.className = "guide__toc-item";
    btn.textContent = section.heading;
    if (index === 0) btn.classList.add("guide__toc-item--active");

    btn.addEventListener("click", () => {
      document.querySelectorAll(".guide__toc-item").forEach((i) => i.classList.remove("guide__toc-item--active"));
      btn.classList.add("guide__toc-item--active");

      document.querySelectorAll(".guide__section")[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    tocRoot.appendChild(btn);
  });
}

function renderContent(sections) {
  sections.forEach((section) => {
    const div = document.createElement("div");
    div.className = "guide__section";

    const heading = document.createElement("h2");
    heading.className = "guide__section-heading";
    heading.textContent = section.heading;

    const body = document.createElement("p");
    body.className = "guide__section-body";
    body.textContent = section.body;

    div.appendChild(heading);
    div.appendChild(body);
    guideBody.appendChild(div);
  });
}

async function loadGuide() {
  if (!guideId) return renderNotFound();

  try {
    const res = await api.get(`/guides/${guideId}`);
    const guide = res.data;

    guideTitle.textContent = guide.title;

    if (!guide.content) {
      guideBody.innerHTML = "<p>Full content for this guide is coming soon.</p>";
      return;
    }

    const parsed = JSON.parse(guide.content);
    const contentSections = parsed.content ?? [];
    renderToc(contentSections);
    renderContent(contentSections);
  } catch (err) {
    renderNotFound(err.status === 404 ? "This guide does not exist." : err.message);
  }
}

loadGuide();
