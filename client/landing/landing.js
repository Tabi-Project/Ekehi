import Button from "/shared/components/button/button.js";
import "/shared/components/nav/nav.js";
import "/shared/components/footer/footer.js";

const heroBtns = document.querySelector(".hero__btns");
const aboutBtnMount = document.querySelector(".about-btn-mount");
const ctaBtnMount = document.querySelector(".cta-btn-mount");
const faqSection = document.querySelector('.faq-section');

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

faqSection.addEventListener('click', (e) => {
  const questionBtn = e.target.closest('.faq-question');
  if (!questionBtn) return;

  const currentItem = questionBtn.closest('.faq-item');
  const allItems = faqSection.querySelectorAll('.faq-item');
  const isOpen = currentItem.classList.contains('active');

  allItems.forEach(item => {
    item.classList.remove('active');

    const btn = item.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', 'false');

    const answer = item.querySelector('.faq-answer');
    if (answer) answer.style.maxHeight = null;

    const icon = item.querySelector('.icon');
    if (icon) icon.textContent = '+';
  });

  if (!isOpen) {
    currentItem.classList.add('active');
    questionBtn.setAttribute('aria-expanded', 'true');

    const answer = currentItem.querySelector('.faq-answer');
    if (answer) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    }

    const icon = currentItem.querySelector('.icon');
    if (icon) icon.textContent = '-';
  }
});
