# Li & Love — strona marki (statyczna)

Minimalistyczna strona marki bransoletek w stylu „minimal luxury”, zbudowana w **HTML + CSS + czystym JavaScript** (bez backendu, kompatybilna z GitHub Pages).

## Pages
- `index.html`: Strona główna + wybrane produkty
- `catalog.html`: Katalog + filtrowanie (kolor, materiał, cena)

## Run locally
To projekt statyczny. Możesz otworzyć `index.html` bezpośrednio w przeglądarce.

Rekomendowane (żeby uniknąć problemów z modułami/CORS w niektórych przeglądarkach): uruchom mały serwer lokalny.

### Option A: Python
W folderze projektu:

```bash
python -m http.server 5173
```

Następnie otwórz `http://localhost:5173/`.

### Option B: VS Code / Cursor Live Server
- Zainstaluj “Live Server”
- Kliknij prawym na `index.html` → “Open with Live Server”

## Deploy to GitHub Pages
1. Utwórz repo i wypchnij (push) projekt.
2. W GitHub: **Settings → Pages**
3. Ustaw **Source** na domyślną gałąź i folder `/ (root)`.
4. Zapisz. Strona pojawi się pod adresem GitHub Pages.

## Project structure
```
bracelet-brand-site/
  index.html
  catalog.html
  assets/
    images/
    textures/
    fonts/
  css/
    reset.css
    styles.css
    catalog.css
  js/
    products.js
    render.js
    filters.js
    main.js
```

## Notes
- Produkty są zdefiniowane w `js/products.js` i renderowane na obu podstronach.
- Przycisk “Zamów” używa linku `mailto:` (przyjazne dla statycznej strony).

