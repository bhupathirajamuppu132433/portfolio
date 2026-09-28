"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setupMenu = () => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".site-menu");
  if (!toggle || !menu) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    menu.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    menu.classList.toggle("is-open", !isOpen);
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
      toggle.focus();
    }
  });
};

const setupReveal = () => {
  const elements = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
};

const setupTyping = () => {
  const role = document.querySelector("#typed-role");
  if (!role || reducedMotion) return;
  const text = role.textContent.trim();
  role.setAttribute("aria-label", text);
  role.textContent = "";
  let index = 0;
  const typeNext = () => {
    role.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) window.setTimeout(typeNext, 25);
  };
  window.setTimeout(typeNext, 180);
};

const setupProjectFilters = () => {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".project-card[data-category]");
  const emptyState = document.querySelector("#empty-state");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visible = 0;
    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    cards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible > 0;
  }));
};

const setupContactForm = () => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.textContent = "Thanks for your message. It passed browser validation, but was not sent because this demo has no backend.";
    form.reset();
  });
};

const setupPlaceholderLinks = () => {
  document.querySelectorAll("[data-placeholder-link], .footer-social a[href='#'], .project-actions a[href='#']").forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
};

setupMenu();
setupReveal();
setupTyping();
setupProjectFilters();
setupContactForm();
setupPlaceholderLinks();
