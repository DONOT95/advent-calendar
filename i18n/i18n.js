// LANGUAGE: ELEMENTS
import { DEFAULTS, appState } from "../state/appState.js";
export const uiTexts = {
  en: {
    nav: {
      calendar: "Calendar",
      openlink: "Open link",
      create: "Create custom",
      menu: "Menu",
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

      cancel: "Cancel",
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

      openlinktitle: "Open a calendar",
      openlinkhint: "Paste a calendar link to open it.",
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

    hero: {
      kicker: "40% CREATIVITY · 40% CARE · 100% LOVE",
      title: "Make The Christmas Waiting Magical",
      subtitle:
        "Create a personal Advent Calendar in minutes - free, simple, and made with love. Surprise friends, family, or colleagues with daily messages they'll actually remember.",

      createbtn: "Create calendar",
      viewbtn: "View calendar",
      openlink: "Open link",

      trust: "No cookies · No ads · No account · No fees",
    },

    cardnegative: {
      title: "No disadvantages. Just joy.",
      li1: "❌ No cookies",
      li2: "❌ No ads",
      li3: "❌ No costs",
      li4: "❌ No account",
      li5: "❌ No costs",
      li6: "❌ No upload / download",
    },

    cardpositive: {
      title: "Everything you need. Nothing you don't.",
      li1: "✅ Easy to use",
      li2: "✅ Takes only minutes to create",
      li3: "✅ Create unlimited calendars",
      li4: "✅ Create unlimited calendars",
      li5: "✅ Share instantly via a single link",
      li6: "✅ Your data stays inside your URL (copy & send)",
    },

    how: {
      title: "How it works",
      subtitle: "Three minutes now — daily smiles all December.",

      step1: {
        instruction: "Choose names & a theme",
        hint: "Pick “From”, “To”, language, and a look that fits your vibe.",
      },

      step2: {
        instruction: "Write your daily surprises",
        hint: "Add personal messages, memories, jokes, or tiny tasks — one per day.",
      },

      step3: {
        instruction: "Generate your share link",
        hint: "One link contains everything. Copy it and send it anywhere.",
      },

      step4: {
        instruction: "Open doors day by day",
        hint: "The receiver opens a new door each day — simple and magical.",
      },
    },
  },

  de: {
    nav: {
      calendar: "Kalender",
      howto: "Anleitung",
      openlink: "Link öffnen",
      create: "Eigenen Kalender",
      menu: "Menü",
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

      cancel: "Abbrechen",
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

      openlinktitle: "Kalender öffnen",
      openlinkhint: "Füge einen Kalender-Link ein.",
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
      openlink: "Link megnyitása",
      create: "Saját naptár",
      menu: "Menü",
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

      cancel: "Mégse",
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

      openlinktitle: "Naptár megnyitása",
      openlinkhint: "Illeszd be a naptár linkjét.",
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
