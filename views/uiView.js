// Zuständig für: App-übergreifende UI + statische Seiten

/* Header (From/To, Datum/Uhr)
Language-Select
Theme-Klassen am <body>
Navigation / Menu
How-To Section -> Static
 */

// ========== DOM BINDING ==========
export function bindUiDom() {
  return {
    app: document.getElementById("app"),
    body: document.body,

    // Menu
    menuBtn: document.getElementById("menuBtn"),
    menuDropdown: document.getElementById("menuDropdown"),
    menuItems: Array.from(document.querySelectorAll(".menu-item")),

    // Pages
    pages: Array.from(document.querySelectorAll(".page")),

    // Header values
    nameFrom: document.getElementById("name-from"),
    nameTo: document.getElementById("name-to"),
    currentHour: document.getElementById("currentHour"),
    currentDate: document.getElementById("currentDate"),
    pageLanguage: document.getElementById("pageLanguage"),

    // Popup (calendar day dialog)
    popup: document.getElementById("popup"),
    popupTitle: document.getElementById("popup-title"),
    popupText: document.getElementById("popup-text"),
    popupCloseBtn: document.getElementById("popup-close-btn"),

    // Dialogs (optional helper for outside-click close)
    dialogs: Array.from(document.querySelectorAll("dialog")),

    // Theme select exists on create page (still UI-level binding)
    themeSelect: document.getElementById("themeSelect"),
  };
}

export function isUiDomReady(dom) {
  return Boolean(
    dom?.app && dom?.menuBtn && dom?.menuDropdown && dom?.pages?.length,
  );
}
//========== END ==========

// ========== FILL HTML select elements with OPTIONS ==========
export function fillThemeOptions(themeSelectEl, themeRegistry) {
  if (!themeSelectEl || themeSelectEl.options.length > 0) return;
  Object.entries(themeRegistry).forEach(([key, def]) => {
    const option = document.createElement("option");
    option.value = key; // e.g. horror (the value of element)
    option.dataset.i18n = def.i18nKey; // e.g. Horror (Visible text)
    themeSelectEl.appendChild(option);
  });
}

// TODO: Values can instead of "EN" -> "English"  als i18n usw
export function fillLanguageOptions(languageSelectEl, supportedLangs) {
  if (!languageSelectEl || languageSelectEl.options.length > 0) return;

  supportedLangs.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang; // e.g. en
    option.textContent = lang.toUpperCase(); // e.g. EN
    languageSelectEl.appendChild(option);
  });
}
//========== END ==========

//========== MENU ==========
export function setActivePage(pages, pageName) {
  if (!pages) return;

  pages.forEach((sec) => {
    sec.classList.toggle("active", sec.id === `page-${pageName}`);
  });
}

export function toggleMenu(menuDropdownEl) {
  if (!menuDropdownEl) return;

  menuDropdownEl.classList.toggle("open");
}

export function closeMenu(menuDropdownEl) {
  if (!menuDropdownEl) return;

  menuDropdownEl.classList.remove("open");
}

export function shouldCloseMenuOnDocumentClick(e, menuBtnEl, menuDropdownEl) {
  if (!menuBtnEl || !menuDropdownEl) return false;

  const target = e.target;
  return !menuDropdownEl.contains(target) && !menuBtnEl.contains(target);
}
//========== END ==========

//========== SET THEME ==========
export function applyTheme(bodyEl, themeRegistry, themeKey) {
  if (!bodyEl || !themeRegistry) return;

  // Remove all type of theme classes
  bodyEl.classList.remove(
    ...Object.keys(themeRegistry).map((t) => `background-${t}`),
  );

  if (!themeRegistry[themeKey]) themeKey = Object.keys(themeRegistry[0]);

  // Add selected theme class
  bodyEl.classList.add(`background-${themeKey}`);
}

//========== SET DIALOG TITLE/TEXT ==========
export function showPopup(popupEl, titleEl, textEl, titleText, messageText) {
  if (!popupEl || !titleEl || !textEl) return;

  titleEl.textContent = titleText;
  textEl.textContent = messageText;

  if (!popupEl.open) popupEl.showModal();
}
