// The Starting Point of the APP
import { readConfigFromUrl } from "./urlData.js";
import { initCalendar } from "./calendar.js";
import { initUI, openPopup } from "./ui.js";
import { initGenerator } from "./generator.js";

document.addEventListener("DOMContentLoaded", () => {
  // Get Data from URL
  const config = readConfigFromUrl();
  // Content values in Website (From, To, Datetime)
  initUI(config);

  initGenerator();

  // Only give needed DATA to Calendar
  initCalendar({
    container: document.getElementById("calendar"),
    template: document.getElementById("door-tpl"),
    messages: config.messages,
    now: new Date(),
    onDoorOpen: (day, message) => {
      openPopup(day, message);
    },
  });
});
