// Control: Set From-to, Navigator, System Lang
import {
  getUiLanguage,
  setUiLanguage,
  uiTexts,
  SUPPORTED_LANGUAGES,
} from "./i18n/i18n.js";
import { startClock, refreshClock } from "./services/clockService.js";
import { resetGenerator } from "./generator.js";
import { THEME_REGISTRY } from "./config/constants.js";

import {
  setActivePage,
  toggleMenu,
  closeMenu,
  shouldCloseMenuOnDocumentClick,
  bindUiDom,
  isUiDomReady,
  fillThemeOptions,
  fillLanguageOptions,
} from "./views/uiView.js";

// Boolean variable to check if initUI has been already fully executed.
let uiInitialized = false;

let dom = null;

// FUNCTION: initialisation
export function initUI(config, offsetMs) {
  //HTML + JS bind
  dom = bindUiDom();

  if (!isUiDomReady(dom)) return;

  // First need to fill HTML with options to be able to set values in applyConfig
  if (!uiInitialized) {
    fillHTMLSelectsWithOptionElements();
  }

  // Apply Data
  applyConfig(config);

  // Guard clause to avoid double initialization
  if (uiInitialized) return;
  uiInitialized = true;

  // Only once at setup executed functions:
  initPopupCloseEvents();
  initMenuEvents();
  initLanguageEvents();
  // Start Time
  startClock(dom.currentHour, dom.currentDate, offsetMs);
}

//===========================================================================

// Get data from config object and apply it to the website (Static data)
function applyConfig(config) {
  initNameFromTo(dom.nameFrom, dom.nameTo, config);
  initLanguage(dom.pageLanguage, config.lang);
  // initTheme(theme);
}

// Fill HTML-SELECT elements with OPTIONS
function fillHTMLSelectsWithOptionElements() {
  // Fill the select (theme) options in HTML
  fillThemeOptions(dom.themeSelect, THEME_REGISTRY);

  // Fill the select (language) options in HTML
  fillLanguageOptions(dom.pageLanguage, SUPPORTED_LANGUAGES);
}
// Apply selected Theme
function initTheme(theme) {
  // Clear
  dom.body.classList.remove(
    ...Object.keys(THEME_REGISTRY).map((t) => `background-${t}`),
  );
  dom.body.classList.add(`background-${theme}`);
}

//================   MENU   ================
function initMenuEvents() {
  // Guard clause
  if (!dom?.menuBtn || !dom?.menuDropdown) return;

  // OPEN MENU
  dom.menuBtn.addEventListener("click", () => {
    toggleMenu(dom.menuDropdown);
  });

  // CLOSE MENU if outside the opened menu clicked
  document.addEventListener("click", (e) => {
    if (shouldCloseMenuOnDocumentClick(e, dom.menuBtn, dom.menuDropdown)) {
      closeMenu(dom.menuDropdown);
    }
  });

  // Click on Menu elements event
  dom.menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Change "Seit" (secion visibility)
      switchPage(item.dataset.page);

      // Close menu
      closeMenu(dom.menuDropdown);
    });
  });
}

//================   PAGE SWITCH   ================
function switchPage(pageName) {
  setActivePage(dom.pages, pageName);

  // At every create custom menu option, reset the slider.
  if (pageName === "create") {
    resetGenerator();
  }
}

// ================   OPEN POPUP, CALENDAR DAY   ================
export function openPopup(day, message) {
  // =============   Bind HTML with consts (DATA)   =============

  // Check selected language
  const lang = getUiLanguage();

  // Navigate to selected lang or pick default
  const dict = uiTexts[lang] || uiTexts.en;
  var tmpl = dict.labels.popupdaytitle || uiTexts.en.labels.popupdaytitle;

  // Proper title format
  dom.popupTitle.textContent = tmpl.replace("{day}", day);

  dom.popupText.textContent = message;

  if (!dom.popup.open) dom.popup.showModal();
}

// ================   CLOSE POPUP, CALENDAR DAY   ================
function initPopupCloseEvents() {
  if (!dom?.dialogs?.length) return;
  // Bind HTML elements

  // Close popup if click outside of element
  dom.dialogs.forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        dialog.close();
      }
    });
  });

  //Close-btn on popup (opened day)
  dom.popupCloseBtn?.addEventListener("click", () => dom.popup?.close());
}
// ================   READ FROM-TO Name or set Default   ================
// NO NEED HERE TO SET DEFAULT VALUE... Read config URL in main already does
function initNameFromTo(fromNameEl, toNameEl, config) {
  fromNameEl.textContent = config.from || "Me";
  toNameEl.textContent = config.to || "You";
}

// ================   READ THEME or set Default   ================

// ================   INIT LANGUAGE   ================
function initLanguage(langEl, lang) {
  // Make sure lang is not undefined
  const getValidOrDefaultLang = lang || "en";
  langEl.value = getValidOrDefaultLang;
  // Apply Language
  setUiLanguage(getValidOrDefaultLang);
}

//================   LANGUAGE SWITCH   ================
function initLanguageEvents() {
  dom.pageLanguage?.addEventListener("change", () => {
    const newLang = dom.pageLanguage.value;

    // Update all data-i18n Value
    setUiLanguage(newLang);
    // Change lang -> immediately update date-time
    refreshClock();
  });
}
