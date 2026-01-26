// Control: Set From-to, Navigator, System Lang
import {
  getUiLanguage,
  setUiLanguage,
  uiTexts,
  SUPPORTED_LANGUAGES,
} from "../i18n/i18n.js";
import { startClock, refreshClock } from "../services/clockService.js";
import { resetGenerator } from "./wizardController.js";
import { THEME_REGISTRY } from "../config/constants.js";

import {
  setActivePage,
  toggleMenu,
  closeMenu,
  shouldCloseMenuOnDocumentClick,
  bindUiDom,
  isUiDomReady,
  fillThemeOptions,
  fillLanguageOptions,
  applyTheme,
  showPopup,
} from "../views/uiView.js";

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

// Get data from config object and apply it to the FROM/TO/ SELECTED LANGUAGE elements. Set THEME
function applyConfig(config) {
  initNameFromTo(dom.nameFrom, dom.nameTo, config);
  initLanguage(dom.pageLanguage, config.lang);
  applyTheme(dom.body, THEME_REGISTRY, config.theme);
}

// Fill HTML-SELECT elements with OPTIONS
function fillHTMLSelectsWithOptionElements() {
  // Fill the select (theme) options in HTML
  fillThemeOptions(dom.themeSelect, THEME_REGISTRY);

  // Fill the select (language) options in HTML
  fillLanguageOptions(dom.pageLanguage, SUPPORTED_LANGUAGES);
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
  // Check selected language
  const lang = getUiLanguage();

  // Navigate to selected lang or pick default
  const dict = uiTexts[lang] || uiTexts.en;

  let tmpl = dict?.labels?.popupdaytitle || uiTexts.en.labels.popupdaytitle;

  // Proper title format
  const titleText = tmpl.replace("{day}", day);

  // SET title, message for popup
  showPopup(dom.popup, dom.popupTitle, dom.popupText, titleText, message);
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
