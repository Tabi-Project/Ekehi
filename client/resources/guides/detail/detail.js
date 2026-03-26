import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

// Hardcoded guide data
const guides = {
  1: {
    id: "1",
    title: "Guide to understanding and improving business credit scores",
    sections: [
      {
        heading: "Introduction",
        items: ["What is a business credit score?", "Why your score matters"],
      },
      {
        heading: "How scores work",
        items: [
          "How scores are calculated",
          "Understanding your credit report",
          "Score ranges explained",
        ],
      },
      {
        heading: "Improving your score",
        items: [
          "Register your business",
          "Get a TIN",
          "Start with small credit",
          "Pay on time, every time",
          "Manage credit utilisation",
          "Monitor your report",
        ],
      },
    ],
    content: [
      {
        heading: "Introduction",
        body: "If you've ever applied for a business loan and received a vague rejection with no clear reason, your business credit score may have played a role. Understanding what it is and how it works is the first step to taking control of it.",
      },
      {
        heading: "The basic idea",
        body: "A business credit score is a number that tells lenders, suppliers, and financial institutions how creditworthy your business is. In plain terms: how likely you are to repay money you borrow. The higher the number, the more confidence the financial system has in your business. Think of it as your business's financial reputation, built quietly in the background every time you take on credit and either honour or miss a repayment.",
      },
      {
        heading: "It's attached to your business, not you personally",
        body: "This is one of the most important distinctions to understand. A business credit score belongs to your registered business entity, not to you as an individual. You already have a personal credit score tied to your name and identity. Your business, once registered, builds its own separate score. Why does this matter? Because keeping the two separate protects your personal finances from your business obligations and vice versa. If your business takes on debt, a well-maintained separation means your personal financial standing is not automatically at risk.",
      },
      {
        heading: "Who tracks and reports it in Nigeria",
        body: "In Nigeria, business credit data is collected and maintained by licensed credit bureaus. These organisations gather information from banks, microfinance institutions, fintechs, and other lenders, then compile it into a credit report and score for your business. The three primary bureaus operating in Nigeria are CRC Credit Bureau, Credit Registry, and FirstCentral Credit Bureau. Each uses its own scoring model, which means your score may vary slightly depending on which bureau a lender consults but the underlying data feeding into each score is largely the same.",
      },
      {
        heading: "How a score is different from a credit report",
        body: "These two terms are often used interchangeably, but they are not the same thing. Your credit report is the full record, every account, every payment, every inquiry, every public filing attached to your business. Your credit score is a single number calculated from that report, designed to give lenders a quick summary of what the report contains. You need both. The score gets you through the door; the report tells the full story once a lender decides to look closer.",
      },
    ],
  },
};

// Read guideId from URL
const params = new URLSearchParams(window.location.search);
const guideId = params.get("guideId");
const guide = guides[guideId];

// Get DOM elements
const guideTitle = document.getElementById("guide-title");
const guideBody = document.getElementById("guide-body");
const tocRoot = document.getElementById("toc-root");

// Handle missing or invalid guideId
if (!guide) {
  guideTitle.textContent = "Guide not found";
  guideBody.innerHTML = `
    <p>The guide you are looking for does not exist or the link may be broken.</p>
  `;
} else {
  // Render title
  guideTitle.textContent = guide.title;

  // Render table of contents
  guide.sections.forEach((section) => {
    const group = document.createElement("div");
    group.className = "guide__toc-group";

    const headingBtn = document.createElement("button");
    headingBtn.className = "guide__toc-heading";
    headingBtn.textContent = section.heading;
    headingBtn.setAttribute("aria-expanded", "true");
    group.appendChild(headingBtn);

    const itemList = document.createElement("div");
    itemList.className = "guide__toc-items";

    section.items.forEach((item, index) => {
      const btn = document.createElement("button");
      btn.className = "guide__toc-item";
      btn.textContent = item;

      if (section === guide.sections[0] && index === 0) {
        btn.classList.add("guide__toc-item--active");
      }

      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".guide__toc-item")
          .forEach((i) => i.classList.remove("guide__toc-item--active"));
        btn.classList.add("guide__toc-item--active");
      });

      itemList.appendChild(btn);
    });

    // Toggle collapse on heading click
    headingBtn.addEventListener("click", () => {
      const isExpanded = headingBtn.getAttribute("aria-expanded") === "true";
      headingBtn.setAttribute("aria-expanded", String(!isExpanded));
      itemList.style.display = isExpanded ? "none" : "flex";
    });

    group.appendChild(itemList);
    tocRoot.appendChild(group);
  });

  // Render content
  guide.content.forEach((section) => {
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

  // TOC click handlers
  const tocItems = document.querySelectorAll(".guide__toc-item");
  tocItems.forEach((item) => {
    item.addEventListener("click", () => {
      tocItems.forEach((i) => i.classList.remove("guide__toc-item--active"));
      item.classList.add("guide__toc-item--active");
    });
  });
}
