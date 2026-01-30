import { defaultMessages } from "../data/defaultMessages.js";
import { DEFAULTS } from "../state/appState.js";
import { LIMITS } from "../config/constants.js";

// return selected (lang+theme) default messages, def default messages or empty array.
export function getDefaultMessages(
  lang = DEFAULTS.calendarConfig.lang,
  theme = DEFAULTS.calendarConfig.theme,
) {
  const langSet =
    defaultMessages?.[lang] ??
    defaultMessages?.[DEFAULTS.calendarConfig.lang] ??
    {};

  const messages =
    langSet?.[theme] ?? langSet?.[DEFAULTS.calendarConfig.theme] ?? [];

  return Array.isArray(messages) ? messages.slice(0, LIMITS.messagesCount) : [];
}
