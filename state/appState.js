import { LIMITS } from "../config/constants.js";
import { getDefaultMessages } from "../services/defaultMessagesService.js";
import {
  sanitizeMessagesArray,
  sanitizeString,
} from "../validation/sanitizer.js";
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
      source: "demo", // demo || url

      // Either url data, fixed, replaced, or demo (selected lang + def theme)
      // if source "demo" these list is dynamically
      messages: Array(LIMITS.messagesCount).fill(
        DEFAULTS.calendar.emptyMessage,
      ),

      lastUrlStatus: "none", // none || ok || repaired || invalid
      lastUrlIssues: [],
    },

    // Wizard, for user input calendar values
    wizardDraft: {
      from: "",
      to: "",
      theme: DEFAULTS.calendarConfig.theme,

      messages: Array(LIMITS.messagesCount).fill(""),
    },

    generator: { ...DEFAULTS.generator },
  };
}

// MUTABLE State Object OBJECT 1x deklariert,
// but the values can be replaced (update/modify)
export const appState = createInitialState();

// Only wizard reset when leaving create page
export function resetWizardDraft() {
  appState.wizardDraft.from = "";
  appState.wizardDraft.to = "";
  appState.wizardDraft.theme = DEFAULTS.calendarConfig.theme;
  appState.wizardDraft.messages = Array(LIMITS.messagesCount).fill("");
  Object.assign(appState.generator, DEFAULTS.generator);
  // language automatically taken from appState
}

export function applyConfigToState(config) {
  // First load
  // Demo mode, dynamic messages later
  if (!config) {
    Object.assign(appState.calendarConfig, DEFAULTS.calendarConfig);

    appState.calendar.source = "demo";
    // ONLY TEMPORARY EMPTY LIST, it is set by -> view calendar/ language change
    appState.calendar.messages = Array(LIMITS.messagesCount).fill(
      DEFAULTS.calendar.emptyMessage,
    );
    return;
  }

  const lang = config?.lang ?? DEFAULTS.calendarConfig.lang;
  const theme = config?.theme ?? DEFAULTS.calendarConfig.theme;

  // from/to sanitized if url was "Modifyed"
  const from = sanitizeString(
    config.from,
    DEFAULTS.calendarConfig.from,
    LIMITS.from,
  );
  const to = sanitizeString(config.to, DEFAULTS.calendarConfig.to, LIMITS.to);

  // Set calendarConfig -> UI values from URL DATA (config)
  Object.assign(appState.calendarConfig, { lang, theme, from, to });

  // config.messages already sanitized in urlDataService
  const msgs = sanitizeMessagesArray(config.messages, {
    maxLenEach: LIMITS.message,
    emptyFallback: DEFAULTS.calendar.emptyMessage,
  });

  // Change source state
  appState.calendar.source = "url";
  appState.calendar.messages = msgs;
}

/*
 * Ensure demo messages are loaded dynamically for the CURRENT language/theme.
 * Call this when switching to the Calendar section (and optionally on language change),
 * but only when calendar.source === "demo".
 */
export function ensureDemoCalendarMessages() {
  if (appState.calendar.source !== "demo") return;

  const lang = appState.calendarConfig.lang ?? DEFAULTS.calendarConfig.lang;
  const theme = appState.calendarConfig.theme ?? DEFAULTS.calendarConfig.theme;

  const defaults = getDefaultMessages(lang, theme);

  appState.calendar.messages = sanitizeMessagesArray(defaults, {
    maxLenEach: LIMITS.message,
    emptyFallback: DEFAULTS.calendar.emptyMessage,
  });
}
