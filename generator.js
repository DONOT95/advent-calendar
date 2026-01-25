import { buildCalendarUrl } from "./services/urlDataService.js";
import { LIMITS } from "./config/constants.js";
import { appState, DEFAULTS, resetAppState } from "./state/appState.js";
import {
  applyWizardConfig,
  getMessagesForUrl,
} from "./services/wizardDataService.js";

import {
  renderPreviewList,
  openUrlDialog,
  flashCopyButtonText,
  copyUrlFromWizard,
  selectInputText,
  bindWizardDom,
  isWizardDomReady,
  setWizardStep,
} from "./views/wizardView.js";

// LAZY DOM
// UI ELEMENTS (placeholders)

let fromNameEl, toNameEl, themeEl;
let langEl;
let fromPrevEl, toPrevEl;
let generatedUrlInput;
let urlDialog, btnCopyUrl;

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

  // At start 0% progress bar
  if (dom.stepProgress) dom.stepProgress.value = 0;
  // At start set Day: 1
  dom.dailyNumber.textContent = appState.generator.currentMessageIndex + 1;

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
}
// =============================== GENERATOR FUNCTONS ===============================

function setSenderName() {
  // Save from name value
  const name =
    fromNameEl.value.trim().slice(0, LIMITS.from) || DEFAULTS.config.from;

  // Update value
  appState.config.from = name;
  // Display value
  fromPrevEl.textContent = name;
}
function setRecieverName() {
  // Save To name value
  const name = toNameEl.value.trim().slice(0, LIMITS.to) || DEFAULTS.config.to;
  // Save State value
  appState.config.to = name;
  // Display To value
  toPrevEl.textContent = name;
}

function setTheme() {
  const theme = themeEl?.value || DEFAULTS.config.theme;
  appState.config.theme = theme;
}

function setLangCalendar() {
  const lang = (langEl?.value || DEFAULTS.config.lang).trim();
  appState.config.lang = lang;
}

// Set message, increase counter, clear textarea
function showNextMessage() {
  saveCurrentMessage();

  // After the 24. Message -> navigate to PREVIEW
  if (
    appState.generator.currentMessageIndex ===
    appState.calendar.messages.length - 1
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
    appState.calendar.messages[appState.generator.currentMessageIndex] ??
    DEFAULTS.calendar.emptyMessage;

  // Increase Day
  dom.dailyNumber.textContent = String(
    appState.generator.currentMessageIndex + 1,
  );

  // Increase progress bar value
  dom.stepProgress.value += 3;
}

function showPreviousMessage() {
  saveCurrentMessage();

  // If already at startpoint
  if (appState.generator.currentMessageIndex === 0) {
    // reset progressbar
    dom.stepProgress.value = 0;
    goToStep(0);
    return;
  }

  // Decrease Index
  appState.generator.currentMessageIndex--;

  // Load message
  dom.messageEditor.value =
    appState.calendar.messages[appState.generator.currentMessageIndex] ??
    DEFAULTS.calendar.emptyMessage;

  // Decrease Day
  dom.dailyNumber.textContent = String(
    appState.generator.currentMessageIndex + 1,
  );

  // Decrease Progressbar value
  dom.stepProgress.value -= 3;
}

function saveCurrentMessage() {
  // Take cleaned message from UI
  const message = dom.messageEditor.value.trim().slice(0, LIMITS.message);

  // Insert message to our Array at correct position
  appState.calendar.messages[appState.generator.currentMessageIndex] =
    message === "" ? DEFAULTS.calendar.emptyMessage : message;
}

// Display either custom or default messages
function displayMessages() {
  // Get messages
  const list = getMessagesForUrl(appState.calendar.messages);

  // Updata state (messages)
  appState.calendar.messages = [...list];

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

  dom.previewFrom.textContent = appState.config.from;
  dom.previewTo.textContent = appState.config.to;
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
  resetAppState({ keepTime: true });

  if (!dom?.createTrack || !dom?.createSteps?.length) return;
  // Function to navigate step 1-3
  goToStep(0);
  resetUIValuesToDefault();
}

// Clear UI elements values
function resetUIValuesToDefault() {
  dom.fromInput.value = "";
  dom.toInput.value = "";
  //dom.themeSelect.value = appState.config.theme;
  //dom.stepProgress.value = 0;

  // let customLang = "";
  /* const selectedTheme = document.getElementById("themeSelect");
  selectedTheme.value = "classic"; */
  // Reset Day
  dom.dailyNumber.textContent = appState.generator.currentMessageIndex + 1;
}

// SET HTML INPUT Maxlength for From, To and Message
function applyTextLengths() {
  dom.fromInput.maxLength = LIMITS.from;
  dom.toInput.maxLength = LIMITS.to;
  dom.messageEditor.maxLength = LIMITS.message;
}

// =============================== ON CLICK FUNCTONS ===============================
function onCreateCustom() {
  // Save the step 1 values
  readBasicConfig();

  // Navigate to next step
  goToStep(1);

  // Set UI element content (1. value of messages)
  dom.messageEditor.value = appState.calendar.messages[0];
  // Increase progress bar loading
  dom.stepProgress.value = 28;
}

function onCreateDefault() {
  readBasicConfig();
  displayMessages();
  appState.generator.currentMessageIndex =
    appState.calendar.messages.length - 1;

  // Navigate to preview section

  // Increase progressbar
  dom.stepProgress.value = 100;
  goToStep(2);
}

function onGenerateUrl() {
  // Get lang, theme, from, to from USER
  readBasicConfig();

  const messages = getMessagesForUrl(appState.calendar.messages);

  const url = buildCalendarUrl({
    lang: appState.config.lang,
    theme: appState.config.theme,
    from: appState.config.from,
    to: appState.config.to,
    messages,
  });

  openUrlDialog(dom.urlDialog, dom.generatedUrl, url);
}

function onBackToEdit() {
  dom.dailyNumber.textContent = appState.generator.currentMessageIndex + 1;
  dom.messageEditor.value =
    appState.calendar.messages[appState.generator.currentMessageIndex];
  dom.stepProgress.value -= 3;
  goToStep(1);
}

// TODO: CHANGE TEXT WITH i18n
async function onCopyUrl() {
  const ok = await copyUrlFromWizard(dom.generatedUrl);

  if (ok) {
    flashCopyButtonText(dom.btnCopyUrl, 900);
  } else {
    selectInputText(dom.generatedUrl);
  }
}
