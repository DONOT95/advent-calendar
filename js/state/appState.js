import { LIMITS } from "../config/constants.js";

// IMMUTABLE DEFAULT  State Object
// for "empty" init/ reset
export const DEFAULTS = Object.freeze({
  config: Object.freeze({
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
    emptyMessage: "-",
  }),
});

// State Factory
export function createInitialState() {
  return {
    time: {
      offsetMs: 0,
    },

    config: {
      ...DEFAULTS.config,
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
  const offsetMs = appState.time.offsetMs;

  // New default object
  const fresh = createInitialState();

  // Clear the existing object values
  Object.assign(appState.config, fresh.config);
  appState.calendar.messages = fresh.calendar.messages;
  Object.assign(appState.generator, fresh.generator);

  if (keepTime) {
    appState.time.offsetMs = offsetMs;
  }
}
