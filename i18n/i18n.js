// LANGUAGE: ELEMENTS
import { DEFAULTS, appState } from "../state/appState.js";
export const uiTexts = {
  en: {
    nav: {
      calendar: "Calendar",
      howto: "How-To",
      create: "Create custom",
    },
    buttons: {
      // Generate Calendar: Step 1
      generatedefaulturl: "Create URL(default messages)",
      generatecustomurl: "Generate URL",
      addmessages: "Add custom messages",

      // Generate Calendar: Step 2
      nextmessage: "Next",
      prevmessage: "Previous",

      // Generate Calendar: Step 3
      showurl: "Show URL",
      backtoedit: "Back",

      // Calendar dialog:
      closecalendar: "Close",

      // dialog URL
      copy: "Copy",
      copied: "Copied!",
      open: "Open",
    },
    labels: {
      // Create Custom step 1:
      from: "From:",
      to: "To:",
      theme: "Theme:",
      day: "Day",

      // Calendar popup:
      popupdaytitle: "Day {day}",

      // Wizard generated dialog:
      sharecalendartitle: "Share your calendar",
      copyinstruction: "Copy and share this link:",

      // Preview messages list:
      previewmessageslist: "Messages",
    },
    // Set Attribute ( Event listener on placeholder)
    placeholders: {
      from: "From name",
      to: "To name",
    },
    selects: {
      classic: "Classic",
      family: "Family",
      neon: "Neon",
      horror: "Horror",
    },
    titles: {
      howto: "How to use",
      create: "Create your own calendar",
      createstep1: "Step 1 - Names & Theme",
      createstep2: "Step 2 - Edit Daily Messages",
      createstep3: "Step 3 - Check Preview",
    },
    currentHour: "{h}:{min}:{sec}",
    currentDate: "Today: {d}.{m}.{y}",
  },

  de: {
    nav: {
      calendar: "Kalender",
      howto: "Anleitung",
      create: "Eigenen Kalender",
    },
    buttons: {
      // Generate Calendar: Step 1
      generatedefaulturl: "URL erstellen (Standardnachrichten)",
      generatecustomurl: "URL erstellen",
      addmessages: "Benutzerdefinierte Nachrichten hinzufügen",

      // Generate Calendar: Step 2
      nextmessage: "Weiter",
      prevmessage: "Vorherige",

      // Generate Calendar: Step 3
      showurl: "URL anzeigen",
      backtoedit: "Zurück",

      // Calendar:
      closecalendar: "Schließen",

      // dialog URL
      copy: "Kopie",
      copied: "Kopiert!",
      open: "Offen",
    },
    labels: {
      from: "Von:",
      to: "An:",
      theme: "Thema:",
      day: "Tag",

      // Calendar popup:
      popupdaytitle: "Tag {day}",

      // Wizard generated dialog:
      sharecalendartitle: "Teile deinen Kalender",
      copyinstruction: "Kopiere diesen Link und teile ihn:",

      previewmessageslist: "Nachrichten",
    },
    // Set Attribute ( Event listener on placeholder)
    placeholders: {
      from: "Absender",
      to: "Empfänger",
    },
    selects: {
      classic: "Klassiker",
      family: "Familie",
      neon: "Neon",
      horror: "Horror",
    },
    titles: {
      howto: "So funktioniert's",
      create: "Eigenen Kalender Erstellen",
      createstep1: "Schritt 1 - Namen & Thema",
      createstep2: "Schritt 2 - Tägliche Nachrichten Bearbeiten",
      createstep3: "Schritt 3 - Vorschau Überprüfen",
    },
    currentHour: "{h}:{min}:{sec}",
    currentDate: "Heute: {d}.{m}.{y}",
  },

  hu: {
    nav: {
      calendar: "Naptár",
      howto: "Útmutató",
      create: "Saját naptár",
    },
    buttons: {
      // Generate Calendar: Step 1
      generatedefaulturl: "URL létrehozása (alapértelmezett üzenetek)",
      generatecustomurl: "URL létrehozása",
      addmessages: "Egyéni üzenetek hozzáadása",

      // Generate Calendar: Step 2
      nextmessage: "Következő",
      prevmessage: "Előző",

      // Generate Calendar: Step 3
      showurl: "URL megjelenítése",
      backtoedit: "Vissza",

      // Calendar:
      closecalendar: "Bezárás",

      // dialog URL
      copy: "Másol",
      copied: "Másolva!",
      open: "Megnyit",
    },
    labels: {
      from: "Feladó:",
      to: "Címzett:",
      theme: "Téma:",
      day: "Nap",

      // Calendar popup:
      popupdaytitle: "{day}. nap",

      // Wizard generated dialog:
      sharecalendartitle: "Oszd meg a naptárad",
      copyinstruction: "Másold ki és oszd meg a linket:",

      previewmessageslist: "Üzenetek",
    },
    // Set Attribute
    placeholders: {
      from: "Feladó neve",
      to: "Címzett neve",
    },
    selects: {
      classic: "Klasszikus",
      family: "Családi",
      neon: "Neon",
      horror: "Horror",
    },
    titles: {
      howto: "Hogyan működik",
      create: "Készíts saját naptárat",
      createstep1: "1. Lépés - Nevek és Téma",
      createstep2: "2. Lépés - Napi Üzenetek Szerkesztése",
      createstep3: "3. Lépés - Előnézet Ellenőrzése",
    },
    currentHour: "{h}:{min}:{sec}",
    currentDate: "Ma: {y}.{m}.{d}.",
  },
};

export const SUPPORTED_LANGUAGES = Object.freeze(Object.keys(uiTexts));

//================   DEFAULT LANG   ================

// INTERNAL: safely resolve "nav.calendar"
function resolveKey(root, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], root);
}

// APPLY TEXT TO PAGE
export function applyUiLanguage() {
  const lang = getUiLanguage();
  const dict =
    uiTexts[lang] || uiTexts[DEFAULTS.calendarConfig.lang] || uiTexts.en;

  // Set <html lang="xx">
  document.documentElement.lang = lang;

  // FOR TEXT
  // Replace every element value with: data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n; // e.g. "nav.calendar"
    const text = resolveKey(dict, key);

    if (text != null) el.textContent = text;
  });

  // FOR ATTRIBUTES
  // Replace every element value with: data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const text = resolveKey(dict, key);

    if (text != null) el.setAttribute("placeholder", text);
  });
}

export function getUiLanguage() {
  return appState.calendarConfig.lang ?? DEFAULTS.calendarConfig.lang;
}

export function getLangAndDictThanResolveKey(key) {
  // Get language
  const lang = getUiLanguage();

  // Get selected language or Default dictionary
  const dict = uiTexts[lang] || uiTexts[DEFAULTS.calendarConfig.lang];

  const fallback = uiTexts[DEFAULTS.calendarConfig.lang];

  const value = resolveKey(dict, key) ?? resolveKey(fallback, key) ?? "";

  // Notice if no matching element in dictionary
  if (value === "") {
    console.warn("[i18n missing]", key);
  }
  return value;
}

export function formatPlaceholder(key, params = {}) {
  let text = getLangAndDictThanResolveKey(key);
  for (const [k, v] of Object.entries(params)) {
    text = text.replaceAll(`{${k}}`, String(v));
  }

  return text;
}
