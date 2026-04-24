export function initScrollReveal() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const items = Array.from(document.querySelectorAll("[data-reveal]"));
  if (items.length === 0) return;

  const revealNowIfVisible = (el) => {
    if (!(el instanceof HTMLElement)) return false;
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight || document.documentElement.clientHeight;
    const visible = rect.top < viewH * 0.92 && rect.bottom > 0;
    if (visible) {
      el.classList.add("is-revealed");
      return true;
    }
    return false;
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        io.unobserve(entry.target);
      }
    },
    { root: null, threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  // First paint: reveal anything already visible without requiring scroll
  items.forEach((el) => {
    if (!revealNowIfVisible(el)) io.observe(el);
  });
}

