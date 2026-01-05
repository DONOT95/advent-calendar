// LANGUAGE: ELEMENTS
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

      // Calendar popup:
      closecalendar: "Close",
    },
    labels: {
      // Create Custom step 1:
      from: "From:",
      to: "To:",
      theme: "Theme:",
      day: "Day",

      // Calendar popup:
      popupdaytitle: "Day {day}",
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
    },
    labels: {
      from: "Von:",
      to: "An:",
      theme: "Thema:",
      day: "Tag",

      // Calendar popup:
      popupdaytitle: "Tag {day}",
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
    },
    labels: {
      from: "Feladó:",
      to: "Címzett:",
      theme: "Téma:",
      day: "Nap",

      // Calendar popup:
      popupdaytitle: "{day}. nap",
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

//================   DEFAULT LANG   ================
let uiLang = "en";

// INTERNAL: safely resolve "nav.calendar"
function resolveKey(root, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], root);
}

// APPLY TEXT TO PAGE
function applyUiLanguage(lang) {
  const dict = uiTexts[lang] || uiTexts.en;

  // Set <html lang="xx">
  document.documentElement.lang = lang;

  // FOR TEXT
  // Replace every element value with: data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n; // e.g. "nav.calendar"
    const text = resolveKey(dict, key);

    if (text) el.textContent = text;
  });

  // FOR ATTRIBUTES
  // Replace every element value with: data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const text = resolveKey(dict, key);

    if (text) el.setAttribute("placeholder", text);
  });
}

// Manually change website language in UI select
export function setUiLanguage(lang) {
  uiLang = uiTexts[lang] ? lang : "en";
  applyUiLanguage(uiLang);
}

export function getUiLanguage() {
  return uiLang;
}
