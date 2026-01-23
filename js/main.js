// The Starting Point of the APP
import { readConfigFromUrl } from "./urlData.js";
import { initCalendar } from "./calendar.js";
import { initUI, openPopup } from "./ui.js";
import { initGenerator } from "./generator.js";
import { getServerDate } from "./services/clockService.js";
import { appState } from "./state/appState.js";

document.addEventListener("DOMContentLoaded", async () => {
  const serverDateNow = await getServerDate();

  const offsetMs = (serverDateNow?.getTime?.() ?? Date.now()) - Date.now();

  // Get Data from URL
  const config = readConfigFromUrl();

  appState.time.offsetMs = Number.isFinite(offsetMs) ? offsetMs : 0;
  // Safe object assign, with no override (config and appState.config != inhalt...)
  // Take only the correct values (no messages)
  Object.assign(appState.config, {
    lang: config.lang,
    theme: config.theme,
    from: config.from,
    to: config.to,
  });

  // Safe reassign for messages
  appState.calendar.messages = Array.isArray(config.messages)
    ? [...config.messages]
    : [];

  // Assign HTML with JS values
  initUI(appState.config, appState.time.offsetMs);

  // Bild Default or Custom Calendar
  initCalendar({
    container: document.getElementById("calendar"),
    template: document.getElementById("door-tpl"),
    messages: appState.calendar.messages,
    offsetMs: appState.time.offsetMs,
    onDoorOpen: openPopup,
  });

  // Form: custom calendar
  initGenerator();
});
