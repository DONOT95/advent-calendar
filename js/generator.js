import { defaultMessages } from "./messages.js";
import { buildCalendarUrl } from "./urlData.js";

export function initGenerator() {
  // HTML Elements
  const langEl = document.getElementById("pageLanguage");

  // Step 1.
  const fromNameEl = document.getElementById("fromInput");
  const toNameEl = document.getElementById("toInput");
  const themeEl = document.getElementById("themeSelect");

  const btnCreateDefaultURL = document.getElementById("btnCreateDefault");
  // To do: navigate to the 2. Step beginning
  const btnCreateCustomURL = document.getElementById("btnAddCustom");

  // Step 2.
  const currentDayNumber = document.getElementById("dailyNumber");
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

  // Placeholders for UI values
  let customFromName = "";
  let customToName = "";

  // let customLang = "";
  let customTheme = "";

  let customMessages = Array(24).fill("");
  let currentMessageIndex = 0;
  // Default day
  currentDayNumber.textContent = currentMessageIndex + 1;

  function setSenderName() {
    // Save from name value
    customFromName = fromNameEl.value.trim();
    // Display from value
    fromPrevEl.textContent = customFromName;
  }
  function setRecieverName() {
    // Save To name value
    customToName = toNameEl.value.trim();
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
      return;
    }

    // Increase counter
    currentMessageIndex++;

    // Increase day
    currentDayNumber.textContent = currentMessageIndex + 1;
  }

  function showPreviousMessage() {
    // If already at startpoint
    if (currentMessageIndex === 0) return;

    // "Decrease" current day (change value to current index)
    currentDayNumber.textContent = currentMessageIndex;
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

    openUrlDialog(urlDialog, generatedUrlInput, url);
  });

  // Generate URL with Custom Messages
  btnGenerateUrl.addEventListener("click", () => {
    readBasicConfig();

    const messages = customMessages.slice(0, 24);

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
