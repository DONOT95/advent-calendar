// Control: Set From-to, Navigator, System Lang
import { getUiLanguage, setUiLanguage, uiTexts } from "./i18n/i18n.js";
import { startClock, refreshClock } from "./services/clockService.js";
import { resetGenerator } from "./generator.js";
import { THEME_REGISTRY, LANGUAGES } from "./config/constants.js";

// variables to bind HTML elements
let bodyEl,
  popup,
  popupTitle,
  popupText,
  menuBtn,
  menuDropdown,
  menuItems,
  pages,
  fromNameEl,
  toNameEl,
  currentHourEl,
  currentDateEl,
  langSelect,
  themeSelect;

// Boolean variable to check if initUI has been already fully executed.
let uiInitialized = false;

// FUNCTION: initialisation
export function initUI(config, offsetMs) {
  //HTML + JS bind
  if (!bindDom()) return;

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
  startClock(currentHourEl, currentDateEl, offsetMs);
}

//===========================================================================
// Bind all the -by ui.js used- HTML elements with JS variables
function bindDom() {
  const app = document.getElementById("app");
  if (!app) return false;

  // Menu (NAV) HTML
  menuBtn = document.getElementById("menuBtn");
  menuDropdown = document.getElementById("menuDropdown");

  // Section Button ( create, how to, calendar)
  pages = document.querySelectorAll(".page");

  menuItems = document.querySelectorAll(".menu-item");
  bodyEl = document.body;

  // Daily message Elements on dialog
  popup = document.getElementById("popup");
  popupTitle = document.getElementById("popup-title");
  popupText = document.getElementById("popup-text");

  // From - To Names (values)
  fromNameEl = document.getElementById("name-from");
  toNameEl = document.getElementById("name-to");

  // Current Date-Time
  currentHourEl = document.getElementById("currentHour");
  currentDateEl = document.getElementById("currentDate");

  // Selected Page language
  langSelect = document.getElementById("pageLanguage");

  // Selected Theme (only for generate new calendar, current page theme can not be modifyed)
  themeSelect = document.getElementById("themeSelect");

  return true;
}

// Get data from config object and apply it to the website (Static data)
function applyConfig(config) {
  initNameFromTo(fromNameEl, toNameEl, config);
  initLanguage(langSelect, config.lang);
  // initTheme(theme);
}

// Fill HTML-SELECT elements with OPTIONS
function fillHTMLSelectsWithOptionElements() {
  // Fill the select (theme) options in HTML
  if (themeSelect && themeSelect.options.length === 0) {
    Object.entries(THEME_REGISTRY).forEach(([key, def]) => {
      const option = document.createElement("option");
      option.value = key; // e.g. horror (the value of element)
      option.dataset.i18n = def.i18nKey; // e.g. Horror (Visible text)
      themeSelect.appendChild(option);
    });
  }

  // Fill the select (language) options in HTML
  if (langSelect && langSelect.options.length === 0) {
    Object.entries(LANGUAGES).forEach(([langKey, langText]) => {
      const option = document.createElement("option");
      option.value = langKey; // e.g. en
      option.textContent = langText; // e.g. EN
      langSelect.appendChild(option);
    });
  }
}
// Apply selected Theme
function initTheme(theme) {
  // Clear
  bodyEl.classList.remove(
    ...Object.keys(THEME_REGISTRY).map((t) => `background-${t}`),
  );
  bodyEl.classList.add(`background-${theme}`);
}

//================   MENU   ================
function initMenuEvents() {
  // Guard clause
  if (!menuBtn || !menuDropdown) return;

  // OPEN MENU
  menuBtn.addEventListener("click", () => {
    menuDropdown.classList.toggle("open");
  });

  // CLOSE MENU if outside the opened menu clicked
  document.addEventListener("click", (e) => {
    if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
      menuDropdown.classList.remove("open");
    }
  });

  // Click on Menu elements event
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const pageName = item.dataset.page;
      // Change "Seit" (secion visibility)
      switchPage(pageName);

      // Close menu
      menuDropdown.classList.remove("open");
    });
  });
}

//================   PAGE SWITCH   ================
function switchPage(pageName) {
  pages.forEach((sec) => {
    sec.classList.toggle("active", sec.id === `page-${pageName}`);
  });

  // At evry create custom menu option, reset the slider.
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
  popupTitle.textContent = tmpl.replace("{day}", day);

  popupText.textContent = message;

  if (!popup.open) popup.showModal();
}

// ================   CLOSE POPUP, CALENDAR DAY   ================
function initPopupCloseEvents() {
  // Bind HTML elements
  //const popup = document.getElementById("popup");
  const dialogs = document.querySelectorAll("dialog");
  const popupClose = document.getElementById("popup-close-btn");

  // Close popup if click outside of element
  dialogs.forEach((dialog) => {
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
      /* if (event.target === dialog) {
        dialog.close();
      } */
    });
  });
  // Guard clause if no elements
  if (!popup || !popupClose) return;

  //Close-btn on popup (opened day)
  popupClose.addEventListener("click", () => popup.close());
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
  langSelect?.addEventListener("change", () => {
    const newLang = langSelect.value;

    // Update all data-i18n Value
    setUiLanguage(newLang);
    // Change lang -> immediately update date-time
    refreshClock();
  });
}
