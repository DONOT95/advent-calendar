import { defaultMessages } from "./messages.js";
import { buildCalendarUrl } from "./urlData.js";

// LIMITS for TEXT length
export const LIMITS = {
  from: 50,
  to: 50,
  message: 250,
  messagesCount: 24,
};

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

let currentStep = 0;

// Placeholders for FORM values (FROM, TO, THEME, LANGUAGE)
let customFromName = "";
let customToName = "";
// let customLang = "";
let customTheme = "";

// Array to hold custom || default messages
let calendarMessages = Array(LIMITS.messagesCount).fill("");
let currentMessageIndex = 0;

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
  currentDayNumberEl.textContent = currentMessageIndex + 1;

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
  if (!container || !track) return false;

  steps = Array.from(document.querySelectorAll(".create-step"));
  if (!steps.length) return false;

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
  const lang = langEl.value;
  const theme = customTheme || "classic";

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
  customFromName = fromNameEl.value.trim().slice(0, LIMITS.from);
  if (customFromName === "") customFromName = "Me";
  // Display from value
  fromPrevEl.textContent = customFromName;
}
function setRecieverName() {
  // Save To name value
  customToName = toNameEl.value.trim().slice(0, LIMITS.to);
  if (customToName === "") customToName = "You";
  // Display To value
  toPrevEl.textContent = customToName;
}

function setTheme() {
  customTheme = themeEl.value;
}

/*   function setLangCalendar() {
    customLang = langEl.value;
  } */

// Set message, increase counter, clear textarea
function showNextMessage() {
  saveCurrentMessage();

  // Increase progress bar value
  progressBar.value += 3;
  // After the 24. Message -> navigate to PREVIEW
  if (currentMessageIndex === calendarMessages.length - 1) {
    progressBar.value = 100;
    displayMessages(false);
    goToStep(2);
    return;
  }

  // Increase counter, Day, load next message
  currentMessageIndex++;
  // Load next message (or empty)
  messageEL.value = calendarMessages[currentMessageIndex];
  currentDayNumberEl.textContent = String(currentMessageIndex + 1);
}

function showPreviousMessage() {
  saveCurrentMessage();
  // Decrease Progressbar value
  progressBar.value -= 3;

  // If already at startpoint
  if (currentMessageIndex === 0) {
    // reset progressbar
    progressBar.value = 0;
    goToStep(0);
    return;
  }

  // Decrease counter, Day, load prev message
  currentMessageIndex--;
  messageEL.value = calendarMessages[currentMessageIndex];
  currentDayNumberEl.textContent = String(currentMessageIndex + 1);
}

function saveCurrentMessage() {
  // Take cleaned message from UI
  const message = messageEL.value.trim().slice(0, LIMITS.message);

  // Insert message to our Array at correct position
  calendarMessages[currentMessageIndex] = message === "" ? "-" : message;
}

// Display either custom or default messages
function displayMessages(isDefault = true) {
  if (isDefault) {
    const messages = getDefaultMessages();

    calendarMessages = Array(LIMITS.messagesCount).fill("-");
    // Set 24 message with empty ("-")
    // Replace elements with fo
    messages.forEach((message, index) => {
      calendarMessages[index] =
        String(message ?? "")
          .trim()
          .slice(0, LIMITS.message) || "-";
    });
  }

  // Delete html list elements (from before)
  while (messagesPrev.firstChild) {
    messagesPrev.removeChild(messagesPrev.firstChild);
  }

  // Create list element with custom message as content
  // in the html
  calendarMessages.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;

    messagesPrev.appendChild(li);
  });
}

function readBasicConfig() {
  setSenderName();
  setRecieverName();
  //setLangCalendar();
  setTheme();
}

// Function to navigate step 1-3
function goToStep(index) {
  // Safe min-max select (can't be lower than min, can't be over max)
  currentStep = Math.max(0, Math.min(index, steps.length - 1));

  // Animation 0%, -100%, -200%...
  track.style.transform = `translateX(-${currentStep * 100}%)`;

  // Border for different height elements in flex row, always resizen
  syncCreateContainerHeight(currentStep);
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
  // Function to navigate step 1-3
  goToStep(0);
  resetUIValues();
}

// Clear UI elements values
function resetUIValues() {
  fromNameEl.value = "";
  toNameEl.value = "";
  themeEl.value = "classic";
  progressBar.value = 0;

  // let customLang = "";
  /* const selectedTheme = document.getElementById("themeSelect");
  selectedTheme.value = "classic"; */

  // Clear custom messages list, reset index
  calendarMessages = Array(LIMITS.messagesCount).fill("");
  currentMessageIndex = 0;

  // Reset Day
  document.getElementById("dailyNumber").textContent = currentMessageIndex + 1;
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
  messageEL.value = calendarMessages[0];
  // Increase progress bar loading
  progressBar.value = 28;
}

function onCreateDefault() {
  readBasicConfig();
  displayMessages(true);
  currentMessageIndex = calendarMessages.length - 1;
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

  var messages = calendarMessages.slice(0, LIMITS.messagesCount);

  // Check if there are all the custom messages left 'empty' (already replaced empty spaces with '-')
  // if so set default messages
  var emptyCounter = 0;

  messages.forEach((element) => {
    if (element === "-") emptyCounter++;
  });

  if (emptyCounter == LIMITS.messagesCount) messages = getDefaultMessages();

  const url = buildCalendarUrl({
    lang: langEl.value,
    theme: customTheme,
    from: customFromName,
    to: customToName,
    messages,
  });

  openUrlDialog(urlDialog, generatedUrlInput, url);
}

function onBackToEdit() {
  currentDayNumberEl.textContent = currentMessageIndex + 1;
  messageEL.value = calendarMessages[currentMessageIndex];
  progressBar.value -= 3;
  goToStep(1);
}
