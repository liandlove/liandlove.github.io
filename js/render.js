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

function buildOrderMailto(product) {
  const subject = `Li & Love – zamówienie: ${product.name}`;
  const bodyLines = [
    "Dzień dobry Li & Love,",
    "",
    `Chcę zamówić: ${product.name}`,
    `ID produktu: ${product.id}`,
    `Cena: ${formatPrice(product.price, product.currency)}`,
    "",
    "Obwód nadgarstka:",
    "Kraj dostawy:",
    "",
    "Dziękuję.",
  ];

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join("\n"),
  });

  return `mailto:orders@example.com?${params.toString()}`;
}

export function renderProductCard(product) {
  const article = document.createElement("article");
  article.className = "card";
  article.dataset.productId = product.id;
  article.tabIndex = 0;

  const imgSrc = product.images?.[0] ?? "";
  const categories = Array.isArray(product.categories) ? product.categories : [];
  const categoryLabel = categories[0] ?? "";

  article.innerHTML = `
    <div class="card-media">
      <img src="${imgSrc}" alt="${product.name}" loading="lazy" />
    </div>
    <div class="card-body">
      <div>
        <h3 class="card-title">${product.name}</h3>
        <div class="card-meta">
          <span>${categoryLabel}</span>
          <span class="price">${formatPrice(product.price, product.currency)}</span>
        </div>
      </div>
      <div class="card-actions">
        <a class="btn btn-primary order-link" href="${buildOrderMailto(product)}">Zamów</a>
      </div>
    </div>
  `.trim();

  return article;
}

export function renderProductGrid(container, products) {
  const nodes = products.map((p, idx) => {
    const card = renderProductCard(p);
    card.style.setProperty("--stagger", `${idx * 42}ms`);
    return card;
  });

  container.replaceChildren(...nodes);
}

