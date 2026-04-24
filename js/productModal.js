function formatPrice(value, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
}

function buildOrderLink() {
  return "./index.html#contact";
}

function ensureModalShell() {
  let root = document.getElementById("productModal");
  if (root) return root;

  root = document.createElement("div");
  root.id = "productModal";
  root.className = "modal";
  root.hidden = true;
  root.innerHTML = `
    <div class="modal-backdrop" data-close="1"></div>
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-label="Szczegóły produktu">
      <button class="modal-close" type="button" aria-label="Zamknij" data-close="1">×</button>
      <div class="modal-content">
        <div class="modal-gallery">
          <div class="modal-image">
            <img id="modalMainImage" alt="" />
          </div>
          <div class="modal-thumbs" id="modalThumbs"></div>
        </div>
        <div class="modal-info">
          <p class="modal-kicker" id="modalKicker"></p>
          <h2 class="modal-title" id="modalTitle"></h2>
          <p class="modal-desc" id="modalDesc"></p>
          <div class="modal-specs" id="modalSpecs" hidden></div>
          <div class="modal-meta">
            <span class="modal-price" id="modalPrice"></span>
          </div>
          <div class="modal-actions">
            <a class="btn btn-primary" id="modalOrder" href="#">Zamów</a>
          </div>
        </div>
      </div>
    </div>
  `.trim();

  document.body.appendChild(root);
  return root;
}

function openModal(root) {
  const y = window.scrollY || window.pageYOffset || 0;
  root.classList.remove("is-closing");
  root.hidden = false;
  root.classList.remove("is-open");
  document.documentElement.classList.add("product-modal-open");
  document.body.classList.add("product-modal-open");

  const closeBtn = root.querySelector(".modal-close");
  if (closeBtn instanceof HTMLElement) {
    // Prevent the browser from "nudging" the page scroll on focus
    closeBtn.focus({ preventScroll: true });
  }

  // Ensure transitions fire after [hidden] -> visible
  requestAnimationFrame(() => {
    if (!root.hidden) root.classList.add("is-open");
    // Keep the underlying page position perfectly stable
    window.scrollTo(0, y);
  });
}

function closeModal(root) {
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    root.classList.remove("is-open");
    root.classList.add("is-closing");
    window.setTimeout(() => {
      root.hidden = true;
      root.classList.remove("is-closing");
    }, 210);
  } else {
    root.hidden = true;
  }
  document.documentElement.classList.remove("product-modal-open");
  document.body.classList.remove("product-modal-open");
}

function setMainImage(imgEl, src, alt) {
  imgEl.src = src;
  imgEl.alt = alt;
}

function renderThumbs(thumbsRoot, images, activeIdx, onPick) {
  thumbsRoot.replaceChildren(
    ...images.map((src, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "thumb";
      if (idx === activeIdx) btn.classList.add("is-active");

      btn.innerHTML = `<img src="${src}" alt="" loading="lazy" />`;
      btn.addEventListener("click", () => onPick(idx));
      return btn;
    }),
  );
}

export function initProductModal(products) {
  const root = ensureModalShell();
  const byId = new Map(products.map((p) => [p.id, p]));

  const dialog = root.querySelector(".modal-dialog");
  const imgEl = root.querySelector("#modalMainImage");
  const thumbsRoot = root.querySelector("#modalThumbs");
  const kickerEl = root.querySelector("#modalKicker");
  const titleEl = root.querySelector("#modalTitle");
  const descEl = root.querySelector("#modalDesc");
  const specsEl = root.querySelector("#modalSpecs");
  const priceEl = root.querySelector("#modalPrice");
  const orderEl = root.querySelector("#modalOrder");

  if (
    !(dialog instanceof HTMLElement) ||
    !(imgEl instanceof HTMLImageElement) ||
    !(thumbsRoot instanceof HTMLElement) ||
    !(kickerEl instanceof HTMLElement) ||
    !(titleEl instanceof HTMLElement) ||
    !(descEl instanceof HTMLElement) ||
    !(specsEl instanceof HTMLElement) ||
    !(priceEl instanceof HTMLElement) ||
    !(orderEl instanceof HTMLAnchorElement)
  ) {
    return;
  }

  let activeProductId = null;
  let activeIndex = 0;
  let lastFocused = null;
  let isScrollBlocked = false;

  function isInsideModalScrollable(target) {
    if (!(target instanceof Node)) return false;
    const el = target instanceof HTMLElement ? target : target.parentElement;
    if (!(el instanceof HTMLElement)) return false;
    const content = el.closest(".modal-content");
    return content instanceof HTMLElement;
  }

  const onWheel = (e) => {
    if (!isScrollBlocked) return;
    if (isInsideModalScrollable(e.target)) return;
    e.preventDefault();
  };

  const onTouchMove = (e) => {
    if (!isScrollBlocked) return;
    if (isInsideModalScrollable(e.target)) return;
    e.preventDefault();
  };

  const onKeydownScroll = (e) => {
    if (!isScrollBlocked) return;
    if (e.key === "Escape") return;
    if (isInsideModalScrollable(document.activeElement)) return;
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

  function render(product) {
    activeProductId = product.id;
    activeIndex = 0;

    const images = (product.gallery?.length ? product.gallery : product.images) ?? [];
    const first = images[0] ?? "";

    const categories = Array.isArray(product.categories) ? product.categories : [];
    kickerEl.textContent = categories.slice(0, 3).join(" · ");

    titleEl.textContent = product.name;
    descEl.textContent = product.description ?? "Minimalistyczny projekt, dopracowany w detalu.";
    priceEl.textContent = formatPrice(product.price, product.currency);
    orderEl.href = buildOrderLink();

    const specs = product.specs ?? null;
    if (specs && typeof specs === "object") {
      const rows = [];
      if (specs.kamienie) rows.push(["Kamienie", specs.kamienie]);
      if (specs.metal) rows.push(["Metal", specs.metal]);
      if (specs.waga) rows.push(["Waga", specs.waga]);

      if (rows.length) {
        specsEl.hidden = false;
        specsEl.innerHTML = `
          <h3 class="modal-specs-title">Szczegóły</h3>
          <dl class="modal-specs-list">
            ${rows
              .map(
                ([k, v]) =>
                  `<div class="spec-row"><dt class="spec-k">${k}</dt><dd class="spec-v">${v}</dd></div>`,
              )
              .join("")}
          </dl>
        `.trim();
      } else {
        specsEl.hidden = true;
        specsEl.replaceChildren();
      }
    } else {
      specsEl.hidden = true;
      specsEl.replaceChildren();
    }

    setMainImage(imgEl, first, product.name);
    const onPick = (idx) => {
      activeIndex = idx;
      setMainImage(imgEl, images[idx], product.name);
      renderThumbs(thumbsRoot, images, activeIndex, onPick);
    };
    renderThumbs(thumbsRoot, images, activeIndex, onPick);
  }

  function onOpen(product) {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    render(product);
    blockScroll();
    openModal(root);
  }

  function onClose() {
    closeModal(root);
    unblockScroll();
    if (lastFocused && document.contains(lastFocused)) {
      // Avoid scroll jump when restoring focus to the triggering card/button
      lastFocused.focus({ preventScroll: true });
    }
  }

  // Close interactions
  root.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.dataset.close === "1") onClose();
  });

  window.addEventListener("keydown", (e) => {
    if (root.hidden) return;
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const product = activeProductId ? byId.get(activeProductId) : null;
      const images = (product?.gallery?.length ? product.gallery : product?.images) ?? [];
      if (images.length <= 1) return;
      const dir = e.key === "ArrowRight" ? 1 : -1;
      activeIndex = (activeIndex + dir + images.length) % images.length;
      setMainImage(imgEl, images[activeIndex], product?.name ?? "");
      renderThumbs(thumbsRoot, images, activeIndex, (idx) => {
        activeIndex = idx;
        setMainImage(imgEl, images[idx], product?.name ?? "");
      });
    }
  });

  // Open via click on card (but not the order button)
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const order = target.closest(".order-link");
    if (order) return;

    const card = target.closest(".card");
    if (!(card instanceof HTMLElement)) return;

    const id = card.dataset.productId;
    if (!id) return;

    const product = byId.get(id);
    if (!product) return;

    e.preventDefault();
    onOpen(product);
  });
}

