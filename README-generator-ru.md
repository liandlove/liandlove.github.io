# Product Generator — локальная инструкция

Этот файл объясняет, как использовать `product-generator.html` **локально** на компьютере.

## 1) Что нужно перед стартом

- Локальный клон репозитория `liandlove.github.io`
- Браузер `Google Chrome` или `Microsoft Edge` (актуальная версия)
- Файлы фото для нового товара (1-3 изображения)

## 2) Как открыть генератор

1. Откройте файл `product-generator.html` в браузере.
2. Нажмите кнопку **"Wybierz folder projektu"**.
3. Выберите папку проекта `liandlove.github.io`.
4. Если все ок, появится статус: **"Folder projektu wybrany poprawnie."**

## 3) Ввод данных товара

1. В поле **Product number** укажите номер товара (например `90`).
2. Перетащите изображения в блоки:
   - `Drop Image 1 (main)`
   - `Drop Image 2`
   - `Drop Image 3`
3. Вставьте описание в текстовое поле в формате:

```txt
Kategoria: Personalizacja
Cena: 170 PLN
Rodzaj kamienia: onyks
Metal: Srebro 925
Waga: 0,57 g
Opis: Bransoletka wykonana z...
```

## 4) Что делают кнопки

## `Generate & Copy product`

- Генерирует JSON объекта товара.
- Показывает результат внизу (в `pre`).
- Копирует JSON в буфер обмена.

## `Zapisz zdjęcia + dodaj do products.js`

- Переименовывает и сохраняет фото в `assets/images/`:
  - `product-XX-01.png`
  - `product-XX-02.png`
  - `product-XX-03.png`
- Добавляет новый объект товара в `js/products.js`.

## `Special button: commit + push (copy)`

- Копирует в буфер готовые git-команды:

```bash
git add .
git commit -m "add product <номер> from generator"
git push
```

Потом вставьте их в терминал в корне проекта.

## 5) Где проверить результат

- Фото: `assets/images/`
- Товар: `js/products.js`
- Сайт локально: откройте `catalog.html` или `gallery.html`

## 6) Важные ограничения

- Этот генератор рассчитан на **локальное** использование.
- На GitHub Pages он не сможет:
  - записывать файлы в репозиторий,
  - изменять `products.js`,
  - запускать `git commit/push`.

## 7) Быстрый рабочий сценарий

1. Открыть `product-generator.html`
2. Выбрать папку проекта
3. Указать номер товара
4. Добавить 1-3 фото
5. Вставить текст описания
6. Нажать `Zapisz zdjęcia + dodaj do products.js`
7. Нажать `Special button...` и вставить команды в терминал
8. Проверить сайт
