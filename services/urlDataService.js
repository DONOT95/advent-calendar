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

  // NO DATA -> normal visit
  if (!rawParam) {
    return { status: "none", config: null, issues: [] };
  }
  // Some environments convert "+" to " " in query strings
  const raw = rawParam.replace(/ /g, "+");

  // --- Try to read DATA from URL data (raw) ---
  try {
    const json = decodeURIComponent(escape(atob(raw)));
    const data = JSON.parse(json);

    const issues = [];

    // language & theme validation, fallback
    const lang = data?.lang || DEFAULTS.calendarConfig.lang;
    const theme = data?.theme || DEFAULTS.calendarConfig.theme;

    if (!data?.lang) issues.push("lang_missing_or_invalid -> replaced");
    if (!data?.theme) issues.push("theme_missing_or_invalid -> replaced");

    const fromRaw = data?.from;
    const toRaw = data?.to;

    // Sanitize untrusted URL values
    // If data contains truthy values take them,
    //  otherwise take DEFAULT values
    const from = sanitizeString(
      data.from,
      DEFAULTS.calendarConfig.from,
      LIMITS.from,
    );
    const to = sanitizeString(data.to, DEFAULTS.calendarConfig.to, LIMITS.to);

    // Check if from / to changed
    // Compare sanitized against raw-normalized (only if raw provided)
    if (fromRaw != null) {
      const rawNorm = String(fromRaw).trim();
      if (from !== rawNorm) issues.push("invalid from -> from_modified");
      if (
        from === DEFAULTS.calendarConfig.from &&
        rawNorm !== DEFAULTS.calendarConfig.from
      ) {
        issues.push("invalid from -> from_replaced");
      }
    }

    if (toRaw != null) {
      const rawNorm = String(toRaw).trim();
      if (to !== rawNorm) issues.push("invalid reciever -> to_modified");
      if (
        to === DEFAULTS.calendarConfig.to &&
        rawNorm !== DEFAULTS.calendarConfig.to
      ) {
        issues.push("invalid reciever -> to_replaced");
      }
    }

    // MESSAGES: VALIDATE, COMPARE, REPLACE
    // Fallback messages
    const defaults = getDefaultMessages(lang, theme);

    // Check existing array and compare that length valid
    const hasValidMessagesArray =
      Array.isArray(data?.messages) &&
      data.messages.length == LIMITS.messagesCount;

    if (!hasValidMessagesArray) {
      // URL is present but unusable (cannot trust message set)
      issues.push("messages_length_invalid -> replaced");
    }

    // array length ok? use url messages or defaults
    const baseMessages = hasValidMessagesArray ? data.messages : defaults;

    // Check every messages length if too long, cut it,
    // if empty replace with "" (empty)
    // (Now it is the same but optional change empty to other character)
    const messages = sanitizeMessagesArray(baseMessages, {
      maxLenEach: LIMITS.message,
      emptyFallback: DEFAULTS.calendar.emptyMessage,
    });

    // If messages came from URL but after sanitize empty -> replace with default
    const allEmpty = messages.every(
      (m) => m === DEFAULTS.calendar.emptyMessage,
    );

    if (hasValidMessagesArray && allEmpty) {
      issues.push("messages_empty_after_sanitize -> replaced");

      const safeDefaults = sanitizeMessagesArray(defaults, {
        maxLenEach: LIMITS.message,
        emptyFallback: DEFAULTS.calendar.emptyMessage,
      });

      return {
        status: "repaired",
        config: { lang, theme, from, to, messages: safeDefaults },
        issues,
      };
    }

    // Set status
    const status = issues.length > 0 ? "repaired" : "ok";

    return {
      status,
      config: { lang, theme, from, to, messages },
      issues,
    };

    // Error Handling
  } catch (e) {
    console.warn("Invalid data in URL:", e);
    return {
      status: "invalid",
      config: null,
      issues: ["decode_or_parse_failed"],
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
