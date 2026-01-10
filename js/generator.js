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
  const btnGenerateUrl = document.getElementById("btnGenerateUrl");
  const btnShowGeneratedUrl = document.getElementById("btnShowGenerated");

  const urlDialog = document.getElementById("urlDialog");
  const btnOpenUrl = document.getElementById("btnOpenUrl");

  // Step 1. CUSTOM btn click -> Navigate to Step 2. (Create custom messages)
  btnCreateCustomURL.addEventListener("click", () => goToStep(1));

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
    // Take message from UI
    const message = currentMessage.value;

    // Insert message to our Array at correct position
    customMessages[currentMessageIndex] = message;

    // Clear text
    currentMessage.value = "";

    // No more than 24 messages allowed
    if (currentMessageIndex === 23) {
      displayCustomPreviewMessages();
      goToStep(2);
      return;
    }

    // Increase counter
    currentMessageIndex++;

    // Increase day
    currentDayNumberEl.textContent++;
  }

  function showPreviousMessage() {
    // If already at startpoint
    if (currentMessageIndex === 0) return;

    // "Decrease" current day (change value to current index)
    currentDayNumberEl.textContent = currentMessageIndex;
    currentMessageIndex--;
    currentMessage.value = customMessages[currentMessageIndex];
  }

  function displayCustomPreviewMessages() {
    // Delete html list elements (from before)
    while (messagesPrev.firstChild) {
      messagesPrev.removeChild(messagesPrev.firstChild);
    }
    // Create list element with custom message as content
    // in the html
    customMessages.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      messagesPrev.appendChild(li);
      console.log(text);
    });
  }

  function displayDefaultPreviewMessages() {
    const messages = getDefaultMessages();

    // Delete html list elements (from before)
    while (messagesPrev.firstChild) {
      messagesPrev.removeChild(messagesPrev.firstChild);
    }

    // Create list element with default message as content
    messages.forEach((text) => {
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

  // Generate URL with Default Messages
  btnCreateDefaultURL.addEventListener("click", () => {
    readBasicConfig();
    displayDefaultPreviewMessages();
    const messages = getDefaultMessages();
    const url = buildCalendarUrl({
      lang: langEl.value,
      theme: customTheme,
      from: customFromName,
      to: customToName,
      messages,
    });

    // Open up the created URL dialog
    //openUrlDialog(urlDialog, generatedUrlInput, url);

    // Navigate to preview section
    goToStep(3);
  });

  // Generate URL with Custom Messages
  btnGenerateUrl.addEventListener("click", () => {
    readBasicConfig();

    var messages = customMessages.slice(0, 24);

    // Check if there are all the custom messages left empty
    // if so set default messages
    var emptyCounter = 0;

    messages.forEach((element) => {
      if (element === "") emptyCounter++;
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
