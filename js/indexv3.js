const root = document.documentElement;
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenuWrap = document.querySelector(".mobile-menu-wrap");

function setMenuOpen(isOpen) {
  if (!menuToggle || !mobileMenuWrap) return;

  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    mobileMenuWrap.hidden = false;
    requestAnimationFrame(() => mobileMenuWrap.classList.add("is-open"));
    return;
  }

  mobileMenuWrap.classList.remove("is-open");
  window.setTimeout(() => {
    if (!mobileMenuWrap.classList.contains("is-open")) {
      mobileMenuWrap.hidden = true;
    }
  }, 320);
}

menuToggle?.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenuWrap?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1040) setMenuOpen(false);
});

window.addEventListener("pointermove", (event) => {
  root.style.setProperty("--mx", `${(event.clientX / window.innerWidth) * 100}%`);
  root.style.setProperty("--my", `${(event.clientY / window.innerHeight) * 100}%`);
});

const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".dot")];
let activeSlide = 0;
let slideTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
    const bar = dot.querySelector("span");
    bar.style.animation = "none";
    bar.offsetHeight;
    bar.style.animation = "";
  });
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(activeSlide + 1), 5000);
}

dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
document.querySelector("[data-prev]")?.addEventListener("click", () => showSlide(activeSlide - 1));
document.querySelector("[data-next]")?.addEventListener("click", () => showSlide(activeSlide + 1));
slideTimer = setInterval(() => showSlide(activeSlide + 1), 5000);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll("[data-reveal]").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
  observer.observe(element);
});
