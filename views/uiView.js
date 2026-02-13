// Zuständig für: App-übergreifende UI + statische Seiten

/* Header (From/To, Datum/Uhr)
Language-Select
Theme-Klassen am <body>
Navigation / Menu
How-To Section -> Static
 */

// ========== DOM BINDING FOR EVERY ELEMENT WHAT NOT IN CALENDAR/WIZARD ==========
export function bindUiDom() {
  return {
    app: document.getElementById("app"),

    body: document.body,

    calendarPage: document.getElementById("page-calendar"),

    // Menu
    homeBtn: document.getElementById("homeBtn"),

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

    // CTA Buttons
    heroActions: document.getElementById("heroActions"),
    createBtn: document.getElementById("heroCreateBtn"),
    openBtn: document.getElementById("heroOpenLinkBtn"),
    viewBtn: document.getElementById("heroViewBtn"),

    // Popup (calendar day dialog)
    popup: document.getElementById("popup"),
    popupTitle: document.getElementById("popup-title"),
    popupDate: document.getElementById("dayPrefix"),
    popupText: document.getElementById("popup-text"),
    // TODO: ONE CLOSEDIALOG EVENT FOR ALL CLOSE BTN
    popupCloseBtn: document.getElementById("popup-close-btn"),

    // Theme select exists on create page
    themeSelect: document.getElementById("themeSelect"),

    // Dialog for Open link
    openLinkDialog: document.getElementById("openLinkDialog"),
    openLinkInput: document.getElementById("openLinkInput"),
    openLinkError: document.getElementById("openLinkError"),
    btnOpenLinkCancel: document.getElementById("btnOpenLinkCancel"),
    btnOpenLinkGo: document.getElementById("btnOpenLinkGo"),

    // TODO: ONE CLOSEDIALOG EVENT FOR ALL CLOSE BTN
    // Dialog for URL data error (cant read, damaged)
    urlStatusDialog: document.getElementById("showUrlStatusDialog"),
    statusTitle: document.getElementById("urlStatusTitle"),
    statusText: document.getElementById("urlStatusText"),
    /* closeDialogBtns: Array.from(document.querySelectorAll("close-dialog")), */

    // Dialogs (optional helper for outside-click close)
    // Last to be able to get all the dialogs inside the array
    closeUrlErrorBtn: document.getElementById("closeUrlErrorBtn"),
    dialogs: Array.from(document.querySelectorAll("dialog")),
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

// TODO: Values can instead of "EN" -> "English" or Flag icons
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
export function applyTheme(htmlEl, themeRegistry, themeKey) {
  if (!htmlEl || !themeRegistry) return;

  // Remove all type of theme classes

  if (!themeRegistry[themeKey]) themeKey = Object.keys(themeRegistry[0]);

  // Add selected theme class
  htmlEl.dataset.theme = themeKey;
}
