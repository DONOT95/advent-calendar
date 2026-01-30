import { DEFAULTS } from "../state/appState.js";
import { LIMITS } from "../config/constants.js";
import { getDefaultMessages } from "./defaultMessagesService.js";
import {
  sanitizeString,
  sanitizeMessagesArray,
} from "../validation/sanitizer.js";

// =============   read DATA from the URL   =============
export function readConfigFromUrl() {
  // Read the URL string
  const params = new URLSearchParams(window.location.search);

  // Take only the DATA part from the URL string
  const rawParam = params.get("data");

  // NO DATA -> null
  if (!rawParam) {
    return null;
  }
  // Some environments convert "+" to " " in query strings
  const raw = rawParam.replace(/ /g, "+");

  // --- Try to read DATA from URL data (raw) ---
  try {
    const json = decodeURIComponent(escape(atob(raw)));
    const data = JSON.parse(json);

    const lang = data.lang || DEFAULTS.calendarConfig.lang;
    const theme = data.theme || DEFAULTS.calendarConfig.theme;

    const defaults = getDefaultMessages(lang, theme);

    // pick fully valid (len check) message-array or fallback
    const baseMessages =
      Array.isArray(data.messages) &&
      data.messages.length === LIMITS.messagesCount
        ? data.messages
        : defaults;

    // Sanitize untrusted URL values
    // If data contains truthy values take them,
    //  otherwise take DEFAULT values
    const from = sanitizeString(
      data.from,
      DEFAULTS.calendarConfig.from,
      LIMITS.from,
    );
    const to = sanitizeString(data.to, DEFAULTS.calendarConfig.to, LIMITS.to);
    const messages = sanitizeMessagesArray(baseMessages, {
      maxLenEach: LIMITS.message,
      emptyFallback: DEFAULTS.calendar.emptyMessage,
    });

    return { lang, theme, from, to, messages };

    // Error Handling
  } catch (e) {
    console.warn("Invalid data in URL:", e);

    return null;
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
