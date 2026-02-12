import { buildCalendarUrl } from "../services/urlDataService.js";
import { LIMITS } from "../config/constants.js";
import { appState, DEFAULTS, resetWizardDraft } from "../state/appState.js";
import {
  applyWizardConfig,
  getMessagesForUrl,
  setMessageWithWizardAt,
  setWizardMessages,
} from "../services/wizardDataService.js";

import {
  renderPreviewList,
  openUrlDialog,
  flashCopyButtonText,
  copyUrlFromWizard,
  selectInputText,
  selectInputTextSafe,
  bindWizardDom,
  isWizardDomReady,
  setWizardStep,
} from "../views/wizardView.js";
import { getDefaultMessages } from "../services/defaultMessagesService.js";

// LAZY DOM
// UI ELEMENTS (placeholders)

let dom = null;
// ============================================
// let customLang = "";

// Variable to check if initGenerator is already called (No double)
let generatorInitialized = false;

export function initGenerator() {
  // Guard clause to prevent double function call
  if (generatorInitialized) return;

  // bind HTML elements with JS variables
  // if (!bindDom()) return;
  dom = bindWizardDom();
  if (!isWizardDomReady(dom)) return;

  // prevent duplicate event listener bindings
  generatorInitialized = true;

  // Set the max length in HTML form (inputs)
  applyTextLengths();

  // Character counter for Input fields
  setCountersAndProgressToZero();

  // ========================= ON BUTTONS EVENT LISTENERS ============================
  // Step 1. CUSTOM btn click -> Navigate to Step 2. (Create custom messages)
  dom.btnAddCustom.addEventListener("click", onCreateCustom);

  // NAVIGATE TO PREVIEW (Not yet generate)
  dom.btnCreateDefault.addEventListener("click", onCreateDefault);

  // Generate URL with Custom Messages
  dom.btnGenerateUrl.addEventListener("click", onGenerateUrl);

  // Next daily message (custom)
  dom.btnNextDay.addEventListener("click", showNextMessage);

  // Previous daily message (custom)
  dom.btnPrevDay.addEventListener("click", showPreviousMessage);

  dom.btnBackToEdit.addEventListener("click", onBackToEdit);

  // Make possible to re-open the dialog(popup)
  dom.btnShowGenerated.addEventListener("click", () => {
    if (!dom.urlDialog.open) dom.urlDialog.showModal();
  });

  // Open created Calendar in new Window
  dom.btnOpenUrl.addEventListener("click", () => {
    window.open(dom.generatedUrl.value, "_blank");
  });

  // Copy generated URL
  dom.btnCopyUrl?.addEventListener("click", onCopyUrl);

  // Character counter events for: From, To, message
  dom.fromInput?.addEventListener("input", () =>
    updateCounter(dom.fromInput, dom.fromInputCharactersCounter, LIMITS.from),
  );
  dom.toInput?.addEventListener("input", () =>
    updateCounter(dom.toInput, dom.toInputCharactersCounter, LIMITS.to),
  );
  dom.messageEditor?.addEventListener("input", () =>
    updateCounter(
      dom.messageEditor,
      dom.messageEditorCharactersCounter,
      LIMITS.message,
    ),
  );
}
// =============================== GENERATOR FUNCTONS ===============================
function updateCounter(inputEl, counterEl, limit) {
  const length = inputEl.value.length;
  counterEl.textContent = `${length}/${limit}`;
}

function setCountersAndProgressToZero() {
  if (
    dom.fromInputCharactersCounter &&
    dom.toInputCharactersCounter &&
    dom.messageEditorCharactersCounter
  ) {
    // Input characters counter
    dom.fromInputCharactersCounter.textContent = `0/${LIMITS.from}`;
    dom.toInputCharactersCounter.textContent = `0/${LIMITS.to}`;
    dom.messageEditorCharactersCounter.textContent = `0/${LIMITS.message}`;
  }

  resetProgressBar();

  if (dom.dailyNumber) {
    // Day Number
    dom.dailyNumber.textContent = appState.generator.currentMessageIndex + 1;
  }
}
// Progress bar functions:
function increaseProgress(value = 3) {
  if (dom.stepProgress) stepProgress.value += value;
}
function decreaseProgress(value = 3) {
  if (dom.stepProgress) stepProgress.value -= value;
}
function resetProgressBar() {
  if (dom.stepProgress) stepProgress.value = 0;
}

// Set message, increase counter, clear textarea
function showNextMessage() {
  saveCurrentMessage();

  // After the 24. Message -> navigate to PREVIEW
  if (
    appState.generator.currentMessageIndex ===
    appState.wizardDraft.messages.length - 1
  ) {
    dom.stepProgress.value = 100;
    displayMessages();
    goToStep(2);
    return;
  }

  // Increase counter, Day, load next message
  appState.generator.currentMessageIndex++;

  // Load next message (or empty)
  dom.messageEditor.value =
    appState.wizardDraft.messages[appState.generator.currentMessageIndex] ??
    DEFAULTS.calendar.emptyMessage;

  // Select the text in textfeld (UX: easy to edit)
  selectInputText(dom.messageEditor);

  // For message editor always "reset" counter at new Day (new message, reset limit)
  updateCounter(
    dom.messageEditor,
    dom.messageEditorCharactersCounter,
    LIMITS.message,
  );

  // Increase Day
  dom.dailyNumber.textContent = String(
    appState.generator.currentMessageIndex + 1,
  );

  // Increase progress bar value
  increaseProgress();
}

function showPreviousMessage() {
  saveCurrentMessage();

  // If already at startpoint
  if (appState.generator.currentMessageIndex === 0) {
    // reset progressbar
    dom.stepProgress.value = 0;
    goToStep(0);

    // Select the 1. Input field (From person name) (UX: easy to edit)
    selectInputText(dom.fromInput);
    return;
  }

  // Decrease Index
  appState.generator.currentMessageIndex--;

  // Load message for ui or empty
  dom.messageEditor.value =
    appState.wizardDraft.messages[appState.generator.currentMessageIndex] ??
    DEFAULTS.calendar.emptyMessage;

  // Select the text in textfeld (UX: easy to edit)
  selectInputText(dom.messageEditor);

  updateCounter(
    dom.messageEditor,
    dom.messageEditorCharactersCounter,
    LIMITS.message,
  );
  // Decrease Day
  dom.dailyNumber.textContent = String(
    appState.generator.currentMessageIndex + 1,
  );

  // Decrease Progressbar value
  decreaseProgress();
}

function saveCurrentMessage() {
  setMessageWithWizardAt(
    appState.generator.currentMessageIndex,
    dom.messageEditor.value,
  );
}

// Display either custom or default messages
function displayMessages() {
  // Get messages
  const list = getMessagesForUrl(appState.wizardDraft.messages);

  // Updata state (messages)
  appState.wizardDraft.messages = [...list];

  // Render neu elemente
  renderPreviewList(dom.previewMessages, list);
}

function readBasicConfig() {
  applyWizardConfig({
    lang: dom.pageLanguage.value,
    theme: dom.themeSelect.value,
    from: dom.fromInput.value,
    to: dom.toInput.value,
  });

  dom.previewFrom.textContent = appState.wizardDraft.from;
  dom.previewTo.textContent = appState.wizardDraft.to;
}

// Function to navigate step 1-3
function goToStep(index) {
  if (!dom) return;

  const safe = setWizardStep(dom, index);

  if (typeof safe === "number") {
    appState.generator.step = safe;
  }
}

// Clear UI elements values, navigate to first step
export function resetGenerator() {
  if (!dom) {
    dom = bindWizardDom();
  }
  resetWizardDraft();

  if (!dom?.createTrack || !dom?.createSteps?.length) return;
  resetUIValuesToDefault();
  setCountersAndProgressToZero();
  // Function to navigate step 1-3
  goToStep(0);
  // Select the 1. Input field (From person name) (UX: easy to edit)
  selectInputText(dom.fromInput);
}

// Clear HTML element values in WIZARD
function resetUIValuesToDefault() {
  // Clear Form Inputs
  dom.fromInput.value = appState.wizardDraft.from;
  dom.toInput.value = appState.wizardDraft.to;
  // Set default Theme
  dom.themeSelect.value = DEFAULTS.calendarConfig.theme;

  // Reset
  setCountersAndProgressToZero();
}

// SET HTML INPUT Maxlength for From, To and Message
function applyTextLengths() {
  dom.fromInput.maxLength = LIMITS.from;
  dom.toInput.maxLength = LIMITS.to;
  dom.messageEditor.maxLength = LIMITS.message;

  dom.messageEditor;
}

// =============================== ON CLICK FUNCTONS ===============================
function onCreateCustom() {
  // Save the step 1 values
  readBasicConfig();

  // Navigate to next step
  goToStep(1);

  // Set UI element content (1. value of messages)
  dom.messageEditor.value = appState.wizardDraft.messages[0];
  // Select the text in textfeld (UX: easy to edit)
  //dom.messageEditor.focus();
  selectInputTextSafe(dom.messageEditor, { preventScroll: true });

  // Increase progress bar loading
  dom.stepProgress.value = 28;
}

function onCreateDefault() {
  // From, to lang, theme
  readBasicConfig();

  // Default messges...(lang,theme) wizardDraft.messages = default.messages[appstate.lang, wizzDraft.theme]
  setWizardMessages(
    getDefaultMessages(
      appState.calendarConfig.lang,
      appState.wizardDraft.theme,
    ),
  );

  // Display messges for preview
  displayMessages();

  // Increase progressbar
  dom.stepProgress.value = 100;
  // Navigate to preview section
  goToStep(2);
}

function onGenerateUrl() {
  // Get lang, theme, from, to from USER
  readBasicConfig();

  const messages = getMessagesForUrl(appState.wizardDraft.messages);

  const url = buildCalendarUrl({
    lang: appState.calendarConfig.lang,
    theme: appState.wizardDraft.theme,
    from: appState.wizardDraft.from,
    to: appState.wizardDraft.to,
    messages,
  });

  openUrlDialog(dom.urlDialog, dom.generatedUrl, url);
}

function onBackToEdit() {
  // Set messages index correct to last message (if default messages did not used it)
  appState.generator.currentMessageIndex =
    appState.wizardDraft.messages.length - 1;

  // Set Day
  dom.dailyNumber.textContent = String(
    appState.generator.currentMessageIndex + 1,
  );

  // Display message (or empty)
  dom.messageEditor.value =
    appState.wizardDraft.messages[appState.generator.currentMessageIndex];

  // Select the text in textfeld (UX: easy to edit)
  selectInputText(dom.messageEditor);
  // For message editor always "reset" counter at new Day (new message, reset limit)
  updateCounter(
    dom.messageEditor,
    dom.messageEditorCharactersCounter,
    LIMITS.message,
  );

  goToStep(1);
}

async function onCopyUrl() {
  const ok = await copyUrlFromWizard(dom.generatedUrl);

  if (ok) {
    flashCopyButtonText(dom.btnCopyUrl, 900);
  } else {
    selectInputText(dom.generatedUrl);
  }
}
