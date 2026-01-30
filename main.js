// The Starting Point of the APP
import { readConfigFromUrl } from "./services/urlDataService.js";
import { initCalendar } from "./controllers/calendarController.js";
import { initGenerator } from "./controllers/wizardController.js";
import {
  initUI,
  openCalendarWithProperDayTitleDialog,
} from "./controllers/uiController.js";
import { getServerDate } from "./services/clockService.js";
import { appState, applyConfigToState } from "./state/appState.js";

document.addEventListener("DOMContentLoaded", async () => {
  const serverDateNow = await getServerDate();

  const offsetMs = (serverDateNow?.getTime?.() ?? Date.now()) - Date.now();

  // Get Data from URL or null
  const config = readConfigFromUrl();

  // Time
  appState.time.offsetMs = Number.isFinite(offsetMs) ? offsetMs : 0;

  // Apply URL or DEFAULT data to state
  applyConfigToState(config);

  // Assign HTML with JS values, already correct
  initUI(appState.calendarConfig, appState.time.offsetMs);

  // Bild Default or Custom Calendar
  initCalendar({
    container: document.getElementById("calendar"),
    template: document.getElementById("door-tpl"),
    messages: appState.calendar.messages,
    offsetMs: appState.time.offsetMs,
    onDoorOpen: openCalendarWithProperDayTitleDialog,
  });

  // Form: custom calendar
  initGenerator();
});
