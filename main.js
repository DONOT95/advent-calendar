// The Starting Point of the APP
import { readConfigFromUrl } from "./services/urlDataService.js";
import { initCalendar } from "./controllers/calendarController.js";
import { initGenerator } from "./controllers/wizardController.js";
import {
  initUI,
  openCalendarDayAndSetContent,
  showUrlStatusDialog,
} from "./controllers/uiController.js";
import { getServerDate } from "./services/clockService.js";
import { appState, applyConfigToState } from "./state/appState.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Time
  const serverDateNow = await getServerDate();
  const offsetMs = (serverDateNow?.getTime?.() ?? Date.now()) - Date.now();
  appState.time.offsetMs = Number.isFinite(offsetMs) ? offsetMs : 0;

  // Get Data from URL or null
  const result = readConfigFromUrl();

  // Apply URL or DEFAULT data to state
  applyConfigToState(result.config);

  // Save URL status for UX
  appState.calendar.lastUrlStatus = result.status;
  appState.calendar.lastUrlIssues = result.issues ?? [];

  // Determin shown-page (Home || Calendar)
  const hasValidUrl = appState.calendar.source === "url";
  const initialPage = hasValidUrl ? "calendar" : "home";

  // Assign HTML with JS values, already correct
  initUI(
    appState.calendarConfig,
    appState.time.offsetMs,
    initialPage,
    serverDateNow,
  );

  // SECTION: CALENDAR -> Bild Default or Custom Calendar
  initCalendar({
    container: document.getElementById("calendar"),
    template: document.getElementById("door-tpl"),
    messages: appState.calendar.messages,
    offsetMs: appState.time.offsetMs,
    onDoorOpen: openCalendarDayAndSetContent,
  });

  // SECTION: WIZARD -> CALENDAR GENERATOR
  initGenerator();

  // Optional UX dialog on URL problems (only when URL param existed)
  if (result.status === "repaired" || result.status === "invalid") {
    showUrlStatusDialog(result.status, result.issues);
  }
});
