// Control: Set From-to, Navigator, System Lang
import {
  SUPPORTED_LANGUAGES,
  applyUiLanguage,
  getUiLanguage,
  getLangAndDictThanResolveKey,
} from "../i18n/i18n.js";
import { startClock, refreshClock } from "../services/clockService.js";
import {
  resetGenerator,
  activateWizardResize,
  deactivateWizardResize,
} from "./wizardController.js";
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
} from "../views/uiView.js";
import {
  DEFAULTS,
  appState,
  ensureDemoCalendarMessages,
} from "../state/appState.js";
import { refreshCalendar, setCalendarMessages } from "./calendarController.js";

import {
  displayCalendarMessage,
  setFromAndToDefaultMultiLang,
} from "../views/calendarView.js";
import {
  getCalendarDialogTitle,
  getPreviewItemPrefix,
  getFrom,
  getTo,
  getUrlErrorMessage,
} from "../services/calendarDayServices.js";

// Boolean variable to check if initUI has been already fully executed.
let uiInitialized = false;

let dom = null;
// FUNCTION: initialisation
export function initUI(config, offsetMs, initialPage = "home", serverDate) {
  //HTML + JS bind
  dom = bindUiDom();

  if (!isUiDomReady(dom)) return;

  // First need to fill HTML with options to be able to set values in applyConfig
  if (!uiInitialized) {
    fillHTMLSelectsWithOptionElements();
  }

  // Apply Data from url or defaults to UI elements
  applyConfig(config);

  // Implement language on dom element
  dom.pageLanguage.value = getUiLanguage();

  // Determine Opened website section (home | calendar)
  switchPage(initialPage);

  // enable background only for calendar
  dom.main?.classList.toggle("calendar-scope", pageName === "calendar");

  // Guard clause to avoid double initialization
  if (uiInitialized) return;
  uiInitialized = true;

  // Only once at setup executed functions:
  initPopupCloseEvents();
  initOpenLinkEvents();
  initMenuEvents();
  initLanguageEvents();
  initCTAButtonEvents();
  setCurrentYear(dom.footerYear, serverDate);

  dom.closeUrlErrorBtn.addEventListener("click", () => {
    dom.urlStatusDialog?.close();
  });
  // Start Time
  startClock(dom.currentHour, dom.currentDate, offsetMs);
}

// Get data from config object and apply it to the FROM/TO/ SELECTED LANGUAGE elements. Set THEME
function applyConfig(config) {
  initNameFromTo(dom.nameFrom, dom.nameTo, config);

  dom.pageLanguage.value = config.lang;
  applyUiLanguage();
  applyTheme(dom.body, THEME_REGISTRY, config.theme);
}

// Fill HTML-SELECT elements with OPTIONS
function fillHTMLSelectsWithOptionElements() {
  // Fill the select (theme) options in HTML
  fillThemeOptions(dom.themeSelect, THEME_REGISTRY);

  // Fill the select (language) options in HTML
  fillLanguageOptions(dom.pageLanguage, SUPPORTED_LANGUAGES);
}

function initCTAButtonEvents() {
  if (!dom?.heroActions) return;

  dom.createBtn?.addEventListener("click", () => {
    switchPage(dom.createBtn.dataset.page);
  });
  dom.openBtn?.addEventListener("click", () => {
    switchPage(dom.openBtn.dataset.page);
  });
  dom.viewBtn?.addEventListener("click", () => {
    switchPage(dom.viewBtn.dataset.page);
  });
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

  dom.homeBtn?.addEventListener("click", () => {
    switchPage("home");
  });
}

//================   PAGE SWITCH   ================
function switchPage(pageName) {
  // Open link dialog check
  if (pageName === "openlink") {
    openLinkDialog();
    return;
  }
  // Active/inactive bg image for Body (Calendar image for the whole website)
  dom.body?.classList.toggle("calendar-scope", pageName === "calendar");

  setActivePage(dom.pages, pageName);

  // At every create custom menu option, reset the slider.
  if (pageName === "create") {
    resetGenerator();
  }

  // Check for messages before load data.
  if (pageName === "calendar") {
    // if demo, load default messages for current lang + def theme
    ensureDemoCalendarMessages();

    // give calendar controller the new messages
    setCalendarMessages(appState.calendar.messages);

    // refresh locked/today classes + midnight schedule
    refreshCalendar();
  }

  if (pageName === "create") {
    activateWizardResize();
  } else {
    deactivateWizardResize();
  }
}

// Only at demo -> from/ to should change with language select
export function setProperFromTo() {
  const fromText = getFrom();
  const toText = getTo();

  setFromAndToDefaultMultiLang(dom, dom.nameFrom, dom.nameTo, fromText, toText);
}
// ================   OPEN POPUP, CALENDAR DAY   ================
export function openCalendarDayAndSetContent(day, message) {
  const dialogTitle = getCalendarDialogTitle();
  const datum = getPreviewItemPrefix(day);

  // SET title, message for popup
  displayCalendarMessage(
    dom.popup,
    dom.popupTitle,
    dom.popupDate,
    dom.popupText,

    dialogTitle,
    datum,
    message,
  );
}

// ================   CLOSE POPUP, CALENDAR DAY   ================
// Close for all dialogs, if click outside of window
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

  // only for popup close btn
  dom.popupCloseBtn?.addEventListener("click", () => dom.popup?.close());
}

// OPEN EXISTING LINK given by USER
function initOpenLinkEvents() {
  dom.btnOpenLinkCancel?.addEventListener("click", () => {
    dom.openLinkDialog?.close();
  });

  dom.btnOpenLinkGo?.addEventListener("click", () => {
    const url = normalizeCalendarUrl(dom.openLinkInput?.value);

    if (!url) {
      const errorMsg = getUrlErrorMessage();

      showOpenLinkError(errorMsg);

      dom.openLinkInput?.focus();
      return;
    }

    // TODO OPEN LINK IN NEW WINDOW
    // Reload app with new url
    window.open(url, "_blank");
  });

  dom.openLinkInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      dom.btnOpenLinkGo?.click();
    }
  });
}
// ================   READ FROM-TO Name or set Default   ================
// NO NEED HERE TO SET DEFAULT VALUE... Read config URL in main already does
function initNameFromTo(fromNameEl, toNameEl, config) {
  fromNameEl.textContent = config.from ?? DEFAULTS.calendarConfig.from;
  toNameEl.textContent = config.to ?? DEFAULTS.calendarConfig.to;
}

// SET CURRENT YEAR IN FOOTER
function setCurrentYear(yearEl, currentYear) {
  if (!yearEl) return;

  const cleanYear = currentYear.getFullYear();
  yearEl.textContent = cleanYear || 2025;
}
// ================   READ THEME or set Default   ================

//================   LANGUAGE SWITCH   ================
function initLanguageEvents() {
  dom.pageLanguage?.addEventListener("change", () => {
    const newLang = dom.pageLanguage.value;

    appState.calendarConfig.lang = SUPPORTED_LANGUAGES.includes(newLang)
      ? newLang
      : DEFAULTS.calendarConfig.lang;
    // Update all data-i18n Value
    applyUiLanguage();
    // Change lang -> immediately update date-time
    refreshClock();

    // (default) messages if language changes, ONLY BY DEMO
    if (appState.calendar.source === "demo") {
      ensureDemoCalendarMessages();
      setCalendarMessages(appState.calendar.messages);
      refreshCalendar();
    }
  });
}

// TODO: CHECK THESE FUNCTION
function openLinkDialog() {
  if (!dom?.openLinkDialog || !dom?.openLinkInput) return;

  // reset UI
  dom.openLinkInput.value = "";
  if (dom.openLinkError) {
    dom.openLinkError.hidden = true;
    dom.openLinkError.textContent = "";
  }

  if (!dom.openLinkDialog.open) dom.openLinkDialog.showModal();
  dom.openLinkInput.focus();
}

function normalizeCalendarUrl(input) {
  const raw = (input ?? "").trim();

  if (!raw) return "";

  if (/^https?:\/\//i.test(raw)) return raw;

  const cleaned = raw.startsWith("?") ? raw.slice(1) : raw;
  const hasData = cleaned.startsWith("data=") || cleaned.includes("&data=");

  if (!hasData) {
    return "";
  }

  const base = `${window.location.origin}${window.location.pathname}`;

  return `${base}?${cleaned}`;
}

function showOpenLinkError(msg) {
  if (!dom?.openLinkError) return;

  dom.openLinkError.textContent = msg;
  dom.openLinkError.hidden = false;
}

// TODO: CHECK THESE FUNCTION
export function showUrlStatusDialog(status, issues = []) {
  if (!dom?.urlStatusDialog) return;
  // Optional: status === "repaired" | "invalid"
  // Use i18n keys if you add them, otherwise fallback text:
  const title =
    getLangAndDictThanResolveKey("titles.errorTitle") || "Link problem";

  dom.statusTitle.textContent = title;

  const body =
    status === "invalid"
      ? getLangAndDictThanResolveKey("labels.invalidErrorDemo") ||
        "This link is invalid or damaged. Showing demo content."
      : getLangAndDictThanResolveKey("labels.invalidErrorRepaired") ||
        "This link was incomplete. Missing values were replaced with defaults.";

  dom.statusText.textContent = body;

  // If you want show issues (dev only):
  const details = issues.length ? `\n(${issues.join(", ")})` : "";

  // Debug help
  if (details) {
    console.log("Error at url data read:" + details);
  }

  dom.urlStatusDialog.showModal();

  // showModal set die 1. element selected (Btn).
  // We set manual focus to the whole dialog.
  setTimeout(() => {
    dom.urlStatusDialog?.focus();
  }, 0);
}
