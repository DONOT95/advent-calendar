import { defaultMessages } from "./messages.js";
// ===============   FILE TO READ, WRITE URL DATA   ===============
// --- Default DATA Values ---
const DEFAULT_LANG = "en";
const DEFAULT_THEME = "classic";
const DEFAULT_FROM = "Me";
const DEFAULT_TO = "You";

// Function to get messages from a specific language + theme combination or
// default (English + classic)
function getDefaultMessages(lang = DEFAULT_LANG, theme = DEFAULT_THEME) {
  const langSet = defaultMessages[lang] || defaultMessages[DEFAULT_LANG];
  return langSet[theme] || langSet[DEFAULT_THEME];
}

// =============   read DATA from the URL   =============
export function readConfigFromUrl() {
  // Read the URL string
  const params = new URLSearchParams(window.location.search);

  // Take only the DATA part from the URL string
  const rawParam = params.get("data");

  // NO DATA -> return DEFAULT DATA
  if (!rawParam) {
    return {
      lang: DEFAULT_LANG,
      theme: DEFAULT_THEME,
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
      messages: getDefaultMessages(),
    };
  }

  const raw = rawParam.replace(/ /g, "+");

  // --- Try to read DATA from URL data (raw) ---
  try {
    const json = decodeURIComponent(escape(atob(raw)));
    const data = JSON.parse(json);

    const lang = data.lang || DEFAULT_LANG;
    const theme = data.theme || DEFAULT_THEME;

    const defaults = getDefaultMessages(lang, theme);

    // pick fully valid (len check) message-array or fallback
    const messages =
      Array.isArray(data.messages) && data.messages.length === defaults.length
        ? data.messages
        : defaults;

    // If data contains truthy values take them,
    //  otherwise take DEFAULT values
    return {
      lang,
      theme,
      from: data.from || DEFAULT_FROM,
      to: data.to || DEFAULT_TO,
      messages,
    };

    // Error Handling
  } catch (e) {
    console.warn("Invalid data in URL:", e);

    return {
      lang: DEFAULT_LANG,
      theme: DEFAULT_THEME,
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
      messages: getDefaultMessages(),
    };
  }
}

// =============   create URL with DATA   =============
export function buildCalendarUrl(config) {
  const json = JSON.stringify(config);
  // encode text, UTF-8 safe
  const encoded = btoa(unescape(encodeURIComponent(json)));
  const safe = encodeURIComponent(encoded);
  const base = `${window.location.origin}${window.location.pathname}`;

  return `${base}?data=${safe}`;
}
