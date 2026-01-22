// The Starting Point of the APP
import { readConfigFromUrl } from "./urlData.js";
import { initCalendar } from "./calendar.js";
import { initUI, openPopup } from "./ui.js";
import { initGenerator } from "./generator.js";
import { getServerDate } from "./clock.js";

document.addEventListener("DOMContentLoaded", async () => {
  const serverDateNow = await getServerDate();
  const offsetMs = serverDateNow.getTime() - Date.now();

  // Get Data from URL
  const config = readConfigFromUrl();

  // Assign HTML with JS values
  initUI(config, offsetMs);

  // Bild Default or Custom Calendar
  initCalendar({
    container: document.getElementById("calendar"),
    template: document.getElementById("door-tpl"),
    messages: config.messages,
    offsetMs,
    onDoorOpen: openPopup /*  (day, message) => {
      openPopup(day, message);
    }, */,
  });

  // Create custom calendar option
  initGenerator();
});
