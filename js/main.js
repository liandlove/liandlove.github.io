import { PRODUCTS } from "./products.js";
import { renderProductGrid } from "./render.js";
import { initCatalog } from "./filters.js";
import { initScrollReveal } from "./animations.js";
import { initProductModal } from "./productModal.js";

function initTelegramBrowserClass() {
  try {
    const ua = String(navigator.userAgent || "");
    const isTelegram =
      typeof window.TelegramWebviewProxy !== "undefined" ||
      typeof window.Telegram !== "undefined" ||
      /Telegram|TelegramBot|TDesktop|TgWebView|Telegraph/i.test(ua);
    if (isTelegram) document.body.classList.add("tg-browser");
  } catch {
    // ignore
  }
}

function initFeatured() {
  const featuredGrid = document.getElementById("featuredGrid");
  if (!featuredGrid) return;

  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  renderProductGrid(featuredGrid, featured);
}

function initNavIndicator() {
  const nav = document.querySelector(".nav");
  if (!(nav instanceof HTMLElement)) return;

  const indicator = nav.querySelector(".nav-indicator");
  if (!(indicator instanceof HTMLElement)) return;

  const links = Array.from(nav.querySelectorAll(".nav-link")).filter((el) => el instanceof HTMLElement);
  const getActive = () => links.find((l) => l.classList.contains("is-active")) ?? links[0];

  const setTo = (target) => {
    if (!(target instanceof HTMLElement)) return;
    const navRect = nav.getBoundingClientRect();
    const rect = target.getBoundingClientRect();

    const left = rect.left - navRect.left;
    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.opacity = "1";
  };

  let raf = 0;
  const setToRaf = (target) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => setTo(target));
  };

  const active = getActive();
  if (active) setTo(active);

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => setToRaf(link));
    link.addEventListener("focus", () => setToRaf(link));
  });

  nav.addEventListener("mouseleave", () => setToRaf(getActive()));
  nav.addEventListener("focusout", (e) => {
    const related = e.relatedTarget;
    if (related instanceof Node && nav.contains(related)) return;
    setToRaf(getActive());
  });

  window.addEventListener("resize", () => setToRaf(getActive()));
}

function initMobileMenu() {
  const btn = document.querySelector(".nav-toggle");
  const menu = document.getElementById("mobileMenu");
  if (!(btn instanceof HTMLButtonElement) || !(menu instanceof HTMLElement)) return;

  let closeTimer = 0;
  let isScrollBlocked = false;

  const onWheel = (e) => {
    if (!isScrollBlocked) return;
    e.preventDefault();
  };

  const onTouchMove = (e) => {
    if (!isScrollBlocked) return;
    e.preventDefault();
  };

  const onKeydownScroll = (e) => {
    if (!isScrollBlocked) return;
    // Keep Escape working (handled elsewhere)
    if (e.key === "Escape") return;
    // Block common scroll keys while menu is open
    const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"];
    if (keys.includes(e.key)) e.preventDefault();
  };

  function blockScroll() {
    if (isScrollBlocked) return;
    isScrollBlocked = true;
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeydownScroll, { passive: false });
  }

  function unblockScroll() {
    if (!isScrollBlocked) return;
    isScrollBlocked = false;
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("keydown", onKeydownScroll);
  }

  const open = () => {
    window.clearTimeout(closeTimer);
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    btn.classList.add("is-open");
    // Ensure transitions fire after [hidden] -> visible
    menu.classList.remove("is-open");
    menu.classList.remove("is-closing");
    menu.classList.remove("is-measuring");
    requestAnimationFrame(() => {
      if (menu.hidden) return;

      // Animate the panel from the burger button position
      const panel = menu.querySelector(".mobile-menu-panel");
      if (panel instanceof HTMLElement) {
        // Measure panel in its final layout position (without transforms)
        menu.classList.add("is-measuring");
        const p = panel.getBoundingClientRect();
        menu.classList.remove("is-measuring");

        const b = btn.getBoundingClientRect();
        const bx = b.left + b.width / 2;
        const by = b.top + b.height / 2;
        const px = p.left + 18; // a nicer visual anchor inside panel
        const py = p.top + 18;
        menu.style.setProperty("--menu-from-x", `${bx - px}px`);
        menu.style.setProperty("--menu-from-y", `${by - py}px`);
      }

      // One more frame so the browser commits starting styles
      requestAnimationFrame(() => {
        if (!menu.hidden) menu.classList.add("is-open");
      });
    });
    document.documentElement.classList.add("menu-open");
    document.body.classList.add("menu-open");
    blockScroll();
  };

  const close = () => {
    if (menu.hidden) return;
    btn.setAttribute("aria-expanded", "false");
    btn.classList.remove("is-open");
    menu.classList.remove("is-open");
    menu.classList.add("is-closing");
    document.documentElement.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
    unblockScroll();

    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      menu.hidden = true;
      menu.classList.remove("is-closing");
    }, 210);
  };

  btn.addEventListener("click", () => {
    if (menu.hidden) open();
    else close();
  });

  menu.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.dataset.close === "1") close();
    if (t.classList.contains("mobile-menu-link")) close();
  });

  window.addEventListener("keydown", (e) => {
    if (menu.hidden) return;
    if (e.key === "Escape") close();
  });

  window.addEventListener("resize", () => {
    if (!menu.hidden) close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTelegramBrowserClass();
  initFeatured();
  initCatalog(PRODUCTS);
  initNavIndicator();
  initScrollReveal();
  initProductModal(PRODUCTS);
  initMobileMenu();
});

