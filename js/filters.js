import { renderProductGrid } from "./render.js";

function uniq(arr) {
  return Array.from(new Set(arr));
}

function getCategoryIcon(category) {
  const common =
    'viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  switch (category) {
    case "Kolekcja":
      return `<svg ${common}><path d="M8 7h8"/><path d="M9 7V5h6v2"/><path d="M7 7l-1 4a9 9 0 0 0 0 2l1 6h10l1-6a9 9 0 0 0 0-2l-1-4"/><path d="M10 11h4"/></svg>`;
    case "Dla par":
      return `<svg ${common}><path d="M8.5 7.2c1-1.5 3.2-1.8 4.2-.3 1-1.5 3.2-1.2 4.2.3 1 1.6.5 3.6-1 4.9L12.7 15 9.5 12.1c-1.5-1.3-2-3.3-1-4.9z"/></svg>`;
    case "Rodzina":
      return `<svg ${common}><path d="M7.5 9.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z"/><path d="M16.5 9.8a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8z"/><path d="M4.5 19c0-2.6 1.4-4.2 3-4.8"/><path d="M12 19c0-3.2-2-5.2-4.5-5.2S3 15.8 3 19"/><path d="M21 19c0-2.4-1.2-3.9-2.6-4.6"/></svg>`;
    case "Runy":
      return `<svg ${common}><path d="M7 4v16"/><path d="M7 12l10-8"/><path d="M10 14l7 6"/></svg>`;
    case "Znaki zodiaku":
      return `<svg ${common}><path d="M6 18c2-6 10-6 12 0"/><path d="M8 6c2 2 6 2 8 0"/><path d="M12 6v12"/></svg>`;
    case "Symbole":
      return `<svg ${common}><path d="M12 3l3 7h7l-5.6 4 2.1 7L12 17l-6.5 4 2.1-7L2 10h7z"/></svg>`;
    case "Natura":
      return `<svg ${common}><path d="M20 4c-8 1-13 6-14 14 8-1 13-6 14-14z"/><path d="M6 18c3-6 7-9 14-14"/></svg>`;
    case "Męskie":
      return `<svg ${common}><path d="M14 10a5 5 0 1 0 0 7.1"/><path d="M14 10l6-6"/><path d="M16.8 4H20v3.2"/></svg>`;
    case "Zwierzęta":
      return `<svg ${common}><path d="M8.5 12.5c-1.1 1.2-2 2.3-2 3.6 0 2 1.7 3.4 5.5 3.4s5.5-1.4 5.5-3.4c0-1.3-.9-2.4-2-3.6"/><path d="M9 9.5c0 1.4 1.3 2.5 3 2.5s3-1.1 3-2.5"/><path d="M7.2 10.4c-.9-.7-1.4-1.7-1.1-2.5.4-1 1.9-1 2.7.2"/><path d="M16.8 10.4c.9-.7 1.4-1.7 1.1-2.5-.4-1-1.9-1-2.7.2"/></svg>`;
    case "Zestawy":
      return `<svg ${common}><path d="M7 7h10v10H7z"/><path d="M4 10V4h6"/><path d="M20 14v6h-6"/></svg>`;
    case "Personalizacja":
      return `<svg ${common}><path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.8l-.2-.2a2 2 0 0 0-2.8 0L5.9 16.1 4 20z"/><path d="M13.5 6.5l4 4"/></svg>`;
    case "Miasta":
      return `<svg ${common}><path d="M4 20V9l6-3v14"/><path d="M10 20V4l10 5v11"/><path d="M14 10h2"/><path d="M14 13h2"/><path d="M14 16h2"/></svg>`;
    default:
      return "";
  }
}

function initPriceEasterEgg() {
  const MATADORA_SRC = "./assets/audio/matadora.mp3";
  const EUROMOLLY_SRC = "./assets/audio/euromolly.mp3";

  const minEl = document.getElementById("priceMin");
  const maxEl = document.getElementById("priceMax");
  if (!(minEl instanceof HTMLInputElement) || !(maxEl instanceof HTMLInputElement)) return;

  const matadora = new Audio(MATADORA_SRC);
  const euromolly = new Audio(EUROMOLLY_SRC);
  matadora.preload = "auto";
  euromolly.preload = "auto";

  let active = null;
  let lastTriggerAt = 0;

  async function play(audio) {
    // avoid spam on every keystroke; allow retrigger after a moment
    const now = Date.now();
    if (active === audio && now - lastTriggerAt < 800) return;
    lastTriggerAt = now;
    active = audio;

    try {
      // ensure only one track plays
      matadora.pause();
      euromolly.pause();
      if (audio === matadora) euromolly.currentTime = 0;
      if (audio === euromolly) matadora.currentTime = 0;
      await audio.play();
    } catch {
      // Autoplay policies may block until user interacts; ignore silently.
      active = null;
    }
  }

  function stopIfNeeded() {
    if (!active) return;
    active.pause();
    active.currentTime = 0;
    active = null;
  }

  function onInput() {
    const minV = String(minEl.value ?? "").trim();
    const maxV = String(maxEl.value ?? "").trim();

    // Priority: 6767 wins over 67
    const wantsEuromolly = minV === "6767" || maxV === "6767";
    const wantsMatadora = minV === "67" || maxV === "67";

    if (wantsEuromolly) play(euromolly);
    else if (wantsMatadora) play(matadora);
    else stopIfNeeded();
  }

  minEl.addEventListener("input", onInput);
  maxEl.addEventListener("input", onInput);
}

function clampNumber(value, min, max) {
  if (value == null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
}

function getStateFromUI() {
  const selectedCategories = new Set(
    Array.from(document.querySelectorAll('input[name="category"]:checked')).map((el) => el.value),
  );

  const minEl = document.getElementById("priceMin");
  const maxEl = document.getElementById("priceMax");

  const priceMin = minEl ? clampNumber(minEl.value, 0, 1_000_000) : null;
  const priceMax = maxEl ? clampNumber(maxEl.value, 0, 1_000_000) : null;

  return {
    selectedCategories,
    priceMin,
    priceMax,
  };
}

function applyFilters(products, state) {
  return products.filter((p) => {
    const selected = state.selectedCategories;
    const productCategories = p.categories ?? [];
    const categoryPass =
      selected.size === 0 || Array.from(selected).every((c) => productCategories.includes(c));

    const minPass = state.priceMin == null || p.price >= state.priceMin;
    const maxPass = state.priceMax == null || p.price <= state.priceMax;

    return categoryPass && minPass && maxPass;
  });
}

function renderCheckboxOptions(container, options, name, getLabel, getSwatch) {
  container.replaceChildren(
    ...options.map((value) => {
      const label = document.createElement("label");
      label.className = "check";

      const swatchColor = getSwatch?.(value);
      const swatch = swatchColor
        ? `<span class="swatch" style="background:${swatchColor}"></span>`
        : "";

      const iconSvg = name === "category" ? getCategoryIcon(value) : "";
      const icon = iconSvg ? `<span class="check-icon" aria-hidden="true">${iconSvg}</span>` : "";

      label.innerHTML = `
        <input type="checkbox" name="${name}" value="${value}" />
        ${swatch}
        ${icon}
        <span class="check-text">${getLabel(value)}</span>
      `.trim();

      return label;
    }),
  );
}

function setResultsText(countEl, count, total) {
  if (!countEl) return;

  // Micro-animation on change (luxury, subtle)
  countEl.classList.remove("is-updating");
  // Force reflow so the animation can replay
  void countEl.offsetHeight;
  countEl.classList.add("is-updating");

  if (count === total) {
    countEl.textContent = `${total} modeli`;
    return;
  }
  countEl.textContent = `${count} z ${total} modeli`;
}

function syncEmptyState(emptyEl, hasResults) {
  if (!emptyEl) return;
  emptyEl.hidden = hasResults;
}

function resetUI() {
  document.querySelectorAll('input[name="category"]').forEach((el) => {
    el.checked = false;
  });

  const minEl = document.getElementById("priceMin");
  const maxEl = document.getElementById("priceMax");
  if (minEl) minEl.value = "";
  if (maxEl) maxEl.value = "";
}

export function initCatalog(products) {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  initPriceEasterEgg();

  const categoriesRoot = document.getElementById("filterCategories");
  const resultsCount = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");
  const openBtn = document.getElementById("openFilters");
  const drawer = document.getElementById("filtersDrawer");
  const drawerBody = document.getElementById("filtersDrawerBody");
  const panel = document.getElementById("filtersPanel");
  let closeTimer = 0;
  let isScrollBlocked = false;

  function isInsideDrawerScrollable(target) {
    if (!(target instanceof Node)) return false;
    const el = target instanceof HTMLElement ? target : target.parentElement;
    if (!(el instanceof HTMLElement)) return false;
    const content = el.closest(".filters-drawer-body");
    return content instanceof HTMLElement;
  }

  const onWheel = (e) => {
    if (!isScrollBlocked) return;
    if (isInsideDrawerScrollable(e.target)) return;
    e.preventDefault();
  };

  const onTouchMove = (e) => {
    if (!isScrollBlocked) return;
    if (isInsideDrawerScrollable(e.target)) return;
    e.preventDefault();
  };

  const onKeydownScroll = (e) => {
    if (!isScrollBlocked) return;
    if (e.key === "Escape") return;
    if (isInsideDrawerScrollable(document.activeElement)) return;
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

  const CATEGORY_ORDER = [
    "Kolekcja",
    "Dla par",
    "Rodzina",
    "Runy",
    "Znaki zodiaku",
    "Symbole",
    "Natura",
    "Męskie",
    "Zwierzęta",
    "Zestawy",
    "Personalizacja",
    "Miasta",
  ];

  const known = new Set(CATEGORY_ORDER);
  const present = uniq(products.flatMap((p) => p.categories ?? [])).filter((c) => known.has(c));
  const allCategories = CATEGORY_ORDER.filter((c) => present.includes(c));

  if (categoriesRoot) {
    renderCheckboxOptions(categoriesRoot, allCategories, "category", (c) => c);
  }

  function isMobile() {
    return window.matchMedia?.("(max-width: 980px)").matches ?? false;
  }

  function openDrawer() {
    if (!drawer || !drawerBody || !panel) return;
    const y = window.scrollY || window.pageYOffset || 0;
    window.clearTimeout(closeTimer);
    drawerBody.replaceChildren(panel);
    drawer.hidden = false;
    drawer.classList.remove("is-closing");
    // Let the browser paint the initial state, then animate in
    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      // Keep page position stable (avoid tiny scroll nudge)
      window.scrollTo(0, y);
    });
    blockScroll();
  }

  function closeDrawer() {
    if (!drawer || !panel) return;
    // return panel back to sidebar container (even if hidden on mobile)
    const aside = document.querySelector(".catalog-aside");
    if (aside instanceof HTMLElement) aside.appendChild(panel);
    drawer.classList.remove("is-open");
    drawer.classList.add("is-closing");
    unblockScroll();

    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      drawer.hidden = true;
      drawer.classList.remove("is-closing");
    }, 260);
  }

  function rerender() {
    const state = getStateFromUI();
    const filtered = applyFilters(products, state);

    renderProductGrid(grid, filtered);
    setResultsText(resultsCount, filtered.length, products.length);
    syncEmptyState(emptyState, filtered.length > 0);
  }

  const resetBtn = document.getElementById("resetFilters");
  const resetBtnEmpty = document.getElementById("resetFiltersEmpty");

  function resetAndRender() {
    resetUI();
    rerender();
  }

  document.addEventListener("change", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.matches('input[name="category"]')) rerender();
  });

  const minEl = document.getElementById("priceMin");
  const maxEl = document.getElementById("priceMax");

  minEl?.addEventListener("input", rerender);
  maxEl?.addEventListener("input", rerender);

  resetBtn?.addEventListener("click", resetAndRender);
  resetBtnEmpty?.addEventListener("click", resetAndRender);

  openBtn?.addEventListener("click", () => {
    if (!isMobile()) return;
    openDrawer();
  });

  drawer?.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.dataset.close === "1") closeDrawer();
  });

  window.addEventListener("keydown", (e) => {
    if (!drawer || drawer.hidden) return;
    if (e.key === "Escape") closeDrawer();
  });

  window.addEventListener("resize", () => {
    if (!drawer || drawer.hidden) return;
    if (!isMobile()) closeDrawer();
  });

  rerender();
}

