// Menu mobile (panneau latéral)
const menuButton = document.querySelector(".menu-btn");
const navClose = document.querySelector(".nav-close");
const navbar = document.querySelector(".navbar");
const navOverlay = document.querySelector(".nav-overlay");

function openMenu() {
  navbar?.classList.add("is-open");
  navOverlay?.classList.add("is-open");
  menuButton?.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  navbar?.classList.remove("is-open");
  navOverlay?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

menuButton?.addEventListener("click", () => {
  const isOpen = navbar?.classList.contains("is-open");
  isOpen ? closeMenu() : openMenu();
});

navClose?.addEventListener("click", closeMenu);
navOverlay?.addEventListener("click", closeMenu);

navbar?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Marque le lien de navigation actif selon la page courante
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".navbar a[href]").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (currentPage === "" && href === "index.html")) {
    link.classList.add("is-active");
  }
});

// Accordéon FAQ
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove("is-open");
        openItem.querySelector(".faq-answer").style.maxHeight = null;
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      }
    });

    if (isOpen) {
      item.classList.remove("is-open");
      answer.style.maxHeight = null;
      button.setAttribute("aria-expanded", "false");
    } else {
      item.classList.add("is-open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      button.setAttribute("aria-expanded", "true");
    }
  });
});
