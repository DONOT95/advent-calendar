import { DEFAULTS, appState } from "../state/appState.js";
import { LIMITS } from "../config/constants.js";
import { getDefaultMessages } from "./defaultMessagesService.js";
import {
  sanitizeString,
  sanitizeMessagesArray,
} from "../validation/sanitizer.js";

// Read out the daily messages -> return a list
// Is messages length valid? - Sanitize messages
// else default messages for current lang/theme - Sanitize them
export function getMessagesForWizard(messages) {
  // Selected lang+theme OR default lang+theme
  const lang = appState.calendarConfig.lang || DEFAULTS.calendarConfig.lang;
  const theme = appState.wizardDraft.theme || DEFAULTS.calendarConfig.theme;

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

// Check messages are valid: length, sanitize, array all empty
// if fail -> get default list, otherwise return the messages
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
  appState.calendarConfig.lang = lang || DEFAULTS.calendarConfig.lang;
  appState.wizardDraft.theme = theme || DEFAULTS.calendarConfig.theme;

  appState.wizardDraft.from = sanitizeString(
    from,
    DEFAULTS.calendarConfig.from,
    LIMITS.from,
  );
  appState.wizardDraft.to = sanitizeString(
    to,
    DEFAULTS.calendarConfig.to,
    LIMITS.to,
  );
}

// For other files, to set the wizzard messages it can result an empty list...
export function setWizardMessages(messages) {
  appState.wizardDraft.messages = sanitizeMessagesArray(messages, {
    maxLenEach: LIMITS.message,
    emptyFallback: DEFAULTS.calendar.emptyMessage,
  });
}

export function setMessageWithWizardAt(index, rawValue) {
  const i = Number(index);
  // Guard clause: invalid, out of range index
  if (!Number.isInteger(i) || i < 0 || i >= LIMITS.messagesCount) return;

  // Clean input text
  const cleaned = sanitizeString(
    rawValue,
    DEFAULTS.calendar.emptyMessage,
    LIMITS.message,
  );

  // Save message in array at index (i)
  appState.wizardDraft.messages[i] = cleaned;
}
