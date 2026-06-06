import { PRODUCTS } from "./products.js?v=20260426-akwa2";

function collectAllImages(products) {
  const seen = new Set();
  const images = [];

  for (const product of products) {
    const productImages = Array.isArray(product.gallery) && product.gallery.length ? product.gallery : product.images;
    if (!Array.isArray(productImages)) continue;

    for (const src of productImages) {
      if (typeof src !== "string" || !src.trim()) continue;
      if (seen.has(src)) continue;
      seen.add(src);
      images.push({
        src,
        alt: product.name ? `${product.name} — zdjęcie` : "Zdjęcie produktu",
      });
    }
  }

  return images;
}

function renderGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  const galleryCount = document.getElementById("galleryCount");
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("galleryLightboxImage");
  const lightboxClose = document.getElementById("galleryLightboxClose");
  if (!(galleryGrid instanceof HTMLElement)) return;
  if (!(lightbox instanceof HTMLElement)) return;
  if (!(lightboxImage instanceof HTMLImageElement)) return;

  const allImages = collectAllImages(PRODUCTS);

  if (galleryCount instanceof HTMLElement) {
    galleryCount.textContent = `Liczba zdjęć: ${allImages.length}`;
  }

  const fragment = document.createDocumentFragment();

  let previousOverflow = "";
  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.src = "";
    lightboxImage.alt = "";
    document.body.style.overflow = previousOverflow;
  };

  const openLightbox = (src, alt) => {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.hidden = false;
  };

  if (lightboxClose instanceof HTMLButtonElement) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  lightbox.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.close === "1") closeLightbox();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (lightbox.hidden) return;
    closeLightbox();
  });

  for (const image of allImages) {
    const button = document.createElement("button");
    button.className = "gallery-item";
    button.type = "button";
    button.setAttribute("aria-label", `${image.alt} (otwórz podgląd)`);
    button.addEventListener("click", () => openLightbox(image.src, image.alt));

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";
    img.decoding = "async";

    button.appendChild(img);
    fragment.appendChild(button);
  }

  galleryGrid.replaceChildren(fragment);
}

document.addEventListener("DOMContentLoaded", renderGallery);
