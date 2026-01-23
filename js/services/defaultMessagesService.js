import { defaultMessages } from "../Data/defaultMessages.js";
import { DEFAULTS } from "../state/appState";
import { LIMITS } from "../config/constants.js";

export function getDefaultMessages(
  lang = DEFAULTS.config.lang,
  theme = DEFAULTS.config.theme,
) {
  const langSet =
    defaultMessages[lang] || defaultMessages[DEFAULTS.config.lang];

  const messages = langSet[theme] || langSet[DEFAULTS.config.theme];

  return messages.slice(0, LIMITS.messagesCount);
}
