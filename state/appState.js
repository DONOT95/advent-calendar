import { LIMITS } from "../config/constants.js";
import { getDefaultMessages } from "../services/defaultMessagesService.js";
import { sanitizeMessagesArray } from "../validation/sanitizer.js";
import { setWizardMessages } from "../services/wizardDataService.js";

// IMMUTABLE DEFAULT  State Object
// for "empty" init/ reset
export const DEFAULTS = Object.freeze({
  calendarConfig: Object.freeze({
    lang: "en",
    theme: "classic",
    from: "Me",
    to: "You",
  }),

  generator: Object.freeze({
    currentStep: 0,
    currentMessageIndex: 0,
  }),

  calendar: Object.freeze({
    emptyMessage: "",
  }),
});

// State Factory
export function createInitialState() {
  return {
    time: {
      offsetMs: 0,
    },

    calendarConfig: {
      ...DEFAULTS.calendarConfig,
    },

    calendar: {
      messages: Array(LIMITS.messagesCount).fill(
        DEFAULTS.calendar.emptyMessage,
      ),
    },

    generator: { ...DEFAULTS.generator },
  };
}

// MUTABLE State Object OBJECT 1x deklariert,
// but the values can be replaced (update/modify)
export const appState = createInitialState();

// State Helpers
export function resetAppState({ keepTime = true } = {}) {
  // Time value unchanged
  const oldOffset = appState.time.offsetMs;

  // New default object
  const fresh = createInitialState();

  // Reset the existing object values
  Object.assign(appState.calendarConfig, fresh.calendarConfig);
  // Set DEFAULT MESSAGES
  /* const defMsgs = getDefaultMessages(
    fresh.calendarConfig.lang,
    fresh.calendarConfig.theme,
  );

  appState.calendar.messages = sanitizeMessagesArray(defMsgs, {
    maxLenEach: LIMITS.message,
    emptyFallback: DEFAULTS.calendar.emptyMessage,
  }); */
  // Clean list for user input messages

  // fill Empty list (no need defaults)
  setWizardMessages(
    Array(LIMITS.messagesCount).fill(DEFAULTS.calendar.emptyMessage),
  );

  // Reset generator
  Object.assign(appState.generator, fresh.generator);

  appState.time.offsetMs = keepTime ? oldOffset : 0;
}

export function applyConfigToState(config) {
  if (!config) {
    resetAppState({ keepTime: true });
    return;
  }

  const lang = config?.lang ?? DEFAULTS.calendarConfig.lang;
  const theme = config?.theme ?? DEFAULTS.calendarConfig.theme;
  const from = config?.from ?? DEFAULTS.calendarConfig.from;
  const to = config?.to ?? DEFAULTS.calendarConfig.to;

  Object.assign(appState.calendarConfig, { lang, theme, from, to });

  // Either valid custom messages, valid Default messages or empty messages.
  const defMsgs = getDefaultMessages(lang, theme);

  const msgs =
    Array.isArray(config?.messages) &&
    config.messages.length === LIMITS.messagesCount
      ? config.messages
      : defMsgs;
  appState.calendar.messages = sanitizeMessagesArray(msgs, {
    maxLenEach: LIMITS.message,
    emptyFallback: DEFAULTS.calendar.emptyMessage,
  });
}
