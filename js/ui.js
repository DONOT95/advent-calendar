// Control: Set From-to, Navigator, System Lang
import { getUiLanguage, setUiLanguage, uiTexts } from "./i18n.js";
import { startClock, refreshClock } from "./clock.js";
import { resetGenerator } from "./generator.js";

// "registry" OPTIONS Theme:
export const THEME_REGISTRY = {
  classic: { i18nKey: "selects.classic" },
  family: { i18nKey: "selects.family" },
  neon: { i18nKey: "selects.neon" },
  horror: { i18nKey: "selects.horror" },
};

// OPTIONS lanuage:
const LANGUAGES = {
  en: "EN",
  de: "DE",
  hu: "HU",
};

// FUNCTION: HTML + JS bind, initialisation
export function initUI(config) {
  const { lang, theme } = config;

  // Menu (NAV) HTML
  const menuBtn = document.getElementById("menuBtn");
  const menuDropdown = document.getElementById("menuDropdown");

  // Section Button ( create, how to, calendar)
  const menuItems = document.querySelectorAll(".menu-item");
  const pages = document.querySelectorAll(".page");

  // From - To Names (values)
  const fromNameEl = document.getElementById("name-from");
  const toNameEl = document.getElementById("name-to");

  // Current Date-Time
  const currentHour = document.getElementById("currentHour");
  const currentDate = document.getElementById("currentDate");

  // Selected Page language
  const langSelect = document.getElementById("pageLanguage");

  // Selected Theme (only for generate new calendar, current page theme can not be modifyed)
  const themeSelect = document.getElementById("themeSelect");

  // Fill the select (theme) optionen in HTML
  Object.entries(THEME_REGISTRY).forEach(([key, def]) => {
    const option = document.createElement("option");
    option.value = key; // e.g. horror (the value of element)
    option.dataset.i18n = def.i18nKey; // e.g. Horror (Visible text)
    themeSelect.appendChild(option);
  });

  // Fill the select (language) options in HTML
  Object.entries(LANGUAGES).forEach(([langKey, langText]) => {
    const option = document.createElement("option");
    option.value = langKey; // e.g. en
    option.textContent = langText; // e.g. EN
    langSelect.appendChild(option);
  });

  /*   const bodyEl = document.body;
  function initTheme(theme) {
    // Clear
    bodyEl.classList.remove(...THEMES.map((t) => `background-${t}`));
    bodyEl.classList.add(`background-${theme}`);
  } */

  /*   if (themeSelect) {
    themeSelect.value = theme;
    themeSelect.addEventListener("change", (e) =>
      setTheme(e.target.value, bodyEl)
    );
  } */

  if (!menuBtn || !menuDropdown) return;

  // Start Time
  initPopupCloseEvents();
  initNameFromTo(fromNameEl, toNameEl, config);
  initLanguage(lang);
  // initTheme(theme);
  startClock(currentHour, currentDate);

  //================   MENU   ================
  // OPEN MENU
  menuBtn.addEventListener("click", () => {
    menuDropdown.classList.toggle("open");
  });

  // CLOSE MENU
  document.addEventListener("click", (e) => {
    if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
      menuDropdown.classList.remove("open");
    }
  });

  // Click on Menu elements event
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const pageName = item.dataset.page;
      // Change "Seit"
      switchPage(pageName);

      // Close menu
      menuDropdown.classList.remove("open");
    });
  });

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

  //================   LANGUAGE SWITCH   ================
  langSelect?.addEventListener("change", () => {
    const newLang = langSelect.value;

    // Update all data-i18n Value
    setUiLanguage(newLang);
    // Change lang -> immediately update date-time
    refreshClock();
  });
}
//===========================================================================
// ================   OPEN POPUP, CALENDAR DAY   ================
export function openPopup(day, message) {
  // =============   Bind HTML with consts (DATA)   =============
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupText = document.getElementById("popup-text");

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
  const popup = document.getElementById("popup");
  const dialogs = document.querySelectorAll("dialog");
  const popupClose = document.getElementById("popup-close-btn");

  /*   // Close popup if click outside of element */
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
function initLanguage(lang) {
  const selectedLang = document.getElementById("pageLanguage");
  if (!selectedLang) return;

  selectedLang.value = lang;

  setUiLanguage(lang);
}
