// The Starting Point of the APP
import { readConfigFromUrl } from "./services/urlDataService.js";
import { initCalendar } from "./controllers/calendarController.js";
import { initGenerator } from "./controllers/wizardController.js";
import { initUI, openPopup } from "./controllers/uiController.js";
import { getServerDate } from "./services/clockService.js";
import { appState, applyConfigToState } from "./state/appState.js";

document.addEventListener("DOMContentLoaded", async () => {
  const serverDateNow = await getServerDate();

  const offsetMs = (serverDateNow?.getTime?.() ?? Date.now()) - Date.now();

  // Get Data from URL
  const config = readConfigFromUrl();

  // Time
  appState.time.offsetMs = Number.isFinite(offsetMs) ? offsetMs : 0;
  // Safe object assign, with no override (config and appState.config != inhalt...)
  // Take only the correct values (no messages)
  applyConfigToState(config);

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
