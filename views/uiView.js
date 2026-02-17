// UI view for shared static/global interface elements.
/* Responsibilities:
- Header values (from/to, date/time)
- Language select and body theme assignment
- Navigation/menu state helpers
- Shared dialogs and global UI bindings
*/

// ========== DOM BINDING FOR ELEMENTS OUTSIDE CALENDAR/WIZARD ==========
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
    // TODO: Consolidate all close buttons into one shared close-handler.
    popupCloseBtn: document.getElementById("popup-close-btn"),

    // Theme select exists on create page
    themeSelect: document.getElementById("themeSelect"),

    // Dialog for Open link
    openLinkDialog: document.getElementById("openLinkDialog"),
    openLinkInput: document.getElementById("openLinkInput"),
    openLinkError: document.getElementById("openLinkError"),
    btnOpenLinkCancel: document.getElementById("btnOpenLinkCancel"),
    btnOpenLinkGo: document.getElementById("btnOpenLinkGo"),

    // TODO: Consolidate all close buttons into one shared close-handler.
    // Dialog for URL data errors (invalid or unreadable links).
    urlStatusDialog: document.getElementById("showUrlStatusDialog"),
    statusTitle: document.getElementById("urlStatusTitle"),
    statusText: document.getElementById("urlStatusText"),
    /* closeDialogBtns: Array.from(document.querySelectorAll("close-dialog")), */

    // Dialogs (optional helper for outside-click close)
    // Keep this last so all dialogs are already present in the DOM.
    closeUrlErrorBtn: document.getElementById("closeUrlErrorBtn"),
    dialogs: Array.from(document.querySelectorAll("dialog")),

    footerYear: document.getElementById("currentYear"),
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

// TODO: Consider full language labels ("English") or icons instead of short codes.
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

  // Fallback to first registered theme when provided key is invalid.
  if (!themeRegistry[themeKey]) themeKey = Object.keys(themeRegistry)[0];

  // Apply selected theme to <body> via data attribute.
  htmlEl.dataset.theme = themeKey;
}
