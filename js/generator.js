import { defaultMessages } from "./Data/defaultMessages.js";
import { buildCalendarUrl } from "./urlData.js";
import { LIMITS } from "./config/constants.js";
import { appState, DEFAULTS, resetAppState } from "./state/appState.js";

// LAZY DOM
// UI ELEMENTS (placeholders)
let page, container, track, steps;
let fromNameEl, toNameEl, themeEl, progressBar;
let currentDayNumberEl, messageEL;
let btnNextMessage, btnPrevMessage;
let langEl;
let btnCreateDefaultCalendar, btnCreateCustomCalendar;
let fromPrevEl, toPrevEl, messagesPrev;
let generatedUrlInput;
let btnBackToEdit, btnGenerateUrl, btnShowGeneratedUrl;
let urlDialog, btnOpenUrl;
// ============================================
// let customLang = "";

// Variable to check if initGenerator is already called (No double)
let generatorInitialized = false;
export function initGenerator() {
  // Guard clause to prevent double function call
  if (generatorInitialized) return;

  // bind HTML elements with JS variables
  if (!bindDom()) return;

  // prevent duplicate event listener bindings
  generatorInitialized = true;

  // Set the max length in HTML form (inputs)
  applyTextLengths();

  // At start 0% progress bar
  if (progressBar) progressBar.value = 0;
  // At start set Day: 1
  currentDayNumberEl.textContent = appState.generator.currentMessageIndex + 1;

  // ========================= ON BUTTONS EVENT LISTENERS ============================
  // Step 1. CUSTOM btn click -> Navigate to Step 2. (Create custom messages)
  btnCreateCustomCalendar.addEventListener("click", onCreateCustom);

  // NAVIGATE TO PREVIEW (Not yet generate)
  btnCreateDefaultCalendar.addEventListener("click", onCreateDefault);

  // Generate URL with Custom Messages
  btnGenerateUrl.addEventListener("click", onGenerateUrl);

  // Next daily message (custom)
  btnNextMessage.addEventListener("click", showNextMessage);

  // Previous daily message (custom)
  btnPrevMessage.addEventListener("click", showPreviousMessage);

  btnBackToEdit.addEventListener("click", onBackToEdit);

  // Make possible to re-open the dialog(popup)
  btnShowGeneratedUrl.addEventListener("click", () => {
    if (!urlDialog.open) urlDialog.showModal();
  });

  // Open created Calendar in new Window
  btnOpenUrl.addEventListener("click", () => {
    window.open(generatedUrlInput.value, "_blank");
  });
}
// =============================== GENERATOR FUNCTONS ===============================
// Bind all the -by generator used- HTML elements with JS variables
function bindDom() {
  // UI Containers with guard clause
  page = document.getElementById("page-create");
  if (!page) return false;

  container = document.getElementById("create-container");
  track = document.getElementById("create-track");

  steps = Array.from(document.querySelectorAll(".create-step"));

  // Step 1.
  fromNameEl = document.getElementById("fromInput");
  toNameEl = document.getElementById("toInput");
  themeEl = document.getElementById("themeSelect");
  progressBar = document.getElementById("stepProgress");

  // Step 2.
  currentDayNumberEl = document.getElementById("dailyNumber");
  messageEL = document.getElementById("messageEditor");

  btnNextMessage = document.getElementById("btnNextDay");
  btnPrevMessage = document.getElementById("btnPrevDay");
  // Navigate to step 3. (preview)
  btnCreateDefaultCalendar = document.getElementById("btnCreateDefault");
  // Navigate to step 2. (custom messages day 1)
  btnCreateCustomCalendar = document.getElementById("btnAddCustom");

  // Step 3.
  fromPrevEl = document.getElementById("previewFrom");
  toPrevEl = document.getElementById("previewTo");
  messagesPrev = document.getElementById("previewMessages");

  generatedUrlInput = document.getElementById("generatedUrl");
  btnBackToEdit = document.getElementById("btnBackToEdit");
  btnGenerateUrl = document.getElementById("btnGenerateUrl");
  btnShowGeneratedUrl = document.getElementById("btnShowGenerated");

  urlDialog = document.getElementById("urlDialog");
  btnOpenUrl = document.getElementById("btnOpenUrl");

  langEl = document.getElementById("pageLanguage");

  // Only if all element existing and not null return true
  return true;
}
// Read out the daily default messages -> return a list
function getDefaultMessages() {
  const lang = appState.config.lang || DEFAULTS.config.lang;
  const theme = appState.config.theme || DEFAULTS.config.theme;

  // Either an existing lang + theme (default messages) OR an empty array
  const messages = defaultMessages?.[lang]?.[theme] ?? [];
  return messages.slice(0, LIMITS.messagesCount);
}

// Open generated Url dialog popup
function openUrlDialog(dialog, input, url) {
  input.value = url;
  if (!dialog.open) dialog.showModal();
}

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
  appState.config.theme = themeEl.value || DEFAULTS.config.theme;
}

function setLangCalendar() {
  appState.config.lang = langEl.value || DEFAULTS.config.lang;
}

// Set message, increase counter, clear textarea
function showNextMessage() {
  saveCurrentMessage();

  // After the 24. Message -> navigate to PREVIEW
  if (
    appState.generator.currentMessageIndex ===
    appState.calendar.messages.length - 1
  ) {
    progressBar.value = 100;
    displayMessages(false);
    goToStep(2);
    return;
  }

  // Increase counter, Day, load next message
  appState.generator.currentMessageIndex++;

  // Load next message (or empty)
  messageEL.value =
    appState.calendar.messages[appState.generator.currentMessageIndex] ??
    DEFAULTS.calendar.emptyMessage;

  // Increase Day
  currentDayNumberEl.textContent = String(
    appState.generator.currentMessageIndex + 1,
  );

  // Increase progress bar value
  progressBar.value += 3;
}

function showPreviousMessage() {
  saveCurrentMessage();

  // If already at startpoint
  if (appState.generator.currentMessageIndex === 0) {
    // reset progressbar
    progressBar.value = 0;
    goToStep(0);
    return;
  }

  // Decrease Index
  appState.generator.currentMessageIndex--;

  // Load message
  messageEL.value =
    appState.calendar.messages[appState.generator.currentMessageIndex] ??
    DEFAULTS.calendar.emptyMessage;

  // Decrease Day
  currentDayNumberEl.textContent = String(
    appState.generator.currentMessageIndex + 1,
  );

  // Decrease Progressbar value
  progressBar.value -= 3;
}

function saveCurrentMessage() {
  // Take cleaned message from UI
  const message = messageEL.value.trim().slice(0, LIMITS.message);

  // Insert message to our Array at correct position
  appState.calendar.messages[appState.generator.currentMessageIndex] =
    message === "" ? DEFAULTS.calendar.emptyMessage : message;
}

// Display either custom or default messages
function displayMessages(isDefault = true) {
  if (isDefault) {
    // DEFAULT messages
    const messages = getDefaultMessages();

    // Fill messages 24x "-"
    appState.calendar.messages = Array(LIMITS.messagesCount).fill(
      DEFAULTS.calendar.emptyMessage,
    );

    // Fill message with  "-" or valid String
    messages.forEach((message, index) => {
      appState.calendar.messages[index] =
        String(message ?? "")
          .trim()
          .slice(0, LIMITS.message) || DEFAULTS.calendar.emptyMessage;
    });
  }

  // Delete html list elements (from before)
  while (messagesPrev.firstChild) {
    messagesPrev.removeChild(messagesPrev.firstChild);
  }

  // Create list element with custom message as content
  // in the html
  appState.calendar.messages.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;

    messagesPrev.appendChild(li);
  });
}

function readBasicConfig() {
  setSenderName();
  setRecieverName();
  setLangCalendar();
  setTheme();
}

// Function to navigate step 1-3
function goToStep(index) {
  // Safe min-max select (can't be lower than min, can't be over max)
  appState.generator.currentStep = Math.max(
    0,
    Math.min(index, steps.length - 1),
  );

  // Animation 0%, -100%, -200%...
  track.style.transform = `translateX(-${appState.generator.currentStep * 100}%)`;

  // Border for different height elements in flex row, always resizen
  syncCreateContainerHeight(appState.generator.currentStep);
}

// For different STEP (generate 1-3)
// Make border fit content
function syncCreateContainerHeight(stepIndex) {
  // Wenn die Page nicht sichtbar ist: NICHT messen und NICHT überschreiben
  if (!page.classList.contains("active")) return;

  const steps = track.querySelectorAll(".create-step");
  const activeStep = steps[stepIndex];
  if (!activeStep) return;

  // Erst nach Layout-Update messen (wichtig bei Transition/Fonts)
  requestAnimationFrame(() => {
    const h = activeStep.getBoundingClientRect().height;
    if (h > 0) container.style.height = `${Math.ceil(h)}px`;
  });
}

// Clear UI elements values, navigate to first step
export function resetGenerator() {
  resetAppState({ keepTime: true });
  // Function to navigate step 1-3
  goToStep(0);
  resetUIValues();
}

// Clear UI elements values
function resetUIValues() {
  fromNameEl.value = appState.config.from;
  toNameEl.value = appState.config.to;
  themeEl.value = appState.config.theme;
  progressBar.value = 0;

  // let customLang = "";
  /* const selectedTheme = document.getElementById("themeSelect");
  selectedTheme.value = "classic"; */
  // Reset Day
  document.getElementById("dailyNumber").textContent =
    appState.generator.currentMessageIndex + 1;
}

// SET HTML INPUT Maxlength for From, To and Message
function applyTextLengths() {
  fromNameEl.maxLength = LIMITS.from;
  toNameEl.maxLength = LIMITS.to;
  messageEL.maxLength = LIMITS.message;
}

// =============================== ON CLICK FUNCTONS ===============================
function onCreateCustom() {
  // Save the step 1 values
  readBasicConfig();

  // Navigate to next step
  goToStep(1);

  // Set UI element content (1. value of messages)
  messageEL.value = appState.calendar.messages[0];
  // Increase progress bar loading
  progressBar.value = 28;
}

function onCreateDefault() {
  readBasicConfig();
  displayMessages(true);
  appState.generator.currentMessageIndex =
    appState.calendar.messages.length - 1;
  /* const messages = getDefaultMessages();
    const url = buildCalendarUrl({
      lang: langEl.value,
      theme: customTheme,
      from: customFromName,
      to: customToName,
      messages,
    }); */

  // Open up the created URL dialog
  //openUrlDialog(urlDialog, generatedUrlInput, url);

  // Navigate to preview section

  // Increase progressbar
  progressBar.value = 100;
  goToStep(2);
}

function onGenerateUrl() {
  // Get
  readBasicConfig();

  let messages = appState.calendar.messages.slice(0, LIMITS.messagesCount);

  // Check if there are all the custom messages left 'empty' (already replaced empty spaces with '-')
  // if so set default messages
  const allEmpty = messages.every((m) => m === "-");

  if (allEmpty) messages = getDefaultMessages();

  const url = buildCalendarUrl({
    lang: appState.config.lang,
    theme: appState.config.theme,
    from: appState.config.from,
    to: appState.config.to,
    messages,
  });

  openUrlDialog(urlDialog, generatedUrlInput, url);
}

function onBackToEdit() {
  currentDayNumberEl.textContent = appState.generator.currentMessageIndex + 1;
  messageEL.value =
    appState.calendar.messages[appState.generator.currentMessageIndex];
  progressBar.value -= 3;
  goToStep(1);
}
