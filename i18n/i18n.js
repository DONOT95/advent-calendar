// LANGUAGE: ELEMENTS
import { DEFAULTS, appState } from "../state/appState.js";
import { setProperFromTo } from "../controllers/uiController.js";
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
      generatedefault: "Create default",
      generateurl: "Generate URL",
      addmessages: "Custom messages",

      // Generate Calendar: Step 2
      nextmessage: "Next",
      prevmessage: "Previous",

      // Generate Calendar: Step 3
      showurl: "Show URL",
      backtoedit: "Back",

      // Calendar dialog:
      close: "Close",

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

      fromPerson: "Me",
      toPerson: "You",

      // Calendar popup:
      popupdaytitle: "Day {day}",

      popupTitle: "Today's message",
      dayPrefix: "{day}. December:",

      // Wizard generated dialog:
      sharecalendartitle: "Share your calendar",
      copyinstruction: "Copy and share this link:",

      // Preview messages list:
      previewMessageLabel: "Daily messages:",

      openlinktitle: "Open a calendar",
      openlinkhint: "Paste a calendar link to open it.",

      // Sender, reciever at Calendar view
      fromTxt: "From:",
      toTxt: "To:",

      // 2 different warning message for URL error dialog
      invalidErrorDemo:
        "This link is invalid or damaged. Showing demo content.",
      invalidErrorRepaired:
        "This link was incomplete. Missing values were replaced with defaults.",
    },
    // Set Attribute ( Event listener on placeholder)
    placeholders: {
      from: "From name",
      to: "To name",
    },

    // Themes
    selects: {
      classic: "Classic",
      family: "Family",
      neon: "Neon",
      horror: "Horror",
    },
    titles: {
      howto: "How to use",
      create: "Create your own calendar",
      createstep1: "Step 1",
      createstep1Text: "Names & Theme",
      createstep2: "Step 2",
      createstep2Text: "Edit Daily Messages",
      createstep3: "Step 3",
      createstep3Text: "Check Preview",

      // Url Error dialog title
      errorTitle: "Link problem",
    },

    // Formatted
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

    cards: {
      label: "Why you'll love it",
      subtitle:
        "Everything you need for a meaningful Advent Calendar — nothing more, nothing less.",
    },

    cardnegative: {
      title: "No disadvantages.",
      li1: "No cookies or tracking",
      li2: "No ads or distractions",
      li3: "No hidden costs",
      li4: "No account required",
      li5: "No upload / download",
    },

    cardpositive: {
      title: "Only what you need.",
      li1: "Easy to use",
      li2: "Takes only minutes to create",
      li3: "Unlimited calendars",
      li4: "Share instantly with a single link",
      li5: "Your data stays inside your URL (copy & send)",
    },

    how: {
      label: "How it works",
      subtitle:
        "Set it up in minutes — enjoy the magic every day until Christmas.",

      step1: {
        instruction: "Address and style",
        hint: "Choose who it’s from and who it’s for, pick a language, and select a theme that matches your mood — cozy, playful, or a little bit magical.",
      },

      step2: {
        instruction: "Write your daily surprises",
        hint: "Fill each day with something special: a kind message, a shared memory, a small joke, or a tiny challenge. Every door can be a new smile.",
      },

      step3: {
        instruction: "Generate your share link",
        hint: "We turn everything into a single, private link. Just copy it and share it — no accounts, no downloads, no extra steps.",
      },

      step4: {
        instruction: "Open doors day by day",
        hint: "From December 1st on, one door opens each day. Take your time, enjoy the moment, and let the anticipation grow until Christmas.",
      },
    },

    create: {
      labels: {
        go: "Let's go!",
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
      generatedefault: "Default erstellen",
      generateurl: "URL erstellen",

      addmessages: "Benutzerdefiniert erstellen",

      // Generate Calendar: Step 2
      nextmessage: "Nächste",
      prevmessage: "Vorherige",

      // Generate Calendar: Step 3
      showurl: "URL anzeigen",
      backtoedit: "Zurück",

      // Calendar:
      close: "Schließen",

      // dialog URL
      copy: "Kopie",
      copied: "Kopiert!",
      open: "Öffnen",

      cancel: "Abbrechen",
    },
    labels: {
      from: "Von:",
      to: "An:",
      theme: "Thema:",
      day: "Tag",

      fromPerson: "Mir",
      toPerson: "Dich",

      // Calendar popup:
      popupdaytitle: "Tag {day}",

      popupTitle: "Heutige Nachricht",
      dayPrefix: "{day}. Dezember:",

      // Wizard generated dialog:
      sharecalendartitle: "Teile deinen Kalender",
      copyinstruction: "Kopiere diesen Link und teile ihn:",

      previewMessageLabel: "Tägliche Nachrichten:",

      openlinktitle: "Kalender öffnen",
      openlinkhint: "Füge einen Kalender-Link ein.",

      fromTxt: "Von:",
      toTxt: "An:",

      // 2 different warning message for URL error dialog
      invalidErrorDemo:
        "Dieser Link ist ungültig oder beschädigt. Demo-Kalender Inhalt wird angezeigt.",
      invalidErrorRepaired:
        "Dieser Link war unvollständig. Fehlende Werte wurden durch Standardwerte ersetzt.",
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
      createstep1: "Schritt 1",
      createstep2: "Schritt 2",
      createstep3: "Schritt 3",
      createstep1Text: "Namen & Thema",
      createstep2Text: "Nachrichten Bearbeiten",
      createstep3Text: "Vorschau Überprüfen",

      // Url error dialog title
      errorTitle: "Link-Problem",
    },

    // Format
    currentHour: "{h}:{min}:{sec}",
    currentDate: "Heute: {d}.{m}.{y}",
    previewitemPrefix: "{day}. Dezember:",

    hero: {
      kicker: "40 % KREATIVITÄT · 40 % FÜRSORGE · 100 % LIEBE",
      title: "Mach das Warten auf Weihnachten magisch",
      subtitle:
        "Erstelle in wenigen Minuten einen persönlichen Adventskalender - kostenlos, einfach und mit viel Liebe gemacht. Überrasche Freunde, Familie oder Kolleg:innen mit täglichen Nachrichten, die wirklich in Erinnerung bleiben.",

      createbtn: "Kalender erstellen",
      viewbtn: "Kalender ansehen",
      openlink: "Link öffnen",

      trust: "Keine Cookies · Keine Werbung · Kein Konto · Keine Kosten",
    },

    cards: {
      label: "Warum du es lieben wirst",
      subtitle:
        "Alles, was du für einen bedeutungsvollen Adventskalender brauchst - nicht mehr und nicht weniger.",
    },

    cardnegative: {
      title: "Keine Nachteile.",
      li1: "Keine Cookies oder Tracking",
      li2: "Keine Werbung oder Ablenkungen",
      li3: "Keine versteckten Kosten",
      li4: "Kein Benutzerkonto erforderlich",
      li5: "Kein Upload / Download",
    },

    cardpositive: {
      title: "Alles, was du brauchst.",
      li1: "Einfach und intuitiv zu bedienen",
      li2: "In wenigen Minuten erstellt",
      li3: "Unbegrenzt viele Kalender",
      li4: "Sofort teilen mit einem einzigen Link",
      li5: "Deine Daten bleiben in deiner URL (kopieren & senden)",
    },

    how: {
      label: "So funktioniert’s",
      subtitle: "Ein paar Minuten jetzt - tägliche Freude den ganzen Dezember.",

      step1: {
        instruction: "Absender & Stil wählen",
        hint: "Lege fest, von wem der Kalender ist, für wen er gedacht ist, wähle Sprache und Design - gemütlich, verspielt oder ganz festlich.",
      },

      step2: {
        instruction: "Tägliche Überraschungen schreiben",
        hint: "Fülle jeden Tag mit etwas Besonderem: einer lieben Nachricht, einer gemeinsamen Erinnerung, einem kleinen Scherz oder einer Mini-Aufgabe. Jede Tür kann ein Lächeln sein.",
      },

      step3: {
        instruction: "Deinen Link erstellen",
        hint: "Wir verwandeln alles in einen einzigen, privaten Link. Einfach kopieren und teilen - kein Konto, keine Downloads, keine Umwege.",
      },

      step4: {
        instruction: "Tag für Tag Türen öffnen",
        hint: "Ab dem 1. Dezember öffnet sich jeden Tag eine neue Tür. Lass dir Zeit und genieße dieses besondere Gefühl des Wartens bis Weihnachten.",
      },
    },
    create: {
      labels: {
        go: "Los geht's!",
      },
    },
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

      generatedefault: "Alapértelmezett üzenetek",
      generateurl: "URL létrehozása",
      addmessages: "Egyéni üzenetek",

      // Generate Calendar: Step 2
      nextmessage: "Következő",
      prevmessage: "Előző",

      // Generate Calendar: Step 3
      showurl: "URL megjelenítése",
      backtoedit: "Vissza",

      // Calendar:
      close: "Bezárás",

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

      fromPerson: "Én",
      toPerson: "Te",

      // Calendar popup:
      popupdaytitle: "{day}. nap",

      popupTitle: "Mai üzenet",
      dayPrefix: "{day}. december:",

      // Wizard generated dialog:
      sharecalendartitle: "Oszd meg a naptárad",
      copyinstruction: "Másold ki és oszd meg a linket:",

      previewMessageLabel: "Napi üzenetek:",

      openlinktitle: "Naptár megnyitása",
      openlinkhint: "Illeszd be a naptár linkjét.",

      fromTxt: "Feladó:",
      toTxt: "Címzett:",

      invalidErrorDemo:
        "Ez a link érvénytelen vagy sérült. Demo Kalendár nézet aktiválva.",
      invalidErrorRepaired:
        "Ez a link hiányos volt. A hiányzó értékeket alapértelmezett értékekkel helyettesítettük.",
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
      createstep1: "1. Lépés",
      createstep2: "2. Lépés",
      createstep3: "3. Lépés",
      createstep1Text: "Nevek és Téma",
      createstep2Text: "Üzenetek Szerkesztése",
      createstep3Text: "Előnézet Ellenőrzése",

      // Url Error dialog title
      errorTitle: "Link probléma",
    },

    // Formatted
    currentHour: "{h}:{min}:{sec}",
    currentDate: "Ma: {y}.{m}.{d}.",
    previewitemPrefix: "{day}. December:",

    hero: {
      kicker: "40% KREATIVITÁS · 40% TÖRŐDÉS · 100% SZERETET",
      title: "Tedd varázslatossá a karácsonyi várakozást",
      subtitle:
        "Készíts személyes adventi naptárat néhány perc alatt - ingyenesen, egyszerűen és szeretettel. Lepd meg barátaidat, családodat vagy kollégáidat olyan napi üzenetekkel, amelyek igazán emlékezetesek maradnak.",

      createbtn: "Naptár létrehozása",
      viewbtn: "Naptár megtekintése",
      openlink: "Link megnyitása",

      trust: "Nincs cookie · Nincs reklám · Nincs fiók · Nincs költség",
    },

    cards: {
      label: "Miért fogod szeretni",
      subtitle:
        "Minden, amire egy igazán jó adventi naptárhoz szükséged van - se több, se kevesebb.",
    },

    cardnegative: {
      title: "Semmi hátrány!",
      li1: "Nincsenek sütik vagy követés",
      li2: "Nincsenek hirdetések vagy zavaró elemek",
      li3: "Nincsenek rejtett költségek",
      li4: "Nincs szükség felhasználói fiókra",
      li5: "Nincs feltöltés / letöltés",
    },

    cardpositive: {
      title: "Csak ami szükséges!",
      li1: "Egyszerű és könnyen használható",
      li2: "Pár perc alatt elkészíthető",
      li3: "Korlátlan számú naptár",
      li4: "Azonnali megosztás egyetlen linkkel",
      li5: "Az adataid a linkben maradnak (másolás & küldés)",
    },

    how: {
      label: "Hogyan működik",
      subtitle:
        "Pár perc alatt elkészül - élvezze a varázslatot minden nap karácsonyig.",

      step1: {
        instruction: "Feladó és stílus",
        hint: "Válaszd ki, kitől szól és kinek készül a naptár, állítsd be a nyelvet és a hangulatot - meghitt, játékos vagy ünnepi.",
      },

      step2: {
        instruction: "Napi meglepetések megírása",
        hint: "Tölts meg minden napot valami különlegessel: kedves üzenettel, közös emlékkel, egy kis poénnal vagy apró kihívással. Minden ajtó egy új mosoly lehet.",
      },

      step3: {
        instruction: "Megosztható link létrehozása",
        hint: "Mindent egyetlen, privát linkké alakítunk. Csak másold ki és oszd meg - nincs fiók, nincs letöltés, nincs bonyodalom.",
      },

      step4: {
        instruction: "Ajtók megnyitása nap mint nap",
        hint: "December 1-től minden nap egy új ajtó nyílik meg. Szánj rá időt, és élvezd a karácsonyig tartó várakozás különleges érzését.",
      },
    },

    create: {
      labels: {
        go: "Hajrá!",
      },
    },
  },
};

export const SUPPORTED_LANGUAGES = Object.freeze(Object.keys(uiTexts));

//================   DEFAULT LANG   ================

// INTERNAL: safely resolve
// eg: root -> uiTexts[lang] , path -> "nav.calendar"
function resolveKey(root, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], root);
}

// APPLY on DOM -> DYNAMCALLY REPLACE STATIC TEXTS
export function applyUiLanguage() {
  const lang = getUiLanguage();
  const dict =
    uiTexts[lang] || uiTexts[DEFAULTS.calendarConfig.lang] || uiTexts.en;

  // Set <html lang="xx">
  document.documentElement.lang = lang;

  // FOR TEXT
  // Replace every element value with: data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    // Element property (dataset name -> data-i18n)
    const key = el.dataset.i18n;
    // Text search for a key and give back the value
    // e.g. "nav.calendar"
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

  // If demo -> from and to (Me, you) should be change with language change
  if (appState.calendar.source === "demo") {
    setProperFromTo();
  }
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

// Get a text or fallback
export function formatText(key, fallback = "") {
  return getLangAndDictThanResolveKey(key) || fallback;
}

// Get a text formatted or fallback
export function formatPlaceholder(key, params = {}, fallback = "") {
  const base = getLangAndDictThanResolveKey(key) || fallback;

  let text = base;

  for (const [k, v] of Object.entries(params)) {
    text = text.replaceAll(`{${k}}`, String(v));
  }

  return text;
}
