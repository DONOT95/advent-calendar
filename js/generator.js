import { defaultMessages } from "./messages.js";
import { buildCalendarUrl } from "./urlData.js";

// Step Select
const track = document.getElementById("create-track");
const steps = Array.from(document.querySelectorAll(".create-step"));
let currentStep = 0;

// Placeholders for UI values
let customFromName = "";
let customToName = "";
// let customLang = "";
let customTheme = "";

let customMessages = Array(24).fill("");
let currentMessageIndex = 0;

// Step 1.
const fromNameEl = document.getElementById("fromInput");
const toNameEl = document.getElementById("toInput");
const themeEl = document.getElementById("themeSelect");

export function initGenerator() {
  // HTML Elements
  const langEl = document.getElementById("pageLanguage");

  // Navigate to step 3. (preview)
  const btnCreateDefaultURL = document.getElementById("btnCreateDefault");
  // Navigate to step 2. (custom messages day 1)
  const btnCreateCustomURL = document.getElementById("btnAddCustom");

  // Step 2.
  const currentDayNumberEl = document.getElementById("dailyNumber");

  // Default Day: 1
  currentDayNumberEl.textContent = currentMessageIndex + 1;

  const currentMessage = document.getElementById("messageEditor");
  const btnNextMessage = document.getElementById("btnNextDay");
  const btnPrevMessage = document.getElementById("btnPrevDay");

  // Step 3.
  const fromPrevEl = document.getElementById("previewFrom");
  const toPrevEl = document.getElementById("previewTo");
  const messagesPrev = document.getElementById("previewMessages");
  const generatedUrlInput = document.getElementById("generatedUrl");
  const btnBackToEdit = document.getElementById("btnBackToEdit");
  const btnGenerateUrl = document.getElementById("btnGenerateUrl");
  const btnShowGeneratedUrl = document.getElementById("btnShowGenerated");

  const urlDialog = document.getElementById("urlDialog");
  const btnOpenUrl = document.getElementById("btnOpenUrl");

  // Step 1. CUSTOM btn click -> Navigate to Step 2. (Create custom messages)
  btnCreateCustomURL.addEventListener("click", () => {
    // Save the step 1 values
    readBasicConfig();

    // Navigate to next step
    goToStep(1);

    // Set UI element content (1. value of messages)
    currentMessage.value = customMessages[0];
  });

  function setSenderName() {
    // Save from name value
    customFromName = fromNameEl.value.trim();
    if (customFromName === "") customFromName = "Me";
    // Display from value
    fromPrevEl.textContent = customFromName;
  }
  function setRecieverName() {
    // Save To name value
    customToName = toNameEl.value.trim();
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
  function setCurrentMessage() {
    // Take cleaned message from UI
    var message = currentMessage.value.trim();

    // If it is empty replace with '-'
    if (message === "") {
      message = "-";
    }

    // Insert message to our Array at correct position
    customMessages[currentMessageIndex] = message;

    // After the 24. Message -> navigate to PREVIEW
    if (currentMessageIndex === 23) {
      displayMessages(false);
      goToStep(2);
      return;
    }

    // Load next message (or empty)
    currentMessage.value = customMessages[currentMessageIndex + 1];

    // Increase counter
    currentMessageIndex++;

    // Increase day
    currentDayNumberEl.textContent++;
  }

  function showPreviousMessage() {
    // If already at startpoint
    if (currentMessageIndex === 0) {
      goToStep(0);
      return;
    }

    // "Decrease" current day (change value to current index)
    currentDayNumberEl.textContent = currentMessageIndex;
    currentMessageIndex--;
    currentMessage.value = customMessages[currentMessageIndex];
  }

  // Display either custom or default messages
  function displayMessages(isDefault = true) {
    if (isDefault) {
      const messages = getDefaultMessages();
      customMessages = messages;
    }

    // Delete html list elements (from before)
    while (messagesPrev.firstChild) {
      messagesPrev.removeChild(messagesPrev.firstChild);
    }

    // Create list element with custom message as content
    // in the html
    customMessages.forEach((text) => {
      const li = document.createElement("li");
      if (text === "") {
        li.textContent = "-";
      } else {
        li.textContent = text;
      }
      messagesPrev.appendChild(li);
    });
  }

  function readBasicConfig() {
    setSenderName();
    setRecieverName();
    //setLangCalendar();
    setTheme();
  }

  // NAVIGATE TO PREVIEW (Not yet generate)
  btnCreateDefaultURL.addEventListener("click", () => {
    readBasicConfig();
    displayMessages(true);
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
    goToStep(2);
  });

  // Generate URL with Custom Messages
  btnGenerateUrl.addEventListener("click", () => {
    // Get
    readBasicConfig();

    var messages = customMessages.slice(0, 24);

    // Check if there are all the custom messages left 'empty' (already replaced empty spaces with '-')
    // if so set default messages
    var emptyCounter = 0;

    messages.forEach((element) => {
      if (element === "-") emptyCounter++;
    });

    if (emptyCounter == 24) messages = getDefaultMessages();

    const url = buildCalendarUrl({
      lang: langEl.value,
      theme: customTheme,
      from: customFromName,
      to: customToName,
      messages,
    });

    openUrlDialog(urlDialog, generatedUrlInput, url);
  });

  // Next daily message (custom)
  btnNextMessage.addEventListener("click", () => {
    setCurrentMessage();
  });

  // Previous daily message (custom)
  btnPrevMessage.addEventListener("click", () => {
    showPreviousMessage();
  });

  btnBackToEdit.addEventListener("click", () => {
    currentMessageIndex = 23;
    currentDayNumberEl.textContent = currentMessageIndex + 1;
    currentMessage.value = customMessages[currentMessageIndex];
    goToStep(1);
  });

  // Make possible to re-open the dialog(popup)
  btnShowGeneratedUrl.addEventListener("click", () => {
    if (!urlDialog.open) urlDialog.showModal();
  });

  // Read out the daily default messages -> return a list
  function getDefaultMessages() {
    const defaults = defaultMessages[langEl.value][customTheme];
    return defaults.slice(0, 24);
  }

  // Open generated Url dialog popup
  function openUrlDialog(dialog, input, url) {
    input.value = url;
    input.textConten = url;
    if (!dialog.open) dialog.showModal();
  }

  // Open created Calendar in new Window
  btnOpenUrl.addEventListener("click", () => {
    window.open(generatedUrlInput.value, "_blank");
  });
}

// Function to navigate step 1-3
function goToStep(index) {
  // Safe min-max select (can't be lower than min, can't be over max)
  currentStep = Math.max(0, Math.min(index, steps.length - 1));

  // Animation 0%, -100%, -200%...
  track.style.transform = `translateX(-${currentStep * 100}%)`;

  // Border for different height elements in flex row, always resizen
  syncCreateContainerHeight(index);
}

function syncCreateContainerHeight(stepIndex) {
  const page = document.getElementById("page-create");
  const container = document.getElementById("create-container");
  const track = document.getElementById("create-track");
  if (!page || !container || !track) return;

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

export function resetGenerator() {
  // Function to navigate step 1-3
  goToStep(0);
  resetUIValues();
}

function resetUIValues() {
  fromNameEl.value = "";
  toNameEl.value = "";

  // let customLang = "";
  const selectedTheme = document.getElementById("themeSelect");
  selectedTheme.value = "classic";

  customMessages = Array(24).fill("");
  currentMessageIndex = 0;
  // Default day
  document.getElementById("dailyNumber").textContent = currentMessageIndex + 1;
}
