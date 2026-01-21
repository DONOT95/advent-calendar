// The Starting Point of the APP
import { readConfigFromUrl } from "./urlData.js";
import { initCalendar } from "./calendar.js";
import { initUI, openPopup } from "./ui.js";
import { initGenerator } from "./generator.js";

document.addEventListener("DOMContentLoaded", () => {
  // Get Data from URL
  const config = readConfigFromUrl();

  // Assign HTML with JS values
  initUI(config);

  // Bild Default or Custom Calendar
  initCalendar({
    container: document.getElementById("calendar"),
    template: document.getElementById("door-tpl"),
    messages: config.messages,
    now: new Date(),
    onDoorOpen: (day, message) => {
      openPopup(day, message);
    },
  });

  // Create custom calendar option
  initGenerator();
});
