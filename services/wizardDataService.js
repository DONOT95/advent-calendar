import { DEFAULTS, appState } from "../state/appState.js";
import { LIMITS } from "../config/constants.js";
import { getDefaultMessages } from "./defaultMessagesService.js";
import {
  sanitizeString,
  sanitizeMessagesArray,
} from "../validation/sanitizer.js";

// Read out the daily default messages -> return a list
// Is messages leng valid? - Sanitize messages
// else default messages for current lang/theme - Sanitize them
export function getMessagesForWizard(messages) {
  // Selected lang+theme OR default lang+theme
  const lang = appState.config.lang || DEFAULTS.config.lang;
  const theme = appState.config.theme || DEFAULTS.config.theme;

  // Get the default messages from Data/defaultMessages.js file
  const defaults = getDefaultMessages(lang, theme);

  // Is messages length valid?
  const base =
    Array.isArray(messages) && messages.length === LIMITS.messagesCount
      ? messages
      : defaults;

  // Clean base no matter where the data comes (User, Data)
  return sanitizeMessagesArray(base, {
    maxLenEach: LIMITS.message,
    emptyFallback: DEFAULTS.calendar.emptyMessage,
  });
}

// Check messages are valid: length, sanitize
export function getMessagesForUrl(messages) {
  // Get messages or defaults, sanitize
  let list = getMessagesForWizard(messages);

  // Check if there are all the custom messages left 'empty'
  const allEmpty = list.every((m) => m === DEFAULTS.calendar.emptyMessage);

  // If all empty: return default messages
  if (allEmpty) list = getMessagesForWizard(null);

  return list;
}

// Save values from User OR Defaults: lang, theme, from, to
export function applyWizardConfig({ lang, theme, from, to }) {
  appState.config.lang =
    (lang || DEFAULTS.config.lang).trim() || DEFAULTS.config.lang;

  appState.config.theme = theme || DEFAULTS.config.theme;

  appState.config.from = sanitizeString(
    from,
    DEFAULTS.config.from,
    LIMITS.from,
  );
  appState.config.to = sanitizeString(to, DEFAULTS.config.to, LIMITS.to);
}
