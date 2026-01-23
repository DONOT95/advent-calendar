import { defaultMessages } from "./Data/defaultMessages.js";
import { LIMITS } from "./config/constants.js";
import { DEFAULTS } from "./state/appState.js";

// ===============   FILE TO READ, WRITE URL DATA   ===============

// Function to get messages from a specific language + theme combination or
// default (English + classic)
export function getDefaultMessages(
  lang = DEFAULTS.config.lang,
  theme = DEFAULTS.config.theme,
) {
  const langSet =
    defaultMessages[lang] || defaultMessages[DEFAULTS.config.lang];
  return langSet[theme] || langSet[DEFAULTS.config.theme];
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
      ...DEFAULTS.config,
      messages: getDefaultMessages(),
    };
  }

  const raw = rawParam.replace(/ /g, "+");

  // --- Try to read DATA from URL data (raw) ---
  try {
    const json = decodeURIComponent(escape(atob(raw)));
    const data = JSON.parse(json);

    const lang = data.lang || DEFAULTS.config.lang;
    const theme = data.theme || DEFAULTS.config.theme;

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
      from: data.from || DEFAULTS.config.from,
      to: data.to || DEFAULTS.config.to,
      messages,
    };

    // Error Handling
  } catch (e) {
    console.warn("Invalid data in URL:", e);

    return {
      ...DEFAULTS.config,
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
